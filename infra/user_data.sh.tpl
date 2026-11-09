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

export APP_SHA="$(git rev-parse --short HEAD)"
docker compose up -d --build

echo "Grafana admin password:" > /root/grafana_credentials.txt
grep GRAFANA_PASSWORD /opt/guiding-hand/.env >> /root/grafana_credentials.txt
chmod 600 /root/grafana_credentials.txt

chmod +x /opt/guiding-hand/scripts/deploy.sh

cat > /etc/systemd/system/guiding-hand-deploy.service <<'UNIT'
[Unit]
Description=Guiding Hand pull-based deploy
After=docker.service

[Service]
Type=oneshot
ExecStart=/opt/guiding-hand/scripts/deploy.sh
UNIT

cat > /etc/systemd/system/guiding-hand-deploy.timer <<'UNIT'
[Unit]
Description=Roda o deploy pull-based a cada 2 minutos

[Timer]
OnBootSec=2min
OnUnitActiveSec=2min

[Install]
WantedBy=timers.target
UNIT

systemctl daemon-reload
systemctl enable --now guiding-hand-deploy.timer
