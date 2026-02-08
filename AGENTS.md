# 🤖 AGENTS.md — AI Engineering Operating Manual

This document provides specialized instructions for AI agents working on the **TaskFlow** repository. Follow these conventions to maintain architectural integrity and performance standards.

---

## 🏗️ Architectural Constraints (Clean Architecture)

We strictly follow a layered architecture. Do NOT cross-pollinate layers.

1.  **Core (Domain)**: Pure JavaScript. No framework imports (React, Next, etc.). No I/O.
2.  **Infrastructure**: Handles all external communication. This is the **only** place where `fetch` to external APIs or mock DB interactions should live.
3.  **Presentation**: UI logic only. Components must remain "thin". Data should flow via props or Zustand stores.
4.  **App**: Next.js specifics: Pages, API routes, and **Server Actions**.

---

## 🚀 React 19 & Next.js 15 Standards

When building or refactoring features, you MUST use these patterns:

### 1. Data Fetching (Use Server Components)
- Fetch data in Server Components (`page.js`) and pass the **Promise** to Client Components.
- Use the `use()` hook in Client Components to unwrap the promise.
- **Never** use `useEffect` for initial data fetching.

### 2. Mutations (Server Actions)
- All POST, PUT, DELETE operations MUST go through Server Actions (`"use server"`).
- Use `revalidatePath` inside actions to trigger automatic UI refreshes.
- Avoid manual `router.refresh()` when Server Actions are applicable.

### 3. Optimistic UI
- Implement `useOptimistic` for all task-related mutations.
- Use `useTransition` to keep the UI interactive during server communication.

---

## 🎨 Styling & Component Guidelines

- **Vanilla CSS + Tailwind**: Use the custom variables defined in `src/app/globals.css`.
- **Aesthetics**: Maintain the "Premium/Glassmorphism" look. Use `hover:scale`, `backdrop-blur`, and subtle shadows.
- **Dark Mode**: Use the `dark:` prefix in Tailwind. Do not hardcode colors; use `--background`, `--primary`, etc.
- **i18n**: Never hardcode strings. Always use `t` from `useLanguageStore` and update `src/dictionaries/*.json`.

---

## 🔐 Security & Auth

- **Server-Side Checks**: Authenticate using cookies in Server Components.
- **Tokens**: Use `session_token` cookie for SSR and `localStorage` for client-side persistence if necessary, but prioritize the cookie as the source of truth for redirects.

---

## 🧪 Testing & Quality

- **Unit Tests**: Place in `__tests__` directories near the code.
- **Paths**: Use `@/*` aliases. Never use relative paths like `../../../`.
- **Serialization**: Remember that data passed from Server to Client must be **Plain Objects**. Do not pass Class instances.

---

## 📝 Common pitfalls to avoid

- ❌ Adding business logic directly into `page.js`.
- ❌ Using `useState` for things that can be calculated from props or store state.
- ❌ Hardcoding colors instead of using CSS variables.
- ❌ Forgetting `revalidatePath` in Server Actions, causing the UI to stay stale.

---

*This guide ensures parity between human and AI collaboration. Stay optimized.*
