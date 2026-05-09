import unittest
from unittest.mock import patch

from app import app

# python -m unittest to run those puppies

class SequencesTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    @patch("app.query")
    def test_list_sequences(self, mock_query):
        mock_query.return_value = [
            {
                "sequence_number": x,
                "oeis_id": "ID_TEST",
                "name": f"TEST {x}",
                "data": "BLABLABLA",
                "keywords": "BLABLABLA",
                "offset_value": 0,
            } for x in range(10)
        ]

        response = self.client.get("/sequences")

        assert response.status_code == 200
        body = response.get_json()

        assert body["hasMore"] is False
        assert len(body["sequences"]) == 10

    @patch("app.query")
    def test_search_builds_filter(self, mock_query):
        mock_query.return_value = []
        self.client.get("/sequences?q=fib")

        sql, params = mock_query.call_args.args

        assert params[:-2] == ["%fib%"] * 3  # Gets written three times in the backend
        assert params[-2:] == [51, 0]  # Limit and offset