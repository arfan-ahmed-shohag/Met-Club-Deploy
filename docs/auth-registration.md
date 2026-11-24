# Authentication and registration

Accounts are stored in three tables. `User` holds only login data: email (unique), password hash, role and status. Student profiles (student ID, name, school, class, phone, location, photo) live in `Student`, and admin profiles (name, photo) live in `Admin`; each links to its account by a unique `userId`. Registration creates a `User` with a `Student` profile. The API flattens the account and its profile into one user object, so student-only fields are `null` for admins.

The navbar fetches the authenticated user's public profile from `GET /auth/me`. It shows Login for guests and the returned name, role, email and optional profile image for an authenticated user. Profile data is kept in memory; login, registration, logout, token refresh and cross-tab account changes update the same session store. Public routes remain accessible.

Set `VITE_API_URL` to change the backend URL. `src/lib/api.ts` otherwise uses the existing development URL, `https://api.meteorologyclub.com/api/v1`.

The login and registration pages accept `?redirect=<url>` for the Unity game (`src/utils/gameRedirect.ts`). Only `https://game.meteorologyclub.com` URLs are allowed; anything else is ignored. After a successful login or registration the browser goes to that URL, and the login ↔ registration links keep the parameter. If the login page opens with an allowed `redirect` and `GET /auth/refresh-token` succeeds (the sign-in cookie is still valid), it sends the player back without showing the form. It checks the cookie rather than the stored token, so a stale token can't bounce the player between the game and the login page.

Registration validates the following in both clients and API requests:

- Name: 2–100 characters, letters/combining marks and ordinary name punctuation.
- Email: valid format, normalized to lowercase; duplicate email returns a field error.
- Phone: an 11-digit Bangladeshi mobile number. Local, `+880`, `880` and Bangla-digit input normalize to `01…`.
- New password: at least 8 characters, at most 72 UTF-8 bytes. Confirmation must match. Existing shorter passwords remain usable for login.
- Institution/class and the selected division → district → thana/upazila hierarchy.

The API only persists allowed registration fields. Confirmation is checked and discarded, and password hashes/refresh tokens are excluded from profile responses. Registration and login both issue the HTTP-only refresh cookie.

Run `npm test` and `npm run build` in each repository. Backend HTTP tests use a fake database and an ephemeral localhost server. The location columns are defined by `Met-Club-Server/prisma/migrations/20261105000000_add_user_location_fields/migration.sql`.
