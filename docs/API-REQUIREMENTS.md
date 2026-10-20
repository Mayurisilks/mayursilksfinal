# Mayuri Silks — API Requirements

## 1. Project Overview

Mayuri Silks is an e-commerce application. The frontend is built using Next.js, TypeScript, and Tailwind CSS.

The backend must provide secure APIs for authentication, customer accounts, products, cart, orders, payments, and admin operations as the project develops.

## 2. Project Structure

- `frontend/` — Customer-facing website
- `backend/` — Backend API and business logic
- `admin-frontend/` — Admin dashboard
- `docs/` — API documentation

## 3. Authentication APIs

### Register

`POST /api/auth/register`

Purpose:

- Register a new customer.
- Accept first name, last name, email, country code, mobile number, and password.
- Validate required fields.
- Prevent duplicate email registrations.
- Send an email verification OTP.

### Verify Registration Email

`POST /api/auth/verify-email`

Purpose:

- Verify the customer's email using an OTP.
- Expire OTPs after a configured period.
- Limit repeated incorrect attempts.
- Mark the email as verified only after successful server-side validation.

### Resend Registration OTP

`POST /api/auth/resend-verification-otp`

Purpose:

- Send a new verification OTP.
- Apply rate limits and cooldowns.

### Login

`POST /api/auth/login`

Purpose:

- Authenticate customers using email and password.
- Return a signed JWT that expires after one hour.
- Reject invalid credentials with `401` and the same message for unknown emails and incorrect passwords.
- Require the backend `JWT_SECRET` environment variable; never expose it to the frontend.

Request body:

```json
{
	"email": "customer@example.com",
	"password": "your-password"
}
```

Successful response (`200`):

```json
{
	"message": "Login successful",
	"token": "<signed-jwt>",
	"user": {
		"id": "<user-id>",
		"Firstname": "Customer",
		"Lastname": "Name",
		"email": "customer@example.com"
	}
}
```

Clients should send the token in the `Authorization: Bearer <token>` header when calling authenticated endpoints.
Each successful login also creates a server-side session record that expires after one hour. Its identifier is included in the JWT `jti` claim; the raw JWT is not stored in the database.

### Login with Email OTP

`POST /api/auth/send-login-otp`

Purpose:

- Send a one-time login code to a registered email.
- Request body: `{ "email": "customer@example.com" }`.
- A six-digit OTP expires after 10 minutes. The response does not disclose whether the account exists.

`POST /api/auth/verify-login-otp`

Purpose:

- Validate the login OTP and authenticate the customer.
- Request body: `{ "email": "customer@example.com", "otp": "123456" }`.
- On success, return `200` with `message`, a signed JWT in `token` (one-hour expiration), and the same safe `user` fields as password login.
- Successful verification also creates the same one-hour server-side session described in the password login section.
- Return `400` for missing or malformed input, `401` for an invalid or expired OTP, and `500` if authentication is not configured or verification fails.

### Forgot Password

`POST /api/auth/forgot-password`

Purpose:

- Request a password reset OTP.
- Avoid revealing whether an email address is registered.
- Apply a 60-second resend cooldown and expire OTPs after 10 minutes.
- Request body: `{ "email": "customer@example.com" }`.
- Return `200` with a generic message whether or not the account exists.

### Verify Password Reset OTP

`POST /api/auth/verify-reset-otp`

Purpose:

- Verify the password reset OTP on the server.
- Return a short-lived, single-use reset token after successful verification.
- Request body: `{ "email": "customer@example.com", "otp": "123456" }`.
- Return `200` with `{ "message": "OTP verified successfully", "resetToken": "<opaque-token>" }`; invalid or expired codes return `401`.
- Limit verification to five attempts per OTP.

### Reset Password

`POST /api/auth/reset-password`

Purpose:

- Accept the reset token and new password.
- Validate password requirements.
- Save the password securely using a password hash.
- Invalidate the reset token after successful use.
- Request body: `{ "email": "customer@example.com", "resetToken": "<opaque-token>", "newPassword": "new-password" }`.
- Require a password with at least 8 characters. Return `401` for invalid or expired reset tokens.

### Logout

`POST /api/auth/logout`

Purpose:

- Invalidate the current session or refresh token as appropriate.

## 4. Security Requirements

- Hash passwords using a secure password-hashing algorithm.
- Never store passwords or OTPs as plain text.
- Never expose secrets in frontend code.
- Store environment variables in `.env`, not in Git.
- Validate request data on the server.
- Use HTTPS in production.
- Configure CORS for approved frontend origins.
- Apply rate limiting to login and OTP endpoints.
- Use secure, HttpOnly, SameSite cookies if cookie-based sessions are selected.
- Protect authenticated endpoints and enforce authorization on the server.
- Return consistent HTTP status codes and error response formats.

## 5. API Response Format

Use a consistent JSON response structure.

Example success:

{
"success": true,
"message": "Request completed successfully",
"data": {}
}

Example error:

{
"success": false,
"message": "A helpful error message",
"data": null
}

The exact response format can be finalized by the backend developer, but it must be documented for frontend integration.

## 6. Environment Configuration

The backend developer must provide:

- `.env.example` with variable names and safe placeholder values.
- Local development setup instructions.
- Database configuration instructions.
- Required environment variables and their purposes.
- API base URL and port.
- Email provider setup instructions.

Actual secrets must never be committed to GitHub.

The frontend will use `frontend/.env.local` for the public API base URL, for example:

NEXT_PUBLIC_API_URL=http://localhost:5500/api

The actual URL must match the backend configuration.

## 7. Frontend Integration Requirements

For every endpoint, document:

- HTTP method and endpoint path.
- Required request fields.
- Successful response structure.
- Error responses and status codes.
- Authentication requirements.
- Validation rules.

The frontend developer will connect the existing UI forms to these APIs after the backend endpoints are implemented and tested.

## 8. Development Workflow

1. Backend developer implements the APIs and database integration.
2. Backend developer provides `.env.example` and setup documentation.
3. Both developers sync changes through GitHub.
4. Frontend developer configures the API base URL.
5. Frontend and backend are tested together.
6. Production deployment configuration is completed separately.

## 9. Future E-commerce APIs

After authentication is ready, plan APIs for:

- Product categories and product listing
- Product details, images, sizes, and availability
- Search, filtering, and sorting
- Shopping cart and wishlist
- Customer addresses
- Checkout and orders
- Payment gateway integration
- Order tracking and cancellation
- Customer profile
- Admin product and order management

These APIs should be designed according to the finalized e-commerce requirements.

## 10. Completion Criteria

Authentication is complete only when registration, email verification, login, OTP login, forgot password, reset password, and logout work through the backend and are tested end-to-end.

The frontend must never show a successful verification or account creation unless the backend confirms success.
## Backend api integration
for registration send email
for otp verificati send first name,last name,phone,password,email,otp
for resend otp send email
for login with password send email,password
for login with otp send email
for login with otp verification email,otp
for login with reset otp send verify_reset_otp
for forgot password send email