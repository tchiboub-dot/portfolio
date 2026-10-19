import { getDatabaseClient } from './index.js'

export const DDL_STATEMENTS = [
  // 1. Profile & About
  `CREATE TABLE IF NOT EXISTS portfolio_profile (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    email TEXT NOT NULL,
    github TEXT,
    linkedin TEXT,
    photo TEXT,
    cv_path TEXT,
    availability TEXT,
    about_title TEXT,
    about_subtitle TEXT,
    about_introduction TEXT,
    about_description TEXT,
    about_interests_json TEXT,
    about_languages_json TEXT,
    updated_at TEXT NOT NULL
  );`,

  // 2. Projects
  `CREATE TABLE IF NOT EXISTS portfolio_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT,
    detailed_description TEXT,
    business_value TEXT,
    implementation_notes TEXT,
    features_json TEXT,
    tech_stack_json TEXT,
    github_link TEXT,
    live_link TEXT,
    preview TEXT,
    status TEXT DEFAULT 'Published',
    sort_order INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  `CREATE INDEX IF NOT EXISTS idx_projects_order ON portfolio_projects(sort_order);`,
  `CREATE INDEX IF NOT EXISTS idx_projects_published ON portfolio_projects(is_published);`,

  // 3. Skills
  `CREATE TABLE IF NOT EXISTS portfolio_skills (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    level INTEGER NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  `CREATE INDEX IF NOT EXISTS idx_skills_order ON portfolio_skills(category, sort_order);`,

  // 4. Experience
  `CREATE TABLE IF NOT EXISTS portfolio_experience (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    period TEXT NOT NULL,
    type TEXT,
    achievements_json TEXT,
    is_current INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  `CREATE INDEX IF NOT EXISTS idx_exp_order ON portfolio_experience(sort_order);`,

  // 5. Education
  `CREATE TABLE IF NOT EXISTS portfolio_education (
    id TEXT PRIMARY KEY,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT,
    period TEXT NOT NULL,
    description TEXT,
    highlights_json TEXT,
    key_skills_json TEXT,
    is_current INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  `CREATE INDEX IF NOT EXISTS idx_edu_order ON portfolio_education(sort_order);`,

  // 6. Certifications
  `CREATE TABLE IF NOT EXISTS portfolio_certifications (
    id TEXT PRIMARY KEY,
    image TEXT,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year TEXT NOT NULL,
    summary TEXT,
    verification TEXT,
    skills_json TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  `CREATE INDEX IF NOT EXISTS idx_certs_order ON portfolio_certifications(sort_order);`,

  // 7. Announcements / WIP
  `CREATE TABLE IF NOT EXISTS portfolio_announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    goals_json TEXT,
    technologies_json TEXT,
    progress TEXT,
    roadmap_json TEXT,
    verification TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  `CREATE INDEX IF NOT EXISTS idx_ann_order ON portfolio_announcements(sort_order);`,

  // 8. Technologies
  `CREATE TABLE IF NOT EXISTS portfolio_technologies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color TEXT DEFAULT 'text-cyan-400',
    sort_order INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  // 9. Stats
  `CREATE TABLE IF NOT EXISTS portfolio_stats (
    id TEXT PRIMARY KEY,
    value INTEGER NOT NULL,
    suffix TEXT DEFAULT '',
    label TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,

  // 10. Uploaded Media / Assets Metadata
  `CREATE TABLE IF NOT EXISTS portfolio_media (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    uploaded_by TEXT DEFAULT 'admin',
    created_at TEXT NOT NULL
  );`,

  // 11. Content Revisions (for undo / comparison / restore)
  `CREATE TABLE IF NOT EXISTS content_revisions (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    title TEXT,
    revision_data_json TEXT NOT NULL,
    action TEXT NOT NULL,
    created_by TEXT DEFAULT 'admin',
    created_at TEXT NOT NULL
  );`,

  `CREATE INDEX IF NOT EXISTS idx_revisions_entity ON content_revisions(entity_type, entity_id);`,

  // 12. Audit Logs
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    metadata_json TEXT,
    created_at TEXT NOT NULL
  );`,

  `CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(created_at);`,

  // 13. Visual Theme & Design Studio Configuration
  `CREATE TABLE IF NOT EXISTS portfolio_theme (
    id TEXT PRIMARY KEY,
    primary_color TEXT DEFAULT '#38bdf8',
    secondary_color TEXT DEFAULT '#818cf8',
    accent_color TEXT DEFAULT '#22d3ee',
    bg_color TEXT DEFAULT '#030712',
    card_bg TEXT DEFAULT '#0b1329',
    font_family TEXT DEFAULT 'Inter, sans-serif',
    border_radius TEXT DEFAULT '16px',
    hero_headline TEXT DEFAULT 'Architecting Next-Gen Software & Intelligent Cloud Systems',
    hero_subheadline TEXT DEFAULT 'Engineering clean architectures, high-performance backends, and reactive web experiences with relentless attention to detail.',
    custom_css TEXT,
    updated_at TEXT NOT NULL
  );`,

  // 14. Section Order & Visibility Configuration
  `CREATE TABLE IF NOT EXISTS portfolio_sections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    label TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    is_visible INTEGER DEFAULT 1,
    updated_at TEXT NOT NULL
  );`,

  // 15. Dynamic Custom Pages
  `CREATE TABLE IF NOT EXISTS portfolio_pages (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    is_published INTEGER DEFAULT 1,
    seo_title TEXT,
    seo_description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`
]

let isInitialized = false

export async function initDatabaseSchema() {
  if (isInitialized) return
  const db = getDatabaseClient()

  for (const statement of DDL_STATEMENTS) {
    try {
      await db.execute(statement)
    } catch (err) {
      console.error('Error executing DDL statement:', err.message)
    }
  }

  isInitialized = true
}
