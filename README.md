# Sequences Encyclopedia

Minimal OEIS browser with a Flask API and a Next.js website.

## Requirements
- Docker
- Python
- NodeJS/NPM

## Setup

Install dependencies and load data:

```sh
./setup.sh
```

Run the app:

```sh
./dev-run.sh
```

Open `http://localhost:3000`.

The API runs on `http://localhost:5001`. Use `GET /sequences` and `GET /sequences/A001055`.
