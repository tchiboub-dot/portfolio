export const portfolioKnowledge = {
  profile: {
    name: 'Chiboub Taha Adnane',
    shortName: 'T.A.C',
    role: 'Software Engineer Student',
    headline: 'Full-Stack Developer | Cloud & AI Enthusiast',
    summary:
      'Computer science engineering student focused on modern web applications, scalable architecture, and polished user experience.',
    valueStatement:
      'Builds clean, high-quality digital products with strong frontend execution, practical backend logic, and reliable deployment workflows.',
    location: 'Fes, Morocco',
    availability:
      'Available for internships, freelance work, and collaborative product building.',
  },
  sections: {
    home: 'Hero section with profile highlights, value proposition, and direct social links.',
    about:
      'Personal summary, languages, and interests including full-stack development, cloud architecture, user-focused design, and AI-powered applications.',
    education:
      'Engineering studies in computer science at ESISA Fes with focus on algorithms, OOP, systems, networking, and web development.',
    experience:
      'Hands-on full-stack development through personal and academic projects, emphasizing reusable UI, API quality, and iterative improvement.',
    projects:
      'Showcase of selected projects with business value, implementation notes, and production links.',
    certifications:
      'Verified certificates in AI business, prompt engineering, cybersecurity, C programming, and agile project management.',
    skills:
      'Technical capabilities grouped by frontend, backend, tools, and AI/cloud.',
    contact:
      'Direct contact channels via email, LinkedIn, GitHub, and CV download.',
  },
  projects: [
    {
      title: 'Parfume Store',
      category: 'Web Apps',
      description:
        'Premium full-stack e-commerce experience with multilingual flows and conversion-focused UI.',
      stack: ['React', 'Next.js', 'Tailwind', 'TypeScript'],
      github: 'https://github.com/tchiboub-dot/parfume',
      live: 'https://parfume-store-eta.vercel.app/en',
    },
    {
      title: 'Student Management System',
      category: 'Web Apps',
      description:
        'CRUD-focused student platform with dashboard UX, structured forms, and practical administration flows.',
      stack: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      github: 'https://github.com/tchiboub-dot',
      live: 'https://student-management5.vercel.app/',
    },
    {
      title: 'Security Headers Verifier',
      category: 'Tools',
      description:
        'Developer utility for validating HTTP security headers and improving deployment hardening.',
      stack: ['Next.js', 'Node.js', 'Security Headers', 'Vercel'],
      github: 'https://github.com/tchiboub-dot/security-headers',
      live: 'https://security-headers-2owb.vercel.app/',
    },
    {
      title: 'Maison Elegance',
      category: 'Web Apps',
      description:
        'Restaurant platform with interactive menu storytelling, reservation flow, and responsive UX.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
      github: 'https://github.com/tchiboub-dot',
      live: 'https://maisonelegance-one.vercel.app/',
    },
  ],
  skills: {
    frontend: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
    backend: ['Node.js', 'Express', 'Python', 'MongoDB', 'PostgreSQL'],
    tools: ['Git', 'Docker', 'Vercel', 'Figma'],
    aiCloud: ['OpenAI API', 'Cloud Deployment', 'WebRTC'],
  },
  certificates: [
    {
      title: 'AI Business Certificate',
      issuer: 'HP LIFE / HP Foundation',
      year: '2026',
      keySkills: ['AI Business Use Cases', 'Decision Workflows', 'Digital Strategy'],
    },
    {
      title: 'Prompt Engineering Certificate',
      issuer: 'Simplilearn SkillUp',
      year: '2026',
      keySkills: ['Prompt Design', 'Context Structuring', 'Output Quality Control'],
    },
    {
      title: 'Cybersecurity Fundamentals',
      issuer: 'HP LIFE / HP Foundation',
      year: '2026',
      keySkills: ['Security Basics', 'Threat Awareness', 'Secure Practices'],
    },
    {
      title: 'C Programming Certificate',
      issuer: 'Simplilearn SkillUp',
      year: '2026',
      keySkills: ['C Language', 'Memory Concepts', 'Structured Programming'],
    },
    {
      title: 'Agile Project Management',
      issuer: 'HP LIFE / HP Foundation',
      year: '2026',
      keySkills: ['Agile Delivery', 'Collaboration', 'Iteration Planning'],
    },
  ],
  contact: {
    email: 'taha.adnane.chiboub@gmail.com',
    linkedin: 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
    github: 'https://github.com/tchiboub-dot',
    cvPath: '/cv-taha-adnane-chiboub.pdf',
  },
}

export const portfolioKnowledgeJson = JSON.stringify(portfolioKnowledge)
