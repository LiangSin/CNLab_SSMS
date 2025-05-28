#!/bin/bash
# stop_docker.sh – stop a server on a remote Docker host via SSH

set -euo pipefail

usage() {
    echo "Usage: $(basename "$0") <REMOTE_IP> <SERVER_NAME>"
    echo "Example: $(basename "$0") 192.168.1.10 myworld"
    exit 1
}

# --- sanity checks --------------------------------------------------------- #
[[ $# -eq 2 ]] || usage

REMOTE_IP=$1
NAME=$2

# basic IPv4 regex
[[ $REMOTE_IP =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]] || usage
[[ -n $NAME ]]                                   || usage

SSH="ssh -i /home/cnlab/.ssh/docker_control ${REMOTE_IP}"

# --- stop container -------------------------------------------------------- #
$SSH docker stop "${NAME}"
