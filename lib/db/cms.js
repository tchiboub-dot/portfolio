import { getDatabaseClient } from './index.js'
import { seedDatabaseIfEmpty } from './seed.js'
import crypto from 'crypto'

/**
 * Assure que le schéma et les données initiales sont en place
 */
async function ensureDbReady() {
  await seedDatabaseIfEmpty()
  return getDatabaseClient()
}

/**
 * Enregistre une révision de contenu
 */
export async function recordRevision(entityType, entityId, title, data, action, user = 'admin') {
  try {
    const db = await ensureDbReady()
    const id = `rev-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
    await db.execute({
      sql: `INSERT INTO content_revisions (
        id, entity_type, entity_id, title, revision_data_json, action, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        entityType,
        entityId,
        title || entityType,
        JSON.stringify(data),
        action,
        user,
        new Date().toISOString(),
      ],
    })
  } catch (err) {
    console.error('Erreur enregistrement révision:', err.message)
  }
}

/**
 * Enregistre un événement dans les logs d'audit
 */
export async function recordAuditLog(eventType, description, ip = null, userAgent = null, metadata = {}) {
  try {
    const db = await ensureDbReady()
    const id = `audit-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
    await db.execute({
      sql: `INSERT INTO audit_logs (
        id, event_type, description, ip_address, user_agent, metadata_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        eventType,
        description,
        ip,
        userAgent,
        JSON.stringify(metadata),
        new Date().toISOString(),
      ],
    })
  } catch (err) {
    console.error('Erreur audit log:', err.message)
  }
}

// ============================================================================
// LECTURE DU CONTENU PUBLIC (Uniquement contenu publié)
// ============================================================================

export async function getPublicPortfolioContent() {
  const db = await ensureDbReady()

  // 1. Profile
  const profileRes = await db.execute('SELECT * FROM portfolio_profile LIMIT 1')
  const rawProfile = profileRes.rows[0] || {}
  const profile = {
    name: rawProfile.name || '',
    title: rawProfile.title || '',
    email: rawProfile.email || '',
    github: rawProfile.github || '',
    linkedin: rawProfile.linkedin || '',
    photo: rawProfile.photo || '/photo-profil.jpg',
    cvPath: rawProfile.cv_path || '/cv-taha-adnane-chiboub.pdf',
    availability: rawProfile.availability || '',
    aboutTitle: rawProfile.about_title || 'About Me',
    aboutSubtitle: rawProfile.about_subtitle || '',
    aboutIntroduction: rawProfile.about_introduction || '',
    aboutDescription: rawProfile.about_description || '',
    interests: JSON.parse(rawProfile.about_interests_json || '[]'),
    languages: JSON.parse(rawProfile.about_languages_json || '[]'),
  }

  // 2. Projects (published only, ordered)
  const projectsRes = await db.execute(
    'SELECT * FROM portfolio_projects WHERE is_published = 1 ORDER BY sort_order ASC, created_at DESC'
  )
  const projects = projectsRes.rows.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    summary: p.summary,
    detailedDescription: p.detailed_description,
    businessValue: p.business_value,
    implementationNotes: p.implementation_notes,
    features: JSON.parse(p.features_json || '[]'),
    techStack: JSON.parse(p.tech_stack_json || '[]'),
    githubLink: p.github_link,
    liveLink: p.live_link,
    preview: p.preview,
    status: p.status,
    isFeatured: Boolean(p.is_featured),
    sortOrder: p.sort_order,
  }))

  // 3. Skills
  const skillsRes = await db.execute(
    'SELECT * FROM portfolio_skills WHERE is_published = 1 ORDER BY category ASC, sort_order ASC'
  )
  // Group by category
  const categoriesMap = {}
  for (const s of skillsRes.rows) {
    if (!categoriesMap[s.category]) {
      categoriesMap[s.category] = []
    }
    categoriesMap[s.category].push({
      id: s.id,
      name: s.name,
      level: s.level,
      sortOrder: s.sort_order,
    })
  }
  const skillsCategories = Object.keys(categoriesMap).map((cat) => ({
    title: cat,
    skills: categoriesMap[cat],
  }))

  // 4. Experience
  const expRes = await db.execute(
    'SELECT * FROM portfolio_experience WHERE is_published = 1 ORDER BY sort_order ASC, created_at DESC'
  )
  const experience = expRes.rows.map((e) => ({
    id: e.id,
    title: e.title,
    company: e.company,
    location: e.location,
    period: e.period,
    type: e.type,
    achievements: JSON.parse(e.achievements_json || '[]'),
    current: Boolean(e.is_current),
    sortOrder: e.sort_order,
  }))

  // 5. Education
  const eduRes = await db.execute(
    'SELECT * FROM portfolio_education WHERE is_published = 1 ORDER BY sort_order ASC, created_at DESC'
  )
  const education = eduRes.rows.map((e) => ({
    id: e.id,
    degree: e.degree,
    institution: e.institution,
    location: e.location,
    period: e.period,
    description: e.description,
    highlights: JSON.parse(e.highlights_json || '[]'),
    keySkillsDeveloped: JSON.parse(e.key_skills_json || '[]'),
    current: Boolean(e.is_current),
    sortOrder: e.sort_order,
  }))

  // 6. Certifications
  const certsRes = await db.execute(
    'SELECT * FROM portfolio_certifications WHERE is_published = 1 ORDER BY sort_order ASC, created_at DESC'
  )
  const certifications = certsRes.rows.map((c) => ({
    id: c.id,
    image: c.image,
    title: c.title,
    issuer: c.issuer,
    year: c.year,
    summary: c.summary,
    verification: c.verification,
    skills: JSON.parse(c.skills_json || '[]'),
    description: c.description,
    sortOrder: c.sort_order,
  }))

  // 7. Announcements
  const annRes = await db.execute(
    'SELECT * FROM portfolio_announcements WHERE is_published = 1 ORDER BY sort_order ASC, created_at DESC'
  )
  const announcements = annRes.rows.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    description: a.description,
    status: a.status,
    goals: JSON.parse(a.goals_json || '[]'),
    technologies: JSON.parse(a.technologies_json || '[]'),
    progress: a.progress,
    roadmap: JSON.parse(a.roadmap_json || '[]'),
    verification: a.verification,
    sortOrder: a.sort_order,
  }))

  // 8. Technologies
  const techRes = await db.execute(
    'SELECT * FROM portfolio_technologies WHERE is_published = 1 ORDER BY sort_order ASC'
  )
  const technologies = techRes.rows.map((t) => ({
    id: t.id,
    name: t.name,
    iconName: t.icon_name,
    color: t.color,
    sortOrder: t.sort_order,
  }))

  // 9. Stats
  const statsRes = await db.execute(
    'SELECT * FROM portfolio_stats WHERE is_published = 1 ORDER BY sort_order ASC'
  )
  const stats = statsRes.rows.map((s) => ({
    id: s.id,
    value: s.value,
    suffix: s.suffix,
    label: s.label,
    sortOrder: s.sort_order,
  }))

  // 10. Theme Configuration
  const themeRes = await db.execute('SELECT * FROM portfolio_theme LIMIT 1')
  const rawTheme = themeRes.rows[0] || {}
  const theme = {
    primaryColor: rawTheme.primary_color || '#38bdf8',
    secondaryColor: rawTheme.secondary_color || '#818cf8',
    accentColor: rawTheme.accent_color || '#22d3ee',
    bgColor: rawTheme.bg_color || '#030712',
    cardBg: rawTheme.card_bg || '#0b1329',
    fontFamily: rawTheme.font_family || 'Inter, sans-serif',
    borderRadius: rawTheme.border_radius || '16px',
    heroHeadline: rawTheme.hero_headline || 'Architecting Next-Gen Software & Intelligent Cloud Systems',
    heroSubheadline: rawTheme.hero_subheadline || 'Engineering clean architectures, high-performance backends, and reactive web experiences with relentless attention to detail.',
    customCss: rawTheme.custom_css || '',
  }

  // 11. Sections Order & Visibility
  const sectionsRes = await db.execute('SELECT * FROM portfolio_sections ORDER BY sort_order ASC')
  const sections = sectionsRes.rows.map((s) => ({
    id: s.id,
    name: s.name,
    label: s.label,
    sortOrder: s.sort_order,
    isVisible: Boolean(s.is_visible),
  }))

  // 12. Custom Pages
  const pagesRes = await db.execute('SELECT * FROM portfolio_pages WHERE is_published = 1 ORDER BY created_at DESC')
  const pages = pagesRes.rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    contentMarkdown: p.content_markdown,
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
  }))

  return {
    profile,
    projects,
    skillsCategories,
    experience,
    education,
    certifications,
    announcements,
    technologies,
    stats,
    theme,
    sections,
    pages,
  }
}

// ============================================================================
// LECTURE COMPLÈTE ADMIN (Publiés + Brouillons + Métadonnées)
// ============================================================================

export async function getAdminPortfolioData() {
  const db = await ensureDbReady()

  const [
    profileRes,
    projectsRes,
    skillsRes,
    expRes,
    eduRes,
    certsRes,
    annRes,
    techRes,
    statsRes,
    mediaRes,
    revsRes,
    auditRes,
  ] = await Promise.all([
    db.execute('SELECT * FROM portfolio_profile LIMIT 1'),
    db.execute('SELECT * FROM portfolio_projects ORDER BY sort_order ASC, created_at DESC'),
    db.execute('SELECT * FROM portfolio_skills ORDER BY category ASC, sort_order ASC'),
    db.execute('SELECT * FROM portfolio_experience ORDER BY sort_order ASC, created_at DESC'),
    db.execute('SELECT * FROM portfolio_education ORDER BY sort_order ASC, created_at DESC'),
    db.execute('SELECT * FROM portfolio_certifications ORDER BY sort_order ASC, created_at DESC'),
    db.execute('SELECT * FROM portfolio_announcements ORDER BY sort_order ASC, created_at DESC'),
    db.execute('SELECT * FROM portfolio_technologies ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_stats ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_media ORDER BY created_at DESC LIMIT 50'),
    db.execute('SELECT * FROM content_revisions ORDER BY created_at DESC LIMIT 50'),
    db.execute('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50'),
  ])

  const rawP = profileRes.rows[0] || {}
  const profile = {
    id: rawP.id || 'main-profile',
    name: rawP.name || '',
    title: rawP.title || '',
    email: rawP.email || '',
    github: rawP.github || '',
    linkedin: rawP.linkedin || '',
    photo: rawP.photo || '',
    cvPath: rawP.cv_path || '',
    availability: rawP.availability || '',
    aboutTitle: rawP.about_title || '',
    aboutSubtitle: rawP.about_subtitle || '',
    aboutIntroduction: rawP.about_introduction || '',
    aboutDescription: rawP.about_description || '',
    interests: JSON.parse(rawP.about_interests_json || '[]'),
    languages: JSON.parse(rawP.about_languages_json || '[]'),
    updatedAt: rawP.updated_at,
  }

  const projects = projectsRes.rows.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    summary: p.summary,
    detailedDescription: p.detailed_description,
    businessValue: p.business_value,
    implementationNotes: p.implementation_notes,
    features: JSON.parse(p.features_json || '[]'),
    techStack: JSON.parse(p.tech_stack_json || '[]'),
    githubLink: p.github_link,
    liveLink: p.live_link,
    preview: p.preview,
    status: p.status,
    sortOrder: p.sort_order,
    isFeatured: Boolean(p.is_featured),
    isPublished: Boolean(p.is_published),
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }))

  const skills = skillsRes.rows.map((s) => ({
    id: s.id,
    category: s.category,
    name: s.name,
    level: s.level,
    sortOrder: s.sort_order,
    isPublished: Boolean(s.is_published),
  }))

  const experience = expRes.rows.map((e) => ({
    id: e.id,
    title: e.title,
    company: e.company,
    location: e.location,
    period: e.period,
    type: e.type,
    achievements: JSON.parse(e.achievements_json || '[]'),
    isCurrent: Boolean(e.is_current),
    sortOrder: e.sort_order,
    isPublished: Boolean(e.is_published),
  }))

  const education = eduRes.rows.map((e) => ({
    id: e.id,
    degree: e.degree,
    institution: e.institution,
    location: e.location,
    period: e.period,
    description: e.description,
    highlights: JSON.parse(e.highlights_json || '[]'),
    keySkillsDeveloped: JSON.parse(e.key_skills_json || '[]'),
    isCurrent: Boolean(e.is_current),
    sortOrder: e.sort_order,
    isPublished: Boolean(e.is_published),
  }))

  const certifications = certsRes.rows.map((c) => ({
    id: c.id,
    image: c.image,
    title: c.title,
    issuer: c.issuer,
    year: c.year,
    summary: c.summary,
    verification: c.verification,
    skills: JSON.parse(c.skills_json || '[]'),
    description: c.description,
    sortOrder: c.sort_order,
    isPublished: Boolean(c.is_published),
  }))

  const announcements = annRes.rows.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    description: a.description,
    status: a.status,
    goals: JSON.parse(a.goals_json || '[]'),
    technologies: JSON.parse(a.technologies_json || '[]'),
    progress: a.progress,
    roadmap: JSON.parse(a.roadmap_json || '[]'),
    verification: a.verification,
    sortOrder: a.sort_order,
    isPublished: Boolean(a.is_published),
  }))

  const technologies = techRes.rows.map((t) => ({
    id: t.id,
    name: t.name,
    iconName: t.icon_name,
    color: t.color,
    sortOrder: t.sort_order,
    isPublished: Boolean(t.is_published),
  }))

  const stats = statsRes.rows.map((s) => ({
    id: s.id,
    value: s.value,
    suffix: s.suffix,
    label: s.label,
    sortOrder: s.sort_order,
    isPublished: Boolean(s.is_published),
  }))

  const media = mediaRes.rows
  const revisions = revsRes.rows.map((r) => ({
    id: r.id,
    entityType: r.entity_type,
    entityId: r.entity_id,
    title: r.title,
    data: JSON.parse(r.revision_data_json || '{}'),
    action: r.action,
    createdBy: r.created_by,
    createdAt: r.created_at,
  }))
  const auditLogs = auditRes.rows.map((a) => ({
    id: a.id,
    eventType: a.event_type,
    description: a.description,
    ip: a.ip_address,
    userAgent: a.user_agent,
    metadata: JSON.parse(a.metadata_json || '{}'),
    createdAt: a.created_at,
  }))

  // Theme, sections, and pages
  const themeRes = await db.execute('SELECT * FROM portfolio_theme LIMIT 1')
  const rawTheme = themeRes.rows[0] || {}
  const theme = {
    primaryColor: rawTheme.primary_color || '#38bdf8',
    secondaryColor: rawTheme.secondary_color || '#818cf8',
    accentColor: rawTheme.accent_color || '#22d3ee',
    bgColor: rawTheme.bg_color || '#030712',
    cardBg: rawTheme.card_bg || '#0b1329',
    fontFamily: rawTheme.font_family || 'Inter, sans-serif',
    borderRadius: rawTheme.border_radius || '16px',
    heroHeadline: rawTheme.hero_headline || 'Architecting Next-Gen Software & Intelligent Cloud Systems',
    heroSubheadline: rawTheme.hero_subheadline || 'Engineering clean architectures, high-performance backends, and reactive web experiences with relentless attention to detail.',
    customCss: rawTheme.custom_css || '',
  }

  const sectionsRes = await db.execute('SELECT * FROM portfolio_sections ORDER BY sort_order ASC')
  const sections = sectionsRes.rows.map((s) => ({
    id: s.id,
    name: s.name,
    label: s.label,
    sortOrder: s.sort_order,
    isVisible: Boolean(s.is_visible),
  }))

  const pagesRes = await db.execute('SELECT * FROM portfolio_pages ORDER BY created_at DESC')
  const pages = pagesRes.rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    contentMarkdown: p.content_markdown,
    isPublished: Boolean(p.is_published),
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }))

  return {
    profile,
    projects,
    skills,
    experience,
    education,
    certifications,
    announcements,
    technologies,
    stats,
    media,
    revisions,
    auditLogs,
    theme,
    sections,
    pages,
  }
}

// ============================================================================
// OPÉRATIONS MUTATION CMS
// ============================================================================

export async function updateProfile(data, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()

  // Enregistrer révision préalable
  const current = await db.execute('SELECT * FROM portfolio_profile LIMIT 1')
  const prev = current.rows[0] || {}
  if (current.rows[0]) {
    await recordRevision('profile', 'main-profile', 'Profile Update', current.rows[0], 'update', user)
  }

  const name = data.name !== undefined ? data.name : (prev.name || '')
  const title = data.title !== undefined ? data.title : (prev.title || '')
  const email = data.email !== undefined ? data.email : (prev.email || '')
  const github = data.github !== undefined ? data.github : (prev.github || '')
  const linkedin = data.linkedin !== undefined ? data.linkedin : (prev.linkedin || '')
  const photo = data.photo !== undefined ? data.photo : (prev.photo || '/photo-profil.jpg')
  const cvPath = data.cvPath !== undefined ? data.cvPath : (prev.cv_path || '/cv-taha-adnane-chiboub.pdf')
  const availability = data.availability !== undefined ? data.availability : (prev.availability || '')
  const aboutTitle = data.aboutTitle !== undefined ? data.aboutTitle : (prev.about_title || 'About Me')
  const aboutSubtitle = data.aboutSubtitle !== undefined ? data.aboutSubtitle : (prev.about_subtitle || '')
  const aboutIntroduction = data.aboutIntroduction !== undefined ? data.aboutIntroduction : (prev.about_introduction || '')
  const aboutDescription = data.aboutDescription !== undefined ? data.aboutDescription : (prev.about_description || '')
  const interestsJson = data.interests !== undefined ? JSON.stringify(data.interests) : (prev.about_interests_json || '[]')
  const languagesJson = data.languages !== undefined ? JSON.stringify(data.languages) : (prev.about_languages_json || '[]')

  await db.execute({
    sql: `UPDATE portfolio_profile SET
      name = ?, title = ?, email = ?, github = ?, linkedin = ?, photo = ?,
      cv_path = ?, availability = ?, about_title = ?, about_subtitle = ?,
      about_introduction = ?, about_description = ?, about_interests_json = ?,
      about_languages_json = ?, updated_at = ?
    WHERE id = 'main-profile'`,
    args: [
      name ?? '',
      title ?? '',
      email ?? '',
      github ?? '',
      linkedin ?? '',
      photo ?? '',
      cvPath ?? '',
      availability ?? '',
      aboutTitle ?? '',
      aboutSubtitle ?? '',
      aboutIntroduction ?? '',
      aboutDescription ?? '',
      interestsJson,
      languagesJson,
      now,
    ],
  })

  await recordAuditLog('profile_updated', `Profil mis à jour par ${user}`)
  return { success: true }
}

export async function saveProject(project, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()
  const id = project.id || `proj-${Date.now()}`

  // Sauvegarder révision
  const existing = await db.execute({
    sql: 'SELECT * FROM portfolio_projects WHERE id = ?',
    args: [id],
  })

  if (existing.rows[0]) {
    await recordRevision('project', id, project.title, existing.rows[0], 'update', user)
    await db.execute({
      sql: `UPDATE portfolio_projects SET
        title = ?, category = ?, summary = ?, detailed_description = ?,
        business_value = ?, implementation_notes = ?, features_json = ?,
        tech_stack_json = ?, github_link = ?, live_link = ?, preview = ?,
        status = ?, sort_order = ?, is_featured = ?, is_published = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        project.title || '',
        project.category || 'Web Apps',
        project.summary ?? '',
        project.detailedDescription ?? '',
        project.businessValue ?? '',
        project.implementationNotes ?? '',
        JSON.stringify(project.features || []),
        JSON.stringify(project.techStack || []),
        project.githubLink ?? '',
        project.liveLink ?? '',
        project.preview ?? '',
        project.status || 'Published',
        Number(project.sortOrder || 0),
        project.isFeatured ? 1 : 0,
        project.isPublished ? 1 : 0,
        now,
        id,
      ],
    })
    await recordAuditLog('project_updated', `Projet "${project.title}" mis à jour`)
  } else {
    await db.execute({
      sql: `INSERT INTO portfolio_projects (
        id, title, category, summary, detailed_description, business_value,
        implementation_notes, features_json, tech_stack_json, github_link,
        live_link, preview, status, sort_order, is_featured, is_published,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        project.title || '',
        project.category || 'Web Apps',
        project.summary || '',
        project.detailedDescription || '',
        project.businessValue || '',
        project.implementationNotes || '',
        JSON.stringify(project.features || []),
        JSON.stringify(project.techStack || []),
        project.githubLink || null,
        project.liveLink || null,
        project.preview || null,
        project.status || 'Published',
        Number(project.sortOrder || 0),
        project.isFeatured ? 1 : 0,
        project.isPublished ? 1 : 0,
        now,
        now,
      ],
    })
    await recordRevision('project', id, project.title, project, 'create', user)
    await recordAuditLog('project_created', `Nouveau projet créé: "${project.title}"`)
  }

  return { success: true, id }
}

export async function deleteProject(id, user = 'admin') {
  const db = await ensureDbReady()
  const existing = await db.execute({
    sql: 'SELECT * FROM portfolio_projects WHERE id = ?',
    args: [id],
  })

  if (existing.rows[0]) {
    await recordRevision('project', id, existing.rows[0].title, existing.rows[0], 'delete', user)
    await db.execute({
      sql: 'DELETE FROM portfolio_projects WHERE id = ?',
      args: [id],
    })
    await recordAuditLog('project_deleted', `Projet supprimé: ${id}`)
    return { success: true }
  }

  return { success: false, message: 'Projet introuvable' }
}

export async function reorderItems(tableName, orderedIds) {
  const db = await ensureDbReady()
  const validTables = [
    'portfolio_projects',
    'portfolio_skills',
    'portfolio_experience',
    'portfolio_education',
    'portfolio_certifications',
    'portfolio_announcements',
    'portfolio_technologies',
    'portfolio_stats',
  ]

  if (!validTables.includes(tableName)) {
    throw new Error('Table invalide pour le réordonnancement')
  }

  for (let i = 0; i < orderedIds.length; i++) {
    await db.execute({
      sql: `UPDATE ${tableName} SET sort_order = ? WHERE id = ?`,
      args: [i + 1, orderedIds[i]],
    })
  }

  await recordAuditLog('items_reordered', `Ordre mis à jour sur ${tableName}`)
  return { success: true }
}

export async function saveSkill(skill, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()
  const id = skill.id || `skill-${Date.now()}`

  const existing = await db.execute({
    sql: 'SELECT * FROM portfolio_skills WHERE id = ?',
    args: [id],
  })

  if (existing.rows[0]) {
    await recordRevision('skill', id, skill.name, existing.rows[0], 'update', user)
    await db.execute({
      sql: `UPDATE portfolio_skills SET
        category = ?, name = ?, level = ?, sort_order = ?, is_published = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        skill.category,
        skill.name,
        Number(skill.level),
        Number(skill.sortOrder || 0),
        skill.isPublished ? 1 : 0,
        now,
        id,
      ],
    })
  } else {
    await db.execute({
      sql: `INSERT INTO portfolio_skills (
        id, category, name, level, sort_order, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        skill.category,
        skill.name,
        Number(skill.level),
        Number(skill.sortOrder || 0),
        skill.isPublished ? 1 : 0,
        now,
        now,
      ],
    })
  }

  return { success: true, id }
}

export async function deleteSkill(id) {
  const db = await ensureDbReady()
  await db.execute({ sql: 'DELETE FROM portfolio_skills WHERE id = ?', args: [id] })
  return { success: true }
}

export async function saveCertification(cert, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()
  const id = cert.id || `cert-${Date.now()}`

  const existing = await db.execute({
    sql: 'SELECT * FROM portfolio_certifications WHERE id = ?',
    args: [id],
  })

  if (existing.rows[0]) {
    await recordRevision('certification', id, cert.title, existing.rows[0], 'update', user)
    await db.execute({
      sql: `UPDATE portfolio_certifications SET
        image = ?, title = ?, issuer = ?, year = ?, summary = ?,
        verification = ?, skills_json = ?, description = ?,
        sort_order = ?, is_published = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        cert.image,
        cert.title,
        cert.issuer,
        cert.year,
        cert.summary,
        cert.verification,
        JSON.stringify(cert.skills || []),
        cert.description,
        Number(cert.sortOrder || 0),
        cert.isPublished ? 1 : 0,
        now,
        id,
      ],
    })
  } else {
    await db.execute({
      sql: `INSERT INTO portfolio_certifications (
        id, image, title, issuer, year, summary, verification,
        skills_json, description, sort_order, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        cert.image,
        cert.title,
        cert.issuer,
        cert.year,
        cert.summary,
        cert.verification,
        JSON.stringify(cert.skills || []),
        cert.description,
        Number(cert.sortOrder || 0),
        cert.isPublished ? 1 : 0,
        now,
        now,
      ],
    })
  }

  return { success: true, id }
}

export async function deleteCertification(id) {
  const db = await ensureDbReady()
  await db.execute({ sql: 'DELETE FROM portfolio_certifications WHERE id = ?', args: [id] })
  return { success: true }
}

export async function saveAnnouncement(ann, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()
  const id = ann.id || `ann-${Date.now()}`

  const existing = await db.execute({
    sql: 'SELECT * FROM portfolio_announcements WHERE id = ?',
    args: [id],
  })

  if (existing.rows[0]) {
    await recordRevision('announcement', id, ann.title, existing.rows[0], 'update', user)
    await db.execute({
      sql: `UPDATE portfolio_announcements SET
        title = ?, category = ?, description = ?, status = ?,
        goals_json = ?, technologies_json = ?, progress = ?,
        roadmap_json = ?, verification = ?, sort_order = ?,
        is_published = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        ann.title,
        ann.category,
        ann.description,
        ann.status,
        JSON.stringify(ann.goals || []),
        JSON.stringify(ann.technologies || []),
        ann.progress,
        JSON.stringify(ann.roadmap || []),
        ann.verification,
        Number(ann.sortOrder || 0),
        ann.isPublished ? 1 : 0,
        now,
        id,
      ],
    })
  } else {
    await db.execute({
      sql: `INSERT INTO portfolio_announcements (
        id, title, category, description, status, goals_json,
        technologies_json, progress, roadmap_json, verification,
        sort_order, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        ann.title,
        ann.category,
        ann.description,
        ann.status,
        JSON.stringify(ann.goals || []),
        JSON.stringify(ann.technologies || []),
        ann.progress,
        JSON.stringify(ann.roadmap || []),
        ann.verification,
        Number(ann.sortOrder || 0),
        ann.isPublished ? 1 : 0,
        now,
        now,
      ],
    })
  }

  return { success: true, id }
}

export async function deleteAnnouncement(id) {
  const db = await ensureDbReady()
  await db.execute({ sql: 'DELETE FROM portfolio_announcements WHERE id = ?', args: [id] })
  return { success: true }
}

export async function saveExperience(exp, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()
  const id = exp.id || `exp-${Date.now()}`

  const existing = await db.execute({
    sql: 'SELECT * FROM portfolio_experience WHERE id = ?',
    args: [id],
  })

  if (existing.rows[0]) {
    await recordRevision('experience', id, exp.title, existing.rows[0], 'update', user)
    await db.execute({
      sql: `UPDATE portfolio_experience SET
        title = ?, company = ?, location = ?, period = ?, type = ?,
        achievements_json = ?, is_current = ?, sort_order = ?,
        is_published = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        exp.title,
        exp.company,
        exp.location,
        exp.period,
        exp.type,
        JSON.stringify(exp.achievements || []),
        exp.isCurrent ? 1 : 0,
        Number(exp.sortOrder || 0),
        exp.isPublished ? 1 : 0,
        now,
        id,
      ],
    })
  } else {
    await db.execute({
      sql: `INSERT INTO portfolio_experience (
        id, title, company, location, period, type, achievements_json,
        is_current, sort_order, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        exp.title,
        exp.company,
        exp.location,
        exp.period,
        exp.type,
        JSON.stringify(exp.achievements || []),
        exp.isCurrent ? 1 : 0,
        Number(exp.sortOrder || 0),
        exp.isPublished ? 1 : 0,
        now,
        now,
      ],
    })
  }

  return { success: true, id }
}

export async function deleteExperience(id) {
  const db = await ensureDbReady()
  await db.execute({ sql: 'DELETE FROM portfolio_experience WHERE id = ?', args: [id] })
  return { success: true }
}

export async function saveEducation(edu, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()
  const id = edu.id || `edu-${Date.now()}`

  const existing = await db.execute({
    sql: 'SELECT * FROM portfolio_education WHERE id = ?',
    args: [id],
  })

  if (existing.rows[0]) {
    await recordRevision('education', id, edu.degree, existing.rows[0], 'update', user)
    await db.execute({
      sql: `UPDATE portfolio_education SET
        degree = ?, institution = ?, location = ?, period = ?,
        description = ?, highlights_json = ?, key_skills_json = ?,
        is_current = ?, sort_order = ?, is_published = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        edu.degree,
        edu.institution,
        edu.location,
        edu.period,
        edu.description,
        JSON.stringify(edu.highlights || []),
        JSON.stringify(edu.keySkillsDeveloped || []),
        edu.isCurrent ? 1 : 0,
        Number(edu.sortOrder || 0),
        edu.isPublished ? 1 : 0,
        now,
        id,
      ],
    })
  } else {
    await db.execute({
      sql: `INSERT INTO portfolio_education (
        id, degree, institution, location, period, description,
        highlights_json, key_skills_json, is_current, sort_order,
        is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        edu.degree,
        edu.institution,
        edu.location,
        edu.period,
        edu.description,
        JSON.stringify(edu.highlights || []),
        JSON.stringify(edu.keySkillsDeveloped || []),
        edu.isCurrent ? 1 : 0,
        Number(edu.sortOrder || 0),
        edu.isPublished ? 1 : 0,
        now,
        now,
      ],
    })
  }

  return { success: true, id }
}

export async function deleteEducation(id) {
  const db = await ensureDbReady()
  await db.execute({ sql: 'DELETE FROM portfolio_education WHERE id = ?', args: [id] })
  return { success: true }
}

export async function saveStat(stat, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()
  const id = stat.id || `stat-${Date.now()}`

  const existing = await db.execute({
    sql: 'SELECT * FROM portfolio_stats WHERE id = ?',
    args: [id],
  })

  if (existing.rows[0]) {
    await db.execute({
      sql: `UPDATE portfolio_stats SET
        value = ?, suffix = ?, label = ?, sort_order = ?, is_published = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        Number(stat.value),
        stat.suffix || '',
        stat.label,
        Number(stat.sortOrder || 0),
        stat.isPublished ? 1 : 0,
        now,
        id,
      ],
    })
  } else {
    await db.execute({
      sql: `INSERT INTO portfolio_stats (
        id, value, suffix, label, sort_order, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        Number(stat.value),
        stat.suffix || '',
        stat.label,
        Number(stat.sortOrder || 0),
        stat.isPublished ? 1 : 0,
        now,
        now,
      ],
    })
  }

  return { success: true, id }
}

export async function deleteStat(id) {
  const db = await ensureDbReady()
  await db.execute({ sql: 'DELETE FROM portfolio_stats WHERE id = ?', args: [id] })
  return { success: true }
}

// ============================================================================
// MUTATIONS THEME, SECTIONS & PAGES DYNAMIQUES
// ============================================================================

export async function updateTheme(themeData, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()

  await db.execute({
    sql: `UPDATE portfolio_theme SET
      primary_color = ?, secondary_color = ?, accent_color = ?,
      bg_color = ?, card_bg = ?, font_family = ?, border_radius = ?,
      hero_headline = ?, hero_subheadline = ?, custom_css = ?, updated_at = ?
    WHERE id = 'main-theme'`,
    args: [
      themeData.primaryColor || '#38bdf8',
      themeData.secondaryColor || '#818cf8',
      themeData.accentColor || '#22d3ee',
      themeData.bgColor || '#030712',
      themeData.cardBg || '#0b1329',
      themeData.fontFamily || 'Inter, sans-serif',
      themeData.borderRadius || '16px',
      themeData.heroHeadline || '',
      themeData.heroSubheadline || '',
      themeData.customCss || '',
      now,
    ],
  })

  await recordAuditLog('theme_updated', `Thème et Design Studio modifiés par ${user}`)
  return { success: true }
}

export async function updateSectionsOrderAndVisibility(sectionsList, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()

  for (let i = 0; i < sectionsList.length; i++) {
    const sec = sectionsList[i]
    await db.execute({
      sql: `UPDATE portfolio_sections SET sort_order = ?, is_visible = ?, updated_at = ? WHERE id = ?`,
      args: [i + 1, sec.isVisible ? 1 : 0, now, sec.id],
    })
  }

  await recordAuditLog('sections_reordered', `Ordre et visibilité des sections mis à jour`)
  return { success: true }
}

export async function savePage(page, user = 'admin') {
  const db = await ensureDbReady()
  const now = new Date().toISOString()
  const id = page.id || `page-${Date.now()}`

  const existing = await db.execute({
    sql: 'SELECT * FROM portfolio_pages WHERE id = ?',
    args: [id],
  })

  if (existing.rows[0]) {
    await db.execute({
      sql: `UPDATE portfolio_pages SET
        slug = ?, title = ?, content_markdown = ?, is_published = ?,
        seo_title = ?, seo_description = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        page.slug,
        page.title,
        page.contentMarkdown,
        page.isPublished ? 1 : 0,
        page.seoTitle || '',
        page.seoDescription || '',
        now,
        id,
      ],
    })
  } else {
    await db.execute({
      sql: `INSERT INTO portfolio_pages (
        id, slug, title, content_markdown, is_published,
        seo_title, seo_description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        page.slug,
        page.title,
        page.contentMarkdown,
        page.isPublished ? 1 : 0,
        page.seoTitle || '',
        page.seoDescription || '',
        now,
        now,
      ],
    })
  }

  await recordAuditLog('page_saved', `Page "${page.title}" (${page.slug}) sauvegardée`)
  return { success: true, id }
}

export async function deletePage(id) {
  const db = await ensureDbReady()
  await db.execute({ sql: 'DELETE FROM portfolio_pages WHERE id = ?', args: [id] })
  return { success: true }
}

export async function getPageBySlug(slug) {
  const db = await ensureDbReady()
  const res = await db.execute({
    sql: 'SELECT * FROM portfolio_pages WHERE slug = ? AND is_published = 1 LIMIT 1',
    args: [slug],
  })
  const p = res.rows[0]
  if (!p) return null
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    contentMarkdown: p.content_markdown,
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
    updatedAt: p.updated_at,
  }
}

// ============================================================================
// EXPORT & IMPORT DE DONNÉES (PORTABILITÉ & SAUVEGARDE)
// ============================================================================

export async function exportAllData() {
  const db = await ensureDbReady()
  const [
    profile,
    projects,
    skills,
    experience,
    education,
    certifications,
    announcements,
    technologies,
    stats,
    theme,
    sections,
    pages,
  ] = await Promise.all([
    db.execute('SELECT * FROM portfolio_profile LIMIT 1'),
    db.execute('SELECT * FROM portfolio_projects ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_skills ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_experience ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_education ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_certifications ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_announcements ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_technologies ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_stats ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_theme LIMIT 1'),
    db.execute('SELECT * FROM portfolio_sections ORDER BY sort_order ASC'),
    db.execute('SELECT * FROM portfolio_pages ORDER BY created_at DESC'),
  ])

  return {
    exportVersion: '2.0.0',
    exportedAt: new Date().toISOString(),
    profile: profile.rows[0] || null,
    projects: projects.rows,
    skills: skills.rows,
    experience: experience.rows,
    education: education.rows,
    certifications: certifications.rows,
    announcements: announcements.rows,
    technologies: technologies.rows,
    stats: stats.rows,
    theme: theme.rows[0] || null,
    sections: sections.rows,
    pages: pages.rows,
  }
}
