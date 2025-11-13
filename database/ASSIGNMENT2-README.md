# Assignment 2 - Database Setup Guide

## Files Created

### 1. `assignment2.sql` - Task 1 Queries

Contains 6 SQL queries:

1. **INSERT**: Add Tony Stark to account table
2. **UPDATE**: Change Tony Stark's account_type to 'Admin'
3. **DELETE**: Remove Tony Stark from account table
4. **UPDATE**: Change GM Hummer description from "small interiors" to "a huge interior"
5. **SELECT with JOIN**: Get make, model, and classification name for Sport category vehicles
6. **UPDATE**: Add '/vehicles' to image paths for all inventory items

### 2. `db-rebuild.sql` - Database Rebuild File

Contains complete database setup:

- CREATE TYPE for account_type ENUM
- CREATE TABLE statements for: classification, inventory, account
- INSERT statements for classification data
- INSERT statements for inventory data (vehicles)
- Copies of queries 4 and 6 from Task 1 (run at the end)

## How to Complete Assignment 2

### Task 1: Testing Queries

1. **Connect to your Render.com PostgreSQL database** using pgAdmin or SQLTools
2. **Test each query individually** from `assignment2.sql`:
   - Run query 1 (INSERT Tony Stark)
   - Run query 2 (UPDATE to Admin) - verify using: `SELECT * FROM account WHERE account_email = 'tony@starkent.com';`
   - Run query 3 (DELETE Tony Stark) - verify Tony is removed
   - Run query 4 (UPDATE GM Hummer) - verify using: `SELECT * FROM inventory WHERE inv_make = 'GM';`
   - Run query 5 (SELECT with JOIN) - should return 2 Sport vehicles
   - Run query 6 (UPDATE image paths) - verify using: `SELECT inv_image, inv_thumbnail FROM inventory LIMIT 5;`

### Task 2: Video Demonstration (Under 4 Minutes)

Record a video showing:

#### Part 1: Delete and Recreate Database (2 minutes)

1. Log into Render.com dashboard
2. Navigate to your database service
3. Scroll to bottom, click "Delete Database"
4. Follow prompts to confirm deletion
5. Create new PostgreSQL database:
   - Click "New +"
   - Select "PostgreSQL"
   - Give it a name (e.g., `cse340_db_v2`)
   - Select free tier
   - Click "Create Database"
   - **PAUSE VIDEO** while database provisions (takes 3-5 minutes)

#### Part 2: Reconnect and Rebuild (2 minutes)

6. Copy new database connection details from Render.com:
   - Internal Database URL OR
   - External Database URL
7. Delete old connection in pgAdmin/SQLTools
8. Create new connection using new credentials
9. Open `db-rebuild.sql` in your SQL tool
10. **Run entire file** (all queries at once)
11. Show results:
    - Display classification table: `SELECT * FROM classification;`
    - Display inventory table: `SELECT * FROM inventory;`
    - Show GM Hummer has "a huge interior" in description
    - Show image paths contain `/vehicles/` in the path

#### Part 3: Show Task 1 Results (30 seconds)

12. Show that image paths were updated correctly
13. Show GM Hummer description was updated correctly

### Video Tips

- **Narrate using your voice** - explain what you're doing
- **Keep it under 4 minutes** - practice first!
- **Pause while database provisions** - don't waste time
- Upload to YouTube as "Unlisted"

## Submission Checklist

- [ ] Both SQL files (`assignment2.sql` and `db-rebuild.sql`) in database folder
- [ ] Video recorded and uploaded to YouTube (Unlisted)
- [ ] All 6 Task 1 queries tested and working
- [ ] Database rebuild file tested and working
- [ ] Submit to Canvas:
  - YouTube video URL
  - GitHub repository URL
  - **NOTE**: No Render.com production URL needed for Assignment 2

## Common Issues and Solutions

### Query 4 - GM Hummer Update

- Make sure the original text says "small interiors" (plural)
- The REPLACE function is case-sensitive

### Query 6 - Image Path Update

- Should change `/images/` to `/images/vehicles/`
- Final paths should look like: `/images/vehicles/camaro.jpg`

### Database Rebuild

- Run all queries in the file at once (not one by one)
- The file handles duplicate prevention with `IF NOT EXISTS` and `ON CONFLICT`
- Queries 4 and 6 MUST run after data insertion

## Testing Your Work

### Verify Task 1 Queries Work:

```sql
-- After running all queries, check results:
SELECT * FROM inventory WHERE inv_make = 'GM'; -- Should show "a huge interior"
SELECT inv_image FROM inventory LIMIT 3; -- Should show /images/vehicles/ in path
SELECT * FROM inventory i JOIN classification c ON i.classification_id = c.classification_id WHERE c.classification_name = 'Sport';
```

### Verify Database Rebuild Works:

```sql
-- After running db-rebuild.sql:
SELECT COUNT(*) FROM classification; -- Should show 5 classifications
SELECT COUNT(*) FROM inventory; -- Should show multiple vehicles
SELECT * FROM inventory WHERE inv_make = 'GM'; -- Should show "a huge interior"
SELECT inv_image FROM inventory LIMIT 1; -- Should show /images/vehicles/ in path
```

## Next Steps

1. Connect to your Render.com database
2. Test all queries in assignment2.sql
3. Practice the delete/rebuild process once
4. Record your video (second attempt usually better!)
5. Push to GitHub
6. Submit URLs to Canvas
