Profile editing is shared by `/profile` and `/en/profile` in `src/components/Profile/ProfilePage.tsx`.

- `PATCH /api/v1/user/me`: partial update of fullName, institution, class, guardianPhone, division, district and thana. The server derives the account from the bearer token. Email, student ID, role, status, password and image URL are rejected here. Location updates are checked against the merged division/district/thana hierarchy; legacy accounts may update unrelated fields without completing an address.
- `PATCH /api/v1/user/me/photo`: multipart field `photo`, one JPG/PNG/WebP image, maximum 2 MiB. The server checks its signature, creates a random filename under `uploads/profiles`, saves the relative URL, and removes the previous avatar owned by this endpoint. A failed database save removes the new upload. This uses the server's existing `/uploads` static hosting; the upload directory needs persistent storage when deploying.
- `PATCH /api/v1/auth/change-password`: currentPassword, newPassword, confirmPassword. Checks the current bcrypt hash, rejects reuse, checks confirmation and the existing 8-character/72-byte password policy, and saves a new hash. The response contains no password. Existing authenticated sessions continue under the current token policy.

Save responses update the shared authenticated user so the profile and navbar change together. Cancelling discards edits. Token refresh preserves open forms; switching accounts clears them. Earlier profile fetches cannot overwrite a completed update.

Run frontend `npm test`, scoped ESLint and `npm run build`. In the sibling server, run `npm test` and `npm run build`. Server tests use fake Prisma records and an isolated temporary upload directory, without connecting to the real database.
