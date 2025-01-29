# Research Data

## Recursive Category

- Postgres ltree type: https://www.postgresql.org/docs/current/ltree.html
- Using custom length of level deepth: https://mikehillyer.com/articles/managing-hierarchical-data-in-mysql/

## Email Addresses

- Use docker image for email server https://docker-mailserver.github.io/docker-mailserver/latest/examples/tutorials/basic-installation/ for email `contact@aham.ro`
- **Resolution:**: Not using custom email server ( or maybe https://mailu.io/2024.06/general.html# )

```
docker run \
    -p 25:25 \
    -p 80:80 \
    -p 443:443 \
    -p 110:110 \
    -p 143:143 \
    -p 465:465 \
    -p 587:587 \
    -p 993:993 \
    -p 995:995 \
    -e TZ=Europe/Bucharest \
    -e SSL=OFF \
    -v /usr/local/aham/data/mail:/data \
    -t analogic/poste.io
```

## DNS
- https://brandonrozek.com/blog/coredns/

## Inspiration

**Links:**
- https://www.gumtree.com/
- https://imgur.com/
- https://raw.githubusercontent.com/romania/localitati/refs/heads/master/json/orase.json
- https://gitlab.com/anuntam/website/-/blob/main/init.sql?ref_type=heads
- https://github.com/pacocoursey/next-themes

**Payments:**
- https://mollie.com - aham42@gmx.com ( pass ubuntu )
- https://mangopay.com/
- https://quickpay.net/
- https://paylike.io/features
