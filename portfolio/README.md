# Dr. P. N. Nesarajan: LinkedIn-style MERN Portfolio

A responsive personal portfolio with a protected admin dashboard. Content lives in MongoDB, so you edit the public site from `/admin` without touching code. Initial content is seeded from the resume.

## 1. Overview and features

**Public site** (in this order): Profile header, About, Experience (timeline), Projects & Research Publications, Education, Technical Skills, Certifications & Achievements, Contact.

- LinkedIn-inspired design (white cards on light gray, `#0A66C2` accent, Inter font), sticky nav, light/dark mode, responsive layouts.
- Loading skeletons, empty states, success and error messages, keyboard and screen-reader friendly forms.
- Contact form: validation, honeypot, rate limiting, saved to MongoDB, optional email via Nodemailer.
- The phone number is hidden publicly unless you switch it on. The **Download Resume** button appears only after you upload a PDF.

**Admin dashboard** (`/admin`): JWT login; full create/read/update/delete for Experience, Projects & Publications, Skills, Education and Certifications; profile and social links; photo and resume upload (Cloudinary); contact message inbox.

## 2. Tech stack

MongoDB Atlas, Express 4, React 18 + Vite, Node.js, React Router, Tailwind CSS 3, Axios, Mongoose, JWT (`jsonwebtoken`), `bcryptjs` for password hashing, Zod validation, Helmet, `express-rate-limit`, Multer, Cloudinary, Nodemailer, Lucide React.

> `bcryptjs` is the pure-JavaScript bcrypt implementation. It produces standard bcrypt hashes and avoids native build problems on hosts like Render.

## 3. Prerequisites

- Node.js 18.18 or newer (20 LTS recommended) and npm
- A free MongoDB Atlas account
- Optional: Cloudinary account (uploads), an SMTP account such as a Gmail App Password (email notifications)

## 4. Installation

```bash
cd portfolio
npm run install:all        # installs server/ and client/ dependencies
```

## 5. Frontend and backend setup

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Then fill in `server/.env` (see section 6).

## 6. Environment variables

**server/.env**

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | Atlas connection string, including the database name (`/portfolio`) |
| `JWT_SECRET` | Yes | 32+ random characters. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_EXPIRES_IN` | No (8h) | Admin session length |
| `CLIENT_URL` | Yes | Allowed frontend origin(s) for CORS, comma-separated, no trailing slash |
| `PORT`, `NODE_ENV` | No | Defaults: 5000, development |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | For `create-admin` | Your admin login. Password must be 12+ characters |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | For uploads | Without them, uploads return a clear 503 message |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_RECIPIENT` | For email | Without them, messages are still saved to MongoDB |

The server validates these at startup and exits with a readable list of problems if anything required is missing or invalid.

**client/.env**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL including `/api`, e.g. `http://localhost:5000/api` |

Never commit `.env` files. Only the `.env.example` files are tracked.

## 7. MongoDB Atlas setup

1. Create a free cluster at <https://cloud.mongodb.com>.
2. **Database Access** → add a database user with a strong password.
3. **Network Access** → add an IP address. For Render's free tier use `0.0.0.0/0` (allow from anywhere). The database user password is then what protects the data, so keep it strong.
4. **Connect → Drivers** → copy the connection string, replace `<password>`, and add `/portfolio` before the `?`. Paste it into `MONGODB_URI`.

## 8. Admin bootstrap and login

There is no public registration. Create the admin from the command line:

```bash
# set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first
npm run create-admin
```

Running it again with the same email resets that admin's password. Then open `http://localhost:5173/admin` and sign in. After the first login, you may remove `ADMIN_PASSWORD` from `.env`.

The session token is kept in `sessionStorage` and cleared when the tab closes or the token expires.

## 9. Seed command

```bash
npm run seed                 # inserts the resume content; safe to re-run
npm run seed -- --force      # overwrite seeded records with the resume values
npm run seed -- --sample     # also insert clearly-marked [SAMPLE] test records
npm run seed -- --remove-sample
```

- Records have stable keys, so re-running never creates duplicates and, by default, never overwrites edits you made in `/admin`. (A record you deleted in `/admin` will be re-created by the next seed.)
- The data lives in `server/data/resumeData.js`. Missing details (GitHub, LinkedIn, photo, resume file, grades, thesis details) are left empty rather than invented.
- `[SAMPLE]` records are never inserted unless you pass `--sample`.

## 10. Local development

```bash
npm run dev:server      # API on http://localhost:5000
npm run dev:client      # site on http://localhost:5173
```

Typical first run: configure `server/.env` → `npm run seed` → `npm run create-admin` → start both servers.

Production build check: `npm run build:client`.

## 11. API reference

Base path: `/api`. 🔒 = requires `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/portfolio` | Everything the public page needs in one response |
| POST | `/auth/login` | `{email, password}` → `{token, admin}` (10 attempts / 15 min) |
| GET 🔒 | `/auth/me` | Current admin |
| GET | `/profile` | Public profile (phone hidden unless enabled) |
| GET 🔒 | `/profile/admin` | Full profile |
| PUT 🔒 | `/profile` | Update profile and social links |
| GET | `/experience` `/projects` `/skills` `/education` `/certifications` | List records, sorted by `order` |
| POST 🔒 | same paths | Create |
| PUT 🔒 | `/<resource>/:id` | Update |
| DELETE 🔒 | `/<resource>/:id` | Delete |
| POST | `/messages` | Contact form (5 / hour / IP) |
| GET 🔒 | `/messages` | List messages |
| PATCH 🔒 | `/messages/:id/read` | `{read: boolean}` |
| DELETE 🔒 | `/messages/:id` | Delete |
| POST 🔒 | `/uploads/photo` | multipart field `file`: JPEG/PNG/WebP, max 3 MB |
| POST 🔒 | `/uploads/resume` | multipart field `file`: PDF, max 5 MB |

Errors return `{ "message": "...", "details": [...] }` with appropriate status codes (400, 401, 403, 404, 409, 413, 429, 503, 500). Stack traces are never returned in production.

## 12. Deploy the frontend to Vercel

1. Push the repository to GitHub.
2. In Vercel: **Add New → Project**, import the repo, set **Root Directory** to `client`.
3. Framework preset: Vite (build `npm run build`, output `dist`). `client/vercel.json` already adds the SPA fallback so `/admin` works on refresh.
4. Add environment variable `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`.
5. Deploy, then copy your Vercel URL into the backend's `CLIENT_URL` (see below).

## 13. Deploy the backend to Render

1. In Render: **New → Web Service** from your repo (or **New → Blueprint** using `server/render.yaml`).
2. Root Directory `server`, Build Command `npm ci`, Start Command `npm start`, Health Check Path `/api/health`.
3. Add all variables from section 6. Set `CLIENT_URL` to your exact Vercel URL (`https://your-site.vercel.app`, no trailing slash; add a custom domain too, comma-separated, if you use one).
4. After the first deploy, use the Render **Shell** (or run locally against the same Atlas database) for `npm run seed` and `npm run create-admin`.
5. Free instances sleep after inactivity. The first request can take up to ~30 seconds, and the site shows a "server is waking up" notice meanwhile.

## 14. Cloudinary setup

1. Create an account at <https://cloudinary.com>. Copy the cloud name, API key and API secret from the dashboard into `server/.env`.
2. Uploads go to `portfolio/photo` and `portfolio/resume`.
3. If the resume link returns an authorization error, open **Settings → Security** and enable delivery of PDF and ZIP files.

## 15. Nodemailer setup

Gmail example: enable 2-Step Verification, create an **App Password**, then set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=<your gmail>`, `SMTP_PASS=<app password>`, `CONTACT_RECIPIENT=<where to receive notifications>`. Use port 465 for implicit TLS. Replying to a notification replies to the visitor (Reply-To is set).

## 16. Troubleshooting

| Problem | Fix |
|---|---|
| Server exits with "Invalid environment configuration" | Fill in the variables it lists in `server/.env` |
| `MongooseServerSelectionError` | Check the Atlas IP allow-list, the password (URL-encode special characters) and the database name |
| Browser shows a CORS error / "Origin not allowed" | `CLIENT_URL` must exactly match the site origin (scheme + host, no trailing slash) |
| Site shows "Cannot reach the server" | Check `VITE_API_URL` (must include `/api`). On Render, wait for the instance to wake. Rebuild the client after changing env vars |
| "Profile has not been set up yet" | Run `npm run seed` |
| Cannot log in | Run `npm run create-admin`; after 10 failed attempts wait 15 minutes |
| `/admin` gives 404 on refresh in production | Make sure `client/vercel.json` is deployed and Root Directory is `client` |
| Uploads return 503 | Cloudinary variables are missing |
| Messages saved but no email | SMTP variables missing or wrong (check Render logs); Gmail needs an App Password |
| `429 Too many requests` | Rate limit hit: contact form 5/hour, login 10/15 min per IP |

## Security notes

Passwords are bcrypt-hashed; JWT secret and database credentials exist only on the server; all admin routes require a valid token for an existing admin; request bodies are validated (Zod) and stripped of HTML; URLs are limited to http(s); uploads are type-, size- and signature-checked; Helmet, CORS allow-list, 100 KB body limit and rate limits are enabled.
