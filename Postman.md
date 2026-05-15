# NGO Management System API

Base URL: `http://localhost:8000`

For every endpoint with a request body, use:

- `Content-Type: application/json`

For protected endpoints, add:

- `Authorization: Bearer <your_jwt_token>`

## Public Endpoints

### `GET /`

- Request type: `GET`
- Payload type: `none`

```json
{}
```

### `GET /api/health`

- Request type: `GET`
- Payload type: `none`

```json
{}
```

### `GET /api/health/db`

- Request type: `GET`
- Payload type: `none`

```json
{}
```

### `GET /api/docs.json`

- Request type: `GET`
- Payload type: `none`

```json
{}
```

### `POST /api/auth/register`

- Request type: `POST`
- Payload type: `application/json`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123",
  "role": "public"
}
```

Supported roles: `admin`, `staff`, `donor`, `volunteer`, `public`

Default role: `public`

### `POST /api/auth/login`

- Request type: `POST`
- Payload type: `application/json`

```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```

### `POST /api/auth/forgot-password`

- Request type: `POST`
- Payload type: `application/json`

```json
{
  "email": "jane@example.com"
}
```

### `POST /api/auth/reset-password`

- Request type: `POST`
- Payload type: `application/json`

```json
{
  "token": "token-from-reset-email",
  "newPassword": "NewPassword123"
}
```

## Protected Auth Endpoint

### `PUT /api/auth/change-password`

- Request type: `PUT`
- Payload type: `application/json`

```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword123"
}
```

## Donor Endpoints

### `POST /api/donors`

- Request type: `POST`
- Payload type: `application/json`
- Auth: required, admin, staff, donor, or public
- Note: `userId` is required. For self-service, pass the logged-in user's ID. Creating a donor profile promotes that user to the `donor` role.

```json
{
  "userId": "6822f81b4f0ed1e6455ab456",
  "phone": "+2348012345678",
  "address": "12 Charity Street, Lagos",
  "donorType": "individual"
}
```

Organization example:

```json
{
  "userId": "6822f81b4f0ed1e6455ab456",
  "phone": "+2348012345678",
  "address": "12 Charity Street, Lagos",
  "donorType": "organization",
  "organizationName": "Hope Foundation"
}
```

### `GET /api/donors`

- Request type: `GET`
- Payload type: `none`
- Auth: required, admin or staff
- Optional query params: `page`, `limit`, `donorType`, `isActive`

Example:

```text
/api/donors?page=1&limit=10&donorType=individual&isActive=true
```

### `GET /api/donors/:id`

- Request type: `GET`
- Payload type: `none`
- Auth: required, admin, staff, or the donor who owns the profile
- Note: `:id` can be either the donor profile ID or the linked user ID.

Example:

```text
/api/donors/6822f81b4f0ed1e6455ab456
```

### `PATCH /api/donors/:id`

- Request type: `PATCH`
- Payload type: `application/json`
- Auth: required, admin, staff, or the donor who owns the profile
- Note: `:id` can be either the donor profile ID or the linked user ID.

```json
{
  "phone": "+2348098765432",
  "address": "42 Service Road, Abuja"
}
```

Organization update example:

```json
{
  "donorType": "organization",
  "organizationName": "Hope Foundation Ltd"
}
```

### `PATCH /api/donors/:id/deactivate`

- Request type: `PATCH`
- Payload type: `none`
- Auth: required, donor who owns the profile only
- Note: `:id` can be either the donor profile ID or the linked user ID.

Example:

```text
/api/donors/6822f81b4f0ed1e6455ab456/deactivate
```

### `PATCH /api/donors/:id/reactivate`

- Request type: `PATCH`
- Payload type: `none`
- Auth: required, admin or staff
- Note: `:id` can be either the donor profile ID or the linked user ID.

Example:

```text
/api/donors/6822f81b4f0ed1e6455ab456/reactivate
```

## Donation Endpoints

### `POST /api/donations`

- Request type: `POST`
- Payload type: `application/json`
- Auth: required, admin, staff, or donor
- Note: donors can only create donations for themselves. Admin and staff can optionally pass `userId` or `donorId` to create a donation for a specific donor profile.

```json
{
  "amount": 25000,
  "currency": "NGN",
  "donationType": "transfer",
  "notes": "Monthly contribution"
}
```

With donor and project:

```json
{
  "userId": "6822f81b4f0ed1e6455ab456",
  "projectId": "6822f91b4f0ed1e6455ab789",
  "amount": 50000,
  "currency": "NGN",
  "donationType": "cash",
  "notes": "Support for feeding program"
}
```

### `GET /api/donations`

- Request type: `GET`
- Payload type: `none`
- Auth: required, admin or staff
- Optional query params: `page`, `limit`, `status`, `donationType`

Example:

```text
/api/donations?page=1&limit=10&status=confirmed&donationType=transfer
```

### `GET /api/donations/donor/:donorId`

- Request type: `GET`
- Payload type: `none`
- Auth: required, admin, staff, or donor
- Optional query params: `page`, `limit`

Example:

```text
/api/donations/donor/6822f81b4f0ed1e6455ab456?page=1&limit=10
```

### `GET /api/donations/:id`

- Request type: `GET`
- Payload type: `none`
- Auth: required, admin, staff, or donor

Example:

```text
/api/donations/6822fa1b4f0ed1e6455ababc
```

### `PATCH /api/donations/:id`

- Request type: `PATCH`
- Payload type: `application/json`
- Auth: required, admin or staff

```json
{
  "status": "confirmed",
  "notes": "Payment confirmed by admin"
}
```

Failure example:

```json
{
  "status": "failed",
  "notes": "Payment reconciliation failed"
}
```
