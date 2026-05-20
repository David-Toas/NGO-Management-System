# NGO Management System

A comprehensive REST API for managing NGO operations, including donors, donations, projects, events, volunteers, beneficiaries, and financial reports.

## 🌟 Features

- **User Management**: Authentication, registration, password management
- **Donor Management**: Create and manage donor profiles
- **Donation Tracking**: Record and track donations with project associations
- **Project Management**: Create, update, and track projects with budgets
- **Event Management**: Schedule and manage NGO events
- **Volunteer Management**: Register, approve, and assign volunteers
- **Beneficiary Management**: Register and manage beneficiaries
- **Payment Processing**: Integration with Paystack for secure payments
- **Financial Reports**: Comprehensive reports on donations, projects, and transparency
- **Health Monitoring**: Real-time database and service health checks
- **API Documentation**: Interactive Swagger UI with OpenAPI specification

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Paystack
- **Documentation**: Swagger/OpenAPI 3.0
- **Email Service**: Nodemailer
- **Security**: Helmet.js
- **Logging**: Winston (custom logger)
- **Hosting**: Vercel

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Postman or similar API client (optional)
- Paystack account (for payment processing)
- Email service credentials (SMTP or mail provider)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "NGO Management System"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**

   ```env
   # Server
   PORT=8000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/ngo-system
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ngo-system

   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d

   # Email Configuration (choose one)
   # Option 1: Gmail
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-app-password

   # Option 2: Custom SMTP
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email
   SMTP_PASS=your-password

   # Paystack
   PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   PAYSTACK_SECRET_KEY=sk_live_xxxxx

   # Optional: Public base URL for production
   PUBLIC_BASE_URL=https://your-domain.com

   # Vercel (auto-injected in production)
   # VERCEL_URL will be automatically set
   ```

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

Server will start at `http://localhost:8000`

### Production Mode

```bash
npm start
```

### Health Check

```bash
curl http://localhost:8000/api/health
```

## 📚 API Documentation

### Access Points

- **Interactive Swagger UI**: `http://localhost:8000/api/docs`
- **OpenAPI JSON**: `http://localhost:8000/api/docs.json`
- **API Root Page**: `http://localhost:8000/`

### API Endpoints Overview

#### Core

- `GET /` - API landing page
- `GET /api/health` - Service health status
- `GET /api/health/db` - Database health check
- `GET /api/docs` - Swagger documentation

#### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `PUT /api/auth/change-password` - Change password (requires JWT)

#### Donors

- `GET /api/donors` - List all donors
- `POST /api/donors` - Create donor profile
- `GET /api/donors/:id` - Get donor details
- `PATCH /api/donors/:id` - Update donor profile
- `DELETE /api/donors/:id` - Delete donor

#### Donations

- `GET /api/donations` - List donations
- `POST /api/donations` - Record donation
- `GET /api/donations/:id` - Get donation details
- `PATCH /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation

#### Projects

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Events

- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

#### Volunteers

- `GET /api/volunteers` - List volunteers
- `POST /api/volunteers` - Register volunteer
- `GET /api/volunteers/:id` - Get volunteer details
- `PATCH /api/volunteers/:id` - Update volunteer
- `PATCH /api/volunteers/:id/approve` - Approve volunteer (admin)
- `PATCH /api/volunteers/:id/reject` - Reject volunteer (admin)
- `PATCH /api/volunteers/:id/assign` - Assign to project (admin)
- `DELETE /api/volunteers/:id` - Delete volunteer

#### Beneficiaries

- `GET /api/beneficiaries` - List beneficiaries
- `POST /api/beneficiaries` - Register beneficiary
- `GET /api/beneficiaries/:id` - Get beneficiary details
- `PATCH /api/beneficiaries/:id` - Update beneficiary
- `DELETE /api/beneficiaries/:id` - Delete beneficiary

#### Payment

- `POST /api/payment/initialize` - Initialize Paystack payment
- `GET /api/payment/verify/:reference` - Verify payment status
- `POST /api/payment/webhook` - Paystack webhook

#### Reports

- `GET /api/reports/donations-summary` - Donation summary
- `GET /api/reports/projects` - Projects report
- `GET /api/reports/transparency` - Transparency report
- `GET /api/reports/dashboard` - Dashboard metrics

### Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To get a token:

1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login`

## 📁 Project Structure

```
NGO Management System/
├── api/                    # API entry point
├── config/                 # Configuration files (database, etc.)
├── controllers/            # Request handlers
├── middleware/             # Express middleware
├── models/                 # MongoDB schemas
├── routes/                 # API route definitions
├── services/               # Business logic
├── utils/                  # Utility functions
├── docs/                   # OpenAPI documentation
├── scripts/                # Helper scripts
├── logs/                   # Application logs
├── app.js                  # Express app setup
├── server.js               # Server entry point
├── package.json            # Dependencies
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## 🔐 Security Considerations

1. **JWT Secrets**: Keep `JWT_SECRET` secure and unique
2. **Environment Variables**: Never commit `.env` files
3. **HTTPS**: Use HTTPS in production (enforced by Vercel)
4. **CORS**: Configure CORS policies as needed
5. **Rate Limiting**: Implement rate limiting for production
6. **Input Validation**: All inputs are validated
7. **SQL Injection**: Protected by MongoDB schema validation
8. **XSS Protection**: Helmet.js provides XSS protection

## 🧪 Testing

### Using Postman

1. Import the API collection (check `Postman.md` for details)
2. Configure environment variables
3. Test endpoints with provided examples

### Using cURL

```bash
# Health check
curl http://localhost:8000/api/health

# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"Pass123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Pass123"}'
```

## 📊 Database Schema

The system uses MongoDB with the following main collections:

- **Users**: Authentication and account information
- **Donors**: Donor profiles
- **Donations**: Donation records
- **Projects**: Project information and tracking
- **Events**: Event details
- **Volunteers**: Volunteer profiles and assignments
- **Beneficiaries**: Beneficiary information
- **Reports**: Aggregated financial data

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository to Vercel

2. **Environment Variables**
   - Add all required variables in Vercel dashboard
   - Set `NODE_ENV=production`

3. **Deploy**

   ```bash
   # Automatic deployment on push to main
   git push origin main
   ```

4. **Production URL**
   - Access via `https://<your-project>.vercel.app`
   - API docs at `https://<your-project>.vercel.app/api/docs`

## 🐛 Troubleshooting

### Database Connection Issues

- Verify MongoDB connection string
- Check MongoDB service is running
- For Atlas: Whitelist IP addresses in security settings

### Email Not Sending

- Verify SMTP credentials
- Check email service is enabled
- For Gmail: Use app-specific passwords
- Check firewall/antivirus blocking SMTP

### Swagger Documentation Not Showing

- Clear browser cache
- Check `/api/docs.json` returns valid JSON
- Verify `docs/openapi.json` file exists
- Check file permissions

### Payment Integration Issues

- Verify Paystack keys are correct
- Check webhook URL is publicly accessible
- Test with Paystack test keys first

## 📞 Support & Contact

For issues, questions, or contributions:

1. **Email**: support@ngomanagementsystem.com
2. **GitHub Issues**: Create issue in repository
3. **Documentation**: Check `Postman.md` for detailed examples

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Bulk import/export functionality
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] WhatsApp integration
- [ ] Offline mode for field workers

## 📝 Changelog

### Version 1.0.0 (Current)

- Initial release
- Core features implemented
- Volunteer and Beneficiary management
- Payment processing via Paystack
- Comprehensive API documentation

---

**Last Updated**: May 20, 2026
**Status**: Active Development
