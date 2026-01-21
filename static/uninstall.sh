#!/bin/bash
#
# Arcane Uninstallation Script
# Usage: curl -fsSL https://getarcane.app/uninstall.sh | bash
#
# This script removes Arcane and optionally its dependencies
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration (should match install.sh defaults)
ARCANE_INSTALL_DIR="${ARCANE_INSTALL_DIR:-/opt/arcane}"
ARCANE_DATA_DIR="${ARCANE_DATA_DIR:-/var/lib/arcane}"
ARCANE_USER="${ARCANE_USER:-arcane}"
ARCANE_GROUP="${ARCANE_GROUP:-arcane}"

# Options
REMOVE_DATA="${REMOVE_DATA:-false}"
REMOVE_USER="${REMOVE_USER:-false}"
REMOVE_DOCKER="${REMOVE_DOCKER:-false}"
REMOVE_GO="${REMOVE_GO:-false}"
REMOVE_NODE="${REMOVE_NODE:-false}"
FORCE="${FORCE:-false}"

# Verbosity (default: minimal output)
VERBOSE="${VERBOSE:-false}"

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

# Print banner
print_banner() {
    echo -e "${RED}"
    cat << 'EOF'
    _                            
   / \   _ __ ___ __ _ _ __   ___ 
  / _ \ | '__/ __/ _` | '_ \ / _ \
 / ___ \| | | (_| (_| | | | |  __/
/_/   \_\_|  \___\__,_|_| |_|\___|
                                  
Modern Docker Management, Designed for Everyone.
Uninstallation Script
EOF
    echo -e "${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

auto_force_if_piped() {
    if [[ "$FORCE" != "true" && ! -t 0 ]]; then
        FORCE="true"
        log_warn "Non-interactive shell detected; proceeding with --force"
    fi
}

# Prompt for confirmation
confirm() {
    local prompt="$1"
    local default="${2:-n}"
    
    if [[ "$FORCE" == "true" ]]; then
        return 0
    fi
    
    if [[ "$default" == "y" ]]; then
        read -p "$prompt [Y/n] " -n 1 -r
    else
        read -p "$prompt [y/N] " -n 1 -r
    fi
    echo
    
    if [[ "$default" == "y" ]]; then
        [[ ! $REPLY =~ ^[Nn]$ ]]
    else
        [[ $REPLY =~ ^[Yy]$ ]]
    fi
}

# Stop and disable Arcane service
stop_service() {
    log_step "Stopping Arcane service..."
    progress "Stopping service"
    
    # systemd
    if command -v systemctl &> /dev/null && [[ -f /etc/systemd/system/arcane.service ]]; then
        log_info "Stopping systemd service..."
        run_cmd systemctl stop arcane 2>/dev/null || true
        run_cmd systemctl disable arcane 2>/dev/null || true
        rm -f /etc/systemd/system/arcane.service
        run_cmd systemctl daemon-reload
        log_success "Systemd service removed"
    fi
    
    # OpenRC
    if [[ -f /etc/init.d/arcane ]]; then
        log_info "Stopping OpenRC service..."
        run_cmd rc-service arcane stop 2>/dev/null || true
        run_cmd rc-update del arcane 2>/dev/null || true
        rm -f /etc/init.d/arcane
        log_success "OpenRC service removed"
    fi
    
    # launchd (macOS)
    if [[ -f /Library/LaunchDaemons/app.getarcane.arcane.plist ]]; then
        log_info "Stopping launchd service..."
        run_cmd launchctl unload /Library/LaunchDaemons/app.getarcane.arcane.plist 2>/dev/null || true
        rm -f /Library/LaunchDaemons/app.getarcane.arcane.plist
        log_success "launchd service removed"
    fi
    
    progress_done
}

# Remove Arcane binary and installation directory
remove_arcane() {
    log_step "Removing Arcane installation..."
    progress "Removing Arcane"
    
    # Remove symlink
    if [[ -L /usr/local/bin/arcane ]]; then
        rm -f /usr/local/bin/arcane
        log_info "Removed /usr/local/bin/arcane symlink"
    fi
    
    # Remove installation directory
    if [[ -d "$ARCANE_INSTALL_DIR" ]]; then
        rm -rf "$ARCANE_INSTALL_DIR"
        log_info "Removed $ARCANE_INSTALL_DIR"
    fi
    
    log_success "Arcane installation removed"
    progress_done
}

# Remove Arcane data
remove_data() {
    log_step "Removing Arcane data..."
    
    if [[ -d "$ARCANE_DATA_DIR" ]]; then
        if [[ "$REMOVE_DATA" == "true" ]] || confirm "Remove Arcane data directory ($ARCANE_DATA_DIR)? This will delete all your data!"; then
            progress "Removing data"
            rm -rf "$ARCANE_DATA_DIR"
            log_info "Removed $ARCANE_DATA_DIR"
            progress_done
        else
            log_warn "Data directory preserved at $ARCANE_DATA_DIR"
        fi
    fi
    
    # Remove log directory
    progress "Removing logs"
    if [[ -d /var/log/arcane ]]; then
        rm -rf /var/log/arcane
        log_info "Removed /var/log/arcane"
    fi
    progress_done
}

# Remove Arcane user and group
remove_user() {
    log_step "Removing Arcane user and group..."
    
    if [[ "$REMOVE_USER" == "true" ]] || confirm "Remove Arcane user and group?"; then
        progress "Removing user"
        # Remove user
        if id "$ARCANE_USER" &> /dev/null; then
            userdel "$ARCANE_USER" 2>/dev/null || true
            log_info "Removed user: $ARCANE_USER"
        fi
        
        # Remove group
        if getent group "$ARCANE_GROUP" &> /dev/null; then
            groupdel "$ARCANE_GROUP" 2>/dev/null || true
            log_info "Removed group: $ARCANE_GROUP"
        fi
        
        log_success "User and group removed"
        progress_done
    else
        log_warn "User and group preserved"
    fi
}

# Remove Docker (optional)
remove_docker() {
    if ! command -v docker &> /dev/null; then
        return 0
    fi
    
    if [[ "$REMOVE_DOCKER" != "true" ]]; then
        if ! confirm "Remove Docker? (This may affect other applications)"; then
            log_warn "Docker preserved"
            return 0
        fi
    fi
    
    log_step "Removing Docker..."
    progress "Removing Docker"
    
    if command -v apt-get &> /dev/null; then
        run_cmd apt-get remove -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker.io docker-compose 2>/dev/null || true
        run_cmd apt-get autoremove -y 2>/dev/null || true
        rm -f /etc/apt/sources.list.d/docker.list
        rm -f /etc/apt/keyrings/docker.gpg
    elif command -v dnf &> /dev/null; then
        run_cmd dnf remove -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker docker-compose 2>/dev/null || true
    elif command -v yum &> /dev/null; then
        run_cmd yum remove -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker docker-compose 2>/dev/null || true
    elif command -v pacman &> /dev/null; then
        run_cmd pacman -Rns --noconfirm docker docker-compose 2>/dev/null || true
    elif command -v zypper &> /dev/null; then
        run_cmd zypper remove -y docker docker-compose 2>/dev/null || true
    elif command -v apk &> /dev/null; then
        run_cmd apk del docker docker-compose 2>/dev/null || true
    else
        log_warn "Unsupported package manager. Remove Docker manually."
    fi
    
    log_success "Docker removed"
    progress_done
}

# Remove Go (optional)
remove_go() {
    if [[ ! -d /usr/local/go ]]; then
        return 0
    fi
    
    if [[ "$REMOVE_GO" != "true" ]]; then
        if ! confirm "Remove Go? (This may affect other applications)"; then
            log_warn "Go preserved"
            return 0
        fi
    fi
    
    log_step "Removing Go..."
    progress "Removing Go"
    
    rm -rf /usr/local/go
    rm -f /etc/profile.d/go.sh
    
    log_success "Go removed"
    progress_done
}

# Remove Node.js/fnm (optional)
remove_node() {
    if ! command -v fnm &> /dev/null && ! command -v node &> /dev/null; then
        return 0
    fi
    
    if [[ "$REMOVE_NODE" != "true" ]]; then
        if ! confirm "Remove Node.js and fnm? (This may affect other applications)"; then
            log_warn "Node.js preserved"
            return 0
        fi
    fi
    
    log_step "Removing Node.js and fnm..."
    progress "Removing Node.js"
    
    # Remove fnm
    rm -f /usr/local/bin/fnm
    rm -rf /opt/fnm
    rm -f /etc/profile.d/fnm.sh
    
    # Remove node symlinks
    rm -f /usr/local/bin/node
    rm -f /usr/local/bin/npm
    rm -f /usr/local/bin/npx
    rm -f /usr/local/bin/pnpm
    
    # Remove user fnm directories
    rm -rf ~/.local/share/fnm 2>/dev/null || true
    rm -rf ~/.fnm 2>/dev/null || true
    
    log_success "Node.js and fnm removed"
    progress_done
}

# Print completion message
print_completion() {
    echo ""
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}                  Uninstallation Complete!                       ${NC}"
    echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${CYAN}Arcane has been successfully uninstalled.${NC}"
    echo ""
    
    if [[ -d "$ARCANE_DATA_DIR" ]]; then
        echo -e "  ${YELLOW}Note: Data directory preserved at $ARCANE_DATA_DIR${NC}"
        echo -e "  ${YELLOW}      Run with --remove-data to delete it.${NC}"
        echo ""
    fi
    
    echo -e "  ${CYAN}Thank you for using Arcane!${NC}"
    echo -e "  ${CYAN}Feedback: https://github.com/getarcaneapp/arcane/issues${NC}"
    echo ""
}

# Show help
show_help() {
    echo "Arcane Uninstallation Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h          Show this help message"
    echo "  --verbose, -v       Show detailed output"
    echo "  --force, -f         Skip all confirmation prompts"
    echo "  --remove-data       Remove Arcane data directory"
    echo "  --remove-user       Remove Arcane user and group"
    echo "  --remove-docker     Remove Docker"
    echo "  --remove-go         Remove Go"
    echo "  --remove-node       Remove Node.js and fnm"
    echo "  --remove-all        Remove everything (data, user, docker, go, node)"
    echo ""
    echo "Environment Variables:"
    echo "  ARCANE_INSTALL_DIR  Installation directory (default: /opt/arcane)"
    echo "  ARCANE_DATA_DIR     Data directory (default: /var/lib/arcane)"
    echo "  ARCANE_USER         Arcane user (default: arcane)"
    echo "  ARCANE_GROUP        Arcane group (default: arcane)"
    echo "  VERBOSE=true        Same as --verbose"
    echo "  FORCE=true          Same as --force"
    echo "  REMOVE_DATA=true    Same as --remove-data"
    echo "  REMOVE_USER=true    Same as --remove-user"
    echo "  REMOVE_DOCKER=true  Same as --remove-docker"
    echo "  REMOVE_GO=true      Same as --remove-go"
    echo "  REMOVE_NODE=true    Same as --remove-node"
    echo ""
    echo "Examples:"
    echo "  # Interactive uninstall (minimal output, asks for confirmation)"
    echo "  sudo bash uninstall.sh"
    echo ""
    echo "  # Verbose uninstall"
    echo "  sudo bash uninstall.sh --verbose"
    echo ""
    echo "  # Remove everything without prompts"
    echo "  sudo bash uninstall.sh --force --remove-all"
    echo ""
    echo "  # Remove Arcane and data, keep dependencies"
    echo "  sudo bash uninstall.sh --remove-data"
    echo ""
}

# Parse arguments
parse_args() {
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
            --force|-f)
                FORCE="true"
                shift
                ;;
            --remove-data)
                REMOVE_DATA="true"
                shift
                ;;
            --remove-user)
                REMOVE_USER="true"
                shift
                ;;
            --remove-docker)
                REMOVE_DOCKER="true"
                shift
                ;;
            --remove-go)
                REMOVE_GO="true"
                shift
                ;;
            --remove-node)
                REMOVE_NODE="true"
                shift
                ;;
            --remove-all)
                REMOVE_DATA="true"
                REMOVE_USER="true"
                REMOVE_DOCKER="true"
                REMOVE_GO="true"
                REMOVE_NODE="true"
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
}

# Main function
main() {
    parse_args "$@"
    
    print_banner
    check_root
    auto_force_if_piped
    
    echo -e "${YELLOW}${BOLD}WARNING: This will uninstall Arcane from your system.${NC}"
    echo ""
    
    if [[ "$FORCE" != "true" ]]; then
        if ! confirm "Are you sure you want to continue?"; then
            log_info "Uninstallation cancelled"
            exit 0
        fi
    fi
    
    stop_service
    remove_arcane
    remove_data
    remove_user
    remove_docker
    remove_go
    remove_node
    
    print_completion
}

# Run main function
main "$@"
