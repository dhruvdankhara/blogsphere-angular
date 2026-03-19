# Social Blogging Platform — Complete Frontend Documentation

(Angular + PrimeNG + Medium-Style UI)

This is an extended, detailed documentation covering:

- All possible pages inspired by **Medium.com**
- All routes
- Full layout structure (Public, User, Admin)
- Page purpose
- Page UI components (PrimeNG)
- Data displayed (based on your real schemas)
- All features Medium provides (your platform version)

This is the full, expanded documentation that includes **every possible page Medium has**, adapted to your database and use case.

---

# 1. LAYOUT SYSTEM

---

# A. PublicLayout (Visitors)

**Structure**

- Floating top navbar (always visible)
- Clean single-column reading layout
- Optional right recommendations area

**Navbar includes**

- Logo → Home `/`
- Search bar
- Explore → `/explore`
- Sign In / Sign Up buttons
- If logged in → avatar menu

**Used for routes**

- `/`
- `/blog/:slug`
- `/profile/:username`
- `/category/:slug`
- `/tag/:slug`
- `/member/:username` (Medium has this)
- `/explore`
- `/search`
- `/login`
- `/register`
- `/about`, `/terms`, `/privacy`

---

# B. UserLayout (3-Column, Medium-style, for logged-in users)

**Left Column**

- Home
- Following
- Create
- My Blogs
- Bookmarks
- Notifications
- Profile
- Settings

**Center Column**

- Main reading or feed content

**Right Column**

- Trending blogs
- Suggested writers
- Recommended topics
- Popular tags
- Staff picks

**Used for**

- `/dashboard`
- `/following`
- `/create`
- `/edit/:blogId`
- `/my-blogs`
- `/bookmarks`
- `/notifications`
- `/settings`
- `/me`

---

# C. AdminLayout (2-Column Sidebar)

**Left Column**

- Dashboard
- Manage Users
- Manage Blogs
- Reports System
- Categories
- Tags
- Site Settings

**Right Column**

- Data tables
- Charts
- Forms
- Moderation UI

**Used for**

- `/admin`
- `/admin/users`
- `/admin/blogs`
- `/admin/reports`
- `/admin/categories`
- `/admin/tags`

---

# 2. VISITOR PAGES (All Medium-style Public Pages)

These pages do not require login.

---

# 1. Home

Route: `/`
Layout: PublicLayout

### Shows:

- Latest blogs
- Trending blogs
- “In case you missed it” section
- Popular tags
- Writer suggestions

From Blog model:

- `title`, `featureImage`, `content` preview, `visits`, `slug`, `createdAt`, `isPublic`, `isDraft`, `tags`, `category`

From User model:

- `name`, `avatar`, `username`

---

# 2. Explore

Route: `/explore`
Layout: PublicLayout

### Shows:

- Trending topics
- Tag grid (from `tag` model)
- Category grid (from `category` model)
- Recommended blogs
- Spotlight writers

PrimeNG:

- Cards, Chips, Tag components, Image, Grid layout

---

# 3. Search Page

Route: `/search?q=`
Layout: PublicLayout

### Shows:

- Search results for:
  - Blogs (by title/content)
  - Users (by username/name)
  - Topics (tags/categories)

### Filters:

- Category filter
- Tag filter
- Date sorting
- Most popular

---

# 4. Blog Detail Page

Route: `/blog/:slug`
Layout: PublicLayout (visitor), UserLayout (logged)

### Shows:

- `title`
- `featureImage`
- `content` (PrimeNG editor rendered output)
- `visits`
- `category`
- `tags`
- `author` info
- `createdAt`

### Interactions:

- Like / Unlike (Like model)
- Bookmark / Unbookmark (Bookmark model)
- Follow author (Follow model)
- Comment + Replies (Comment model)
- Report button (Report model)
- Share blog

### Medium-style elements:

- Inline story actions (on left side)
- “Claps” system → in your case Likes
- Table of contents (optional)

---

# 5. Public User Profile

Route: `/profile/:username`
Layout: PublicLayout

### Shows:

- avatar
- name
- username
- bio
- gender
- follower & following count
- user’s published blogs
- user’s tags/topics of interest
- “Follow” button (if not same user)

---

# 6. Category Page

Route: `/category/:slug`
Layout: PublicLayout

### Shows:

- Category banner image
- Category description (`description`, `featureImage`)
- Blogs under that category

---

# 7. Tag Page

Route: `/tag/:slug`
Layout: PublicLayout

### Shows:

- Tag name
- Blogs with that tag
- Related tags

---

# 8. Member Page (Like Medium's membership section)

Route: `/membership`

### Shows:

- Benefits of joining
- Features of platform
- CTA to register/sign in

(Optional but recommended)

---

# 9. About Page

Route: `/about`
Layout: PublicLayout

---

# 10. Terms & Conditions

Route: `/terms`

---

# 11. Privacy Policy

Route: `/privacy`

---

# 12. Contact Page

Route: `/contact`

---

# 13. 404 Not Found

Route: `/**`

---

# 3. LOGGED-IN USER PAGES (Medium-Style Authenticated Area)

These use the full 3-column Medium layout.

---

# 1. Dashboard (Your personalized homepage)

Route: `/dashboard`
Layout: UserLayout

### Shows:

- Personalized feed based on follows
- Recommended blogs
- Recommended tags
- “Writers you might like”
- “Recently bookmarked”

---

# 2. Following Feed

Route: `/following`
Layout: UserLayout

### Shows:

- Blogs from authors user follows (Follow model)
- Sorted by newest or recommended
- Medium-style infinite scroll

---

# 3. Notifications

Route: `/notifications`
Layout: UserLayout

### Shows:

If you add a Notification model:

- Likes on your blog
- New followers
- New comments
- Admin announcements

Notifications displayed in:

- page
- dropdown in navbar

---

# 4. Create Blog

Route: `/create`
Layout: UserLayout

### Fields:

- title
- featureImage
- content (PrimeNG Editor)
- category
- tags
- publish/draft toggle

### Features:

- Auto-save drafts (Blog.isDraft)
- Unsaved changes warning

---

# 5. Edit Blog

Route: `/edit/:blogId`
Layout: UserLayout
Same structure as Create Blog.

---

# 6. My Blogs

Route: `/my-blogs`
Layout: UserLayout

### Sections:

- Published blogs
- Drafts
- Unlisted (if isPublic=false)

### Columns:

- title
- visits
- isPublic
- isDraft
- createdAt

Actions:

- Edit
- Delete
- Publish / Unpublish

---

# 7. Bookmarks

Route: `/bookmarks`
Layout: UserLayout

Shows blogs from Bookmark model.

---

# 8. Reading History

Route: `/history`
(You can store this based on visits timestamps)

Shows past read blogs (optional like Medium)

---

# 9. Stats / Blog Analytics

Route: `/stats`
(Optional)

### Shows:

- total visits (from Blog.visits)
- most viewed posts
- daily read chart
- total likes

---

# 10. Edit Profile

Route: `/settings`
Layout: UserLayout

Fields:

- name
- username
- avatar
- bio
- gender
- password

---

# 11. User Settings - Account

Sub-routes:

- `/settings/account`
- `/settings/profile`
- `/settings/security`
- `/settings/notifications`

---

# 12. Writer Monetization Page (Optional)

Route: `/partner-program`

Displays:

- How to earn
- Writer rewards
- Requirements

---

# 4. ADMIN PAGES (Full Management Area)

These use the 2-column AdminLayout.

---

# 1. Admin Dashboard

Route: `/admin`

### Shows:

- total users
- total blogs
- total reports
- total categories
- total tags
- weekly new users chart
- trending tags

---

# 2. Manage Users

Route: `/admin/users`

Columns:

- name
- username
- email
- role
- gender
- createdAt

Actions:

- Promote/Demote (role)
- Delete
- View user profile
- Suspend (if you add a field)

---

# 3. Manage Blogs

Route: `/admin/blogs`

Columns:

- title
- author
- visits
- isPublic
- isDraft
- createdAt

Actions:

- Force unpublish
- Delete
- View blog

---

# 4. Report Management

Route: `/admin/reports`

Columns from Report model:

- reportedBy
- blogId
- reason
- description
- status
- reviewedBy
- createdAt

Actions:

- Mark as resolved
- Review report
- Delete offending blog
- Ban offending user

---

# 5. Category Management

Route: `/admin/categories`

Fields:

- name
- slug
- description
- featureImage
- createdBy

Actions:

- Create / Edit category
- Delete category

---

# 6. Tag Management

Route: `/admin/tags`

Fields:

- name
- slug

Actions:

- Add new tag
- Update
- Delete

---

# 7. Admin Settings (Optional)

Route: `/admin/settings`

### Contains:

- Featured tags
- Homepage configuration
- Email templates (if needed)
- SEO meta settings

---

# 8. Admin Logs (Optional)

Route: `/admin/logs`

### Shows:

- Post deletions
- Reports handled
- Admin actions

---

# 5. ALL ROUTES SUMMARY (Medium-Enhanced List)

---

## Public

```
/
 /explore
 /search
 /blog/:slug
 /profile/:username
 /category/:slug
 /tag/:slug
 /member/:username
 /about
 /privacy
 /terms
 /contact
 /login
 /register
```

## User

```
/dashboard
/following
/create
/edit/:blogId
/my-blogs
/bookmarks
/history
/notifications
/settings
/settings/profile
/settings/account
/settings/security
/settings/notifications
/me
/stats
```

## Admin

```
/admin
/admin/users
/admin/blogs
/admin/reports
/admin/categories
/admin/tags
/admin/settings
/admin/logs
```

---

# 6. UI COMPONENTS (PrimeNG Mapping)

### Cards

- Blog preview
- Category / Tag cards
- Suggestions

### Editor

- Create/Edit blog

### Table (Admin)

- Users
- Blogs
- Reports
- Categories
- Tags

### Images

- Blog thumbnails
- Avatars
- Category banners

### Chips / Tags

- Blog tag system

### Dialog

- Delete confirmations
- Edit modals
- Report modals

### OverlayPanel

- Notifications dropdown

### Menubar / Toolbar

- Main navigation

### Sidebar

- User left navigation
- Admin menu

---

# 7. Conclusion

This documentation now includes:

- Every important page Medium provides
- All admin pages
- All reader pages
- All writer pages
- All user settings pages
- All public browsing pages
- All meaningful routes
- Exact link between **your models** and **UI screens**
- Full layout architecture

It is complete and scalable for a real production blogging platform.

---

If you want next:

### I can generate:

- Complete Angular folder structure
- Routing module file
- Component structure
- UI wireframes
- API–UI mapping documentation

Tell me what to prepare next.
