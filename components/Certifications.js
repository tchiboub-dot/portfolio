'use client'

import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa'

/**
 * COMPOSANT CERTIFICATIONS
 * Section présentant les certifications obtenues
 * Pour modifier les informations, changez les valeurs dans le tableau certificationsData ci-dessous
 */
export default function Certifications() {
  // DONNÉES DES CERTIFICATIONS - MODIFIEZ ICI
  const certificationsData = [
    {
      title: 'C Programming Basics',
      organization: 'Simplilearn SkillUp',
      date: '10 Janvier 2026',
      certificateId: '9698550',
      logo: '💻',
    },
    {
      title: 'Prompt Engineering Applications',
      organization: 'Simplilearn SkillUp',
      date: '5 Février 2026',
      certificateId: '9808496',
      logo: '🤖',
    },
    {
      title: 'AI for Business Professionals',
      organization: 'HP LIFE / HP Foundation',
      date: '3 Février 2026',
      certificateId: 'cdab7e32-4bfe-4f0d-acc4-bdf643f1dc25',
      certificateLink: 'https://www.life-global.org/',
      logo: '🧠',
    },
    {
      title: 'Introduction to Cybersecurity Awareness',
      organization: 'HP LIFE / HP Foundation',
      date: '4 Février 2026',
      certificateId: '73fec2ee-a03a-40c2-9e0f-3a4785948f15',
      certificateLink: 'https://www.life-global.org/',
      logo: '🔐',
    },
    {
      title: 'Agile Project Management',
      organization: 'HP LIFE / HP Foundation',
      date: '5 Février 2026',
      certificateId: '7fcc8748-1694-4abe-9224-e062bff9fefd',
      certificateLink: 'https://www.life-global.org/',
      logo: '📊',
    },
  ]

  return (
    <section id="certifications" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Titre de la section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Certifications
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Formations et certifications professionnelles
          </p>
        </div>

        {/* Grille de certifications */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificationsData.map((cert, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Logo/Icône */}
              <div className="text-5xl mb-4 text-center">{cert.logo}</div>

              {/* Titre de la certification */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {cert.title}
              </h3>

              {/* Organisation */}
              <p className="text-primary font-semibold text-center mb-3">
                {cert.organization}
              </p>

              {/* Date */}
              <p className="text-gray-600 text-sm text-center mb-3">
                {cert.date}
              </p>

              {/* ID de certificat */}
              <div className="bg-gray-100 rounded p-2 mb-4">
                <p className="text-xs text-gray-600 text-center">
                  <span className="font-semibold">ID:</span> {cert.certificateId}
                </p>
              </div>

              {/* Lien vers le certificat (si disponible) */}
              {cert.certificateLink && (
                <a
                  href={cert.certificateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-primary hover:text-secondary transition-colors text-sm font-semibold"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  Vérifier le certificat
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Information supplémentaire */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-lg">
            <FaCertificate className="mr-3 text-2xl" />
            <span className="font-semibold">
              {certificationsData.length} certifications obtenues
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
