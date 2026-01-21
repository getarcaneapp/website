#!/bin/bash
#
# Arcane Update Script
# Usage: curl -fsSL https://getarcane.app/update.sh | bash
#
# Updates Arcane to the latest release (or a specified version)
#

set -e

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
ARCANE_USER="${ARCANE_USER:-arcane}"
ARCANE_GROUP="${ARCANE_GROUP:-arcane}"

# Verbosity (default: minimal output)
VERBOSE="${VERBOSE:-false}"
NO_RESTART="${NO_RESTART:-false}"

# Logging functions
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
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "\n${CYAN}${BOLD}==> $1${NC}\n"
    fi
}

# Minimal progress indicator
progress() {
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
        echo -e "${BOLD}Arcane Update Script${NC}"
        echo -e "Target version: ${ARCANE_VERSION}"
        echo ""
    fi
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Detect OS and architecture
detect_os() {
    log_step "Detecting operating system..."
    progress "Detecting system"

    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS="linux"
        OS_NAME=${PRETTY_NAME:-Linux}
    elif [[ -f /etc/redhat-release ]]; then
        OS="linux"
        OS_NAME=$(cat /etc/redhat-release)
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        OS_NAME="macOS $(sw_vers -productVersion)"
    else
        progress_fail
        log_error "Unable to detect operating system"
        exit 1
    fi

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

resolve_installation() {
    log_step "Locating Arcane installation..."
    progress "Locating Arcane"

    if [[ -x "${ARCANE_INSTALL_DIR}/arcane" ]]; then
        ARCANE_BIN="${ARCANE_INSTALL_DIR}/arcane"
    elif [[ -x "/usr/local/bin/arcane" ]]; then
        ARCANE_BIN="/usr/local/bin/arcane"
        if [[ -L "/usr/local/bin/arcane" ]]; then
            TARGET=$(readlink "/usr/local/bin/arcane" 2>/dev/null || true)
            if [[ -n "$TARGET" ]]; then
                if [[ "$TARGET" != /* ]]; then
                    TARGET="$(dirname "/usr/local/bin/arcane")/$TARGET"
                fi
                ARCANE_BIN="$TARGET"
                ARCANE_INSTALL_DIR="$(dirname "$ARCANE_BIN")"
            fi
        fi
    else
        progress_fail
        log_error "Arcane binary not found. Set ARCANE_INSTALL_DIR or install Arcane first."
        exit 1
    fi

    if [[ ! -x "$ARCANE_BIN" ]]; then
        progress_fail
        log_error "Arcane binary is not executable: $ARCANE_BIN"
        exit 1
    fi

    log_info "Found Arcane at: $ARCANE_BIN"
    progress_done
}

download_arcane() {
    log_step "Downloading Arcane..."
    progress "Downloading Arcane"

    if [[ "$ARCANE_VERSION" == "latest" ]]; then
        if [[ "$OS" == "macos" ]]; then
            DOWNLOAD_URL="https://github.com/getarcaneapp/arcane/releases/latest/download/arcane_darwin_${ARCH}"
        else
            DOWNLOAD_URL="https://github.com/getarcaneapp/arcane/releases/latest/download/arcane_linux_${ARCH}"
        fi
    else
        if [[ "$OS" == "macos" ]]; then
            DOWNLOAD_URL="https://github.com/getarcaneapp/arcane/releases/download/${ARCANE_VERSION}/arcane_darwin_${ARCH}"
        else
            DOWNLOAD_URL="https://github.com/getarcaneapp/arcane/releases/download/${ARCANE_VERSION}/arcane_linux_${ARCH}"
        fi
    fi

    TMP_FILE=$(mktemp -t arcane-update.XXXXXX 2>/dev/null || mktemp /tmp/arcane-update.XXXXXX)

    if command -v curl &>/dev/null; then
        curl -fsSL "$DOWNLOAD_URL" -o "$TMP_FILE" 2>/dev/null
    elif command -v wget &>/dev/null; then
        wget -qO "$TMP_FILE" "$DOWNLOAD_URL"
    else
        progress_fail
        log_error "Neither curl nor wget is available"
        exit 1
    fi

    chmod +x "$TMP_FILE"

    if ! "$TMP_FILE" --version &>/dev/null; then
        progress_fail
        log_error "Downloaded binary failed to run. Aborting update."
        exit 1
    fi

    log_info "Downloaded from: $DOWNLOAD_URL"
    progress_done
}

stop_service() {
    log_step "Stopping Arcane service..."
    progress "Stopping service"

    if command -v systemctl &> /dev/null; then
        run_cmd systemctl stop arcane 2>/dev/null || true
    elif command -v rc-service &> /dev/null; then
        run_cmd rc-service arcane stop 2>/dev/null || true
    elif command -v launchctl &> /dev/null; then
        run_cmd launchctl stop app.getarcane.arcane 2>/dev/null || true
    else
        progress_skip
        log_warn "No service manager found; skipping stop"
        return
    fi

    progress_done
}

start_service() {
    if [[ "$NO_RESTART" == "true" ]]; then
        log_warn "Restart skipped (NO_RESTART=true)"
        return
    fi

    log_step "Starting Arcane service..."
    progress "Starting service"

    if command -v systemctl &> /dev/null; then
        run_cmd systemctl start arcane 2>/dev/null || true
    elif command -v rc-service &> /dev/null; then
        run_cmd rc-service arcane start 2>/dev/null || true
    elif command -v launchctl &> /dev/null; then
        run_cmd launchctl start app.getarcane.arcane 2>/dev/null || true
    else
        progress_skip
        log_warn "No service manager found; start Arcane manually with: arcane serve"
        return
    fi

    progress_done
}

apply_update() {
    log_step "Applying update..."
    progress "Updating binary"

    BACKUP_PATH="${ARCANE_BIN}.bak.$(date +%s)"
    cp "$ARCANE_BIN" "$BACKUP_PATH" 2>/dev/null || true

    cp "$TMP_FILE" "$ARCANE_BIN"
    chmod +x "$ARCANE_BIN"
    chown "$ARCANE_USER:$ARCANE_GROUP" "$ARCANE_BIN" 2>/dev/null || true
    ln -sf "$ARCANE_BIN" /usr/local/bin/arcane 2>/dev/null || true

    progress_done
    log_success "Backup created at $BACKUP_PATH"
}

ensure_systemd_service() {
    if ! command -v systemctl &> /dev/null; then
        return 0
    fi

    if [[ ! -d /etc/systemd/system ]]; then
        return 0
    fi

    if [[ -f /etc/systemd/system/arcane.service ]]; then
        return 0
    fi

    log_step "Creating systemd service..."
    progress "Creating service"

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

    run_cmd systemctl daemon-reload
    run_cmd systemctl enable arcane

    progress_done
    log_success "Systemd service created and enabled"
}

print_completion() {
    OLD_VERSION="${OLD_VERSION:-unknown}"
    NEW_VERSION=$("$ARCANE_BIN" --version 2>/dev/null || echo "unknown")

    echo ""
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}                       Update Complete!                         ${NC}"
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${BOLD}Previous:${NC} ${YELLOW}${OLD_VERSION}${NC}"
    echo -e "  ${BOLD}Current:${NC}  ${GREEN}${NEW_VERSION}${NC}"
    echo ""
}

cleanup() {
    rm -f "$TMP_FILE" 2>/dev/null || true
}

show_help() {
    echo "Arcane Update Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h       Show this help message"
    echo "  --verbose, -v    Show detailed output"
    echo "  --no-restart     Do not restart the Arcane service"
    echo ""
    echo "Environment Variables:"
    echo "  ARCANE_VERSION      Version to install (default: latest)"
    echo "  ARCANE_INSTALL_DIR  Installation directory (default: /opt/arcane)"
    echo "  ARCANE_USER         Arcane service user (default: arcane)"
    echo "  ARCANE_GROUP        Arcane service group (default: arcane)"
    echo "  VERBOSE=true        Same as --verbose"
    echo "  NO_RESTART=true     Same as --no-restart"
    echo ""
    echo "Examples:"
    echo "  # Update to latest"
    echo "  curl -fsSL https://getarcane.app/update.sh | sudo bash"
    echo ""
    echo "  # Update to a specific version"
    echo "  curl -fsSL https://getarcane.app/update.sh | sudo ARCANE_VERSION=v1.2.3 bash"
    echo ""
}

main() {
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
            --no-restart)
                NO_RESTART="true"
                shift
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
    resolve_installation

    OLD_VERSION=$("$ARCANE_BIN" --version 2>/dev/null || echo "unknown")

    download_arcane
    stop_service
    apply_update
    ensure_systemd_service
    start_service
    cleanup
    print_completion
}

main "$@"
