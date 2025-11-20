# Assignment 3 - Deployment Checklist

## Pre-Deployment Checklist

### Local Testing

- [ ] Update DATABASE_URL in .env with your Render PostgreSQL URL
- [ ] Run `npm run dev` and verify server starts
- [ ] Open http://localhost:5500 and verify home page loads
- [ ] Click each navigation link and verify classification views load
- [ ] Click vehicle cards to test detail views
- [ ] Verify price shows as `$35,000` (with $ and commas)
- [ ] Verify mileage shows as `22,000 miles` (with commas)
- [ ] Test responsive design (resize browser window)
  - Large screens: image and text side-by-side
  - Small screens: image and text stacked
- [ ] Click "Trigger Error" in footer, verify 500 error page
- [ ] Visit http://localhost:5500/fake-page, verify 404 error page
- [ ] Test multiple vehicles (at least 3 different ones)

### Code Quality

- [ ] All console.error messages removed (except in error handlers)
- [ ] No intentional errors left in code (except trigger-error route)
- [ ] All TODO comments removed
- [ ] Code properly commented
- [ ] Consistent indentation and formatting

### HTML/CSS Validation

- [ ] Validate HTML at https://validator.w3.org/
  - Test home page
  - Test classification page
  - Test detail page
  - Test error page
- [ ] Validate CSS at https://jigsaw.w3.org/css-validator/
- [ ] WAVE accessibility check at https://wave.webaim.org/
  - Test home page
  - Test detail page

### Git Repository

- [ ] All files committed
- [ ] .env NOT committed (should be in .gitignore)
- [ ] .env.sample exists with template values
- [ ] README.md or ASSIGNMENT3-README.md present
- [ ] Clean commit history with meaningful messages

## Deployment Steps

### Step 1: Verify Database on Render

1. [ ] Log into https://dashboard.render.com/
2. [ ] Click on your PostgreSQL database service
3. [ ] Verify status is "Available"
4. [ ] Copy "External Database URL"
5. [ ] Test connection with pgAdmin or SQL client
6. [ ] Run this query to verify data: `SELECT COUNT(*) FROM inventory;`
7. [ ] Should show at least 10 vehicles

### Step 2: Update Local .env

1. [ ] Open `.env` file
2. [ ] Replace DATABASE_URL with your Render URL
3. [ ] Test locally to ensure database connection works
4. [ ] DO NOT commit .env file

### Step 3: Commit and Push

```powershell
cd C:\Users\HP15\Desktop\cse340\cse340
git add .
git commit -m "Complete Assignment 3: Vehicle detail view, error handling, and intentional error"
git push origin main
```

- [ ] Git push successful
- [ ] No errors during push
- [ ] Verify files on GitHub web interface

### Step 4: Configure Render Web Service

1. [ ] Go to your Render.com dashboard
2. [ ] Click on your web service (not database)
3. [ ] Click "Environment" in the left sidebar
4. [ ] Add/verify these environment variables:

| Key          | Value                          | Notes                        |
| ------------ | ------------------------------ | ---------------------------- |
| DATABASE_URL | (your PostgreSQL External URL) | Copy from database service   |
| NODE_ENV     | production                     | Must be exactly "production" |
| PORT         | 10000                          | Render default port          |
| HOST         | 0.0.0.0                        | Bind to all interfaces       |

5. [ ] Click "Save Changes"
6. [ ] Render will auto-deploy (wait 2-3 minutes)

### Step 5: Monitor Deployment

1. [ ] Click "Logs" tab
2. [ ] Watch for these success messages:
   - "Build successful"
   - "npm install" completes
   - "Starting service..."
   - "app listening on http://0.0.0.0:10000"
3. [ ] Check for any errors in logs
4. [ ] Wait for "Live" status indicator

### Step 6: Test Production

Your production URL will be: `https://your-service-name.onrender.com`

- [ ] Home page loads: `https://your-service-name.onrender.com/`
- [ ] Navigation links work
- [ ] Classification view loads: `https://your-service-name.onrender.com/inv/type/2`
- [ ] Detail view loads: `https://your-service-name.onrender.com/inv/detail/1`
- [ ] Test multiple vehicles
- [ ] Price formatted correctly
- [ ] Mileage formatted correctly
- [ ] Images display
- [ ] Responsive design works
- [ ] 404 error: `https://your-service-name.onrender.com/fake-page`
- [ ] 500 error: `https://your-service-name.onrender.com/inv/trigger-error`

### Step 7: Final Validation

- [ ] Test on mobile device or browser mobile emulator
- [ ] Validate production HTML (view source, copy to validator)
- [ ] Check all links in navigation
- [ ] Test at least 5 different vehicles
- [ ] Verify no console errors in browser dev tools
- [ ] Check page load times (should be < 3 seconds)

## Submission Checklist

### Canvas Submission

- [ ] GitHub repository URL (main branch)
- [ ] Render.com production URL
- [ ] Both URLs submitted as a comment (not as attachments)
- [ ] URLs are clickable and working
- [ ] Submission is on time

### URLs to Submit

**GitHub URL Format:**

```
https://github.com/your-username/cse340
```

**Render URL Format:**

```
https://your-service-name.onrender.com
```

### Double-Check

- [ ] Instructor can access GitHub repo (public)
- [ ] Production site is live (not sleeping)
- [ ] No build errors in Render logs
- [ ] All assignment requirements met

## Common Issues and Fixes

### Issue: "Cannot connect to database"

**Fix:**

1. Check DATABASE_URL in Render environment variables
2. Make sure it's the "External Database URL" not "Internal"
3. Verify database service is "Available"
4. Check database has data: `SELECT * FROM classification;`

### Issue: "Application Error" or "503 Service Unavailable"

**Fix:**

1. Check Render logs for specific error
2. Verify all environment variables are set
3. Make sure NODE_ENV=production
4. Check that build succeeded

### Issue: Navigation shows placeholder links

**Fix:**

1. Database connection not working
2. Check DATABASE_URL is correct
3. Verify database has classification table with data
4. Run `db-rebuild.sql` if needed

### Issue: Images not loading

**Fix:**

1. Check browser console for 404 errors
2. Verify image paths start with `/images/vehicles/`
3. Make sure `db-rebuild.sql` was run (includes image path update)
4. Check public/images/vehicles/ folder has images

### Issue: "Cannot GET /inv/type/1"

**Fix:**

1. Check routes are properly registered in server.js
2. Verify `app.use("/inv", inventoryRoute);` is present
3. Check that route file is in routes/ folder
4. Look for typos in route paths

### Issue: Styles not loading

**Fix:**

1. Check static files middleware in server.js
2. Verify CSS file is in public/css/styles.css
3. Check <link> tag in head.ejs
4. Clear browser cache

### Issue: Error page doesn't show

**Fix:**

1. Check error handlers are LAST in server.js
2. Verify errorHandler.js is in middleware/ folder
3. Make sure error view is in views/errors/error.ejs
4. Check that utilities.handleErrors() wraps routes

## Testing Matrix

Test all these scenarios before submission:

| Test           | URL                | Expected Result            |
| -------------- | ------------------ | -------------------------- |
| Home           | /                  | Home page with dynamic nav |
| Classification | /inv/type/1        | Custom vehicles list       |
| Classification | /inv/type/2        | Sport vehicles list        |
| Detail         | /inv/detail/1      | DeLorean details           |
| Detail         | /inv/detail/2      | Camaro details             |
| 404 Error      | /does-not-exist    | 404 error page             |
| 500 Error      | /inv/trigger-error | 500 error page             |
| Invalid Detail | /inv/detail/999    | 404 or error page          |

## Grading Matrix Checklist

### Objective 1: Frontend Standards (Value: Check gradebook)

- [ ] Detail view meets Frontend Checklist standards
- [ ] Responsive design (multi-column → stacked)
- [ ] Price formatted with $ and commas
- [ ] Mileage formatted with commas
- [ ] No horizontal scrolling or zooming needed

### Objective 2: MVC Structure (Value: Check gradebook)

- [ ] Route handles detail requests
- [ ] Controller processes requests
- [ ] Utility function builds HTML
- [ ] All components working correctly

### Objective 3: MVC Solution (Value: Check gradebook)

- [ ] Detail delivery uses full MVC
- [ ] Footer error uses MVC approach
- [ ] Proper separation of concerns

### Objective 4: Database (Value: Check gradebook)

- [ ] Model function gets vehicle by ID
- [ ] Uses parameterized statements ($1)
- [ ] Works correctly

### Objective 5: Error Handling (Value: Check gradebook)

- [ ] Error handling throughout application
- [ ] Errors delivered via error views
- [ ] Footer link triggers intentional error
- [ ] Error caught by middleware

### Objective 6: Submission (Value: Check gradebook)

- [ ] Render.com URL submitted
- [ ] GitHub URL submitted
- [ ] Both URLs working
- [ ] Submitted on time

## Final Notes

- Remove "Trigger Error" link from footer before real production
- Keep error handling for legitimate errors
- The DATABASE_URL should never be committed to GitHub
- Test thoroughly before submitting
- Take screenshots of working application (backup proof)

## Need Help?

- Post to weekly discussion board
- Ask learning team
- Check Render logs for specific errors
- Review ASSIGNMENT3-README.md for detailed docs

## You're Ready!

If all checkboxes are checked, you're ready to submit! 🎉

Good luck!
