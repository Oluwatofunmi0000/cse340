# Project 2 Part 1 - Video Script (5-8 min)

## Goal: Show CRUD working locally and deployed on Render

### PREP: Before recording

- Start local server (`npm run dev`) with `.env` pointing to a local test DB or Atlas cluster
- Seed DB (optional): `node seed.js`
- Open Postman and import `project2/docs/postman_collection.json`
- Prepare Render link if deployed

---

### 1. Opening (15s)

- "Hi, I'm [Your Name]. This demo shows Project 2 Part 1 - CRUD operations with a MongoDB backend, built in Node/Express."

### 2. Quick summary of project (20s)

- "This API stores Books and Authors. Books have 9 fields. I implemented GET/POST/PUT/DELETE routes with Joi validation and central error handling."

### 3. Show file structure (30s)

- Show files: `models/`, `controllers/`, `routes/`, `validators/`, `seed.js`, `docs/openapi.yaml`

### 4. Run local server and seed DB (40s)

- `npm run dev` and `node seed.js` (pause while seeds run)
- Explain `seed.js` creates an author and a book for quick testing

### 5. Test APIs in Postman (2 min)

- Show `GET /api/books` -> results list of books
- Show `GET /api/authors` -> list of authors
- Show `POST /api/authors` -> create a new author, show response
- Use created author `_id` in `POST /api/books` -> create book with required fields
- Show `PUT /api/books/:id` -> change title or price, show updated response
- Show `DELETE /api/books/:id` -> confirm success

### 6. Show validations (30s)

- Try to create book without `title` or `isbn` -> show Joi error from server
- Try invalid email for author -> show 400 error with message

### 7. Deploy to Render (1 min)

- Show that you added repo to Render, set `MONGO_URI` env var, and deployed
- Show that the remote URL responds to `GET /api/books`

### 8. Conclusion (15-20s)

- "That demonstrates CRUD operations, validation, error handling, and a successful deployment to Render. In Part 2 I will add OAuth and authentication."

---

## Demo Tips

- Use your voice and keep it steady
- Pause while deployments/provisioning happen
- Highlight the response body so graders can see fields
- Keep total length between 5-8 minutes
