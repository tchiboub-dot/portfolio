const SECTION_SYNONYMS = {
  home: ['home', 'accueil', 'start', 'top'],
  about: ['about', 'about you', 'who are you', 'qui es tu', 'a propos', 'apropos', 'presentation'],
  education: ['education', 'formation', 'study', 'etudes', 'school'],
  experience: ['experience', 'work', 'career', 'professional experience'],
  projects: ['projects', 'project', 'projets', 'portfolio', 'work samples'],
  skills: ['skills', 'skill', 'competences', 'competence', 'technologies', 'tech stack', 'stack'],
  certificates: ['certificates', 'certificate', 'certifications', 'certification', 'certificat', 'certificats'],
  contact: ['contact', 'email', 'linkedin', 'github', 'reach you', 'how can i contact'],
}

const REQUEST_VERBS = [
  'go to',
  'show',
  'take me to',
  'open',
  'scroll to',
  'navigate to',
  'jump to',
  'bring me to',
  'aller a',
  'va a',
  'ouvre',
  'montre',
  'descends',
  'fais defiler',
  'navigue vers',
  'parle moi de',
  'tell me about',
  'what technologies do you use',
  'how can i contact you',
]

export const SECTION_TARGETS = {
  home: ['home'],
  about: ['about'],
  education: ['education'],
  experience: ['experience'],
  projects: ['projects'],
  skills: ['skills', 'technologies'],
  certificates: ['certificates', 'certifications'],
  contact: ['contact'],
}

function normalizeText(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function detectSection(text) {
  for (const [section, synonyms] of Object.entries(SECTION_SYNONYMS)) {
    if (synonyms.some((synonym) => text.includes(synonym))) {
      return section
    }
  }
  return null
}

export function parseNavigationIntent(message) {
  const normalized = normalizeText(message)
  if (!normalized) return null

  const targetSection = detectSection(normalized)
  if (!targetSection) return null

  const explicitRequest = REQUEST_VERBS.some((verb) => normalized.includes(verb))
  const shortCommand = normalized.split(' ').length <= 4

  if (!explicitRequest && !shortCommand) {
    return null
  }

  return { section: targetSection, anchorCandidates: SECTION_TARGETS[targetSection] || [targetSection] }
}

export function getNavigationAck(section, locale = 'en') {
  const isFr = (locale || '').toLowerCase().startsWith('fr')
  const labels = {
    home: isFr ? 'Accueil' : 'Home',
    about: isFr ? 'A propos' : 'About',
    education: isFr ? 'Education' : 'Education',
    experience: isFr ? 'Experience' : 'Experience',
    projects: isFr ? 'Projects' : 'Projects',
    skills: isFr ? 'Skills' : 'Skills',
    certificates: isFr ? 'Certificates' : 'Certificates',
    contact: isFr ? 'Contact' : 'Contact',
  }

  return isFr
    ? `Bien sur - je t'emmene vers ${labels[section] || 'la section demandee'}.`
    : `Sure - taking you to ${labels[section] || 'the requested section'}.`
}
