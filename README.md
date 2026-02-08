# 🚀 TaskFlow — High-Performance Task Management

**TaskFlow** is a premium, state-of-the-art Progressive Web Application (PWA) designed for speed, efficiency, and elite user experience. Built on the bleeding edge of **Next.js 15** and **React 19**, it demonstrates advanced architectural patterns and modern web capabilities.

<!-- [IMAGE: A high-quality screenshot showing the Dashboard with Glassmorphism cards, Dark Mode enabled, and the language toggle active] -->

## ✨ Core Features

- **⚡ Instant Feedback (Optimistic UI)**: Leverages React 19's `useOptimistic` for zero-latency task creation and state updates.
- **🌍 Internationalization (i18n)**: Full multi-language support (English/Spanish) with server-side dictionary hydration.
- **🛡️ Server-Side Security**: Secure, cookie-based authentication integrated with Next.js Server Components.
- **🎨 Elite Aesthetics**: Modern UI with smooth transitions, glassmorphic elements, and a seamless Dark/Light mode engine.
- **📱 PWA Ready**: Installable experience with offline capabilities and mobile-optimized responsiveness.
- **🧪 Clean Architecture**: Engineered following Clean Architecture principles for maximum testability and scale.

---

## 🛠️ Installation

Get your development environment up and running in seconds:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rafa-romero-dev/TaskFlow.git
   cd TaskFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Verify the build**
   ```bash
   npm run build
   ```

---

## 📖 Usage

### Authentication
- **Test Credentials**:
  - Email: `test@example.com`
  - Password: `123pass456`

### Task Interactions
- **➕ Create & Edit**: Use the "New Task" button or the edit icon on cards to manage tasks via a validated modal form (powered by Zod).
- **🔄 Quick Status Cycle**: Click directly on a task's status badge (e.g., `📋 To Do`) to cycle it instantly through *To Do* → *In Progress* → *Done*.
- **🗑️ Smart Deletion**: Delete tasks with an optimistic UI update and a safety confirmation modal to prevent accidental data loss.
- **🔍 Advanced Filtering**: Filter your view by status (All, To Do, In Progress, Done) to focus on what matters.
- **📦 Dynamic Grouping**: Organize your dashboard "By Status" to see your workflow in a Kanban-like clear overview.
- **🌓 Theme Engine**: Switch between Light, Dark, or System themes with a single click, featuring smooth CSS transitions.
- **🌐 Language Switcher**: Toggle the entire interface between English and Spanish instantly with persistent settings.

---

## 🏗️ Project Architecture

Our codebase follows a strict **Clean Architecture** to separate concerns and ensure maintainability.

```text
src/
├── app/                  # Next.js Routing, Pages & Server Actions
├── core/                 # Business Logic & Entities (Pure JS)
├── infrastructure/       # Data Persistence & External APIs
├── presentation/         # UI Components, State & CSS
│   ├── components/       # Domain & UI atomic components
│   ├── providers/        # Context & Theme providers
│   └── store/            # Zustand state management
├── dictionaries/         # Localization files (i18n)
└── lib/                  # Shared system utilities
```

| Directory | Purpose | Contents |
| :--- | :--- | :--- |
| **`src/app`** | **Routing & Actions** | Next.js pages, API routes, and Server Actions for data mutations. |
| **`src/presentation`** | **User Interface** | React components, CSS, Zustand stores, and UI providers (Theme, etc). |
| **`src/infrastructure`** | **Data & External** | Repository implementations, API clients, and mock database logic. |
| **`src/core`** | **Business Logic** | Domain entities and pure business rules (Framework independent). |
| **`src/dictionaries`** | **i18n** | Language JSON files for English and Spanish localization. |
| **`src/lib`** | **Shared Utilities** | Reusable helper functions, Tailwind merge logic, and formatting tools. |

---

## ⚙️ Configuration

The project uses `jsconfig.json` for path aliasing to maintain clean imports:
- Use `@/*` to reference the `src/` directory.

### Environment Requirements
- **Node.js**: 18.x or higher
- **React**: 19.x (Canary/Latest)
- **Next.js**: 15.x

---

## ⚖️ License

This project is licensed under the **MIT License**.

---

<!-- [IMAGE: Visual Footer - A mockup of the app on both Desktop and Mobile showing the responsive fluidity] -->

*Built with ❤️ for high-performance productivity.*
