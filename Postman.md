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

## Payment Endpoints

### `POST /api/payment/initialize`

- Request type: `POST`
- Payload type: `application/json`
- Auth: not required (public)
- Description: Initialize a Paystack payment transaction

```json
{
  "email": "donor@example.com",
  "amount": 50000
}
```

**Response:**

```json
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "access_code_here",
    "reference": "reference_code_here"
  }
}
```

---

### `GET /api/payment/verify/:reference`

- Request type: `GET`
- Payload type: `none`
- Auth: not required (public)
- Description: Verify payment status using reference code

Example:

```text
/api/payment/verify/reference_code_from_paystack
```

**Response:**

```json
{
  "status": "success",
  "amount": 50000,
  "customer": {
    "email": "donor@example.com"
  }
}
```

---

### `POST /api/payment/webhook`

- Request type: `POST`
- Payload type: `application/json`
- Auth: not required (Paystack webhook signature verification)
- Description: Receive payment confirmations from Paystack webhook
- Note: Paystack sends `x-paystack-signature` header for authentication

Example Paystack webhook event:

```json
{
  "event": "charge.success",
  "data": {
    "reference": "reference_code",
    "amount": 50000,
    "customer": {
      "email": "donor@example.com"
    }
  }
}
```

---

## Report & Dashboard Endpoints

### `GET /api/reports/donations-summary`

- Request type: `GET`
- Payload type: `none`
- Auth: not required (public)
- Description: Get summary statistics of all donations

**Response:**

```json
{
  "total_donations": 5000000,
  "donation_count": 250,
  "average_donation": 20000,
  "by_status": {
    "confirmed": 3500000,
    "pending": 1000000,
    "failed": 500000
  },
  "by_type": {
    "cash": 2000000,
    "transfer": 3000000
  }
}
```

---

### `GET /api/reports/projects`

- Request type: `GET`
- Payload type: `none`
- Auth: not required (public)
- Optional query params: `status`, `page`, `limit`

Example:

```text
/api/reports/projects?status=ongoing&page=1&limit=10
```

**Response:**

```json
{
  "total_projects": 12,
  "active_projects": 5,
  "completed_projects": 4,
  "by_status": {
    "planned": 2,
    "ongoing": 5,
    "completed": 4,
    "cancelled": 1
  },
  "total_budget": 5000000,
  "total_received": 3500000,
  "total_spent": 2000000,
  "projects": [
    {
      "_id": "project_id",
      "title": "Water Project",
      "budget": 500000,
      "amountReceived": 350000,
      "amountSpent": 200000,
      "status": "ongoing"
    }
  ]
}
```

---

### `GET /api/reports/transparency`

- Request type: `GET`
- Payload type: `none`
- Auth: not required (public)
- Description: Get financial transparency report

**Response:**

```json
{
  "total_funds_received": 5000000,
  "total_funds_spent": 2000000,
  "remaining_balance": 3000000,
  "spending_breakdown": {
    "projects": 1500000,
    "operations": 300000,
    "salaries": 200000
  },
  "donor_count": 250,
  "project_count": 12,
  "efficiency_ratio": 40,
  "generated_at": "2026-05-19T10:30:00Z"
}
```

---

### `GET /dashboard`

- Request type: `GET`
- Payload type: `none`
- Auth: not required (public)
- Description: Get comprehensive dashboard metrics

**Response:**

```json
{
  "key_metrics": {
    "total_donations": 5000000,
    "total_donors": 250,
    "active_projects": 5,
    "beneficiaries": 1200
  },
  "donations_last_30_days": 500000,
  "projects_completed_this_year": 4,
  "impact_metrics": {
    "lives_impacted": 5000,
    "communities_served": 25,
    "success_rate": "92%"
  },
  "recent_donations": [
    {
      "amount": 50000,
      "donor_name": "Jane Doe",
      "project": "Water Project",
      "date": "2026-05-19T08:00:00Z"
    }
  ],
  "top_projects": [
    {
      "_id": "project_id",
      "title": "School Feeding Program",
      "funding_progress": "85%"
    }
  ]
}
```

---

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

---

## Payment Endpoints

### `POST /api/payment/initialize`

- Request type: `POST`
- Payload type: `application/json`
- Auth: not required
- Note: Initializes a Paystack payment session

```json
{
  "email": "donor@example.com",
  "amount": 50000
}
```

Response:

```json
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "wypfx59p6u",
    "reference": "7PVGY9M1DK"
  }
}
```

### `GET /api/payment/verify/:reference`

- Request type: `GET`
- Payload type: `none`
- Auth: not required
- Note: Verify payment status using reference from Paystack

Example:

```text
/api/payment/verify/7PVGY9M1DK
```

Response:

```json
{
  "status": "success",
  "amount": 50000,
  "customer": {
    "id": 123456,
    "email": "donor@example.com",
    "phone": "+2348012345678"
  }
}
```

### `POST /api/payment/webhook`

- Request type: `POST`
- Payload type: `application/json`
- Auth: not required
- Note: Webhook endpoint for Paystack payment notifications (Paystack server initiates this)

Paystack will POST the following payload:

```json
{
  "event": "charge.success",
  "data": {
    "id": 123456789,
    "reference": "7PVGY9M1DK",
    "amount": 50000,
    "status": "success",
    "paid_at": "2026-05-19T10:30:00.000Z",
    "customer": {
      "id": 123456,
      "email": "donor@example.com",
      "phone": "+2348012345678"
    }
  }
}
```

---

## Report Endpoints

### `GET /api/reports/donations-summary`

- Request type: `GET`
- Payload type: `none`
- Auth: required
- Note: Get donations summary statistics

```text
/api/reports/donations-summary
```

Response example:

```json
{
  "success": true,
  "message": "Donations summary retrieved",
  "data": {
    "totalDonations": 1500000,
    "totalDonors": 45,
    "averageDonation": 33333,
    "topDonor": {
      "name": "John Doe",
      "amount": 250000
    },
    "donationsByType": {
      "cash": 500000,
      "transfer": 1000000
    }
  }
}
```

### `GET /api/reports/projects`

- Request type: `GET`
- Payload type: `none`
- Auth: required
- Optional query params: `status`, `startDate`, `endDate`

```text
/api/reports/projects?status=ongoing
```

Response example:

```json
{
  "success": true,
  "message": "Projects report retrieved",
  "data": {
    "totalProjects": 12,
    "projectsByStatus": {
      "planned": 3,
      "ongoing": 5,
      "completed": 3,
      "cancelled": 1
    },
    "totalBudget": 5000000,
    "totalReceived": 2500000,
    "totalSpent": 1800000,
    "balance": 700000,
    "projectDetails": [
      {
        "title": "Water Project",
        "budget": 1000000,
        "received": 600000,
        "spent": 450000,
        "status": "ongoing"
      }
    ]
  }
}
```

### `GET /api/reports/transparency`

- Request type: `GET`
- Payload type: `none`
- Auth: required
- Note: Get transparency report for public accountability

```text
/api/reports/transparency
```

Response example:

```json
{
  "success": true,
  "message": "Transparency report retrieved",
  "data": {
    "reportDate": "2026-05-19T00:00:00.000Z",
    "organizationName": "NGO Management System",
    "financialSummary": {
      "totalFundsReceived": 2500000,
      "totalFundsSpent": 1800000,
      "currentBalance": 700000
    },
    "fundUtilization": {
      "projectsPercentage": 65,
      "adminPercentage": 20,
      "otherPercentage": 15
    },
    "majorDonors": [
      {
        "name": "John Doe",
        "amount": 250000,
        "type": "individual"
      }
    ],
    "activeProjects": 5,
    "beneficiariesServed": 1250
  }
}
```

### `GET /api/dashboard`

- Request type: `GET`
- Payload type: `none`
- Auth: required
- Note: Get comprehensive dashboard metrics

```text
/api/dashboard
```

Response example:

```json
{
  "success": true,
  "message": "Dashboard metrics retrieved",
  "data": {
    "stats": {
      "totalDonors": 45,
      "totalDonations": 1500000,
      "activeProjects": 5,
      "totalVolunteers": 23,
      "totalBeneficiaries": 1250
    },
    "recentDonations": [
      {
        "_id": "6822fa1b4f0ed1e6455ababc",
        "amount": 50000,
        "donor": "Jane Doe",
        "date": "2026-05-19T10:30:00.000Z"
      }
    ],
    "projectProgress": [
      {
        "title": "Water Project",
        "progress": 75,
        "status": "ongoing"
      }
    ],
    "fundFlow": {
      "received": 2500000,
      "spent": 1800000,
      "remaining": 700000
    }
  }
}
```
