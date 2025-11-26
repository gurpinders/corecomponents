# CoreComponents Platform - Manual Testing Checklist

**Date:** November 25th, 2025
**Tester:** Gurpinderjeet Sandhu 
**Environment:** localhost:3000

---

## SECTION 1: PUBLIC PAGES (NOT LOGGED IN) 🌐

### A. Homepage (`localhost:3000`)
- [x] Page loads without errors
- [x] Hero section displays with branded background
- [x] Logo displays in header
- [x] Navigation menu works (all links clickable)
- [x] "Browse Catalog" button works
- [x] "View Trucks" button works
- [x] Footer displays with contact info
- [x] Promotional bar shows phone number and discount info
- [x] No console errors (F12 → Console)

### B. Category Browsing (`localhost:3000/catalog`)
- [x] All 12 category tiles display
- [x] Category images show (or placeholder if no image)
- [x] Hover effects work (card lifts, image zooms)
- [x] Category names and descriptions visible
- [x] Clicking any category navigates correctly
- [x] URL changes to `?category=...`

### C. Category Parts View (Click on "Engine Parts")
- [x] Breadcrumb shows: "All Categories > Engine Parts"
- [x] Parts display in grid
- [x] Part images show
- [x] Part names display
- [x] Retail prices show (not customer price - you're not logged in)
- [x] Stock status badges visible (In Stock, Low Stock, Out of Stock)
- [x] Search bar present
- [x] "Add to Cart" buttons present
- [x] "Details" buttons work

### D. Part Detail Page (Click "Details" on any part)
- [x] Part details load
- [x] Multiple images display (if part has them)
- [x] Description shows
- [x] Specifications display
- [x] Price visible
- [x] Stock status correct
- [x] "Add to Cart" button works
- [x] Clicking cart adds item

### E. Shopping Cart (Click cart icon)
- [x] Cart opens/displays
- [x] Items show correctly
- [x] Prices display
- [x] Quantity can be changed (+/-)
- [x] Items can be removed (X button)
- [x] Subtotal calculates correctly
- [x] "Checkout" or "Request Quote" button visible

### F. Trucks Page (`localhost:3000/trucks`)
- [x] Truck listings display
- [x] Truck images show
- [x] Year/Make/Model visible
- [x] Prices display
- [x] "View Details" buttons work

### G. Truck Detail Page (Click any truck)
- [x] Truck details load
- [x] Images display
- [x] Specifications show
- [x] Price visible
- [x] Contact/inquiry option present

### H. About Page (`localhost:3000/about`)
- [x] Page loads
- [x] Content displays properly

### I. Contact Page (`localhost:3000/contact`)
- [x] Page loads
- [x] Contact form present
- [x] Phone/email info visible

---

## SECTION 2: AUTHENTICATION 🔐

### A. Sign Up (`localhost:3000/signup`)
- [x] Form displays
- [x] Can enter: Name, Email, Password, Phone, Company
- [x] Password field is masked
- [x] "Sign Up" button works
- [x] Account gets created (no errors)
- [x] Redirects after signup
- [x] Header now shows "Account" and "Logout" (not "Login/Sign Up")

### B. Logout
- [x] Click "Logout" button
- [x] User gets logged out
- [x] Header returns to "Login/Sign Up"
- [x] Redirects to homepage

### C. Login (`localhost:3000/login`)
- [x] Form displays
- [x] Can enter email and password
- [x] "Login" button works
- [x] Successfully logs in
- [x] Header shows "Account" and "Logout"
- [x] No errors in console

---

## SECTION 3: CUSTOMER FEATURES (LOGGED IN) 👤

### A. Customer Pricing
- [x] Go to any part while logged in
- [x] See BOTH prices (retail crossed out, customer price in green)
- [x] Shows "You save $X.XX"
- [x] Customer price is 5% less than retail
- [x] Cart uses customer pricing

### B. Account Page (`localhost:3000/account`)

**Overview Tab:**
- [x] Customer discount badge shows "5% OFF"
- [x] Total orders displays correctly
- [x] Total spent shows correct amount
- [x] Account details card shows info
- [x] Recent activity shows last 3 orders

**Orders Tab:**
- [x] Click "Orders" tab
- [x] All orders display (or empty state if none)
- [x] Order cards show: ID, date, status, amount
- [x] Status badges colored correctly (green/blue/yellow)
- [x] "View Order Details" button works
- [x] Modal opens with order details
- [x] Order items listed with quantities and prices
- [x] Totals shown (subtotal, tax, shipping, total)
- [x] Can close modal (X or click outside)

**Profile Tab:**
- [x] Click "Profile" tab
- [x] Shows current info (name, email, phone, company, address)
- [x] Click "Edit Profile"
- [x] Fields become editable
- [x] Change something (e.g., phone number)
- [x] Click "Save"
- [x] Success message appears
- [x] Changes saved (refresh page to verify)
- [x] Can click "Cancel" to discard changes

### C. Shopping Cart (Logged In)
- [x] Add items to cart
- [x] Cart shows customer prices (not retail)
- [x] Totals use customer pricing
- [x] Discount applied correctly

---

## SECTION 4: ADMIN FEATURES (ADMIN ACCESS) 👨‍💼

### A. Admin Dashboard (`localhost:3000/admin`)

**Revenue Metrics:**
- [x] Total Revenue displays
- [x] Total Orders count shows
- [x] Average Order Value calculates
- [x] This Month's Revenue shows

**Secondary Metrics:**
- [x] Inventory count (Parts + Trucks)
- [x] Customers count
- [x] Quote Requests count
- [x] Email Campaigns count

**Other Sections:**
- [x] Quick Actions buttons visible
- [x] Low Stock Alerts section (if applicable)
- [x] Quote Pipeline chart displays
- [x] Customer Growth shows
- [x] Top Selling Products displays
- [x] Campaign Performance table shows
- [x] Recent Orders widget displays
- [x] Recent Quote Requests shows
- [x] Recent Campaigns shows

**Navigation:**
- [x] All admin sidebar links work
- [x] Can navigate between admin pages

### B. Parts Management

**View Parts List (`localhost:3000/admin/parts`):**
- [x] All parts display in table
- [x] Can see: name, SKU, price, category, stock status
- [x] "Add New Part" button visible
- [x] "Edit" buttons work
- [x] "Delete" buttons work (with confirmation)

**Add New Part (`localhost:3000/admin/parts/new`):**
- [x] Form loads
- [x] Can enter: name, SKU, description
- [x] Can select category from dropdown
- [x] Can upload multiple images
- [x] Images preview after upload
- [x] Can delete uploaded images (hover → X)
- [x] Enter retail price → customer price auto-calculates (5% off)
- [x] Can select stock status
- [x] "Add Part" button works
- [x] Part gets created
- [x] Redirects to parts list

**Edit Part (Click "Edit" on any part):**
- [x] Form loads with existing data
- [x] Existing images display
- [x] Can upload new images
- [x] Can delete existing images
- [x] Can modify any field
- [x] Changes save successfully
- [x] Redirects after saving

### C. Trucks Management

**Add New Truck (`localhost:3000/admin/trucks/new`):**

**VIN Lookup:**
- [x] Enter test VIN: `3AKJHHDR6LSLE8799`
- [x] Click "Lookup VIN"
- [x] Button shows "Looking up..."
- [x] Success message appears (green)
- [x] Fields auto-fill: Make, Model, Year, Engine, Transmission, GVW
- [x] Can still manually edit any field

**Complete Form:**
- [x] Can upload multiple images
- [x] Enter retail price → customer price auto-calculates
- [x] Select condition (new/used/rebuilt)
- [x] Select status (available/pending/sold)
- [x] "Add Truck" button works
- [x] Truck gets created

**Edit Truck:**
- [x] Can edit existing trucks
- [x] VIN lookup still works in edit mode
- [x] Changes save successfully

### D. Categories Management (`localhost:3000/admin/categories`)

**List View:**
- [x] All 12 categories display
- [x] Can see: name, description, display order
- [x] "Add Category" button visible
- [x] "Edit" buttons work

**Edit Category:**
- [x] Click "Edit" on any category
- [x] Form loads with existing data
- [x] Can upload category image
- [x] Image previews after upload
- [x] Can change name, description, display order
- [x] "Update Category" works
- [x] Changes save

**Verify on Frontend:**
- [x] Go to `localhost:3000/catalog`
- [x] Category now shows uploaded image
- [x] Hover and click effects work

### E. Email Campaigns (`localhost:3000/admin/campaigns`)

**Campaign List:**
- [x] Existing campaigns display
- [x] Shows: name, subject, status, recipients, sent date
- [x] "Create Campaign" button visible
- [x] Can see campaign analytics (opens, clicks)

**Create Campaign:**
- [x] Click "Create Campaign"
- [x] Form loads
- [x] Enter: campaign name, subject, headline
- [x] Can select multiple products
- [x] Products display with checkboxes
- [x] "Create Campaign" button works
- [x] Campaign appears in list

**Send Campaign:**
- [x] Click "Send Campaign" on any campaign
- [x] Confirmation appears
- [x] Email sends (check your inbox)
- [x] Status changes to "Sent"
- [x] Recipients count updates

**Check Email:**
- [x] Email received in inbox
- [x] Logo displays correctly
- [x] Headline shows below logo
- [x] Navy background visible
- [x] Product grid displays (2 columns)
- [x] Product images show
- [x] Prices display
- [x] "View Product" buttons present
- [x] Footer shows contact info
- [x] Unsubscribe link present

**Analytics:**
- [x] Click "View Analytics" on sent campaign
- [ ] Open rate displays
- [ ] Click rate displays
- [ ] Charts/graphs show

---

## SECTION 5: MOBILE RESPONSIVENESS 📱

**Test on mobile view (F12 → Toggle Device Toolbar):**

- [x] Homepage mobile layout works
- [x] Mobile menu button appears
- [x] Mobile menu opens/closes
- [x] Catalog grid adjusts (1-2 columns)
- [x] Part cards stack properly
- [x] Cart displays correctly on mobile
- [x] Forms are usable on mobile
- [x] Text is readable (not too small)
- [x] Buttons are tappable (not too small)
- [x] Images scale properly

---

## SECTION 6: SEARCH & FILTERS 🔍

- [x] Go to any category
- [x] Use search bar
- [x] Enter part name
- [x] Click "Search"
- [x] Results filter correctly
- [x] Part count updates
- [x] Clear search works

---

## SECTION 7: ERROR HANDLING ⚠️

- [x] Try to access admin without login → Redirects or shows error
- [x] Try invalid login credentials → Shows error message
- [x] Try to checkout empty cart → Appropriate message
- [x] Navigate to non-existent page (`localhost:3000/fake-page`) → 404 page or redirect
- [x] Try to edit non-existent part → Shows error

---

## SECTION 8: PERFORMANCE ⚡

- [x] Pages load quickly (< 3 seconds)
- [x] Images load without delay
- [x] No laggy scrolling
- [x] Animations smooth
- [x] No excessive console warnings

---

## SECTION 9: SEO & ANALYTICS 📊

- [x] Visit `localhost:3000/sitemap.xml` → XML displays
- [x] Visit `localhost:3000/robots.txt` → Rules display
- [x] View homepage source (Ctrl+U) → Title and meta tags present
- [x] Google Analytics script present in source (search for "gtag")

---

## FINAL CHECKS ✅

- [x] No console errors on any page
- [x] All links work (no 404s)
- [x] All images display (no broken images)
- [x] All forms submit successfully
- [x] Navigation flows make sense
- [x] Professional appearance throughout

---

## BUGS FOUND 🐛

**Document any bugs you find:**

1. 
2. 
3. 

---

## NOTES 📝

**Additional observations:**

---

## COMPLETION

- [ ] All sections tested
- [ ] All bugs documented
- [ ] Ready for automated Playwright tests

**Total Time:** __________ minutes

**Overall Status:** ⬜ PASS / ⬜ FAIL

---

**Next Steps:**
1. Fix any bugs found
2. Re-test failed sections
3. Proceed to Playwright automated testing