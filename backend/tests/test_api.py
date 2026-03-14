import pytest
from datetime import datetime, timedelta


@pytest.fixture
async def auth_token(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "Password123", "name": "Test User"},
    )
    return response.json()["access_token"]


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.mark.asyncio
async def test_create_client(client, auth_headers):
    response = await client.post(
        "/api/v1/clients",
        headers=auth_headers,
        json={"name": "Acme Corp", "email": "billing@acme.com", "phone": "+1234567890"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Acme Corp"
    assert data["email"] == "billing@acme.com"


@pytest.mark.asyncio
async def test_list_clients(client, auth_headers):
    # Create a few clients first
    for i in range(3):
        await client.post(
            "/api/v1/clients",
            headers=auth_headers,
            json={"name": f"Client {i}", "email": f"client{i}@example.com"},
        )
    response = await client.get("/api/v1/clients", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] == 3


@pytest.mark.asyncio
async def test_unauthorized_access(client):
    response = await client.get("/api/v1/clients")
    assert response.status_code == 422  # Missing auth header

    response = await client.post("/api/v1/clients", json={"name": "Test", "email": "t@t.com"})
    assert response.status_code == 422