#!/usr/bin/env python3
"""
Fix JSON escaping in import-data.sql for Supabase.

In SQL single-quoted strings, JSON must use regular double quotes.
This script converts the CSV-escaped doubled double-quotes inside
JSON arrays/objects to normal JSON double quotes.
"""

import re

SQL_PATH = 'supabase/import-data.sql'

with open(SQL_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace doubled double quotes inside SQL single-quoted strings
# when they appear to be JSON arrays/objects.
content = content.replace('""', '"')

with open(SQL_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Fixed JSON escaping in {SQL_PATH}")