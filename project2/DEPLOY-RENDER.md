# Deploying Project 2 to Render

Follow these steps to deploy your project to Render. They match the project requirements: your API will be public and use environment variables for DB credentials.

1. Create a new Git repo (if not done) and push your `project2/` folder to GitHub.

2. Add `.env` to `.gitignore` and do NOT push real credentials.

3. Log in to Render.com and click "New Web Service" → Connect to repo → choose your `project2` repo.

4. Build & Start commands

- Build command: leave blank (Node doesn't need a build step)
- Start command: `npm start`
- Environment: `Node 18` (render chooses automatically)

5. **Environment variables** (in Render Dashboard: Settings -> Environment)

- `MONGO_URI` = `mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/project2-db?retryWrites=true&w=majority`
- `PORT` = `10001` (or leave blank to default)

6. Deploy and Watch the logs for a successful startup message. The server will say `Server running on port <port>`.

7. Test endpoints using Postman / cURL with your Render URL:

- `GET https://<your-app-name>.onrender.com/api/books`
- `POST https://<your-app-name>.onrender.com/api/authors`

8. If you use SSL or Render requires verification, ensure your `MONGO_URI` includes `ssl=true` or `tls=true` (depending on your connection string).

9. Add the Render URL and GitHub repo URL to Canvas when ready.

**Troubleshooting**

- If deployment fails: check the server logs, ensure `MONGO_URI` is valid and accessible from Render, and that your `package.json` has a start script.
- If the app can't connect: double-check the IP whitelist (if applicable) in MongoDB Atlas.
- If Swagger docs don't show: confirm `/docs` is accessible on your rendered site or check logs.

**Optional**

- For a production-ready site, you may want to set `NODE_ENV=production` and use robust logging.
