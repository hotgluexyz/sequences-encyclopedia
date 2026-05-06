import argparse
import json
import os
import random
import urllib.error
import sys
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse
from urllib.request import Request, urlopen

import psycopg
from psycopg.types.json import Jsonb


DEFAULT_PAGES = ["https://oeis.org/A112798", "https://oeis.org/A001055"]
DEFAULT_DATABASE_URL = "postgresql://oeis:oeis@localhost:5432/oeis"


def page_url(page):
    if page.startswith("A") and len(page) == 7:
        page = f"https://oeis.org/{page}"
    parsed = urlparse(page)
    query = dict(parse_qsl(parsed.query))
    query["fmt"] = "json"
    return urlunparse(parsed._replace(query=urlencode(query)))


def random_pages(count):
    return [
        f"https://oeis.org/A{random.randint(1, 999999):06d}"
        for _ in range(count)
    ]


def fetch_sequence(page):
    req = Request(
        page_url(page),
        headers={"User-Agent": "oeis-postgres-loader/1.0"},
    )
    try:
        with urlopen(req, timeout=20) as response:
            payload = json.load(response)
    except urllib.error.HTTPError as exc:
        print(f"failed to fetch {page}: {exc}", file=sys.stderr)
        return None
    if isinstance(payload, dict) and payload.get("results"):
        payload = payload["results"][0]
    if not isinstance(payload, dict) or "number" not in payload:
        raise ValueError("unexpected OEIS response")
    return payload


def ensure_table(conn):
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS oeis_sequences (
          sequence_number integer PRIMARY KEY,
          oeis_id text NOT NULL UNIQUE,
          name text NOT NULL,
          data text NOT NULL,
          keywords text,
          offset_value text,
          raw jsonb NOT NULL,
          fetched_at timestamptz NOT NULL DEFAULT now()
        )
        """
    )


def upsert_sequence(conn, sequence):
    number = int(sequence["number"])
    conn.execute(
        """
        INSERT INTO oeis_sequences
          (
            sequence_number, oeis_id, name, data, keywords, offset_value,
            raw, fetched_at
          )
        VALUES (%s, %s, %s, %s, %s, %s, %s, now())
        ON CONFLICT (sequence_number) DO UPDATE SET
          oeis_id = EXCLUDED.oeis_id,
          name = EXCLUDED.name,
          data = EXCLUDED.data,
          keywords = EXCLUDED.keywords,
          offset_value = EXCLUDED.offset_value,
          raw = EXCLUDED.raw,
          fetched_at = now()
        """,
        (
            number,
            f"A{number:06d}",
            sequence.get("name", ""),
            sequence.get("data", ""),
            sequence.get("keyword"),
            sequence.get("offset"),
            Jsonb(sequence),
        ),
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "pages",
        nargs="*",
        help="OEIS URLs or ids like A001055",
    )
    parser.add_argument(
        "--database-url",
        default=os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL),
    )
    args = parser.parse_args()
    pages = (args.pages or DEFAULT_PAGES) + random_pages(500)
    with psycopg.connect(args.database_url) as conn:
        print(f"connected to {args.database_url}")
        print(f"ensuring table")
        ensure_table(conn)
        for page in pages:
            print(f"fetching {page}")
            sequence = fetch_sequence(page)
            if sequence is None:
                continue
            print(f"upserting {page}")
            upsert_sequence(conn, sequence)


if __name__ == "__main__":
    main()
