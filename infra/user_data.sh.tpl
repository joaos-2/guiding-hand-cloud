#!/bin/bash
set -euo pipefail

dnf update -y
dnf install -y docker git
systemctl enable --now docker
usermod -aG docker ec2-user

mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

cd /opt
git clone ${repo_url} guiding-hand
cd guiding-hand

cat > .env <<EOF
DB_USER=ghuser
DB_PASSWORD=$(openssl rand -hex 24)
DB_NAME=guidinghand
GRAFANA_USER=admin
GRAFANA_PASSWORD=$(openssl rand -hex 24)
APP_IMAGE=guiding-hand-cloud:local
EOF
chmod 600 .env

docker compose up -d --build

echo "Grafana admin password:" > /root/grafana_credentials.txt
grep GRAFANA_PASSWORD /opt/guiding-hand/.env >> /root/grafana_credentials.txt
chmod 600 /root/grafana_credentials.txt
