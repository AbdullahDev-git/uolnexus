# UOL Nexus

A campus companion web app for the University of Lahore.

## Features

- **Room Finder** — interactive campus map with building & room search
- **GPA / CGPA Calculator** — with UOL grading scale
- **Teachers Review** — rate and review faculty members
- **Memory Wall** — drop memories on a campus map
- **Cafes & Libraries** — find food spots and libraries on the map
- **Contact** — contact form that saves to Supabase
- **Admin Panel** — approve/reject memories, view contact messages

## Tech Stack

- React 19 + Vite
- Tailwind CSS 4
- Supabase (PostgreSQL + Storage)
- React-Leaflet

## Setup

1. Clone the repo
2. `npm install`
3. Create `.env` (see `.env.example`) with your Supabase URL, anon key, and admin passcode
4. `npm run dev`

## Database

Run the SQL files in `supabase/` in order:
1. `schema.sql`
2. `seed_teachers.sql`
3. `seed_buildings_detailed.sql` (optional building room data)

## Deploy

Build output is `dist`. Deploy on Vercel with the build command `npm run build` and add the three env vars from `.env.example`.
