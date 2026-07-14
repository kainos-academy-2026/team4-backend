# Goal
The goal of this ticket is to create functionality for a user to create a new user in the database.

## Requirements
User must be created using an Http POST:

The structure of the User table in the db is 

model User {
  id           String   @id @default(cuid()) // Identify user row
  email        String   @unique
  role         String   @default("user") // user = applicant, admin = recruiter
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}


Acceptance Criteria
User must be able to register with email, password
Role should default to "user" role in database (not admin)
Email must be a valid email format
Password much be more than 8 chars with upper, lower and special char
Password should be salted and hashed (https://youtu.be/zt8Cocdy15c?si=u74kFMHTvILDY1P_)