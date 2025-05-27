#!/bin/bash
# remove_docker.sh – remove a server on a remote Docker host via SSH

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
DATA_DIR="/home/cnlab/minecraft-data/${NAME}"

# --- remove container ------------------------------------------------------- #
$SSH "docker ps -q --filter name=^/${NAME}\$ | xargs -r docker stop"
$SSH "docker rm -f ${NAME} 2>/dev/null || true"
$SSH "if [ -d '${DATA_DIR}' ]; then
        # use root inside a throw-away Alpine container to nuke contents
        docker run --rm -v '${DATA_DIR}':/target alpine \
               sh -c 'rm -rf /target/*'
        # remove now-empty directory; ignore error if still in use
        rmdir '${DATA_DIR}' 2>/dev/null || true
      fi"
