import pytest


@pytest.mark.asyncio
async def test_register_success(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "Password123", "name": "Test User"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "Password123", "name": "Test User"},
    )
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "Password123", "name": "Test User 2"},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_register_weak_password(client):
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "pass", "name": "Test User"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_success(client):
    await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "Password123", "name": "Test User"},
    )
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "Password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "Password123", "name": "Test User"},
    )
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me_authenticated(client):
    reg = await client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "Password123", "name": "Test User"},
    )
    token = reg.json()["access_token"]
    response = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"


@pytest.mark.asyncio
async def test_get_me_no_token(client):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 422  # Missing required header