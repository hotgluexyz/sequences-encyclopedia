import os

from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
from psycopg import connect
from psycopg.rows import dict_row


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://oeis:oeis@localhost:5432/oeis",
)

PAGE_SIZE = 50
app = Flask(__name__)
CORS(app)


def query(sql, params=()):
    with connect(DATABASE_URL, row_factory=dict_row) as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchall()


def shape(row):
    data = row["data"] or ""
    return {
        "id": row["oeis_id"],
        "number": row["sequence_number"],
        "name": row["name"],
        "data": data,
        "terms": [term for term in data.split(",") if term],
        "keywords": row["keywords"],
        "offset": row["offset_value"],
    }


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/sequences")
def sequences():
    q = request.args.get('q')
    try:
        page = max(1, int(request.args.get('page', 1)))
    except (ValueError, TypeError):
        page = 1

    offset = (page - 1) * PAGE_SIZE

    accepted_fields = ('name', 'keywords', 'oeis_id')
    filter_statement = ""
    filter_params = []
    if q:
        filter_statement = "WHERE " + " OR ".join([f"""{field} ILIKE %s""" for field in accepted_fields])
        filter_params = [f"%{q}%" for _ in range(len(accepted_fields))]

    filter_params.extend([PAGE_SIZE + 1, offset])  # Needs to be PAGE_SIZE + 1, so that when it reaches the end, it flags has_more

    rows = query(
        f"""
        select sequence_number, oeis_id, name, data, keywords, offset_value
        from oeis_sequences
        {filter_statement}
        order by name
        limit %s OFFSET %s
        """, filter_params
    )

    has_more = len(rows) > PAGE_SIZE
    rows = rows[:PAGE_SIZE]  # Truncate results to fix the PAGE_SIZE + 1 assert above
    return jsonify({'sequences': [shape(row) for row in rows], 'hasMore': has_more})


@app.get("/sequences/<sequence_id>")
def sequence(sequence_id):
    sequence_id = sequence_id.upper()
    rows = query(
        """
        select sequence_number, oeis_id, name, data, keywords, offset_value
        from oeis_sequences
        where oeis_id = %s
        limit 1
        """,
        (sequence_id,),
    )
    if not rows:
        return {"error": "not found"}, 404
    return jsonify(shape(rows[0]))


if __name__ == "__main__":
    app.run(port=int(os.getenv("PORT", "5001")), debug=True)
