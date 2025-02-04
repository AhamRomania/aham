# Development Manual


In development data is within the project in `/data`

```
make dev
```


In production data is at `/var/data`

```
make prod
```

## Production Environment

Must have the following folders on `/var/aham`:

```
mkdir -p /var/data/cdn
mkdir -p /var/data/db/api
mkdir -p /var/data/db/wp
mkdir -p /var/data/db/redis
mkdir -p /var/data/mail
sudo chmod -R 750 /var/data
```

## Third Party Integrations
- Google Map Key
