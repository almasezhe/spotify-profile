# Spotify Profile App

This project is a simple Spotify profile viewer built with **Next.js (App Router)**, **Tailwind CSS**, **shadcn/ui**, and the **Spotify Web API**. It allows users to log in with their Spotify account and view their profile information.

---

## 🚀 Features

- OAuth2 Authentication with Spotify
- Fetch and display user's Spotify profile data
- Modern UI with **shadcn** components
- Tailwind CSS theming with `@theme inline`
- Secure cookie-based token storage (HttpOnly, SameSite)

---

## 📦 Tech Stack

- **Next.js 14+ (App Router)**
- **Tailwind CSS 3.4+**
- **shadcn** (components and theming)
- **Spotify Web API**
- **Axios** for API requests

---

## ⚙️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/almasezhe/spotify-profile.git
cd spotify-profile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Spotify App
- Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Create a new app
- Add Redirect URI:
  ```
  http://127.0.0.1:3000/api/callback
  ```
- Copy your **Client ID** and **Client Secret**

### 4. Create `.env.local`
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_REDIRECT_URI=http://127.0.0.1:3000/api/callback
```

### 5. Run the app
```bash
npm run dev
```

App will be available at:
```
http://127.0.0.1:3000
```

---

## 🔥 Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── login/route.ts
│   │   ├── callback/route.ts
│   │   └── user/route.ts
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/ (shadcn components)
```

