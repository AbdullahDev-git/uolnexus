-- ============================================
-- UOL Nexus Database Schema
-- Run this in Supabase SQL Editor (or via migration)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop all tables in reverse dependency order (safe for re-runs)
DROP TABLE IF EXISTS review_reactions CASCADE;
DROP TABLE IF EXISTS teacher_reviews CASCADE;
DROP TABLE IF EXISTS memories CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS grading_scale CASCADE;

-- 1. BUILDINGS
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  department_category TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  photo_url TEXT,
  distance_from_gate2_km DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ROOMS
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number TEXT NOT NULL,
  floor INTEGER NOT NULL DEFAULT 1,
  room_type TEXT NOT NULL DEFAULT 'classroom',
  capacity INTEGER,
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TEACHERS
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  designation TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TEACHER REVIEWS
CREATE TABLE IF NOT EXISTS teacher_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL DEFAULT 'Anonymous',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  is_reported BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. REVIEW REACTIONS (tracks per-reviewer like/dislike to prevent double-counting)
CREATE TABLE IF NOT EXISTS review_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES teacher_reviews(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  reviewer_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(review_id, reviewer_name, reaction_type)
);

-- 7. GRADING SCALE
CREATE TABLE IF NOT EXISTS grading_scale (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade_letter TEXT NOT NULL UNIQUE,
  min_marks INTEGER NOT NULL,
  max_marks INTEGER NOT NULL,
  grade_points DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. MEMORIES (Memory Wall)
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  submitted_by_name TEXT NOT NULL DEFAULT 'Anonymous',
  likes INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (public read/write, no auth)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_scale ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access to all tables
DROP POLICY IF EXISTS "Allow public read buildings" ON buildings;
CREATE POLICY "Allow public read buildings" ON buildings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read departments" ON departments;
CREATE POLICY "Allow public read departments" ON departments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read rooms" ON rooms;
CREATE POLICY "Allow public read rooms" ON rooms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read teachers" ON teachers;
CREATE POLICY "Allow public read teachers" ON teachers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read teacher_reviews" ON teacher_reviews;
CREATE POLICY "Allow public read teacher_reviews" ON teacher_reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read review_reactions" ON review_reactions;
CREATE POLICY "Allow public read review_reactions" ON review_reactions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read grading_scale" ON grading_scale;
CREATE POLICY "Allow public read grading_scale" ON grading_scale FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read memories" ON memories;
CREATE POLICY "Allow public read memories" ON memories FOR SELECT USING (true);

-- Allow anonymous inserts on teacher_reviews, review_reactions, memories
DROP POLICY IF EXISTS "Allow public insert teacher_reviews" ON teacher_reviews;
CREATE POLICY "Allow public insert teacher_reviews" ON teacher_reviews FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public insert review_reactions" ON review_reactions;
CREATE POLICY "Allow public insert review_reactions" ON review_reactions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public insert memories" ON memories;
CREATE POLICY "Allow public insert memories" ON memories FOR INSERT WITH CHECK (true);

-- Allow anonymous updates on teacher_reviews (for upvote/downvote/report)
DROP POLICY IF EXISTS "Allow public update teacher_reviews" ON teacher_reviews;
CREATE POLICY "Allow public update teacher_reviews" ON teacher_reviews FOR UPDATE USING (true) WITH CHECK (true);

-- Allow anonymous updates on memories (for approving/rejecting + likes)
DROP POLICY IF EXISTS "Allow public update memories" ON memories;
CREATE POLICY "Allow public update memories" ON memories FOR UPDATE USING (true) WITH CHECK (true);

-- Allow anonymous deletes on review_reactions (for toggling likes)
DROP POLICY IF EXISTS "Allow public delete review_reactions" ON review_reactions;
CREATE POLICY "Allow public delete review_reactions" ON review_reactions FOR DELETE USING (true);

-- Allow public read + insert on contact_messages
DROP POLICY IF EXISTS "Allow public read contact_messages" ON contact_messages;
CREATE POLICY "Allow public read contact_messages" ON contact_messages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert contact_messages" ON contact_messages;
CREATE POLICY "Allow public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_teachers_department_id ON teachers(department_id);
CREATE INDEX IF NOT EXISTS idx_teacher_reviews_teacher_id ON teacher_reviews(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_reviews_rating ON teacher_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_review_reactions_review_id ON review_reactions(review_id);
CREATE INDEX IF NOT EXISTS idx_memories_status ON memories(status);
CREATE INDEX IF NOT EXISTS idx_memories_latitude_longitude ON memories(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_rooms_building_id ON rooms(building_id);
CREATE INDEX IF NOT EXISTS idx_departments_building_id ON departments(building_id);

-- ============================================
-- Cafes table
-- ============================================
CREATE TABLE IF NOT EXISTS cafes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read cafes" ON cafes;
CREATE POLICY "Anyone can read cafes"
  ON cafes FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_cafes_latitude_longitude ON cafes(latitude, longitude);

-- ============================================
-- Libraries table
-- ============================================
CREATE TABLE IF NOT EXISTS libraries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE libraries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read libraries" ON libraries;
CREATE POLICY "Anyone can read libraries"
  ON libraries FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_libraries_latitude_longitude ON libraries(latitude, longitude);

-- ============================================
-- Seed data: Cafes
-- ============================================
INSERT INTO cafes (name, latitude, longitude) VALUES ('Food Street', 31.391101377602993, 74.24037570735369);
INSERT INTO cafes (name, latitude, longitude) VALUES ('Basement Cafe', 31.3906845530427, 74.24166208611692);
INSERT INTO cafes (name, latitude, longitude) VALUES ('Sub Uni Cafe', 31.390844521730415, 74.24160464970049);
INSERT INTO cafes (name, latitude, longitude) VALUES ('Nescafe', 31.390365036878382, 74.24099743428373);
INSERT INTO cafes (name, latitude, longitude) VALUES ('Cafe Upstairs', 31.391062287476707, 74.24162250937943);
INSERT INTO cafes (name, latitude, longitude) VALUES ('Main Street Cafe', 31.391394624309115, 74.2403702690465);
INSERT INTO cafes (name, latitude, longitude) VALUES ('X2 Cafe', 31.39208024207315, 74.24289378474262);
INSERT INTO cafes (name, latitude, longitude) VALUES ('Cheezious', 31.39208024207315, 74.24289378474262);
INSERT INTO cafes (name, latitude, longitude) VALUES ('Main Cafeteria', 31.390714227397734, 74.24043432347857);
INSERT INTO cafes (name, latitude, longitude) VALUES ('AHS Cafeteria', 31.391879243764638, 74.24319455046047);
INSERT INTO cafes (name, latitude, longitude) VALUES ('Soca Basement Cafe', 31.392241108117627, 74.24312405053787);
INSERT INTO cafes (name, latitude, longitude) VALUES ('The Lavender Cup', 31.390297910368446, 74.24242524593353);
INSERT INTO cafes (name, latitude, longitude) VALUES ('Whytees ', 31.391025797081955, 74.24209670826917);
INSERT INTO cafes (name, latitude, longitude) VALUES ('Eastern Molly', 31.39121161501705, 74.24194093203094);

-- ============================================
-- Seed data: Libraries
-- ============================================
INSERT INTO libraries (name, latitude, longitude) VALUES ('Medical Library', 31.390765184409023, 74.24087832882502);
INSERT INTO libraries (name, latitude, longitude) VALUES ('LBS Library', 31.390616918155175, 74.24047614018465);
INSERT INTO libraries (name, latitude, longitude) VALUES ('EE-1 Library', 31.391029050732396, 74.24159998576545);
INSERT INTO libraries (name, latitude, longitude) VALUES ('Software Engineering Library', 31.392143607719376, 74.24209514782054);
