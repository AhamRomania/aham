#!/bin/bash

if (( $EUID != 0 )) ; then
echo "Please run as root"
exit
fi

rm -rf /var/www/aham.ro

mkdir -p /var/www/aham.ro/api
mkdir -p /var/www/aham.ro/cdn
mkdir -p /var/www/aham.ro/web
mkdir -p /var/www/aham.ro/certs

cp -f conf/acme-aham.conf /etc/nginx/sites-enabled/acme-aham.conf

service nginx restart

certbot certonly --webroot -w /var/www/aham.ro/certs -d aham.ro
certbot certonly --webroot -w /var/www/aham.ro/certs -d api.aham.ro
certbot certonly --webroot -w /var/www/aham.ro/certs -d cdn.aham.ro

cp ../web/src/app/favicon.ico /var/www/aham.ro

chown -R www-data:www-data /var/www/aham.ro

rm -f /etc/nginx/sites-enabled/acme-aham.conf

rm -rf /var/www/aham.ro/certs

cp -f conf/aham.conf /etc/nginx/sites-enabled/aham.conf

service nginx restart
