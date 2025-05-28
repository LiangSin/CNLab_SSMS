#!/bin/bash
# del_user.sh – delete an ldap user

if [ $# -ne 1 ]; then
  echo "Usage: $(basename "$0") <name>"
  echo "Example: $(basename "$0") cnlab"
  exit 1
fi

NAME=$1
# TODO: please modify <admin_passwd>
ldapdelete -x -D "cn=admin,dc=cnlab,dc=csie,dc=ntu" -w <admin_passwd> \
  "uid=${NAME},ou=people,dc=cnlab,dc=csie,dc=ntu"

