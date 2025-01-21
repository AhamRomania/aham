#!/bin/bash

if (( $EUID != 0 )) ; then
echo "Please run as root"
exit
fi

if [ ! -d "/var/www" ]; then
echo "/var/www missing. Nginx running?"
exit
fi

rm -rf /var/www/aham.ro
rm -f /etc/nginx/sites-enabled/aham.conf

mkdir -p /var/www/aham.ro/api
mkdir -p /var/www/aham.ro/cdn
mkdir -p /var/www/aham.ro/web
mkdir -p /var/www/aham.ro/certs

chmod 775 /var/www/aham.ro

cp -f conf/acme-aham.conf /etc/nginx/sites-enabled/acme-aham.conf

service nginx restart

certbot certonly --webroot -w /var/www/aham.ro/certs -d aham.ro
certbot certonly --webroot -w /var/www/aham.ro/certs -d api.aham.ro
certbot certonly --webroot -w /var/www/aham.ro/certs -d cdn.aham.ro

cp ../web/src/app/favicon.ico /var/www/aham.ro

chown -R www-data:www-data /var/www/aham.ro

rm -f /etc/nginx/sites-enabled/acme-aham.conf

rm -rf /var/www/aham.ro/certs

# aham/eeeee

echo 'aham:$apr1$gc45tm9p$fo6DJ1rh5c4XHfMw1IU7h0' > /var/www/aham.ro/.htpasswd

cp -f conf/aham.conf /etc/nginx/sites-enabled/aham.conf

service nginx restart
