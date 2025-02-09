#!/usr/bin/python3


import time
import warnings
import json
import psycopg2

st = time.time()

warnings.filterwarnings("ignore")

# Connect to PostgreSQL database
conn = psycopg2.connect(
    dbname="aham", 
    user="aham", 
    password="aham", 
    host="localhost", 
    port="15432"
)

# delete existent data
cursor = conn.cursor()
cursor.execute("delete from categories")
cursor.execute("SELECT pg_catalog.setval('public.categories_id_seq', 1, false)");
conn.commit()
cursor.close()

with open('categories.json', 'r', encoding='utf-8') as file:
    data = json.load(file)  # Parse JSON


def store(items, parent = None):

    ids = {}

    for item in items:
        
        cursor = conn.cursor()

        cursor.execute(
            "insert into categories (name, slug, parent) values (%s, %s, %s) RETURNING id",
            ( item["name"], item["slug"], parent )
        )

        conn.commit()

        ids[item["name"]] = cursor.fetchone()[0];

    for item in items:

        if isinstance(item.get("children"), list):
            store(item.get("children"), ids[item["name"]])


    cursor.close()

store(data)

print("--- %s seconds ---" % (time.time() - st))

conn.close()

# Then
# 1. Export from this connection
## pg_dump -U aham -d aham -t categories --column-inserts --disable-triggers --no-owner --clean --if-exists -f categories.sql