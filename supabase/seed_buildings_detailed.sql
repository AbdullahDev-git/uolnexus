-- ============================================
-- Supplementary: EE-1, EE-2, ITC(CS-2) detail data
-- Run after schema.sql + seed.sql (or safely any time)
-- ============================================

ALTER TABLE buildings ADD COLUMN IF NOT EXISTS total_floors TEXT;

-- ============================================
-- 1. Update building metadata
-- ============================================
UPDATE buildings SET total_floors = 'Basement, Ground, 1st, 2nd, 3rd, 4th, 5th, 6th' WHERE code = 'EE1';
UPDATE buildings SET total_floors = 'Basement, Ground, 1st, 2nd, 3rd, 4th, 5th, 6th' WHERE code = 'EE2';
UPDATE buildings SET total_floors = '1st, 2nd, 3rd' WHERE code = 'ITC';

-- ============================================
-- 2. Add unique constraints for idempotency
-- ============================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'departments_name_key') THEN
    ALTER TABLE departments ADD CONSTRAINT departments_name_key UNIQUE (name);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rooms_building_room_key') THEN
    ALTER TABLE rooms ADD CONSTRAINT rooms_building_room_key UNIQUE (room_number, building_id);
  END IF;
END $$;

-- ============================================
-- 3. Insert EE-1 departments
-- ============================================
INSERT INTO departments (name, building_id)
SELECT d.name, b.id FROM (VALUES
  ('Department Of Electrical Engineering')
) AS d(name), buildings b WHERE b.code = 'EE1'
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 4. Insert EE-2 departments
-- ============================================
INSERT INTO departments (name, building_id)
SELECT d.name, b.id FROM (VALUES
  ('Department Of Information measurement'),
  ('Mechanical Engineering'),
  ('Civil Engineering'),
  ('Department Of Physics'),
  ('Mathematics Department'),
  ('Technology Department'),
  ('Allied Health Sciences'),
  ('Chemistry Department'),
  ('IT Department'),
  ('Environmental Department')
) AS d(name), buildings b WHERE b.code = 'EE2'
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 5. Insert ITC(CS-2) departments
-- ============================================
INSERT INTO departments (name, building_id)
SELECT d.name, b.id FROM (VALUES
  ('Department Of Computer Science & Information Technology'),
  ('Department Of Software Engineering'),
  ('Department Of Artificial Intelligence'),
  ('Department Of Data Science'),
  ('Department Of CyberSecurity')
) AS d(name), buildings b WHERE b.code = 'ITC'
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 6. EE-1 Rooms
-- ============================================

-- Ground floor (0)
INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Office Of International Qualifications', 0, 'office', id FROM buildings WHERE code = 'EE1'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Office Of Student Affairs', 0, 'office', id FROM buildings WHERE code = 'EE1'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Basement (-1)
INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Registrate Office', -1, 'office', id FROM buildings WHERE code = 'EE1'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Examination Office', -1, 'office', id FROM buildings WHERE code = 'EE1'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Accounts Office', -1, 'office', id FROM buildings WHERE code = 'EE1'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- First floor (1)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'MOOT Court Room', 1, 'courtroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'LAB-104', 1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'LAB-105', 1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'LAB-106', 1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'LAB-107', 1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Second floor (2)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'EE-1-201', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'EE-1-202', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'EE-1-203', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'EE-1-204', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'LAB-205', 2, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'LAB-206', 2, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Fee Section', 2, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Third floor (3)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'EE-1-301', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'EE-1-302', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'EE-1-303', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'EE-1-304', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'LAB-305', 3, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'LAB-306', 3, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'LAB-307', 3, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'LAB-308', 3, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Fourth floor (4)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Electronic & Embeded System Lab 401', 4, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'RM Scientific LAB 402', 4, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'CE LAB 403', 4, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Class 401', 4, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Class 402', 4, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Class 403', 4, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Class 404', 4, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Fifth floor (5)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'SAP Office', 5, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Innovation Hub', 5, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Office Of Communication', 5, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'FAHS 503', 5, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Data Centre', 5, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Kamyab Jawan', 5, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Sixth floor (6)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'School Of Architecture', 6, 'department', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE1' AND d.name = 'Department Of Electrical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- ============================================
-- 7. EE-2 Rooms
-- ============================================

-- Basement (-1)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Mechanical & Electrical Shops', -1, 'workshop', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Department Of Information measurement', -1, 'department', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Department Of Information measurement'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Product realization workshop B-01', -1, 'workshop', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Electrical & welding shop B-01', -1, 'workshop', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Manufacturing Lab B-02', -1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Mechanics Of Machine Lab B-08', -1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Thermodynamics Lab B-09', -1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Machine Shop B-10', -1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Research & Tech Development Lab B-11', -1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Ground floor (0)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Mechanical Engineering Department', 0, 'department', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Civil Engineering', 0, 'department', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Civil Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- First floor (1)
INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'International Board Room', 1, 'meeting', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Dean Office', 1, 'office', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Civil Engineering Offices', 1, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Civil Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Physics LAB', 1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Department Of Physics'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Chemistry LAB', 1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Chemistry Department'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Mechanical LAB', 1, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Girls Common Room', 1, 'commonroom', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Second floor (2)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Chairman Office', 2, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Robotics, Automation, Control & Engineering LAB 202', 2, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Aerodynamics testing & design LAB 208', 2, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Mechanical Vibration LAB', 2, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Third floor (3)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Civil Office', 3, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Civil Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Mathematics Department Office', 3, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mathematics Department'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Technology Department Office', 3, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Technology Department'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT '302', 3, 'lecture_hall', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT '303', 3, 'lecture_hall', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT '309', 3, 'lecture_hall', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT '310', 3, 'lecture_hall', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Fourth floor (4)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Mathematics Department Office', 4, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mathematics Department'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Technology Department Office', 4, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Technology Department'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Allied Health Sciences Offices', 4, 'office', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Allied Health Sciences'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Pharmacy Board Room', 4, 'board_room', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Mechanics LAB', 4, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT '406', 4, 'lecture_hall', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT '423', 4, 'lecture_hall', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT '424', 4, 'lecture_hall', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Heat & Mass Transfer Climate Coordination Lab 412', 4, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Mechanical Engineering'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Fifth floor (5)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Med Care 503', 5, 'lecture_hall', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Allied Health Sciences'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'IT Lab', 5, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'IT Department'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Sixth floor (6)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'Department Of Physics', 6, 'department', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Department Of Physics'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Department Of Criminology', 6, 'department', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'PASCO LAB 611', 6, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Department Of Physics'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'PASCO LAB 612', 6, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Department Of Physics'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'PASCO LAB 613', 6, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Department Of Physics'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'PASCO LAB 614', 6, 'lab', b.id, d.id FROM buildings b, departments d WHERE b.code = 'EE2' AND d.name = 'Department Of Physics'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Classroom 615', 6, 'classroom', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Classroom 616', 6, 'classroom', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Classroom 617', 6, 'classroom', id FROM buildings WHERE code = 'EE2'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- ============================================
-- 8. ITC(CS-2) Rooms
-- ============================================

-- First floor (1)
INSERT INTO rooms (room_number, floor, room_type, building_id)
SELECT 'Wellbeing', 1, 'office', id FROM buildings WHERE code = 'ITC'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Second floor (2)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 201', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 202', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 203', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 204', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 205', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 206', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 207', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 208', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 209', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 210', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 211', 2, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

-- Third floor (3)
INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 301', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 302', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 303', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 304', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 305', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 306', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 307', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 308', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 309', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 310', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;

INSERT INTO rooms (room_number, floor, room_type, building_id, department_id)
SELECT 'ITC 311', 3, 'classroom', b.id, d.id FROM buildings b, departments d WHERE b.code = 'ITC' AND d.name = 'Department Of Computer Science & Information Technology'
ON CONFLICT (room_number, building_id) DO NOTHING;
