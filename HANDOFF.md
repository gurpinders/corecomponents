# 📋 COMPREHENSIVE HANDOFF DOCUMENT - CORECOMPONENTS PROJECT

---

## 🎯 PROJECT OVERVIEW

**Project Name:** CoreComponents  
**Domain:** ccomponents.ca  
**Purpose:** E-commerce website for trucking parts with email marketing capabilities  
**Current Status:** ~40% complete (Phases 1-2 mostly done, Phase 3-4 pending)  
**GitHub Repo:** Connected and actively maintained  
**Developer:** Learning to code, prefers step-by-step guidance with explanations

---

## 📚 COMPLETE TECH STACK

### Frontend:
- **Next.js 16.0.3** (App Router)
- **React 19.2.0**
- **Tailwind CSS 3.4.18**
- **next/image** for optimized images

### Backend:
- **Next.js API Routes** (not yet implemented)
- **Supabase** (PostgreSQL database + Auth + Storage)

### Database:
- **Supabase PostgreSQL**
- Project ID: `gsadmhqpzhkmgmcvxbdi`
- 6 tables with relationships

### Authentication:
- **Supabase Auth**
- Admin user created and working

### Storage:
- **Supabase Storage**
- Bucket: `product-images` (public)

### Deployment:
- **Not yet deployed** (local development only)
- Plan: Vercel

### Package Manager:
- **npm**

---

## 🗄️ COMPLETE DATABASE SCHEMA

### Table 1: categories

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Sample Data:**
- Engine Parts (display_order: 1)
- Brake Systems (display_order: 2)

**Auto-update trigger:** ✅ Active (updates `updated_at` on UPDATE)

---

### Table 2: parts

```sql
CREATE TABLE parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock_status TEXT NOT NULL CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
  images TEXT[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Sample Data (4 parts):**
1. Heavy Duty Oil Filter Kit (Engine, $45.99, in_stock, featured)
2. Heavy-Duty Air Filter (Engine, $67.99, in_stock)
3. Air Brake Chamber Type 30 (Brake, $189.99, in_stock, featured)
4. Ceramic Brake Pad Set (Brake, $124.99, low_stock)

**Auto-update trigger:** ✅ Active

**Images:** Currently using Unsplash URLs for testing

---

### Table 3: customers

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  company TEXT,
  phone TEXT,
  subscribed BOOLEAN DEFAULT false,
  unsubscribe_token UUID DEFAULT gen_random_uuid() UNIQUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Sample Data (2 customers):**
1. John Smith (john.smith@example.com, Smith Trucking Co, subscribed: true)
2. Sarah Johnson (sarah.j@example.com, subscribed: false)

**Auto-update trigger:** ✅ Active

---

### Table 4: email_campaigns

```sql
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  banner_text TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'sent')),
  sent_at TIMESTAMP,
  recipient_count INTEGER DEFAULT 0,
  click_rate NUMERIC(5, 2),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Sample Data:** None yet

**Auto-update trigger:** ✅ Active

---

### Table 5: email_campaign_parts (Junction Table)

```sql
CREATE TABLE email_campaign_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
  part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT now()
);
```

**Purpose:** Links products to email campaigns (many-to-many relationship)

**Sample Data:** None yet

---

### Table 6: quote_requests

```sql
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID REFERENCES parts(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_company TEXT,
  customer_phone TEXT,
  quantity INTEGER DEFAULT 1,
  message TEXT,
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Sample Data:** 1+ test quotes (from testing the form)

**Auto-update trigger:** ✅ Active

---

## 📁 COMPLETE FILE STRUCTURE

```
corecomponents/
├── app/
│   ├── globals.css                    # Tailwind directives + global styles
│   ├── layout.js                      # Root layout (imports globals.css, fonts)
│   ├── page.js                        # Homepage (hero + featured products)
│   ├── admin/
│   │   ├── page.js                    # Admin dashboard (protected, shows email)
│   │   └── login/
│   │       └── page.js                # Login form (email/password, redirects to /admin)
│   └── catalog/
│       ├── page.jsx                   # Catalog list (search, filters, sorting)
│       └── [id]/
│           └── page.jsx               # Product detail + quote request form
│
├── components/
│   ├── Header.jsx                     # Site header (logo, nav, sticky)
│   └── Footer.jsx                     # Site footer (company info, links)
│
├── lib/
│   ├── supabase.js                    # Supabase client initialization
│   └── auth.js                        # Auth helpers (signIn, signOut, getUser)
│
├── public/
│   └── logo.png                       # Company logo (1600x445)
│
├── .env.local                         # Environment variables (DO NOT COMMIT)
├── .gitignore                         # Ignores node_modules, .env.local, .next
├── CHECKLIST.md                       # Project checklist (updated regularly)
├── HANDOFF.md                         # This file
├── next.config.mjs                    # Next.js config (image domains)
├── package.json                       # Dependencies
├── postcss.config.mjs                 # PostCSS config (Tailwind)
├── tailwind.config.js                 # Tailwind config (content paths)
└── jsconfig.json                      # Path aliases (@/ = root)
```

---

## 🔐 ENVIRONMENT VARIABLES

**File:** `.env.local` (in project root, NOT committed to Git)

```env
NEXT_PUBLIC_SUPABASE_URL=https://gsadmhqpzhkmgmcvxbdi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[actual key - user has this]
```

**Important:** These are PUBLIC keys (safe for client-side use)

---

## ⚙️ CONFIGURATION FILES

### next.config.mjs
```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
```

### tailwind.config.js
```javascript
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### postcss.config.mjs
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### jsconfig.json
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 🎨 KEY COMPONENTS

### Header.jsx
- Sticky header (stays at top on scroll)
- Logo (h-24, left side)
- Navigation: Home, Catalog, About, Contact
- Responsive (need to add mobile hamburger menu eventually)
- Uses Next.js Link for navigation

### Footer.jsx
- Dark theme (bg-gray-900)
- 3 columns: Company Info | Quick Links | Contact Us
- Copyright notice
- Real business info: (647) 993-8235, info@ccomponents.ca

### Product Card Pattern (reused in catalog & homepage)
```jsx
<Link href={`/catalog/${product.id}`}>
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
    <Image src={product.images[0]} alt={product.name} width={400} height={300} className="w-full h-48 object-cover"/>
    <div className="p-4">
      <h3>{product.name}</h3>
      <p>Starting from ${product.price}</p>
      <span className={/* dynamic stock badge styling */}>
        {/* In Stock / Low Stock / Out of Stock */}
      </span>
    </div>
  </div>
</Link>
```

---

## 🔄 AUTHENTICATION FLOW

### lib/auth.js Functions:

**signIn(email, password)**
- Calls `supabase.auth.signInWithPassword()`
- Returns `{ data, error }`

**signOut()**
- Calls `supabase.auth.signOut()`
- Returns `{ error }`

**getUser()**
- Calls `supabase.auth.getUser()`
- Returns `{ user, error }`

### Admin Pages Protection:
- `app/admin/page.js` checks for user with useEffect
- If no user → redirects to `/admin/login`
- If user exists → shows dashboard with email

### Admin Credentials:
- Email: User's actual email (not shared here)
- Password: User has this
- Created in Supabase Auth

---

## ✅ COMPLETED FEATURES

### Phase 1: Foundation (100% Complete)
✅ Domain registered (ccomponents.ca)  
✅ Next.js 16 initialized  
✅ Tailwind CSS 3 configured  
✅ Supabase project created  
✅ Database connected and tested  
✅ 6 database tables created with relationships  
✅ Auto-update triggers on all tables  
✅ Storage bucket created (product-images)  
✅ Storage policies configured  
✅ Admin authentication working  
✅ Test data populated  

### Phase 2: Website (75% Complete)
✅ Header component (logo, nav, sticky)  
✅ Footer component (company info, links)  
✅ Homepage with hero section  
✅ Featured products display (4 products)  
✅ Parts catalog page with grid  
✅ Search functionality (by name)  
✅ Category filters (dynamic from database)  
✅ Stock status filters  
✅ Sorting (name A-Z/Z-A, price low/high)  
✅ Product detail pages (dynamic routing with [id])  
✅ Clickable product cards  
✅ Breadcrumb navigation  
✅ Quote request form on product pages  
✅ Form validation (required fields)  
✅ Quote saves to database  
✅ Success/error messages  

**Still Needed:**
- Mobile hamburger menu for nav
- Newsletter signup (on homepage)
- Email notifications for quotes
- SEO meta tags
- Related products section
- Pagination (catalog works with 4 items, but will need pagination with more)

---

## ⏳ PENDING FEATURES

### Phase 3: Admin Panel (0% Complete)
**Next Priority - Most Important**

Need to build:
1. **Parts Management UI**
   - List all parts in admin table
   - Add new part form
   - Edit existing part
   - Delete part (with confirmation)
   - Image upload to Supabase Storage
   - Bulk CSV upload

2. **Category Management**
   - CRUD operations for categories
   - Drag-and-drop reordering (optional)

3. **Customer Management**
   - View all customers
   - Add/edit customers
   - Export to CSV
   - View subscription status

4. **Quote Management**
   - View all quote requests
   - Update status (new → contacted → quoted → closed)
   - Add admin notes
   - Email customer from admin (future)

5. **Dashboard Improvements**
   - Key metrics (total parts, customers, quotes)
   - Recent activity feed
   - Charts/graphs (optional)

### Phase 4: Email Flyer System (0% Complete)

Need to build:
1. **Flyer Builder**
   - Select products for flyer
   - Preview email template
   - Save as draft

2. **Email Template**
   - HTML email template
   - Product grid layout
   - Personalization (customer name, pricing tier)

3. **Sending System**
   - Resend API integration
   - Batch sending
   - Schedule campaigns
   - Track sent campaigns

4. **Analytics**
   - Open tracking
   - Click tracking
   - Campaign performance dashboard

### Phase 5: Polish & Deployment (0% Complete)

Need to:
- Mobile responsiveness testing
- SEO optimization (meta tags, sitemap, robots.txt)
- Performance optimization (Lighthouse audit)
- Deploy to Vercel
- Custom domain setup
- SSL certificate
- Production environment variables

---

## 🚨 KNOWN ISSUES & IMPORTANT NOTES

### Critical Issues:
None currently - everything working as expected

### Important Context:

1. **Tailwind Configuration Issue (RESOLVED)**
   - Had both Tailwind v3 and v4 installed initially
   - Fixed by uninstalling v4, using only v3
   - postcss.config.mjs now correctly configured

2. **Next.js 15+ Params Change (RESOLVED)**
   - In Next.js 15+, `params` is now a Promise
   - Must `await params` before accessing properties
   - Pattern: `const { id } = await params`

3. **Image Configuration**
   - Unsplash images allowed for testing
   - Supabase storage allowed for production images
   - Both configured in next.config.mjs

4. **File Extensions**
   - Using .jsx for files with JSX (industry standard)
   - Using .js for utility files (no JSX)
   - Both work in Next.js

5. **Import Paths**
   - Can use `@/` alias (configured in jsconfig.json)
   - Sometimes needs `.jsx` extension explicitly
   - Example: `import Header from '@/components/Header.jsx'`

6. **Supabase Row Level Security (RLS)**
   - Policies created for storage bucket
   - Public read access for images
   - Authenticated write access only
   - Table RLS not yet implemented (using anon key for now - okay for development)

---

## 🎯 RECOMMENDED NEXT STEPS

### Immediate Priority: Admin Panel Parts Management

**Why:** Users can't add/manage products without this. Currently must use Supabase UI.

**Estimated Time:** 2-3 hours

**Steps:**
1. Create `app/admin/parts/page.jsx` (parts list with table)
2. Create `app/admin/parts/new/page.jsx` (add part form)
3. Create `app/admin/parts/[id]/edit/page.jsx` (edit part form)
4. Implement image upload to Supabase Storage
5. Add delete functionality with confirmation
6. Test thoroughly

**Key Features:**
- Reusable form component for add/edit
- Image upload with preview
- Category selector (dropdown from categories table)
- Stock status selector
- Price validation
- Featured checkbox

### Second Priority: Admin Quote Management

**Why:** Quote requests are coming in but no way to manage them in admin UI.

**Estimated Time:** 1-2 hours

**Steps:**
1. Create `app/admin/quotes/page.jsx`
2. Display all quotes in table
3. Add status update dropdown
4. Add admin notes field
5. Filter by status
6. Show customer and part info

### Third Priority: Email Flyer Builder

**Why:** Core business feature - send promotional emails.

**Estimated Time:** 3-4 hours

**Steps:**
1. Design email template HTML
2. Create flyer builder UI
3. Integrate Resend API
4. Implement sending logic
5. Add tracking pixels
6. Build analytics dashboard

---

## 💡 DEVELOPMENT PATTERNS & CONVENTIONS

### File Naming:
- Pages: lowercase with .jsx (e.g., `page.jsx`, `login/page.jsx`)
- Components: PascalCase with .jsx (e.g., `Header.jsx`, `ProductCard.jsx`)
- Utilities: camelCase with .js (e.g., `auth.js`, `supabase.js`)

### Component Patterns:

**Server Components (default in App Router):**
```javascript
// No 'use client' directive
// Can directly await database calls
export default async function Page() {
  const { data } = await supabase.from('parts').select('*')
  return <div>{/* render */}</div>
}
```

**Client Components (for interactivity):**
```javascript
'use client'
import { useState, useEffect } from 'react'

export default function Page() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    // fetch data
  }, [])
  
  return <div>{/* render */}</div>
}
```

### Database Query Pattern:
```javascript
// Fetch all
const { data } = await supabase.from('parts').select('*')

// Fetch with filter
const { data } = await supabase.from('parts').select('*').eq('featured', true)

// Fetch single
const { data } = await supabase.from('parts').select('*').eq('id', id).single()

// Insert
const { error } = await supabase.from('parts').insert([{ name: 'Part Name', ... }])

// Update
const { error } = await supabase.from('parts').update({ name: 'New Name' }).eq('id', id)

// Delete
const { error } = await supabase.from('parts').delete().eq('id', id)
```

### Form Handling Pattern:
```javascript
const [formData, setFormData] = useState({ field1: '', field2: '' })

// Update single field
onChange={(e) => setFormData({...formData, field1: e.target.value})}

// Submit
const handleSubmit = async (e) => {
  e.preventDefault()
  // validation
  // submit to database
  // handle success/error
}
```

### Tailwind Styling Conventions:
- Use utility classes inline
- Common patterns:
  - Containers: `max-w-7xl mx-auto px-6`
  - Cards: `bg-white rounded-lg shadow-lg p-6`
  - Buttons: `bg-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-800`
  - Inputs: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black`

---

## 🎓 USER LEARNING STYLE & PREFERENCES

**Important Context for Next Claude:**

1. **Step-by-Step Guidance:** User prefers detailed, incremental instructions. Break tasks into small steps.

2. **Code First, Explanation After:** User likes to write code themselves with guidance, then get explanations of what they built.

3. **No Big Code Blocks:** Don't give large blocks of code upfront. Guide them to write it line by line or section by section.

4. **Verify at Checkpoints:** User likes to paste their code for review before moving on. Always ask to see their code before proceeding.

5. **Practical Learning:** User learns by building real features, not abstract examples.

6. **Appreciates Encouragement:** User responds well to positive reinforcement and celebration of progress.

7. **Commits Regularly:** User commits to GitHub frequently (good practice).

8. **Industry Standards:** User wants to follow professional conventions and best practices.

**Example Good Interaction Flow:**
```
Claude: "Let's add a state variable for the form. Create a useState that stores the product name."
User: [writes code]
Claude: "Great! Now add another one for price. Paste your code when done."
User: [pastes code]
Claude: "Perfect! Those state variables will hold the form data. Now let's build the JSX..."
```

---

## 🔧 TROUBLESHOOTING GUIDE

### Common Issues & Solutions:

**Issue: "Module not found" for @/ imports**
- **Cause:** jsconfig.json not configured or dev server not restarted
- **Fix:** Restart dev server (`npm run dev`)

**Issue: Tailwind classes not applying**
- **Cause:** Config file issue or dev server needs restart
- **Fix:** Check tailwind.config.js content paths, restart dev server

**Issue: "hostname not configured" for images**
- **Cause:** Image domain not in next.config.mjs
- **Fix:** Add domain to remotePatterns array, restart dev server

**Issue: "params is a Promise" error**
- **Cause:** Next.js 15+ change
- **Fix:** `const { id } = await params` before using

**Issue: Supabase query returns empty**
- **Cause:** Wrong table name, wrong column name, or no data
- **Fix:** Check table name spelling, check Supabase UI for data

**Issue: Form not submitting**
- **Cause:** Missing e.preventDefault() or validation error
- **Fix:** Add e.preventDefault(), check console for errors

---

## 📞 IMPORTANT CONTACTS & RESOURCES

**Business Info:**
- Company: CoreComponents
- Phone: (647) 993-8235
- Email: info@ccomponents.ca
- Domain: ccomponents.ca
- Founded: 2020

**Documentation Links:**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

**Project Repository:**
- GitHub: [User has this - actively maintained]
- Branch: main
- Last commit: Quote request forms + catalog features

---

## ✨ FINAL NOTES FOR CONTINUATION

**What the user has accomplished:**
This user has gone from zero coding experience to building a fully functional e-commerce website with:
- Database design and implementation
- Authentication system
- Search and filtering
- Dynamic routing
- Form handling
- Responsive design

**Confidence level:** High and growing. User can handle more complex tasks now.

**Next session approach:**
1. Start by verifying the dev server is running
2. Quick recap of what's built
3. Dive into admin panel parts management (highest priority)
4. Continue step-by-step guidance pattern
5. Celebrate wins along the way

**Token budget for new chat:** Full budget available

**Most important:** Keep the momentum going! User is engaged and making excellent progress.

---

## 🎯 READY TO CONTINUE CHECKLIST

When starting new chat, verify:
- [ ] Dev server running (`npm run dev`)
- [ ] Browser at `localhost:3000`
- [ ] Can access admin at `/admin/login`
- [ ] Catalog works at `/catalog`
- [ ] Quote form works on product pages
- [ ] Supabase connection working

**All systems are GO! Ready to build admin panel!** 🚀

---

**END OF HANDOFF DOCUMENT**