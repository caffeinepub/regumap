# ReguMap - Regulatory Mapping Web Application

## Current State
New project. No existing application files beyond default scaffolding.

## Requested Changes (Diff)

### Add
- User authentication: Sign Up and Login pages with secure credential storage
- Dashboard page (post-login) with:
  - File upload section (CSV/XLSX, max 10MB)
  - Free-text user story textarea
  - Regulatory requirement radio buttons (CFR PART 11, OTHER)
  - Run Mapping CTA button with validation and spinner
  - Results section (hidden until mapping completes) with table preview (first 20 rows) and Export CSV button
- Logout button in header/sidebar
- Backend APIs:
  - signup: create user with hashed password, unique user ID check
  - login: validate credentials, return session token
  - runMapping: accept regulatory_requirement + text_input + optional file_data (base64), return structured placeholder data

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - User storage: store userId, passwordHash, createdAt
   - signup endpoint: uniqueness check, password hashing (SHA-256 or similar), return success/error
   - login endpoint: verify credentials, return session token
   - runMapping endpoint: accept input, return mock structured output with columns: User_Story, Regulatory_Clause, Requirement_ID, Compliance_Status, Notes
   - logout / session validation helpers

2. Frontend (React/TypeScript):
   - Route: /login - Login form with userId + password fields, error display
   - Route: /signup - Sign Up form with userId, password, confirm password; client-side validation
   - Route: /dashboard (protected) - Sidebar nav, main content with 3 sections in a card, results section below
   - File upload dropzone (CSV/XLSX only, 10MB limit), shows filename on upload
   - Textarea for user story
   - Radio buttons for regulatory requirement (CFR PART 11 default)
   - Run Mapping button with spinner state
   - Results table (scrollable, first 20 rows)
   - Export CSV button using client-side CSV generation
   - Logout clears session and redirects to login
