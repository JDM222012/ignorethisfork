#!/bin/sh
# Name: Tic Tac Toe
# Author: GPT+jdmann6
# DontUseFBInk
#
# Edit SOURCE_DIR if you placed the app elsewhere (e.g., /mnt/us/documents/illusionTicTacToe)
SOURCE_DIR="/mnt/us/documents/illusionTicTacToe"
TARGET_DIR="/var/local/mesquite/illusionTicTacToe"
DB="/var/local/appreg.db"
APP_ID="com.jdmann6.tictactoe"
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Source dir not found: $SOURCE_DIR"
  exit 1
fi

# copy files
rm -rf "$TARGET_DIR"
cp -r "$SOURCE_DIR" "$TARGET_DIR" || exit 2

# register (best-effort; may vary by firmware)
sqlite3 "$DB" <<EOF
INSERT OR IGNORE INTO interfaces(interface) VALUES('application');
INSERT OR IGNORE INTO handlerIds(handlerId) VALUES('$APP_ID');
INSERT OR REPLACE INTO properties(handlerId,name,value) VALUES('$APP_ID','lipcId','$APP_ID');
INSERT OR REPLACE INTO properties(handlerId,name,value) VALUES('$APP_ID','command','/usr/bin/mesquite -l $APP_ID -c file://$TARGET_DIR/');
INSERT OR REPLACE INTO properties(handlerId,name,value) VALUES('$APP_ID','supportedOrientation','U');
EOF

sleep 1
# Try starting app (best-effort)
nohup lipc-set-prop com.lab126.appmgrd start app://$APP_ID >/dev/null 2>&1 &

echo "Installed to $TARGET_DIR (attempted to register $APP_ID)."
