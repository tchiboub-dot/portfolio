import { getDatabaseClient } from './index.js'
import { initDatabaseSchema } from './schema.js'
import fs from 'fs'
import path from 'path'

function getBaselineData() {
  const filePath = path.resolve(process.cwd(), 'data', 'baseline-content.json')
  const content = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(content)
}

export async function seedDatabaseIfEmpty() {
  await initDatabaseSchema()
  const db = getDatabaseClient()
  const baselineData = getBaselineData()
  const now = new Date().toISOString()

  // 1. Check Profile
  const profileCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_profile')
  const profileCount = Number(profileCountRes.rows[0].count || 0)

  if (profileCount === 0 && baselineData.profile) {
    const p = baselineData.profile
    await db.execute({
      sql: `INSERT INTO portfolio_profile (
        id, name, title, email, github, linkedin, photo, cv_path, availability,
        about_title, about_subtitle, about_introduction, about_description,
        about_interests_json, about_languages_json, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'main-profile',
        p.name,
        p.title,
        p.email,
        p.github,
        p.linkedin,
        p.photo,
        p.cvPath,
        p.availability,
        p.aboutTitle,
        p.aboutSubtitle,
        p.aboutIntroduction,
        p.aboutDescription,
        JSON.stringify(p.interests || []),
        JSON.stringify(p.languages || []),
        now,
      ],
    })
  }

  // 2. Check Projects
  const projectsCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_projects')
  const projectsCount = Number(projectsCountRes.rows[0].count || 0)

  if (projectsCount === 0 && Array.isArray(baselineData.projects)) {
    for (const prj of baselineData.projects) {
      await db.execute({
        sql: `INSERT INTO portfolio_projects (
          id, title, category, summary, detailed_description, business_value,
          implementation_notes, features_json, tech_stack_json, github_link,
          live_link, preview, status, sort_order, is_featured, is_published,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          prj.id,
          prj.title,
          prj.category,
          prj.summary,
          prj.detailedDescription,
          prj.businessValue,
          prj.implementationNotes,
          JSON.stringify(prj.features || []),
          JSON.stringify(prj.techStack || []),
          prj.githubLink,
          prj.liveLink,
          prj.preview,
          prj.status || 'Published',
          prj.sortOrder || 0,
          prj.isFeatured ? 1 : 0,
          prj.isPublished ? 1 : 0,
          now,
          now,
        ],
      })
    }
  }

  // 3. Check Skills
  const skillsCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_skills')
  const skillsCount = Number(skillsCountRes.rows[0].count || 0)

  if (skillsCount === 0 && Array.isArray(baselineData.skills)) {
    for (const skill of baselineData.skills) {
      await db.execute({
        sql: `INSERT INTO portfolio_skills (
          id, category, name, level, sort_order, is_published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          skill.id,
          skill.category,
          skill.name,
          skill.level,
          skill.sortOrder || 0,
          skill.isPublished ? 1 : 0,
          now,
          now,
        ],
      })
    }
  }

  // 4. Check Education
  const eduCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_education')
  const eduCount = Number(eduCountRes.rows[0].count || 0)

  if (eduCount === 0 && Array.isArray(baselineData.education)) {
    for (const edu of baselineData.education) {
      await db.execute({
        sql: `INSERT INTO portfolio_education (
          id, degree, institution, location, period, description,
          highlights_json, key_skills_json, is_current, sort_order,
          is_published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          edu.id,
          edu.degree,
          edu.institution,
          edu.location,
          edu.period,
          edu.description,
          JSON.stringify(edu.highlights || []),
          JSON.stringify(edu.keySkillsDeveloped || []),
          edu.isCurrent ? 1 : 0,
          edu.sortOrder || 0,
          edu.isPublished ? 1 : 0,
          now,
          now,
        ],
      })
    }
  }

  // 5. Check Experience
  const expCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_experience')
  const expCount = Number(expCountRes.rows[0].count || 0)

  if (expCount === 0 && Array.isArray(baselineData.experience)) {
    for (const exp of baselineData.experience) {
      await db.execute({
        sql: `INSERT INTO portfolio_experience (
          id, title, company, location, period, type, achievements_json,
          is_current, sort_order, is_published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          exp.id,
          exp.title,
          exp.company,
          exp.location,
          exp.period,
          exp.type,
          JSON.stringify(exp.achievements || []),
          exp.isCurrent ? 1 : 0,
          exp.sortOrder || 0,
          exp.isPublished ? 1 : 0,
          now,
          now,
        ],
      })
    }
  }

  // 6. Check Certifications
  const certsCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_certifications')
  const certsCount = Number(certsCountRes.rows[0].count || 0)

  if (certsCount === 0 && Array.isArray(baselineData.certifications)) {
    for (const cert of baselineData.certifications) {
      await db.execute({
        sql: `INSERT INTO portfolio_certifications (
          id, image, title, issuer, year, summary, verification,
          skills_json, description, sort_order, is_published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          cert.id,
          cert.image,
          cert.title,
          cert.issuer,
          cert.year,
          cert.summary,
          cert.verification,
          JSON.stringify(cert.skills || []),
          cert.description,
          cert.sortOrder || 0,
          cert.isPublished ? 1 : 0,
          now,
          now,
        ],
      })
    }
  }

  // 7. Check Announcements
  const annCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_announcements')
  const annCount = Number(annCountRes.rows[0].count || 0)

  if (annCount === 0 && Array.isArray(baselineData.announcements)) {
    for (const ann of baselineData.announcements) {
      await db.execute({
        sql: `INSERT INTO portfolio_announcements (
          id, title, category, description, status, goals_json,
          technologies_json, progress, roadmap_json, verification,
          sort_order, is_published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          ann.id,
          ann.title,
          ann.category,
          ann.description,
          ann.status,
          JSON.stringify(ann.goals || []),
          JSON.stringify(ann.technologies || []),
          ann.progress,
          JSON.stringify(ann.roadmap || []),
          ann.verification,
          ann.sortOrder || 0,
          ann.isPublished ? 1 : 0,
          now,
          now,
        ],
      })
    }
  }

  // 8. Check Technologies
  const techCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_technologies')
  const techCount = Number(techCountRes.rows[0].count || 0)

  if (techCount === 0 && Array.isArray(baselineData.technologies)) {
    for (const tech of baselineData.technologies) {
      await db.execute({
        sql: `INSERT INTO portfolio_technologies (
          id, name, icon_name, color, sort_order, is_published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          tech.id,
          tech.name,
          tech.iconName,
          tech.color || 'text-cyan-400',
          tech.sortOrder || 0,
          tech.isPublished ? 1 : 0,
          now,
          now,
        ],
      })
    }
  }

  // 9. Check Stats
  const statsCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_stats')
  const statsCount = Number(statsCountRes.rows[0].count || 0)

  if (statsCount === 0 && Array.isArray(baselineData.stats)) {
    for (const stat of baselineData.stats) {
      await db.execute({
        sql: `INSERT INTO portfolio_stats (
          id, value, suffix, label, sort_order, is_published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          stat.id,
          stat.value,
          stat.suffix || '',
          stat.label,
          stat.sortOrder || 0,
          stat.isPublished ? 1 : 0,
          now,
          now,
        ],
      })
    }
  }

  // 10. Check Theme
  const themeCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_theme')
  const themeCount = Number(themeCountRes.rows[0].count || 0)

  if (themeCount === 0) {
    await db.execute({
      sql: `INSERT INTO portfolio_theme (
        id, primary_color, secondary_color, accent_color, bg_color, card_bg,
        font_family, border_radius, hero_headline, hero_subheadline, custom_css, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'main-theme',
        '#38bdf8',
        '#818cf8',
        '#22d3ee',
        '#030712',
        '#0b1329',
        'Inter, sans-serif',
        '16px',
        'Architecting Next-Gen Software & Intelligent Cloud Systems',
        'Engineering clean architectures, high-performance backends, and reactive web experiences with relentless attention to detail.',
        '',
        now,
      ],
    })
  }

  // 11. Check Sections
  const sectionsCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_sections')
  const sectionsCount = Number(sectionsCountRes.rows[0].count || 0)

  if (sectionsCount === 0) {
    const defaultSections = [
      { id: 'sec-hero', name: 'hero', label: 'Section Accueil (Hero)', sort_order: 1, is_visible: 1 },
      { id: 'sec-about', name: 'about', label: 'À Propos & Bio', sort_order: 2, is_visible: 1 },
      { id: 'sec-projects', name: 'projects', label: 'Projets Réalisés', sort_order: 3, is_visible: 1 },
      { id: 'sec-skills', name: 'skills', label: 'Compétences Techniques', sort_order: 4, is_visible: 1 },
      { id: 'sec-experience', name: 'experience', label: 'Expérience Professionnelle', sort_order: 5, is_visible: 1 },
      { id: 'sec-education', name: 'education', label: 'Formation & Diplômes', sort_order: 6, is_visible: 1 },
      { id: 'sec-certifications', name: 'certifications', label: 'Certifications', sort_order: 7, is_visible: 1 },
      { id: 'sec-announcements', name: 'announcements', label: 'En Cours & Projets R&D', sort_order: 8, is_visible: 1 },
      { id: 'sec-technologies', name: 'technologies', label: 'Technologies & Outils', sort_order: 9, is_visible: 1 },
      { id: 'sec-stats', name: 'stats', label: 'Statistiques Clés', sort_order: 10, is_visible: 1 },
      { id: 'sec-contact', name: 'contact', label: 'Formulaire de Contact', sort_order: 11, is_visible: 1 },
    ]

    for (const sec of defaultSections) {
      await db.execute({
        sql: `INSERT INTO portfolio_sections (id, name, label, sort_order, is_visible, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [sec.id, sec.name, sec.label, sec.sort_order, sec.is_visible, now],
      })
    }
  }

  // 12. Check Pages
  const pagesCountRes = await db.execute('SELECT COUNT(*) as count FROM portfolio_pages')
  const pagesCount = Number(pagesCountRes.rows[0].count || 0)

  if (pagesCount === 0) {
    await db.execute({
      sql: `INSERT INTO portfolio_pages (
        id, slug, title, content_markdown, is_published,
        seo_title, seo_description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'page-legal',
        'mentions-legales',
        'Mentions Légales & Confidentialité',
        `# Mentions Légales & Confidentialité\n\n### Éditeur du site\nLe présent site portfolio est conçu et administré par Chiboub Taha Adnane, élève-ingénieur en génie logiciel.\n\n### Propriété Intellectuelle\nL'ensemble des projets, architectures logicielles, maquettes et documentations présentés sur ce portfolio sont la propriété exclusive de leur auteur.\n\n### Sécurité & Confidentialité\nCe système est doté d'une console d'administration sécurisée par authentification à deux facteurs (2FA) et sessions cryptographiques HttpOnly.\n\n### Contact\nPour toute collaboration, contactez-moi directement via taha.adnane.chiboub@gmail.com.`,
        1,
        'Mentions Légales — Chiboub Taha Adnane',
        'Informations légales et politique de confidentialité du portfolio',
        now,
        now,
      ],
    })
  }

  return { seeded: true }
}
