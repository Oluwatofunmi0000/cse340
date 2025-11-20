## Getting Started

This document is intended to get you started quickly in building a backend driven Node.js application complete with pages and content, backend logic and a PostgreSQL database for data storage.

## Prerequisites

The only prerequisite software required to have installed at this point is Git for version control and a code editor - we will use VS Code (VSC).

## Package Management

The foundation of the project development software is Node. While functional, Node depends on "packages" to add functionality to accomplish common tasks. This requires a package manager. Three common managers are NPM (Node Package Manager), YARN, and PNPM. While all do the same thing, they do it slightly differently. We will use PNPM for two reasons: 1) All packages are stored on your computer only once and then symlinks (system links) are created from the package to the project as needed, 2) performance is increased meaning that when the project builds, it does so faster.
You will need to either install or activate PNPM before using it. See https://pnpm.io/

## Install the Project Dependencies

1. Open the downloaded project folder (where this file is located) in VS Code (VSC).
2. Open the VSC terminal: Terminal > New Window.
3. Run the following command in the terminal:

   pnpm install

4. The first time it may take a few minutes, depending on the speed of your computer and the speed of your Internet connection. This command will instruct PNPM to read the package.json file and download and install the dependencies (packages) needed for the project. It will build a "node_modules" folder storing each dependency and its dependencies. It should also create a pnpm-lock.yaml file. This file should NEVER be altered by you. It is an internal file (think of it as an inventory) that PNPM uses to keep track of everything in the project.

## Start the Express Server

With the packages installed you're ready to run the initial test.

1. If the VSC terminal is still open use it. If it is closed, open it again using the same command as before.
2. Type the following command, then press Enter:

   pnpm run dev

3. If the command works, you should see the message "app listening on localhost:5500" in the console.
4. Open the package.json file.
5. Note the "Scripts" area? There is a line with the name of "dev", which tells the nodemon package to run the server.js file.
6. This is the command you just ran.
7. Open the server.js file.
8. Near the bottom you'll see two variables "Port" and "Host". The values for the variables are stored in the .env file.
9. These variables are used when the server starts on your local machine.

## Move the demo file

When you installed Git and cloned the remote repository in week 1, you should have created a simple web page.

1. Find and move that simple web page to the public folder. Be sure to note its name.

## Test in a browser

1. Go to http://localhost:5500 in a browser tab. Nothing should be visible as the server has not been setup to repond to that route.
2. Add "/filename.html" to the end of the URL (replacing filename with the name of the file you moved to the public folder).
3. You should see that page in the browser.

## Render Deployment (Production)

Follow these steps to deploy this application to Render either manually via the dashboard or using an IaC blueprint (`render.yaml`).

### 1. Prepare Environment Variables

Required variables (set in Render Dashboard > Environment):

- `DATABASE_URL` (Render will inject if you create a Render Postgres instance and link it; otherwise paste connection string manually.)
- `PORT` (Render auto-assigns; you may omit setting it manually. The code uses `process.env.PORT || 5000`.)
- `HOST` is not required in Render; app binds to `0.0.0.0` automatically.

Local `.env` must NOT contain live production secrets. The committed `DATABASE_URL` value was removed. Use placeholders locally.

### 2. Provision Postgres on Render

Option A (Dashboard):

1. New > PostgreSQL
2. Choose a name (e.g. `cse340-db`), Free plan, Region (e.g. Oregon)
3. After creation, copy the connection string (with `?sslmode=require` if provided) OR use the automatic link in the Web Service.

Option B (Blueprint): Define a database in `render.yaml` and reference its connection string via `fromDatabase`.

### 3. (Optional) Apply Schema & Seed

Use `assignment2.sql` and/or `db-rebuild.sql` from the `database` folder.

Dashboard Approach:

1. In Database > Data > Connect using psql (Render shows a connection snippet).
2. Run:
   ```bash
   psql '<YOUR_CONNECTION_STRING>' -f database/assignment2.sql
   ```
   Repeat for `db-rebuild.sql` if needed.

Local Tunnel Approach:

1. Connect via psql locally.
2. Run same `-f` commands.

### 4. Create Web Service

1. New > Web Service.
2. Select GitHub repo.
3. Branch: `main`.
4. Runtime: Node.
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Instance Type: Free (sufficient for course work).
8. Health Check Path: `/health` (already implemented).
9. Link to Postgres (Add Environment Variable automatically or use `fromDatabase`).
10. Deploy.

### 5. Verify Deployment

After build completes you should see: `Listening on 0.0.0.0:<PORT>` in Logs.
Test in browser: `https://<service-name>.onrender.com/` and `.../health` returns `OK`.
Check classification routes: `/inv/type/<classificationId>` and details `/inv/detail/<vehicleId>`.

### 6. Inventory Data Validation

If navigation is empty, confirm that tables and seed data were applied: re-run SQL files or inspect via psql `\dt` and sample `SELECT * FROM classification LIMIT 5;`.

### 7. Intentional Error Route

Available at `/inv/trigger-error` (for assignment testing); confirm custom error view renders.

### 8. Security Notes

- Never commit real secrets: `.env` is ignored by `.gitignore`.
- Rotate database password if it was previously committed.
- Use Render dashboard for secret management.

### 9. Blueprint Example (render.yaml)

See `render.yaml` in project root for an IaC definition you can apply by connecting the repo in Render and selecting "Blueprint".

### 10. Local Development vs Production

- Local dev may still use a different Postgres instance.
- Keep migrations (`assignment2.sql`) source controlled; do NOT source control generated data dumps.

### 11. Troubleshooting

- Port conflicts: Render sets `PORT`; do not hard-code.
- Empty navigation: indicates DB query failure; inspect Logs for pg errors (SSL, auth). Ensure `PGSSLMODE=require` if needed.
- Build fails: verify Node version (Render default is generally recent LTS). Add an `engines` field in `package.json` if strict version needed.

### 12. Optional Enhancements

- Add monitoring: Configure Alert on failed deploys.
- Add a staging service pointing to a separate staging database.

---

Deployment complete when all dynamic routes serve data without fallbacks and health endpoint consistently returns `OK`.
