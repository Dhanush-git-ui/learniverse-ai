import pytest
from starlette.testclient import TestClient
import app as app_module
from app import app

_HAS_BROTLI = getattr(app_module, "_HAS_BROTLI", False)

@pytest.mark.skipif(not _HAS_BROTLI, reason="brotli not installed")
def test_brotli_header_present():
    client = TestClient(app)
    resp = client.get("/", headers={"Accept-Encoding": "br"})
    assert resp.status_code == 200
    assert resp.headers.get("Content-Encoding") == "br"
    assert "Vary" in resp.headers and "Accept-Encoding" in resp.headers.get("Vary")

