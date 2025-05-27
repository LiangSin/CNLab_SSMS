#!/bin/bash
# add_user.sh – add an ldap user

if [ $# -ne 2 ]; then
  echo "Usage: $(basename "$0") <name> <password>"
  echo "Example: $(basename "$0") cnlab password"
  exit 1
fi

NAME=$1
PASSWORD=$2
GIDNUM=123

# find largest uidNumber and +1 for current use
UIDNUM=$(ldapsearch -x -b "ou=people,dc=cnlab,dc=csie,dc=ntu" "(objectClass=posixAccount)" uidNumber | \
  grep "^uidNumber:" | awk '{print $2}' | sort -n | tail -n1)

if [ -z "$UIDNUM" ]; then
  UIDNUM=2000
else
  UIDNUM=$((UIDNUM + 1))
fi

# hash password
PASSWORD_HASH=$(slappasswd -s "$PASSWORD")

# 新增 LDAP 使用者
cat <<EOF | ldapadd -x -D "cn=admin,dc=cnlab,dc=csie,dc=ntu" -w cnlab2016usercnlab -H ldap:///
dn: uid=${NAME},ou=people,dc=cnlab,dc=csie,dc=ntu
objectClass: top
objectClass: account
objectClass: posixAccount
objectClass: shadowAccount
cn: ${NAME}
uid: ${NAME}
uidNumber: ${UIDNUM}
gidNumber: ${GIDNUM}
homeDirectory: /home/$UID
loginShell: /bin/bash
userPassword: ${PASSWORD_HASH}
EOF

# echo "✅ User '${NAME}' created with uidNumber=${UIDNUM} and gidNumber=${GIDNUM}"

