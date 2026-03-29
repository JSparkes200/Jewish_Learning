# Auth, email, and password reset

**Vercel env var names, KV, Resend, and `AUTH_RESET_EMAIL_MAP`:** see **[vercel-environment.md](./vercel-environment.md)** (full checklist for all Next APIs).

## What you have today

### Legacy app (`hebrew-v8.2.html`)

- **Passwords:** Hashed with **SHA-256** in the browser (`authHashPassword`). This is **not** as strong as Argon2id/bcrypt with a per-user salt; acceptable only for low-risk local data.
- **Storage:** `localStorage` under `ivrit_users_v1` (usernames, optional `email`, password hash). Anyone with device access can read or tamper with it.
- **Email on file:** New accounts must enter an email. **`AUTH_EMAIL_BOOTSTRAP`** in the HTML is **`{}` by default** (no secrets in the repo). To backfill email on one device only, you can temporarily set it locally, or add the email once in Create-user / account UI when that exists.
- **Forgot password:** On the **home gate** (logged-out welcome), use **FORGOT PASSWORD?** under Log in / Create user, or open **Log in** and use **Forgot password?** at the bottom of that modal.
  1. **No Vercel API URL:** A **6-digit code** is stored in **sessionStorage** on that browser and shown on screen — **email is not sent**. Good for static/GitHub Pages demos only.
  2. **With `IVRIT_API_ORIGIN` or `localStorage.ivrit_api_origin`:** The app calls your **Next.js** deployment (`/api/auth/request-reset` and `/api/auth/confirm-reset`). After a valid code, the **new hash is written in the user’s `localStorage`** on that device (the server never stores passwords).

### Next.js API (`web/`)

- **Learn progress (optional cloud):** `GET` / `PUT` / `DELETE /api/progress` stores a **sanitized** copy of course progress in **Vercel KV** when `KV_*` is set. Access uses a random **sync key** in `localStorage` (`hebrew-web-cloud-sync-v1`) as a **Bearer** token — not a login. See **[cloud-progress.md](./cloud-progress.md)**.
- **Allowlist:** `AUTH_RESET_EMAIL_MAP` (JSON) on the server. Only matching `username` + `email` get a code. This mirrors your bootstrap until you have a real database.
- **Codes:** Stored as **SHA-256 hash** with **15-minute** expiry via **Vercel KV** if `KV_REST_API_URL` / `KV_REST_API_TOKEN` are set; otherwise **in-memory** (often **broken** across Vercel instances — link KV for production).
- **Email:** Optional **Resend** (`RESEND_API_KEY`, `RESEND_FROM`).
- **CORS:** `Access-Control-Allow-Origin: *` for simplicity; tighten to your static app origin when both URLs are stable.

## Recommendations (strongest → lightest)

1. **Managed auth (best for email + security)**  
   Use **Clerk**, **Supabase Auth**, **Firebase Auth**, or **Auth0**. You get email verification, password reset, MFA, and no secrets in the client. Migrate off `ivrit_users_v1` when ready.

2. **Your own DB + server**  
   Store **Argon2id** or **bcrypt** hashes server-side, per-user salt, rate-limit reset endpoints, and send codes only over HTTPS. Do **not** commit real user emails in public repos.

3. **Keep current hybrid**  
   - Add **Vercel KV** (or Upstash Redis) for reset codes.  
   - Set **CORS** to your real Pages/domain.  
   - Turn **HTTPS** only.  
   - Remove **`AUTH_EMAIL_BOOTSTRAP`** from git if the repo is public (use env-only allowlist on Vercel).  
   - Replace **SHA-256** with **PBKDF2/Argon2** in the client if you stay password-in-localStorage (still weaker than server-side).

4. **“Recovery phrase” alternative (no email)**  
   At signup, show a one-time **recovery phrase**; store only a hash. Reset works without email but users must save the phrase.

## Wiring the HTML app to Vercel

After deploying `web/`:

```js
// Browser console once, or inject before your script:
localStorage.setItem('ivrit_api_origin', 'https://YOUR_PROJECT.vercel.app');
// Or: window.IVRIT_API_ORIGIN = 'https://YOUR_PROJECT.vercel.app';
```

Set the same **allowlist** and **Resend** + **KV** env vars on Vercel.

## Vercel (protect your email)

1. Open your project → **Settings** → **Environment Variables**.
2. Add **`AUTH_RESET_EMAIL_MAP`** with a JSON value, e.g.  
   `{"jonathan1":"your-real-email@example.com"}`  
   (one line, no line breaks inside the JSON).
3. Redeploy. The HTML app uses this **only** when it calls your Vercel API (`ivrit_api_origin` / `IVRIT_API_ORIGIN`); the address is **not** stored in GitHub.

## Privacy note

Do **not** put real recovery emails in **`hebrew-v8.2.html`** or committed **`.env`** files. Use **Vercel env** (and optional **`.env.local`** on your machine, gitignored).
