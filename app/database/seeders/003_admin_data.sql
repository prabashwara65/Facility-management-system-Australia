-- ============================================
-- SEEDER 003: Admin Data
-- ============================================

-- Insert admin user (replace with your actual user)
-- Note: In production, you'd create this via your app's auth system
INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  'Admin User',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- You can add more admin users here
-- INSERT INTO admin_users (id, email, full_name, role) VALUES
--   (gen_random_uuid(), 'staff@example.com', 'Staff User', 'staff');