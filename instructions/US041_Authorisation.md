Acceptance Criteria
- Token should be required on all API endpoints other than Registration and Login    
- Create authorisation system
- 2 roles (admin and user)
- Recruitment admin can access all endpoints

Create a middelware to do the following:
1. Get token from Authorisation header (req.headers)
2. Check token is valid (check signature and expiry) using library called jose
3. Get role from token payload
4. Check if role is a allowed role 
5. Use currying: function returns middleware and takes allowed roles

HTTP response codes: 
- 200/201: request successful
- 401 unauthorized: no token, malformed token, invalid token, expired token
- 403 Forbidden: valid token but role not allowed

How it should behave when everything passes?
Call next() and allow request to continue to controller/service

Enums:
- Role enum: Admin, User
- Optional error/message enum for consistency (Unauthorized, Forbidden, InvalidToken, TokenExpired).

# Request path summary
- get the jwt token from the request handler
- validate token
- read role claim
- check against allowed roles
- continue or return 401/403

# database
amend the users table to inlcude the following fields: 
role: string







