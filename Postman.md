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

## Project Endpoints

### `POST /api/projects`

- Request type: `POST`
- Payload type: `application/json`
- Auth: required, admin only

```json
{
  "title": "Water Project",
  "description": "Clean water for rural communities",
  "budget": 100000,
  "amountReceived": 50000,
  "amountSpent": 15000,
  "status": "ongoing",
  "startDate": "2026-05-15T00:00:00.000Z",
  "endDate": "2026-12-31T00:00:00.000Z"
}
```

Minimal example:

```json
{
  "title": "School Feeding Program",
  "budget": 50000
}
```

Supported statuses:

```text
planned
ongoing
completed
cancelled
```

Default status:

```text
planned
```

---

### `GET /api/projects`

- Request type: `GET`
- Payload type: `none`
- Auth: required
- Optional query params: `page`, `limit`, `status`

Example:

```text
/api/projects?page=1&limit=10&status=ongoing
```

---

### `GET /api/projects/:id`

- Request type: `GET`
- Payload type: `none`
- Auth: required

Example:

```text
/api/projects/6822fa1b4f0ed1e6455ababc
```

---

### `PATCH /api/projects/:id`

- Request type: `PATCH`
- Payload type: `application/json`
- Auth: required, admin only

Example update:

```json
{
  "amountSpent": 25000,
  "status": "ongoing"
}
```

Budget update example:

```json
{
  "budget": 150000,
  "amountReceived": 75000
}
```

Completion example:

```json
{
  "status": "completed",
  "endDate": "2026-12-31T00:00:00.000Z"
}
```

---

### `DELETE /api/projects/:id`

- Request type: `DELETE`
- Payload type: `none`
- Auth: required, admin or staff

Example:

```text
/api/projects/6822fa1b4f0ed1e6455ababc
```

---

## Project Business Rules

### Budget Tracking

- `amountSpent` cannot exceed `amountReceived`
- Financial fields must be positive numbers
- `balance` is automatically calculated as:

```text
amountReceived - amountSpent
```

Example:

```json
{
  "amountReceived": 50000,
  "amountSpent": 20000,
  "balance": 30000
}
```

---

## Project Response Example

```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "_id": "6822fa1b4f0ed1e6455ababc",
    "title": "Water Project",
    "description": "Clean water for rural communities",
    "budget": 100000,
    "amountReceived": 50000,
    "amountSpent": 15000,
    "status": "ongoing",
    "balance": 35000,
    "createdBy": {
      "_id": "6822f81b4f0ed1e6455ab456",
      "name": "Admin",
      "email": "admin@test.com",
      "role": "admin"
    },
    "createdAt": "2026-05-15T02:00:10.415Z",
    "updatedAt": "2026-05-15T02:00:10.415Z"
  }
}
```