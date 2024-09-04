# Next.js App Router Course

## Demo Application
- [Preview the application here](next-learn-dashboard-roan.vercel.app)
- Login details
  - user@nextmail.com
  - 123456

### About
- This is a starter template for NextJS' learning platform
- Learn NextJS optimisations through building an invoicing platform
---
### Tools
-  NextJS
-  React
-  Tailwind
-  Vercel
-  PostgreSQL
-  NextAuth
---

### Topics Covered
[Course Curriculum](https://nextjs.org/learn/dashboard-app)
- [x] Chapter 1: Getting started
- [x] Chapter 2: CSS Styling
    - GlobalCSS, Modules, TailwindCSS
- [x] Chapter 3: Font and Image Optimisation
    - `next/font` and `next/image` optimisations  
- [x] Chapter 4: Creating Layouts and Pages
  -  Nested routing, route segments
  -  Partial rendering, using `layout.tsx` files
- [x] Chapter 5: Navigating Between Pages
  - Optimisations with `next/link` compared to `<a>` tags
  -  `usePathname()` hook to show 'active' links
  -  Automatic code-splitting and prefetching
- [x] Chapter 6: Setting Up Your Database
  -  Create a Postgres database
  -  Connect database to `vercel` storage and deployments
  -  Seed database with initial data
- [x] Chapter 7: Fetching Data
  - Database queries
  - Using `React Server Components`
  - Parallel data fetching
- [x] Chapter 8: Static and Dynamic Rendering
  - Static: data fetching happens on server at build time or during revalidation
  - Dynamic: content is rendered on the server for each user at request time
- [x] Chapter 9: Streaming
  - How to implement `loading.tsx` and React's `Suspense`
  - Creating loading skeletons
  - Route groups
- [x] Chapter 10: Partial Prerendering (PPR)
  - Combine: static, dynamic, and stream rendering with PPR.
- [x] Chapter 11: Adding Search and Pagination
  -  NextJS APIs: `useSearchParams`, `usePathname`, `useRouter`
  -  Implementing search & pagination with URL search params
  -  Note: very useful for sharing searches with other users
  -  `useDebounce` for optimising searches
- [x] Chapter 12: Mutating Data [**MVP**]
  - Create, Update, Delete functionality with Postgres
  - `React Server Actions`
  - `formData` best practices
  - `revalidatePath` for client caching
  - Dynamic routing
- [x] Chapter 13: Handling Errors
  -  NextJS's `error.tsx` file for fallback
  -  `notFound` function and `not-found.tsx` file
- [x] Chapter 14: Improving Accessibility
  - `eslint-plugin-jsx-a11y`
  - Server side form validation with `zod`
  - `useActionState` on forms to handle and display errors
  - Using `aria-labels`
- [x] Chapter 15: Adding Authentication
  - Using `NextAuth.js`
  - Creating authorisation middleware
  - Using credential providers for sign-in, sign-out functionality
- [x] Chapter 16: Adding Metadata
  -  Using `metadata` object in NextJS
  -  Static and Dynamic SEO optimisation
