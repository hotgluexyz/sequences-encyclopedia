# Sequences Encyclopedia

This repo is intentionally small for takehome work.

## Pieces

`docker-compose.yml` starts Postgres with the `oeis` database.

`db_utils/load_oeis.py` fetches OEIS JSON, creates `oeis_sequences`, and inserts rows.

`api/app.py` is a Flask API. It reads from Postgres and exposes:

`GET /health`

`GET /sequences`

`GET /sequences/<oeis_id>`

`website` is a Next.js app. The homepage calls the API and lists sequences. Each sequence links to `/sequences/<oeis_id>`, which calls the API for one row.

`setup.sh` creates the Python virtualenvs and installs the website dependencies.

## Conventions

Keep the repo minimal. Prefer direct code over new abstractions.

Do not add comments. Function docstrings are acceptable when they clarify public behavior.


Use `DATABASE_URL` to point the loader or API at a different Postgres instance.

Use `API_URL` when the website should call an API host other than `http://localhost:5001`.
