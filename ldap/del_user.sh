#!/bin/bash
# del_user.sh – delete an ldap user

if [ $# -ne 1 ]; then
  echo "Usage: $(basename "$0") <name>"
  echo "Example: $(basename "$0") cnlab"
  exit 1
fi

NAME=$1

ldapdelete -x -D "cn=admin,dc=cnlab,dc=csie,dc=ntu" -w cnlab2016usercnlab \
  "uid=${NAME},ou=people,dc=cnlab,dc=csie,dc=ntu"

