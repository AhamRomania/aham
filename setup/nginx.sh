#!/bin/bash

if (( $EUID != 0 )) ; then
echo "Please run as root"
exit
fi

echo "Cleaning up..."

rm -rf /var/www/aham.ro

echo "Setup folders..."

mkdir -p /var/www/aham.ro/api
mkdir -p /var/www/aham.ro/cdn
mkdir -p /var/www/aham.ro/web
mkdir -p /var/www/aham.ro/certs/{api,cdn,web}

echo "Setup nginx..."

cp -f conf/aham.conf /etc/nginx/sites-enabled/aham.conf

echo "Setup ssl certificates..."

certbot certonly --webroot -w /var/www/aham.ro/certs/web -d aham.ro
certbot certonly --webroot -w /var/www/aham.ro/certs/api -d api.aham.ro
certbot certonly --webroot -w /var/www/aham.ro/certs/cdn -d cdn.aham.ro

cp ../web/src/app/favicon.ico /var/www/aham.ro

echo 'Hello World!' > /var/www/aham.ro/web/index.html

chown -R www-data:www-data /var/www/aham.ro

service nginx restart
