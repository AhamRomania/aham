#!/usr/bin/python3

import os
import time
import warnings
import requests
import sqlite3
from bs4 import BeautifulSoup

st = time.time()

warnings.filterwarnings("ignore")

con = sqlite3.connect("categories.db")
cur = con.cursor()

cur.execute("""
    create table if not exists categories (
        url,
        text          
    );
""")

defaultHeaders = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
}

def ScanURL( URL ):
    
    page = requests.get(URL, verify=False, headers=defaultHeaders)

    if (page.status_code != 200):
        print("Can't read URL")
        return


def ScanMenu( URL ):
    
    page = requests.get(URL, verify=False, headers=defaultHeaders)

    if (page.status_code != 200):
        print("Can't read URL")
        return

    soup = BeautifulSoup(page.content, "html.parser")

    results = soup.find(attrs={"data-q": "category-nav-ribbon"}).find_all("a")

    for a in results:
        cur.execute("insert into categories VALUES (:url, :name)", {
            "url": a["href"],
            "name": a.text.strip(),
        })

    con.commit()

    time.sleep(2)

ScanMenu("http://www.gumtree.com")

print("--- %s seconds ---" % (time.time() - st))

cur.close()
con.close()