#!/bin/bash
# create_bedrock.sh – run a Bedrock server on a remote Docker host via SSH

set -euo pipefail

usage() {
    echo "Usage: $(basename "$0") <REMOTE_IP> <SERVER_NAME> <PORT>"
    echo "Example: $(basename "$0") 192.168.1.10 myworld 19133"
    exit 1
}

# --- sanity checks --------------------------------------------------------- #
[[ $# -eq 3 ]] || usage

REMOTE_IP=$1
NAME=$2
PORT=$3

# basic IPv4 regex
[[ $REMOTE_IP =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]] || usage
[[ -n $NAME ]]                                   || usage
[[ $PORT =~ ^[0-9]+$ ]]                          || usage

SSH="ssh -i /home/cnlab/.ssh/docker_control ${REMOTE_IP}"

# --- run container --------------------------------------------------------- #
$SSH docker run -d \
    -e EULA=TRUE \
    -p ${PORT}:19132/udp \
    -v "/home/cnlab/minecraft-data/${NAME}:/data" \
    -e SERVER_NAME="${NAME}" \
    --name "${NAME}" \
    itzg/minecraft-bedrock-server
