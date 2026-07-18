import pytest
from starlette.testclient import TestClient

from app import app, _HAS_BROTLI


@pytest.mark.skipif(not _HAS_BROTLI, reason="brotli not installed")
def test_brotli_header_present():
    client = TestClient(app)
    resp = client.get("/", headers={"Accept-Encoding": "br"})
    assert resp.status_code == 200
    assert resp.headers.get("Content-Encoding") == "br"
    assert "Vary" in resp.headers and "Accept-Encoding" in resp.headers.get("Vary")
