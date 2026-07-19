import unittest

from fastapi.testclient import TestClient

from main import app


class CollegesEndpointTest(unittest.TestCase):
    def test_colleges_endpoint_returns_ok(self):
        client = TestClient(app)
        response = client.get('/api/colleges')
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn('colleges', payload)
        self.assertIsInstance(payload['colleges'], list)


if __name__ == '__main__':
    unittest.main()
