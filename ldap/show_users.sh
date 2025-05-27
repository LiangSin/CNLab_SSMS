#!/bin/bash
# show_users.sh - 查詢所有 LDAP 使用者 uid 並以逗號分隔印出

LDAP_BASE="ou=people,dc=cnlab,dc=csie,dc=ntu"

uids=$(ldapsearch -x -b "$LDAP_BASE" "(objectClass=posixAccount)" uid | \
  grep "^uid: " | awk '{print $2}' | paste -sd ',' -)

echo "$uids"

