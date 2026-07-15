# Goal
Your objective is to implement the requirements outlined within the confines of this ticket.
The ticket involves creating functionality to register a user to the database with using an HTTP POST request.

## Requirements/Acceptance criteria
1. User must be able to register an account with an email and password only.
2. Role should default to "user" role in the database and NOT the admin role.
3. Email should be in a valid format
4. Created password must be at least 8 characters, and contains, upper, lower, and special characters within it (at least one of each)
5. Password should also be salted and hashed.

user registration should be carried out using a post request to the User table.

All validation must be implemented using zod and must be implemented inside of the middleware.
Create a new middleware file for the user registration validation.

## Current data structure
Users must be stored in the "User" table in the database. The schema can be found in "prisma/schema", but below is its structure:

model User {
  id           String   @id @default(cuid()) // Identify user row
  email        String   @unique
  role         String   @default("user") // user = applicant, admin = recruiter
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

