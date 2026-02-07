# Task Manager PWA

A premium Task Management Application built with Next.js, Tailwind CSS, and Zustand.

## Features

- **Task Management**: Create, Read, Update, and Delete tasks.
- **PWA Support**: Installable on mobile and desktop.
- **Dark Mode**: Seamless toggle between light and dark themes.
- **Responsive Design**: Mobile-first approach.
- **Clean Architecture**: Separation of concerns (Domain, Infrastructure, Presentation).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Project Structure

```
src/
├── core/                 # Domain Entities
├── infrastructure/       # API & Database simulation
├── presentation/         # UI Components, Stores, Providers
└── app/                  # Next.js Pages & Routes
```
