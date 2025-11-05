# Synapse-AI – Setup Guide 🚀

Run with Cloud Setup (Recommended)

---

## ✅ Overview

This project uses the following tech stack:

- ⚡ Vite
- 🔷 TypeScript
- 🧭 React Router v7 (imports only from `react-router`)
- ⚛️ React 19
- 🎨 Tailwind CSS v4
- 🧱 Shadcn UI (UI components)
- 🔔 Lucide Icons
- 🔐 Convex (backend + database)
- ✅ Convex Auth (authentication)
- 🎬 Framer Motion (animations)
- 🧊 Three.js (3D models)

📌 All code is inside the `src` directory.  
📦 Package Manager → `pnpm`

✅ Cloud deployment already running  
✅ Convex sandbox enabled  

---

## 🔑 Environment Variables

Frontend:

| Variable | Description |
|---------|-------------|
| `CONVEX_DEPLOYMENT` | Cloud Convex deployment identifier |
| `VITE_CONVEX_URL` | Convex client-side URL |

Backend (Convex dashboard):

- `JWKS`
- `JWT_PRIVATE_KEY`
- `SITE_URL`

> ⚠️ Backend & frontend ENV variables are different.

---

# 🔐 Authentication (Important!)

Auth includes:

✅ Email OTP  
✅ Anonymous login  
✅ Pre-configured session handling  

📌 **Do NOT modify:**
- `src/convex/auth/emailOtp.ts`
- `src/convex/auth.config.ts`
- `src/convex/auth.ts`

---

### ✅ Backend Auth Usage

Inside `src/convex/users.ts`, get current user:

```ts
import { getCurrentUser } from "@/convex/users";
