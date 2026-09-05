-- ============================================
-- SEEDER 003: Admin Data
-- ============================================

-- Insert admin user (replace with your actual user)
-- Note: In production, you'd create this via your app's auth system
INSERT INTO admin_users (id, email, full_name, role, password_hash)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  'Admin User',
  'admin',
  '$2b$10$SSOqEtyo9k6WYZ45v6UGvedSOXnzv1n0m27cDjYfyP4jFKpJkrxjG'
) ON CONFLICT (email) DO NOTHING;

-- Default login after seeding:
-- email: admin@example.com
-- password: admin123

-- You can add more admin users here
-- INSERT INTO admin_users (id, email, full_name, role) VALUES
--   (gen_random_uuid(), 'staff@example.com', 'Staff User', 'staff');
