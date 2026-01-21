#!/bin/bash
#
# Arcane Installation Script
# Usage: curl -fsSL https://getarcane.app/install.sh | bash
#
# This script installs Arcane and its dependencies:
# - Docker
# - Arcane application
# - systemd service for Arcane
#

set -e

CURRENT_STEP=""

handle_error() {
    progress_fail
    if [[ -n "$CURRENT_STEP" ]]; then
        log_error "Script failed during: $CURRENT_STEP"
    else
        log_error "Script failed"
    fi
    log_warn "Re-run with --verbose for full output"
    exit 1
}

trap 'handle_error' ERR

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
ARCANE_VERSION="${ARCANE_VERSION:-latest}"
ARCANE_INSTALL_DIR="${ARCANE_INSTALL_DIR:-/opt/arcane}"
ARCANE_DATA_DIR="${ARCANE_DATA_DIR:-/var/lib/arcane}"
ARCANE_USER="${ARCANE_USER:-arcane}"
ARCANE_GROUP="${ARCANE_GROUP:-arcane}"
ARCANE_PORT="${ARCANE_PORT:-3552}"

# Verbosity (default: minimal output)
VERBOSE="${VERBOSE:-false}"

# Logging functions
log_verbose() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BLUE}[INFO]${NC} $1"
    fi
}

log_info() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BLUE}[INFO]${NC} $1"
    fi
}

log_success() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${GREEN}[SUCCESS]${NC} $1"
    fi
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    CURRENT_STEP="$1"
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "\n${CYAN}${BOLD}==> $1${NC}\n"
    fi
}

# Minimal progress indicator
progress() {
    CURRENT_STEP="$1"
    if [[ "$VERBOSE" != "true" ]]; then
        echo -ne "${CYAN}●${NC} $1... "
    fi
}

progress_done() {
    if [[ "$VERBOSE" != "true" ]]; then
        echo -e "${GREEN}done${NC}"
    fi
}

progress_skip() {
    if [[ "$VERBOSE" != "true" ]]; then
        echo -e "${YELLOW}skipped${NC}"
    fi
}

progress_fail() {
    if [[ "$VERBOSE" != "true" ]]; then
        echo -e "${RED}failed${NC}"
    fi
}

# Run command with optional output suppression
run_cmd() {
    if [[ "$VERBOSE" == "true" ]]; then
        "$@"
    else
        "$@" &>/dev/null
    fi
}

# Print banner
print_banner() {
    echo -e "${PURPLE}"
    cat << 'EOF'
    _                            
   / \   _ __ ___ __ _ _ __   ___ 
  / _ \ | '__/ __/ _` | '_ \ / _ \
 / ___ \| | | (_| (_| | | | |  __/
/_/   \_\_|  \___\__,_|_| |_|\___|
                                  
Modern Docker Management, Designed for Everyone.
EOF
    echo -e "${NC}"
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BOLD}Arcane Installation Script${NC}"
        echo -e "Version: ${ARCANE_VERSION}"
        echo ""
    fi
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Detect OS and distribution
detect_os() {
    log_step "Detecting operating system..."
    progress "Detecting system"
    
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS="linux"
        OS_ID=${ID:-linux}
        OS_LIKE=${ID_LIKE:-}
        OS_VERSION=${VERSION_ID:-}
        OS_NAME=${PRETTY_NAME:-Linux}
    elif [[ -f /etc/redhat-release ]]; then
        OS="linux"
        OS_ID="rhel"
        OS_LIKE="rhel fedora"
        OS_VERSION=$(cat /etc/redhat-release | grep -oE '[0-9]+\.[0-9]+' | head -1)
        OS_NAME=$(cat /etc/redhat-release)
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        OS_ID="macos"
        OS_VERSION=$(sw_vers -productVersion)
        OS_NAME="macOS $OS_VERSION"
    else
        progress_fail
        log_error "Unable to detect operating system"
        exit 1
    fi
    
    # Detect architecture
    ARCH=$(uname -m)
    case $ARCH in
        x86_64)
            ARCH="amd64"
            ;;
        aarch64|arm64)
            ARCH="arm64"
            ;;
        armv7l)
            ARCH="armv7"
            ;;
        *)
            progress_fail
            log_error "Unsupported architecture: $ARCH"
            exit 1
            ;;
    esac
    
    log_info "Detected: $OS_NAME ($ARCH)"
    progress_done
}

# Detect package manager (Linux) or Homebrew (macOS)
detect_package_manager() {
    log_step "Detecting package manager..."
    progress "Detecting package manager"

    if [[ "$OS" == "macos" ]]; then
        PKG_MGR="brew"
    elif command -v apt-get &> /dev/null; then
        PKG_MGR="apt"
    elif command -v dnf &> /dev/null; then
        PKG_MGR="dnf"
    elif command -v yum &> /dev/null; then
        PKG_MGR="yum"
    elif command -v pacman &> /dev/null; then
        PKG_MGR="pacman"
    elif command -v zypper &> /dev/null; then
        PKG_MGR="zypper"
    elif command -v apk &> /dev/null; then
        PKG_MGR="apk"
    else
        progress_fail
        log_error "Unsupported package manager. Install dependencies manually."
        exit 1
    fi

    log_info "Package manager: $PKG_MGR"
    progress_done
}

# Check system requirements
check_requirements() {
    log_step "Checking system requirements..."
    progress "Checking requirements"
    
    # Check minimum memory (2GB recommended)
    TOTAL_MEM=$(free -m 2>/dev/null | awk '/^Mem:/{print $2}' || echo "0")
    if [[ $TOTAL_MEM -lt 1024 ]]; then
        log_warn "System has less than 1GB RAM. Arcane may run slowly."
    fi
    
    # Check disk space (5GB minimum recommended)
    AVAILABLE_SPACE=$(df -BG "${ARCANE_INSTALL_DIR%/*}" 2>/dev/null | awk 'NR==2 {gsub("G",""); print $4}' || echo "0")
    if [[ ${AVAILABLE_SPACE:-0} -lt 5 ]]; then
        log_warn "Less than 5GB of disk space available. Consider freeing up space."
    fi
    
    log_success "System requirements check completed"
    progress_done
}

# Install system dependencies
install_dependencies() {
    log_step "Installing system dependencies..."
    progress "Installing dependencies"
    
    case $PKG_MGR in
        apt)
            run_cmd apt-get update -qq
            run_cmd apt-get install -y -qq curl ca-certificates gnupg
            ;;
        dnf)
            run_cmd dnf install -y -q curl ca-certificates gnupg2
            ;;
        yum)
            run_cmd yum install -y -q curl ca-certificates gnupg2
            ;;
        pacman)
            run_cmd pacman -Sy --noconfirm --quiet curl ca-certificates gnupg
            ;;
        zypper)
            run_cmd zypper install -y -q curl ca-certificates gpg2
            ;;
        apk)
            run_cmd apk add --no-cache curl ca-certificates bash
            ;;
        brew)
            # Check for Homebrew
            if ! command -v brew &> /dev/null; then
                log_info "Installing Homebrew..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            run_cmd brew install curl
            ;;
        *)
            progress_fail
            log_error "Unsupported package manager: $PKG_MGR"
            exit 1
            ;;
    esac
    
    log_success "System dependencies installed"
    progress_done
}

# Install Docker
install_docker() {
    log_step "Installing Docker..."
    progress "Installing Docker"
    
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
        log_info "Docker is already installed (version $DOCKER_VERSION)"
        
        # Ensure Docker service is running
        if command -v systemctl &> /dev/null; then
            run_cmd systemctl enable docker 2>/dev/null || true
            run_cmd systemctl start docker 2>/dev/null || true
        fi
        progress_skip
        return 0
    fi
    
    case $PKG_MGR in
        apt)
            # Remove old versions
            run_cmd apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
            
            DOCKER_REPO_OS=""
            DOCKER_CODENAME="${VERSION_CODENAME:-}"
            if [[ -z "$DOCKER_CODENAME" && -n "$UBUNTU_CODENAME" ]]; then
                DOCKER_CODENAME="$UBUNTU_CODENAME"
            fi
            if [[ "$OS_ID" == "ubuntu" || "$OS_ID" == "pop" || "$OS_ID" == "linuxmint" || "$OS_ID" == "zorin" || "$OS_ID" == "elementary" || "$OS_ID" == "neon" || "$OS_LIKE" == *"ubuntu"* ]]; then
                DOCKER_REPO_OS="ubuntu"
            elif [[ "$OS_ID" == "debian" || "$OS_ID" == "kali" || "$OS_LIKE" == *"debian"* ]]; then
                DOCKER_REPO_OS="debian"
            fi
            
            if [[ -n "$DOCKER_REPO_OS" && -n "$DOCKER_CODENAME" ]]; then
                # Add Docker's official GPG key
                install -m 0755 -d /etc/apt/keyrings
                curl -fsSL https://download.docker.com/linux/${DOCKER_REPO_OS}/gpg 2>/dev/null | gpg --dearmor -o /etc/apt/keyrings/docker.gpg 2>/dev/null
                chmod a+r /etc/apt/keyrings/docker.gpg
                
                # Set up repository
                echo \
                    "deb [arch=$ARCH signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${DOCKER_REPO_OS} \
                    ${DOCKER_CODENAME} stable" | \
                    tee /etc/apt/sources.list.d/docker.list > /dev/null
                
                # Install Docker
                run_cmd apt-get update -qq
                run_cmd apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            else
                log_warn "Docker repo not available for this distro; installing distro packages instead"
                run_cmd apt-get update -qq
                run_cmd apt-get install -y -qq docker.io
                run_cmd apt-get install -y -qq docker-compose-plugin docker-compose || true
            fi
            ;;
        dnf)
            run_cmd dnf remove -y docker docker-client docker-client-latest docker-common \
                docker-latest docker-latest-logrotate docker-logrotate docker-selinux \
                docker-engine-selinux docker-engine 2>/dev/null || true
            
            run_cmd dnf -y install dnf-plugins-core
            if [[ "$OS_ID" == "fedora" || "$OS_LIKE" == *"fedora"* ]]; then
                run_cmd dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
            else
                run_cmd dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            fi
            run_cmd dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            ;;
        yum)
            run_cmd yum remove -y docker docker-client docker-client-latest docker-common \
                docker-latest docker-latest-logrotate docker-logrotate docker-engine 2>/dev/null || true
            
            run_cmd yum install -y yum-utils
            run_cmd yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            run_cmd yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            ;;
        pacman)
            run_cmd pacman -S --noconfirm docker docker-compose
            ;;
        zypper)
            run_cmd zypper install -y docker docker-compose
            ;;
        apk)
            run_cmd apk add --no-cache docker docker-compose
            run_cmd rc-update add docker boot 2>/dev/null || true
            ;;
        brew)
            progress_fail
            log_error "Please install Docker Desktop for macOS manually:"
            log_info "https://docs.docker.com/desktop/install/mac-install/"
            log_warn "After installing Docker Desktop, re-run this script."
            exit 1
            ;;
        *)
            progress_fail
            log_error "Docker installation not supported for this system"
            exit 1
            ;;
    esac
    
    # Start and enable Docker service
    if command -v systemctl &> /dev/null; then
        run_cmd systemctl enable docker
        run_cmd systemctl start docker
    elif command -v rc-service &> /dev/null; then
        run_cmd rc-service docker start
    fi
    
    # Verify installation
    if docker --version &> /dev/null; then
        log_success "Docker installed successfully"
        progress_done
    else
        progress_fail
        log_error "Docker installation failed"
        exit 1
    fi
}


# Create Arcane user and directories
setup_arcane_user() {
    log_step "Setting up Arcane user and directories..."
    progress "Setting up user"
    
    # Create arcane group if it doesn't exist
    if ! getent group "$ARCANE_GROUP" &> /dev/null; then
        groupadd --system "$ARCANE_GROUP"
        log_info "Created group: $ARCANE_GROUP"
    fi
    
    # Create arcane user if it doesn't exist
    if ! id "$ARCANE_USER" &> /dev/null; then
        useradd --system --gid "$ARCANE_GROUP" --shell /bin/false \
            --home-dir "$ARCANE_DATA_DIR" --create-home "$ARCANE_USER"
        log_info "Created user: $ARCANE_USER"
    fi
    
    # Add arcane user to docker group
    usermod -aG docker "$ARCANE_USER" 2>/dev/null || true
    
    # Create directories
    mkdir -p "$ARCANE_INSTALL_DIR"
    mkdir -p "$ARCANE_DATA_DIR"
    mkdir -p "$ARCANE_DATA_DIR/data"
    mkdir -p /var/log/arcane
    
    # Set permissions
    chown -R "$ARCANE_USER:$ARCANE_GROUP" "$ARCANE_INSTALL_DIR"
    chown -R "$ARCANE_USER:$ARCANE_GROUP" "$ARCANE_DATA_DIR"
    chown -R "$ARCANE_USER:$ARCANE_GROUP" /var/log/arcane
    
    log_success "User and directories configured"
    progress_done
}

# Download and install Arcane
install_arcane() {
    log_step "Installing Arcane..."
    progress "Installing Arcane"
    
    # Determine the download URL
    if [[ "$ARCANE_VERSION" == "latest" ]]; then
        DOWNLOAD_URL="https://github.com/getarcaneapp/arcane/releases/latest/download/arcane_linux_${ARCH}"
    else
        DOWNLOAD_URL="https://github.com/getarcaneapp/arcane/releases/download/${ARCANE_VERSION}/arcane_linux_${ARCH}"
    fi
    
    # For macOS
    if [[ "$OS" == "macos" ]]; then
        if [[ "$ARCANE_VERSION" == "latest" ]]; then
            DOWNLOAD_URL="https://github.com/getarcaneapp/arcane/releases/latest/download/arcane_darwin_${ARCH}"
        else
            DOWNLOAD_URL="https://github.com/getarcaneapp/arcane/releases/download/${ARCANE_VERSION}/arcane_darwin_${ARCH}"
        fi
    fi
    
    log_info "Downloading Arcane from $DOWNLOAD_URL..."
    
    # Download binary
    if ! curl -fsSL "$DOWNLOAD_URL" -o "$ARCANE_INSTALL_DIR/arcane" 2>/dev/null; then
        progress_fail
        log_error "Failed to download Arcane binary"
        exit 1
    fi
    
    # Make executable
    chmod +x "$ARCANE_INSTALL_DIR/arcane"
    
    # Create symlink
    ln -sf "$ARCANE_INSTALL_DIR/arcane" /usr/local/bin/arcane
    
    # Set ownership
    chown "$ARCANE_USER:$ARCANE_GROUP" "$ARCANE_INSTALL_DIR/arcane"
    
    # Verify installation
    if "$ARCANE_INSTALL_DIR/arcane" --version &> /dev/null 2>&1; then
        log_success "Arcane installed successfully"
        progress_done
    else
        progress_fail
        log_error "Downloaded binary failed to run"
        exit 1
    fi
}

# Create Arcane configuration
create_arcane_config() {
    log_step "Creating Arcane configuration..."
    progress "Creating config"
    
    # .env must be in same directory as the binary
    ENV_FILE="$ARCANE_INSTALL_DIR/.env"
    
    if [[ -f "$ENV_FILE" ]]; then
        log_info "Environment file already exists, skipping..."
        progress_skip
        return 0
    fi
    
    # Generate secure random keys using arcane's built-in generator
    log_info "Generating cryptographic secrets using arcane..."
    SECRETS=$("$ARCANE_INSTALL_DIR/arcane" generate secret --format env 2>/dev/null | grep -E '^(ENCRYPTION_KEY|JWT_SECRET)=')
    ENCRYPTION_KEY=$(echo "$SECRETS" | grep '^ENCRYPTION_KEY=' | cut -d= -f2)
    JWT_SECRET=$(echo "$SECRETS" | grep '^JWT_SECRET=' | cut -d= -f2)
    
    # Fallback to openssl if arcane generate fails
    if [[ -z "$ENCRYPTION_KEY" || -z "$JWT_SECRET" ]]; then
        log_warn "arcane generate failed, falling back to openssl..."
        ENCRYPTION_KEY=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
        JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
    fi
    
    # Detect host IP address for APP_URL
    HOST_IP=$(ip -4 route get 1 2>/dev/null | awk '{print $7; exit}' || \
              hostname -I 2>/dev/null | awk '{print $1}' || \
              ifconfig 2>/dev/null | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | awk '{print $2}' | head -1 || \
              echo "localhost")
    
    # Fallback to localhost if no IP found
    if [[ -z "$HOST_IP" || "$HOST_IP" == " " ]]; then
        HOST_IP="localhost"
    fi
    
    log_info "Detected host IP: $HOST_IP"
    
    cat > "$ENV_FILE" << EOF
# Arcane Environment Configuration
# Generated by install script on $(date)
# Documentation: https://github.com/getarcaneapp/arcane

# Application Settings
ENVIRONMENT=production
PORT=${ARCANE_PORT}
APP_URL=http://${HOST_IP}:${ARCANE_PORT}

# Database Configuration
# SQLite (default) - stores data in the data directory
DATABASE_URL=file:data/arcane.db?_pragma=journal_mode(WAL)&_pragma=busy_timeout(2500)&_txlock=immediate

# Security Settings (auto-generated, keep these secret!)
ENCRYPTION_KEY=${ENCRYPTION_KEY}
JWT_SECRET=${JWT_SECRET}

# Docker Configuration
DOCKER_HOST=unix:///var/run/docker.sock

# Projects
PROJECTS_DIRECTORY=/opt/arcane/projects
DISK_USAGE_PATH=/opt/arcane/projects

# Logging
LOG_LEVEL=info
LOG_JSON=false

# Feature Flags
UPDATE_CHECK_DISABLED=false
UI_CONFIGURATION_DISABLED=false
ANALYTICS_DISABLED=false

# OIDC Authentication (uncomment and configure to enable)
# OIDC_ENABLED=true
# OIDC_CLIENT_ID=your-client-id
# OIDC_CLIENT_SECRET=your-client-secret
# OIDC_ISSUER_URL=https://your-idp.example.com
# OIDC_SCOPES=openid email profile
# OIDC_ADMIN_CLAIM=groups
# OIDC_ADMIN_VALUE=arcane-admins

# Agent Mode (for remote Docker host management)
# AGENT_MODE=false
# AGENT_TOKEN=your-secure-agent-token
EOF
    
    chown "$ARCANE_USER:$ARCANE_GROUP" "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    
    log_success "Configuration created at $ENV_FILE"
    progress_done
}

# Create systemd service
create_systemd_service() {
    log_step "Creating systemd service..."
    progress "Creating service"
    
    if [[ ! -d /etc/systemd/system ]]; then
        log_warn "systemd not found, skipping service creation"
        progress_skip
        return 0
    fi
    
    cat > /etc/systemd/system/arcane.service << EOF
[Unit]
Description=Arcane Docker Management UI
Documentation=https://github.com/getarcaneapp/arcane
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=${ARCANE_USER}
Group=${ARCANE_GROUP}
ExecStart=${ARCANE_INSTALL_DIR}/arcane
WorkingDirectory=${ARCANE_INSTALL_DIR}
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/arcane/arcane.log
StandardError=append:/var/log/arcane/arcane-error.log

# Security hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=${ARCANE_INSTALL_DIR} /var/log/arcane
PrivateTmp=true

# Load environment from file
EnvironmentFile=${ARCANE_INSTALL_DIR}/.env

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd
    run_cmd systemctl daemon-reload
    
    # Enable service
    run_cmd systemctl enable arcane
    
    log_success "Systemd service created and enabled"
    progress_done
}

# Create OpenRC service (for Alpine)
create_openrc_service() {
    log_step "Creating OpenRC service..."
    progress "Creating service"
    
    if [[ ! -d /etc/init.d ]]; then
        log_warn "OpenRC not found, skipping service creation"
        progress_skip
        return 0
    fi
    
    # Create environment file wrapper for OpenRC
    cat > /etc/init.d/arcane << EOF
#!/sbin/openrc-run

name="arcane"
description="Arcane Docker Management UI"
command="${ARCANE_INSTALL_DIR}/arcane"
command_user="${ARCANE_USER}:${ARCANE_GROUP}"
command_background="yes"
pidfile="/run/\${RC_SVCNAME}.pid"
directory="${ARCANE_INSTALL_DIR}"
output_log="/var/log/arcane/arcane.log"
error_log="/var/log/arcane/arcane-error.log"

depend() {
    need docker
    after network
}

start_pre() {
    checkpath --directory --owner ${ARCANE_USER}:${ARCANE_GROUP} /var/log/arcane
    # Load environment variables
    if [ -f ${ARCANE_INSTALL_DIR}/.env ]; then
        set -a
        . ${ARCANE_INSTALL_DIR}/.env
        set +a
    fi
}
EOF
    
    chmod +x /etc/init.d/arcane
    run_cmd rc-update add arcane default 2>/dev/null || true
    
    log_success "OpenRC service created"
    progress_done
}

# Create launchd service (for macOS)
create_launchd_service() {
    log_step "Creating launchd service..."
    progress "Creating service"
    
    PLIST_PATH="/Library/LaunchDaemons/app.getarcane.arcane.plist"
    
    # Create wrapper script that loads .env and runs arcane
    cat > "${ARCANE_INSTALL_DIR}/arcane-wrapper.sh" << 'WRAPPER'
#!/bin/bash
ENV_FILE="ARCANE_INSTALL_DIR_PLACEHOLDER/.env"
if [[ -f "$ENV_FILE" ]]; then
    set -a
    source "$ENV_FILE"
    set +a
fi
cd "ARCANE_INSTALL_DIR_PLACEHOLDER"
exec "ARCANE_INSTALL_DIR_PLACEHOLDER/arcane" "$@"
WRAPPER
    
    # Replace placeholders
    sed -i '' "s|ARCANE_INSTALL_DIR_PLACEHOLDER|${ARCANE_INSTALL_DIR}|g" "${ARCANE_INSTALL_DIR}/arcane-wrapper.sh" 2>/dev/null || \
    sed -i "s|ARCANE_INSTALL_DIR_PLACEHOLDER|${ARCANE_INSTALL_DIR}|g" "${ARCANE_INSTALL_DIR}/arcane-wrapper.sh"
    
    chmod +x "${ARCANE_INSTALL_DIR}/arcane-wrapper.sh"
    chown "$ARCANE_USER:$ARCANE_GROUP" "${ARCANE_INSTALL_DIR}/arcane-wrapper.sh"
    
    cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>app.getarcane.arcane</string>
    <key>ProgramArguments</key>
    <array>
        <string>${ARCANE_INSTALL_DIR}/arcane-wrapper.sh</string>
    </array>
    <key>WorkingDirectory</key>
    <string>${ARCANE_INSTALL_DIR}</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/var/log/arcane/arcane.log</string>
    <key>StandardErrorPath</key>
    <string>/var/log/arcane/arcane-error.log</string>
</dict>
</plist>
EOF
    
    run_cmd launchctl load "$PLIST_PATH" 2>/dev/null || true
    
    log_success "launchd service created"
    progress_done
}

# Start Arcane service
start_arcane() {
    log_step "Starting Arcane service..."
    progress "Starting Arcane"
    
    if command -v systemctl &> /dev/null; then
        run_cmd systemctl start arcane
        sleep 2
        if systemctl is-active --quiet arcane; then
            log_success "Arcane service started successfully"
            progress_done
        else
            progress_fail
            log_error "Failed to start Arcane service"
            systemctl status arcane
            exit 1
        fi
    elif command -v rc-service &> /dev/null; then
        run_cmd rc-service arcane start
        log_success "Arcane service started"
        progress_done
    elif command -v launchctl &> /dev/null; then
        run_cmd launchctl start app.getarcane.arcane 2>/dev/null || true
        log_success "Arcane service started"
        progress_done
    else
        progress_skip
        log_warn "No service manager found. Start Arcane manually with: arcane serve"
    fi
}

# Print completion message
print_completion() {
    echo ""
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}                    Installation Complete!                       ${NC}"
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${BOLD}Access Arcane:${NC} ${BLUE}http://localhost:${ARCANE_PORT}${NC}"
    echo ""
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BOLD}Service Management:${NC}"
        if command -v systemctl &> /dev/null; then
            echo -e "  Start:   ${YELLOW}sudo systemctl start arcane${NC}"
            echo -e "  Stop:    ${YELLOW}sudo systemctl stop arcane${NC}"
            echo -e "  Restart: ${YELLOW}sudo systemctl restart arcane${NC}"
            echo -e "  Status:  ${YELLOW}sudo systemctl status arcane${NC}"
            echo -e "  Logs:    ${YELLOW}sudo journalctl -u arcane -f${NC}"
        elif command -v rc-service &> /dev/null; then
            echo -e "  Start:   ${YELLOW}sudo rc-service arcane start${NC}"
            echo -e "  Stop:    ${YELLOW}sudo rc-service arcane stop${NC}"
            echo -e "  Status:  ${YELLOW}sudo rc-service arcane status${NC}"
        fi
        echo ""
        echo -e "${BOLD}Configuration:${NC}"
        echo -e "  Env file:    ${YELLOW}${ARCANE_INSTALL_DIR}/.env${NC}"
        echo -e "  Data dir:    ${YELLOW}${ARCANE_INSTALL_DIR}/data${NC}"
        echo -e "  Log file:    ${YELLOW}/var/log/arcane/arcane.log${NC}"
        echo ""
        echo -e "${BOLD}Useful Commands:${NC}"
        echo -e "  Version:     ${YELLOW}arcane --version${NC}"
        echo -e "  Help:        ${YELLOW}arcane --help${NC}"
        echo ""
    fi
    echo -e "  ${CYAN}Docs: https://github.com/getarcaneapp/arcane${NC}"
    echo ""
}

# Cleanup function
cleanup() {
    log_info "Cleaning up temporary files..."
    rm -rf /tmp/arcane-* 2>/dev/null || true
}

# Uninstall function
uninstall() {
    log_step "Uninstalling Arcane..."
    progress "Stopping service"
    
    # Stop service
    if command -v systemctl &> /dev/null; then
        run_cmd systemctl stop arcane 2>/dev/null || true
        run_cmd systemctl disable arcane 2>/dev/null || true
        rm -f /etc/systemd/system/arcane.service
        run_cmd systemctl daemon-reload
    elif command -v rc-service &> /dev/null; then
        run_cmd rc-service arcane stop 2>/dev/null || true
        run_cmd rc-update del arcane 2>/dev/null || true
        rm -f /etc/init.d/arcane
    elif command -v launchctl &> /dev/null; then
        run_cmd launchctl unload /Library/LaunchDaemons/app.getarcane.arcane.plist 2>/dev/null || true
        rm -f /Library/LaunchDaemons/app.getarcane.arcane.plist
    fi
    progress_done
    
    progress "Removing files"
    # Remove files
    rm -rf "$ARCANE_INSTALL_DIR"
    rm -f /usr/local/bin/arcane
    rm -rf /var/log/arcane
    progress_done
    
    # Optionally remove data (ask user)
    read -p "Remove Arcane data directory ($ARCANE_DATA_DIR)? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$ARCANE_DATA_DIR"
        log_info "Data directory removed"
    fi
    
    # Optionally remove user
    read -p "Remove Arcane user and group? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        userdel "$ARCANE_USER" 2>/dev/null || true
        groupdel "$ARCANE_GROUP" 2>/dev/null || true
        log_info "User and group removed"
    fi
    
    log_success "Arcane has been uninstalled"
}

# Show help
show_help() {
    echo "Arcane Installation Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h       Show this help message"
    echo "  --verbose, -v    Show detailed output"
    echo "  --uninstall      Uninstall Arcane"
    echo ""
    echo "Environment Variables:"
    echo "  ARCANE_VERSION      Version to install (default: latest)"
    echo "  ARCANE_INSTALL_DIR  Installation directory (default: /opt/arcane)"
    echo "  ARCANE_DATA_DIR     Data directory (default: /var/lib/arcane)"
    echo "  ARCANE_PORT         Port to run on (default: 3552)"
    echo "  VERBOSE=true        Same as --verbose"
    echo ""
    echo "Examples:"
    echo "  # Standard installation (minimal output)"
    echo "  curl -fsSL https://getarcane.app/install.sh | sudo bash"
    echo ""
    echo "  # Verbose installation"
    echo "  curl -fsSL https://getarcane.app/install.sh | sudo bash -s -- --verbose"
    echo ""
    echo "  # Custom port"
    echo "  curl -fsSL https://getarcane.app/install.sh | sudo ARCANE_PORT=8080 bash"
    echo ""
}

# Main installation function
main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --verbose|-v)
                VERBOSE="true"
                shift
                ;;
            --uninstall|uninstall)
                check_root
                uninstall
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    print_banner
    check_root
    detect_os
    detect_package_manager
    check_requirements
    install_dependencies
    install_docker
    setup_arcane_user
    install_arcane
    create_arcane_config
    
    # Create appropriate service based on system manager
    if [[ "$OS" == "macos" ]]; then
        create_launchd_service
    elif command -v systemctl &> /dev/null && [[ -d /etc/systemd/system ]]; then
        create_systemd_service
    elif command -v rc-service &> /dev/null; then
        create_openrc_service
    else
        log_warn "No supported service manager found. Start Arcane manually with: arcane serve"
    fi
    
    start_arcane
    cleanup
    print_completion
}

# Run main function
main "$@"
