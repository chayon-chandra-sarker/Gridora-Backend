# ⚡ Gridora Backend

Gridora is a backend API for an electricity management platform designed to manage customers, operators, administrators, service areas, electricity tariffs, bills, complaints, load-shedding schedules, and digital payments.

The backend is built with **Node.js, Express.js, TypeScript, PostgreSQL, Prisma ORM, Redis, bKash, Cloudinary, Nodemailer, and PDFKit**.

---

## 📌 Project Information

| Information            | Details                      |
| ---------------------- | ---------------------------- |
| **Project Name**       | Gridora                      |
| **Backend Repository** | `https://github.com/chayon-chandra-sarker/Gridora-Backend` |
| **Live API**           | `https://gridora-backend-ppfm.onrender.com/`          |
| **API Docs**           | `https://gmail-922659.docs.buildwithfern.com`          |
| **Deployment**         | Render                       |
| **Database**           | PostgreSQL                   |
| **ORM**                | Prisma                       |
| **Runtime**            | Node.js                      |
| **Language**           | TypeScript                   |

---

## 🚀 Live Links

### Backend Repository

`https://github.com/chayon-chandra-sarker/Gridora-Backend`

### Live API

`https://gridora-backend-ppfm.onrender.com/`

### API Documentation

`https://gmail-922659.docs.buildwithfern.com`

---

# ✨ Features

## 🔐 Authentication & Authorization

* User registration
* Email and password login
* Google OAuth login
* JWT access token
* JWT refresh token
* Get authenticated user profile
* Logout
* Role-based authentication
* Password reset with OTP
* OTP verification
* Redis-based OTP expiration
* Secure password hashing with bcrypt

### Supported Roles

* `ADMIN`
* `OPERATOR`
* `CUSTOMER`

---

# 👤 User Management

Gridora provides complete user management functionality.

### Features

* User registration
* User login
* Get current user
* Update profile
* Upload profile image
* Admin user management
* Role management
* Activate/deactivate users
* Role-based access control
* Google authentication

Profile images are stored using **Cloudinary**.

---

# 📍 Area Management

Areas represent electricity service locations.

### Features

* Create area
* Get all areas
* Get area by ID
* Update area
* Delete area
* Area-based customer management
* City and district information

### Area Information

```text
Name
City
District
```

---

# ⚡ Load Shedding Schedule

Gridora provides load-shedding schedule management for different service areas.

### Features

* Create load-shedding schedule
* View all schedules
* View schedule by ID
* Update schedule
* Delete schedule
* Area-based schedules
* Start and end time
* Reason
* Description

### Schedule Information

```text
Area
Start Time
End Time
Reason
Description
```

---

# 💰 Tariff Management

Gridora supports electricity tariff management based on unit ranges.

### Features

* Create tariff
* Get all tariffs
* Get active tariffs
* Get tariff by ID
* Update tariff
* Delete tariff
* Activate/deactivate tariff
* Unit-range validation
* Prevent overlapping tariff ranges

### Tariff Information

```text
Minimum Unit
Maximum Unit
Price Per Unit
Active Status
```

---

# 🧾 Electricity Bill Management

Gridora automatically calculates electricity bills based on meter readings and active electricity tariffs.

### Features

* Create bill
* Get all bills
* Get bill by ID
* Get customer's bills
* Update bill
* Meter reading management
* Automatic unit calculation
* Automatic bill amount calculation
* Billing month
* Due date
* Bill status
* PDF bill generation
* Email bill delivery

### Bill Calculation

```text
Units Consumed = Current Reading - Previous Reading
```

The total bill amount is calculated according to the applicable tariff ranges.

### Bill Status

```text
UNPAID
PAID
```

---

# 📝 Complaint Management

Customers can submit complaints related to electricity services.

### Features

* Create complaint
* View own complaints
* View complaint details
* Admin complaint management
* Operator complaint management
* Update complaint status
* Delete complaint
* Filter complaints by status

### Complaint Status

```text
PENDING
IN_PROGRESS
RESOLVED
REJECTED
```

---

# 💳 bKash Payment Integration

Gridora integrates with the **bKash Tokenized Checkout API** to allow customers to pay their electricity bills digitally.

### Features

* Create bKash payment
* Execute bKash payment
* Payment status tracking
* Transaction ID tracking
* bKash payment ID tracking
* Bill ownership verification
* Prevent duplicate bill payments
* Payment record management
* Automatic bill status update
* Payment invoice generation
* Payment invoice email

### Payment Method

```text
BKASH
```

### Payment Status

```text
PENDING
SUCCESS
FAILED
CANCELLED
```

---

# 🔄 bKash Payment Flow

```text
Customer
    │
    ▼
Select Unpaid Bill
    │
    ▼
Create bKash Payment
    │
    ▼
bKash Checkout
    │
    ▼
Customer Completes Payment
    │
    ▼
Execute Payment
    │
    ▼
Verify Transaction
    │
    ▼
Update Payment
    │
    ▼
Update Bill Status
    │
    ▼
Generate Invoice PDF
    │
    ▼
Send Invoice Email
```

---

# 📄 PDF Generation

Gridora uses **PDFKit** to generate PDF documents.

### Generated Documents

* Electricity bill PDF
* Payment invoice PDF

### Payment Invoice Contains

```text
Invoice Number
Customer Name
Customer Email
Meter Number
Bill ID
Amount
Payment Method
bKash Payment ID
Transaction ID
Payment Date
Payment Status
```

---

# 📧 Email Service

Gridora uses **Nodemailer** with Gmail SMTP for sending emails.

### Email Features

* Password reset OTP email
* Electricity bill email
* Payment invoice email

---

# ☁️ Cloudinary

Gridora uses **Cloudinary** for profile image storage.

### Supported Image Types

```text
JPG
JPEG
PNG
WEBP
```

### Maximum File Size

```text
2 MB
```

Image uploads are handled through **Multer** before being uploaded to Cloudinary.

---

# ⚡ Redis

Gridora uses **Redis** for temporary password-reset OTP storage.

Redis is used to store OTPs with an expiration time.

### OTP Expiration

```text
2 Minutes
```

### Password Reset Flow

```text
Forgot Password
       ↓
Generate OTP
       ↓
Store OTP in Redis
       ↓
Send OTP via Email
       ↓
Verify OTP
       ↓
Reset Password
       ↓
Delete OTP
```

---

# 🔑 Password Reset

Gridora provides an OTP-based password reset system.

## 1. Request Password Reset

```http
POST /api/auth/forgot-password
```

Request:

```json
{
  "email": "user@example.com"
}
```

---

## 2. Verify OTP

```http
POST /api/auth/verify-otp
```

Request:

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

---

## 3. Reset Password

```http
POST /api/auth/reset-password
```

Request:

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123"
}
```

---

# 🛡️ Validation

Gridora uses **Zod** for request validation.

Validation is applied to API request bodies to ensure that incoming data follows the expected structure and format.

### Example Validation Error

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errorDetails": [
    {
      "path": "body.email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

# ❌ Centralized Error Handling

Gridora uses a custom `AppError` class and a global error handler for consistent API error responses.

### Supported Errors

* Validation errors
* Authentication errors
* Authorization errors
* Not found errors
* Duplicate data errors
* Prisma errors
* External API errors
* Internal server errors

### Example

```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "errorDetails": null
}
```

---

# 🗄️ Database

Gridora uses:

* PostgreSQL
* Prisma ORM

### Main Database Models

```text
User
Area
LoadSheddingSchedule
Tariff
Bill
Payment
Complaint
```

---

# 🧩 Technology Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* JWT
* Google OAuth
* bcrypt

### Validation

* Zod

### Cache & Temporary Storage

* Redis
* ioredis

### Payment

* bKash Tokenized Checkout API

### File Upload & Storage

* Multer
* Cloudinary

### Email

* Nodemailer
* Gmail SMTP

### PDF

* PDFKit

### Code Quality

* Biome

---

# 📁 Project Structure

```text
src/
│
├── config/
│
├── errors/
│   └── AppError.ts
│
├── lib/
│   └── prisma.ts
│
├── middleware/
│   ├── auth.ts
│   ├── upload.middleware.ts
│   ├── validateRequest.ts
│   └── ...
│
├── modules/
│   │
│   ├── auth/
│   ├── area/
│   ├── bill/
│   ├── complaint/
│   ├── LoadSheddingSchedule/
│   ├── payment/
│   ├── tariff/
│   └── user/
│
├── utils/
│
├── routes/
│
└── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── generated/
│
├── package.json
├── tsconfig.json
├── biome.json
└── README.md
```

---

# 🔐 Authentication Flow

```text
Client
  │
  ▼
Register / Login
  │
  ▼
JWT Access Token
  │
  ▼
Protected API
  │
  ▼
Authentication Middleware
  │
  ▼
Role Verification
  │
  ├── ADMIN
  ├── OPERATOR
  └── CUSTOMER
```

---

# 👥 Role Permissions

| Feature              | Admin | Operator | Customer |
| -------------------- | :---: | :------: | :------: |
| User Management      |   ✅   |     ❌    |     ❌    |
| Area Management      |   ✅   |   Read   |   Read   |
| Load Shedding        |   ✅   |     ✅    |   Read   |
| Tariff Management    |   ✅   |   Read   |   Read   |
| Bill Management      |   ✅   |     ✅    |    Own   |
| Complaint Management |   ✅   |     ✅    |    Own   |
| Make Payment         |   ❌   |     ❌    |     ✅    |
| View Payments        |   ✅   |     ✅    |    Own   |
| Update Profile       |   ✅   |     ✅    |     ✅    |
| Upload Profile Image |   ✅   |     ✅    |     ✅    |

---

# 🌐 API Base URL

### Local Development

```text
http://localhost:5000/api
```

### Production

```text
https://gridora-backend-ppfm.onrender.com/api
```

---

# 📚 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/refresh-token
GET  /api/auth/me
POST /api/auth/logout

POST /api/auth/forgot-password
POST /api/auth/verify-otp
POST /api/auth/reset-password
```

---

## Users

```http
GET    /api/user
GET    /api/user/:id
PUT    /api/user/:id
DELETE /api/user/:id
POST   /api/users/profile-image
```

---

## Areas

```http
POST   /api/areas
GET    /api/areas
GET    /api/areas/:id
PUT    /api/areas/:id
DELETE /api/areas/:id
```

---

## Load Shedding Schedules

```http
POST   /api/load-shedding-schedules
GET    /api/load-shedding-schedules
GET    /api/load-shedding-schedules/:id
PUT    /api/load-shedding-schedules/:id
DELETE /api/load-shedding-schedules/:id
```

---

## Tariffs

```http
POST   /api/tariffs
GET    /api/tariffs
GET    /api/tariffs/active
GET    /api/tariffs/:id
PUT    /api/tariffs/:id
DELETE /api/tariffs/:id
```

---

## Bills

```http
POST /api/bills
GET  /api/bills
GET  /api/bills/my-bills
GET  /api/bills/:id
PUT  /api/bills/:id
```

---

## Complaints

```http
POST   /api/complaints
GET    /api/complaints
GET    /api/complaints/:id
PUT    /api/complaints/:id
DELETE /api/complaints/:id
```

---

## Payments

```http
POST /api/payments
GET  /api/payments
GET  /api/payments/:id
```

---

## bKash

```http
POST /api/payments/bkash/create
POST /api/payments/bkash/execute
GET  /api/payments/bkash/callback
```

---

# 📊 API Response Format

### Successful Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Something went wrong!",
  "errorDetails": null
}
```

---

# 🔒 Security

Gridora follows several backend security practices:

* Password hashing with bcrypt
* JWT authentication
* Role-based authorization
* Zod request validation
* Centralized error handling
* Environment-based configuration
* Prisma database constraints
* Duplicate data protection
* Bill ownership validation
* Payment ownership validation
* Cloudinary upload restrictions
* File size restrictions
* Redis OTP expiration
* Protected API routes

---

# 🛠️ Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Go to the project directory:

```bash
cd gridora
```

Install dependencies:

```bash
npm install
```

---

# 🗄️ Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations during development:

```bash
npx prisma migrate dev
```

For production:

```bash
npx prisma migrate deploy
```

---

# ▶️ Running the Project

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

---

# 🧹 Code Quality

Run Biome checks:

```bash
npx @biomejs/biome check ./src
```

Automatically fix formatting and lint issues:

```bash
npm run lint:fix
```

---

# 🧪 Testing & Verification

Before pushing changes, run the following commands:

### TypeScript Check

```bash
npx tsc --noEmit
```

### Biome

```bash
npm run lint:fix
```

### Production Build

```bash
npm run build
```

All three checks should pass before deploying the application.

---

# 🚀 Deployment

Gridora backend is deployed using **Render**.

### Production Deployment

The production backend runs on Render with:

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* Redis
* Cloudinary
* bKash API
* Nodemailer

### Production Build

```bash
npm run build
```

### Production Start

```bash
npm start
```

### Prisma Client

```bash
npx prisma generate
```

### Production Migration

```bash
npx prisma migrate deploy
```

---

# 📦 Render Deployment Flow

```text
GitHub Repository
       │
       ▼
     Render
       │
       ▼
Install Dependencies
       │
       ▼
Prisma Generate
       │
       ▼
Build TypeScript
       │
       ▼
Start Server
       │
       ▼
Production API
```

---

# 🤝 Git Workflow

Create a feature branch:

```bash
git checkout -b feature/feature-name
```

Check changed files:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit changes:

```bash
git commit -m "feat: add feature"
```

Push branch:

```bash
git push origin feature/feature-name
```

---

# 📝 Commit Convention

Recommended commit prefixes:

```text
feat:      New feature
fix:       Bug fix
refactor:  Code restructuring
docs:      Documentation
style:     Formatting
test:      Tests
chore:     Maintenance
```

### Examples

```bash
git commit -m "feat: add bKash payment integration"

git commit -m "feat: add password reset with OTP"

git commit -m "fix: resolve payment validation issue"

git commit -m "refactor: replace generic errors with AppError"

git commit -m "docs: update backend README"
```

---

# 📌 Production Checklist

Before deploying to production:

* [ ] PostgreSQL database configured
* [ ] Prisma Client generated
* [ ] Prisma migrations applied
* [ ] Redis connection verified
* [ ] Cloudinary configured
* [ ] Email service configured
* [ ] bKash credentials configured
* [ ] Google OAuth configured
* [ ] JWT secrets configured
* [ ] CORS configured
* [ ] Authentication tested
* [ ] Password reset tested
* [ ] Bill generation tested
* [ ] bKash payment tested
* [ ] PDF generation tested
* [ ] Email delivery tested
* [ ] Role-based authorization tested
* [ ] TypeScript check passed
* [ ] Biome check passed
* [ ] Production build passed
* [ ] Render deployment verified

---

# 🔮 Future Improvements

Potential future improvements for Gridora include:

* Advanced dashboard analytics
* Detailed payment statistics
* Automated billing
* SMS notifications
* Push notifications
* Additional payment gateways
* Advanced Redis caching
* API rate limiting
* Automated testing
* Swagger/OpenAPI documentation
* CI/CD improvements
* Advanced reporting system

---

# 👨‍💻 Developer

## Chayon Chandra Sarker

**Full Stack Developer**

### Technologies Used

```text
TypeScript
Node.js
Express.js
PostgreSQL
Prisma
Redis
JWT
Google OAuth
Zod
bKash API
Cloudinary
Multer
Nodemailer
PDFKit
Biome
```

---

# 📄 License

This project is developed for educational, portfolio, and application development purposes.

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

# 📌 Project Summary

**Gridora** is a full-featured electricity management backend designed to manage the complete workflow of an electricity service platform.

The system provides secure authentication, role-based authorization, area management, load-shedding schedules, electricity tariff management, automatic bill calculation, complaint management, bKash payments, PDF invoice generation, email notifications, Cloudinary image storage, and Redis-based OTP password recovery.

The backend follows a modular architecture using **Node.js, Express.js, TypeScript, PostgreSQL, Prisma ORM, Redis, and multiple third-party service integrations**, and is deployed on **Render**.
