#!/usr/bin/env python3
"""
Cleans VegatoursV2 CSVs for Supabase import.

Fixes:
- fleet.price, tour_packages.price: strip "IDR" prefix and commas
- bookings.invoice_amount: strip "IDR" prefix and commas if present
- Strips currency suffixes from price columns
- Outputs cleaned_*.csv files in the same directory as the inputs.

Usage:
    python supabase/clean_csv.py
"""

import csv
import os
import re

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'Vegatours_Data')

# Map table -> column that needs numeric cleaning
# If the column contains arrays in JSONB, we still clean if the whole column is treated as text
CLEAN_MAP = {
    'Fleet_export.csv': {
        'column': 'price',
        'pattern': re.compile(r'[^\d]'),
    },
    'TourPackage_export.csv': {
        'column': 'price',
        'pattern': re.compile(r'[^\d]'),
    },
    'Booking_export.csv': {
        'column': 'invoice_amount',
        'pattern': re.compile(r'[^\d]'),
    },
}


def clean_value(value: str, pattern: re.Pattern) -> str:
    """Remove non-numeric chars except dot and minus. Preserve empty string as empty."""
    v = value.strip()
    if v == '' or v.lower() == 'null':
        return ''
    cleaned = pattern.sub('', v)
    return cleaned


def clean_csv(filename: str, column: str, pattern: re.Pattern):
    input_path = os.path.join(DATA_DIR, filename)
    output_path = os.path.join(DATA_DIR, f"clean_{filename}")
    if not os.path.exists(input_path):
        print(f"SKIP: {input_path} not found")
        return

    with open(input_path, newline='', encoding='utf-8-sig') as infile, \
         open(output_path, 'w', newline='', encoding='utf-8') as outfile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in reader:
            if column in row and row[column] is not None:
                raw = row[column]
                row[column] = clean_value(raw, pattern)
            writer.writerow(row)
    print(f"CLEANED: {output_path}")


if __name__ == '__main__':
    for filename, cfg in CLEAN_MAP.items():
        clean_csv(filename, cfg['column'], cfg['pattern'])
    print("Done. Import the clean_*.csv files from Supabase Dashboard.")