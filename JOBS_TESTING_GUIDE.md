# Quick Testing Guide - Jobs Portal

## Prerequisites
- Backend running on `http://localhost:3000`
- Frontend running (typically `http://localhost:5173` for Vite)
- User logged in with valid JWT token

---

## Testing Workflow

### Step 1: Navigate to Jobs
1. Open UserDashboard
2. Click **"Browse Jobs"** button (large gradient card on right sidebar)
3. Or click **"View All"** in the "Latest Jobs" card
4. **Expected**: JobsDisplay component renders with list of jobs

---

### Step 2: Test Job Listing
1. JobsDisplay should display jobs in cards
2. Each job card shows:
   - ✅ Job title
   - ✅ Company name
   - ✅ Location with icon
   - ✅ Salary range with icon
   - ✅ Job type badge (colored)
   - ✅ Brief description preview
   - ✅ Apply button

**Expected**: Multiple job cards visible with pagination

---

### Step 3: Test Search Functionality
1. Type in search box (e.g., "engineer", "developer", "marketer")
2. Results filter in real-time (500ms debounce)
3. Search works on: job titles, descriptions, company names

**Expected**: Job list updates with matching results

---

### Step 4: Test Filters (Individual)

#### Location Filter:
1. Enter location (e.g., "New York", "San Francisco")
2. Jobs filter by location

#### Job Type Filter:
1. Select from dropdown: "Full-time", "Part-time", "Contract", "Internship", "Freelance"
2. Jobs filter by selected type

#### Experience Level Filter:
1. Select: "Entry Level", "Mid Level", "Senior", "Director"
2. Jobs filter by experience

#### Salary Filter:
1. Enter min salary (e.g., 50000)
2. Enter max salary (e.g., 100000)
3. Jobs filter to match range

**Expected**: Job list updates with filter applied

---

### Step 5: Test Combined Filters
1. Apply multiple filters (location + job type + salary)
2. Jobs should match ALL filters

**Example**:
- Location: "New York"
- Job Type: "Full-time"
- Experience: "Senior"
- Min Salary: 80000

**Expected**: Only jobs matching all criteria show

---

### Step 6: Test Reset Filters
1. Apply multiple filters
2. Click **"Reset"** button (top right of filters)
3. All filters clear, showing all jobs

**Expected**: All filters reset, full job list returns

---

### Step 7: Test Job Selection (Desktop Only)
1. Click on any job card
2. Right sidebar shows full job details
3. Details panel includes:
   - ✅ Full description
   - ✅ Requirements section
   - ✅ Salary info
   - ✅ Location info
   - ✅ Job type
   - ✅ Experience level

**Expected**: Details panel appears with full job information

---

### Step 8: Test Job Application
1. Click **"Apply Now"** on any job card
2. Button shows "Applying..." with spinner
3. After success: shows "Already Applied" or similar
4. Notification: success or error message

**Expected**: Application submitted (check backend logs)

---

### Step 9: Test Pagination
1. If more than 10 jobs exist, pagination controls appear
2. Click page numbers (1, 2, 3, etc.)
3. Click **Previous** arrow (if not on page 1)
4. Click **Next** arrow (if not on last page)

**Expected**: Job list updates to show correct page

---

### Step 10: Test Responsive Design

#### Mobile View (< 768px):
1. Filters sidebar should be hidden by default
2. Click **Filter icon** (top right) to show filters
3. Job list takes full width
4. Filters overlay or slide in from side

#### Desktop View (>= 768px):
1. Filters sidebar always visible on left
2. Job list in middle with details panel on right
3. Side-by-side layout

---

### Step 11: Test Dark Mode
1. Toggle dark mode in app
2. JobsDisplay should adapt:
   - ✅ Dark backgrounds
   - ✅ Light text
   - ✅ Proper contrast
   - ✅ Badge colors remain visible

**Expected**: UI adapts to dark theme

---

### Step 12: Test Error States

#### No Jobs Found:
1. Search for something that doesn't exist (e.g., "xyzabc123")
2. Empty state message displays

#### No Results After Filter:
1. Apply filters that don't match any jobs
2. Empty state displays

**Expected**: "No Jobs Found" message with helpful text

---

## Common Issues & Solutions

### Jobs not loading
```
✓ Check: Backend running on http://localhost:3000
✓ Check: /api/jobs endpoint returns data
✓ Check: Browser console for errors
```

### Apply button shows error
```
✓ Check: User is logged in (token in localStorage)
✓ Check: Browser console for error details
✓ Check: Backend /api/applications/submit endpoint
```

### Filters not working
```
✓ Check: Database has jobs with those parameters
✓ Check: API response in browser Network tab
✓ Check: Verify filter parameter names match backend
```

### Mobile responsive broken
```
✓ Check: CSS media queries working
✓ Check: Viewport meta tag in HTML
✓ Check: Browser zoom at 100%
```

### Dark mode not working
```
✓ Check: ThemeContext is imported correctly
✓ Check: Theme state is being updated
✓ Check: CSS class names use 'dark:' prefix
```

---

## Browser Developer Tools Tips

### Check API Calls:
1. Open DevTools → Network Tab
2. Filter by "fetch" or "XHR"
3. Look for requests to:
   - `/api/jobs` (GET)
   - `/api/jobs/[id]` (GET)
   - `/api/applications/submit` (POST)

### Check Console:
1. Look for error messages
2. Check API response status
3. Verify authentication token present

### Performance:
1. Check Network tab → Response time
2. Verify images/assets load quickly
3. Check for memory leaks in Console

---

## Test Data Checklist

For comprehensive testing, ensure your database has:
- [ ] Jobs in different locations (NY, SF, LA, etc.)
- [ ] Jobs of all types (Full-time, Part-time, Contract, Internship, Freelance)
- [ ] Jobs at all experience levels (Entry, Mid, Senior, Director)
- [ ] Jobs with various salary ranges
- [ ] At least 15+ jobs for pagination testing
- [ ] Jobs with full descriptions and requirements
- [ ] Company logos/info for each job

---

## Performance Benchmarks

Target performance metrics:
- **Page Load**: < 2 seconds
- **Job Fetch**: < 500ms
- **Apply Job**: < 1 second
- **Search Response**: < 600ms (with debounce)

---

## Sign-Off Checklist

After testing, verify:
- [ ] All jobs display correctly
- [ ] Search works as expected
- [ ] All filters work individually
- [ ] Combined filters work
- [ ] Pagination works
- [ ] Job details panel shows on desktop
- [ ] Job application works
- [ ] Responsive design works on mobile
- [ ] Dark mode works
- [ ] No console errors
- [ ] No API errors (500, 404, etc.)
- [ ] Button states (hover, active, disabled) work
- [ ] Loading spinners show/hide properly

---

## Status: Ready to Test ✅

All components are in place and ready for thorough testing!
