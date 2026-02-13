#!/bin/bash
#
# Arcane Uninstallation Script
# Usage (safe defaults): curl -fsSL https://getarcane.app/uninstall.sh | sudo bash
# Full cleanup (includes Docker): curl -fsSL https://getarcane.app/uninstall.sh | sudo bash -s -- --force --remove-all
#
# This script removes Arcane and optionally its dependencies
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

# Configuration (should match install.sh defaults)
ARCANE_INSTALL_DIR="${ARCANE_INSTALL_DIR:-/opt/arcane}"
ARCANE_DATA_DIR="${ARCANE_DATA_DIR:-/var/lib/arcane}"
ARCANE_USER="${ARCANE_USER:-arcane}"
ARCANE_GROUP="${ARCANE_GROUP:-arcane}"
INSTALL_METADATA_FILE="${INSTALL_METADATA_FILE:-/etc/arcane/install-meta.env}"

# Options
REMOVE_DATA="${REMOVE_DATA:-false}"
REMOVE_USER="${REMOVE_USER:-false}"
REMOVE_DOCKER="${REMOVE_DOCKER:-false}"
FORCE="${FORCE:-false}"
NON_INTERACTIVE="false"
AUTO_REMOVE_USER="false"
AUTO_REMOVE_GROUP="false"

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
    echo -e "${PURPLE}"
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
    if [[ ! -t 0 ]]; then
        NON_INTERACTIVE="true"
    fi

    if [[ "$FORCE" != "true" && ! -t 0 ]]; then
        FORCE="true"
        log_warn "Non-interactive shell detected; proceeding with --force"
    fi
}

user_exists() {
    id "$1" &> /dev/null
}

group_exists() {
    if command -v getent &> /dev/null; then
        getent group "$1" &> /dev/null
        return
    fi
    grep -qE "^${1}:" /etc/group 2>/dev/null
}

read_metadata_value() {
    local key="$1"
    if [[ ! -f "$INSTALL_METADATA_FILE" ]]; then
        echo ""
        return
    fi
    grep -E "^${key}=" "$INSTALL_METADATA_FILE" 2>/dev/null | head -1 | cut -d= -f2-
}

detect_auto_user_group_removal() {
    AUTO_REMOVE_USER="false"
    AUTO_REMOVE_GROUP="false"

    # Prefer explicit install metadata when available
    if [[ -f "$INSTALL_METADATA_FILE" ]]; then
        local meta_user
        local meta_group
        local created_user
        local created_group

        meta_user="$(read_metadata_value "ARCANE_USER")"
        meta_group="$(read_metadata_value "ARCANE_GROUP")"
        created_user="$(read_metadata_value "CREATED_ARCANE_USER")"
        created_group="$(read_metadata_value "CREATED_ARCANE_GROUP")"

        if [[ "$meta_user" == "$ARCANE_USER" && "$created_user" == "true" ]]; then
            AUTO_REMOVE_USER="true"
        fi
        if [[ "$meta_group" == "$ARCANE_GROUP" && "$created_group" == "true" ]]; then
            AUTO_REMOVE_GROUP="true"
        fi
        return
    fi

    # Fallback heuristic for older installs without metadata
    local passwd_entry
    local user_home
    local user_shell
    passwd_entry=$(getent passwd "$ARCANE_USER" 2>/dev/null || grep -E "^${ARCANE_USER}:" /etc/passwd 2>/dev/null | head -1)
    user_home=$(echo "$passwd_entry" | awk -F: '{print $6}')
    user_shell=$(echo "$passwd_entry" | awk -F: '{print $7}')

    if [[ "$ARCANE_USER" == "arcane" && "$ARCANE_GROUP" == "arcane" && -n "$passwd_entry" && "$user_home" == "$ARCANE_DATA_DIR" ]]; then
        case "$user_shell" in
            /bin/false|/sbin/nologin|/usr/sbin/nologin)
                AUTO_REMOVE_USER="true"
                AUTO_REMOVE_GROUP="true"
                ;;
        esac
    fi
}

remove_user_account() {
    local user_name="$1"
    if command -v userdel &> /dev/null; then
        userdel "$user_name" 2>/dev/null || true
        return
    fi
    if command -v deluser &> /dev/null; then
        deluser "$user_name" 2>/dev/null || true
    fi
}

remove_group_account() {
    local group_name="$1"
    if command -v groupdel &> /dev/null; then
        groupdel "$group_name" 2>/dev/null || true
        return
    fi
    if command -v delgroup &> /dev/null; then
        delgroup "$group_name" 2>/dev/null || true
    fi
}

cleanup_install_metadata() {
    if [[ -f "$INSTALL_METADATA_FILE" ]]; then
        rm -f "$INSTALL_METADATA_FILE"
    fi

    local metadata_dir
    metadata_dir="$(dirname "$INSTALL_METADATA_FILE")"
    if [[ -d "$metadata_dir" ]]; then
        rmdir "$metadata_dir" 2>/dev/null || true
    fi
}

print_removal_plan() {
    local data_action="preserved"
    local user_action="preserved"
    local group_action="preserved"
    local docker_action="preserved"

    if [[ "$REMOVE_DATA" == "true" ]]; then
        data_action="removed"
    fi

    if [[ "$REMOVE_USER" == "true" ]]; then
        user_action="removed"
        group_action="removed"
    elif [[ "$NON_INTERACTIVE" == "true" ]]; then
        if [[ "$AUTO_REMOVE_USER" == "true" ]]; then
            user_action="removed (auto-managed)"
        fi
        if [[ "$AUTO_REMOVE_GROUP" == "true" ]]; then
            group_action="removed (auto-managed)"
        fi
    fi

    if [[ "$REMOVE_DOCKER" == "true" ]]; then
        docker_action="removed"
    fi

    echo -e "${BOLD}Removal plan:${NC}"
    echo -e "  - Arcane binaries and services: ${GREEN}removed${NC}"
    echo -e "  - Arcane data (${ARCANE_DATA_DIR}): ${YELLOW}${data_action}${NC}"
    echo -e "  - Arcane user (${ARCANE_USER}): ${YELLOW}${user_action}${NC}"
    echo -e "  - Arcane group (${ARCANE_GROUP}): ${YELLOW}${group_action}${NC}"
    if [[ "$REMOVE_DOCKER" == "true" ]]; then
        echo -e "  - Docker packages: ${RED}${docker_action}${NC}"
        echo -e "${RED}${BOLD}WARNING:${NC} ${RED}Docker removal is enabled and may impact other applications on this host.${NC}"
    else
        echo -e "  - Docker packages: ${YELLOW}${docker_action}${NC}"
    fi
    echo ""
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
    if command -v systemctl &> /dev/null; then
        log_info "Stopping systemd service..."
        run_cmd systemctl stop arcane 2>/dev/null || true
        run_cmd systemctl disable arcane 2>/dev/null || true
        rm -f /etc/systemd/system/arcane.service
        rm -f /lib/systemd/system/arcane.service
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
        if [[ "$REMOVE_DATA" == "true" ]]; then
            progress "Removing data"
            rm -rf "$ARCANE_DATA_DIR"
            log_info "Removed $ARCANE_DATA_DIR"
            progress_done
        elif [[ "$FORCE" == "true" ]]; then
            log_warn "Data directory preserved at $ARCANE_DATA_DIR (use --remove-data to delete)"
        elif confirm "Remove Arcane data directory ($ARCANE_DATA_DIR)? This will delete all your data!"; then
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

    local remove_user_now="false"
    local remove_group_now="false"
    
    if [[ "$REMOVE_USER" == "true" ]]; then
        remove_user_now="true"
        remove_group_now="true"
    elif [[ "$FORCE" == "true" ]]; then
        if [[ "$NON_INTERACTIVE" == "true" && ( "$AUTO_REMOVE_USER" == "true" || "$AUTO_REMOVE_GROUP" == "true" ) ]]; then
            remove_user_now="$AUTO_REMOVE_USER"
            remove_group_now="$AUTO_REMOVE_GROUP"
            log_warn "Non-interactive uninstall: removing Arcane-managed user/group automatically"
        else
            log_warn "User and group preserved (use --remove-user to delete)"
        fi
    elif confirm "Remove Arcane user and group?"; then
        remove_user_now="true"
        remove_group_now="true"
    else
        log_warn "User and group preserved"
    fi

    if [[ "$remove_user_now" == "true" || "$remove_group_now" == "true" ]]; then
        progress "Removing user/group"

        if [[ "$remove_user_now" == "true" ]]; then
            if user_exists "$ARCANE_USER"; then
                remove_user_account "$ARCANE_USER"
                log_info "Removed user: $ARCANE_USER"
            fi
        fi

        if [[ "$remove_group_now" == "true" ]]; then
            if group_exists "$ARCANE_GROUP"; then
                remove_group_account "$ARCANE_GROUP"
                log_info "Removed group: $ARCANE_GROUP"
            fi
        fi

        log_success "User/group removal step completed"
        progress_done
    fi
}

# Remove Docker (optional)
remove_docker() {
    if ! command -v docker &> /dev/null; then
        return 0
    fi
    
    if [[ "$REMOVE_DOCKER" != "true" ]]; then
        if [[ "$FORCE" == "true" ]]; then
            log_warn "Docker preserved (use --remove-docker to delete)"
            return 0
        fi
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
    echo "  --remove-all        Remove everything (data, user, docker/dependencies)"
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
    echo ""
    echo "Examples:"
    echo "  # Interactive uninstall (asks before removing data/user/docker)"
    echo "  sudo bash uninstall.sh"
    echo ""
    echo "  # Remote uninstall with safe defaults"
    echo "  # Keeps data and Docker; removes Arcane-managed user/group only if created by installer"
    echo "  curl -fsSL https://getarcane.app/uninstall.sh | sudo bash"
    echo ""
    echo "  # Verbose uninstall"
    echo "  sudo bash uninstall.sh --verbose"
    echo ""
    echo "  # Remove everything without prompts (includes Docker)"
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
            --remove-all)
                REMOVE_DATA="true"
                REMOVE_USER="true"
                REMOVE_DOCKER="true"
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
    detect_auto_user_group_removal
    
    echo -e "${YELLOW}${BOLD}WARNING: This will uninstall Arcane from your system.${NC}"
    echo -e "${YELLOW}By default, Docker and Arcane data are preserved unless you pass removal flags.${NC}"
    echo ""

    print_removal_plan
    
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
    cleanup_install_metadata
    
    print_completion
}

# Run main function
main "$@"
