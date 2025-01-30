#!/usr/bin/python3

import os
import sys
import shutil
from datetime import datetime

if len(sys.argv) == 1:
    print(f"Please provide destination folder for backing data up")
    os.abort()

to = os.path.abspath(sys.argv[1])

if not os.path.exists(to):
    print(f"The destination path {to} does not exist.")
    os.abort()

if not os.path.isdir(to):
    print(f"The destination path {to} is not a directory.")
    os.abort()

if not os.access(to, os.W_OK):
    print(f"The path {to} is not writable.")
    os.abort()

source = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/data"

try:
    tofile = to + "/aham_data_backup_" + datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    shutil.make_archive(tofile, 'tar', source)
    print(f"Directory {source} successfully compressed to {tofile}")
except Exception as e:
    print(f"Error during compression: {e}")
