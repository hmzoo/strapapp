#/bin/bash

cat <<EOT >> .env
HOST=0.0.0.0
PORT=1337
APP_KEYS=`openssl rand -base64 24`
API_TOKEN_SALT=`openssl rand -base64 24`
ADMIN_JWT_SECRET=`openssl rand -base64 24`
EOT
