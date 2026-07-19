from config import settings
from database import build_database_url


def test_build_database_url_prefers_mysql(monkeypatch):
    monkeypatch.setattr(settings, "USE_SQLITE", False, raising=False)
    monkeypatch.setattr(settings, "MYSQL_HOST", "mysql", raising=False)
    monkeypatch.setattr(settings, "MYSQL_PORT", 3306, raising=False)
    monkeypatch.setattr(settings, "MYSQL_USER", "gpap", raising=False)
    monkeypatch.setattr(settings, "MYSQL_PASSWORD", "gpap123", raising=False)
    monkeypatch.setattr(settings, "MYSQL_DB", "gpap_db", raising=False)

    url = build_database_url()

    assert url == "mysql+pymysql://gpap:gpap123@mysql:3306/gpap_db?charset=utf8mb4"
