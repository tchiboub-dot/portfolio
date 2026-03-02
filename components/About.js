'use client'

import { FaUser, FaLanguage, FaLaptopCode } from 'react-icons/fa'

/**
 * COMPOSANT ABOUT (À PROPOS)
 * Section présentant le profil professionnel
 * Pour modifier les informations, changez les valeurs dans l'objet aboutData ci-dessous
 */
export default function About() {
  // DONNÉES DE LA SECTION À PROPOS - MODIFIEZ ICI
  const aboutData = {
    title: 'À propos de moi',
    introduction: 'Je suis Chiboub Taha Adnane, 19 ans, étudiant en 1ère année Informatique à ESISA Fes. Je développe des projets concrets pour transformer ce que j\'apprends (algorithmique, programmation, systèmes) en applications web utiles, propres et agréables à utiliser.',
    description: 'Je m\'intéresse particulièrement au développement web (interfaces claires, responsive, expérience utilisateur) et je renforce progressivement mes bases en backend afin de construire des applications plus complètes. En parallèle, je garde un intérêt fort pour la cybersécurité (bonnes pratiques, sensibilisation, protection des données) ainsi que pour l\'usage de l\'IA (prompting, productivité).',
    interests: [
      'Développement Web Front-end & Back-end',
      'Cybersécurité & Protection des données',
      'Intelligence Artificielle & Prompt Engineering',
      'UI/UX Design & Expérience utilisateur',
    ],
    languages: ['Arabe (Natif)', 'Français (Courant)', 'Anglais (Intermédiaire)'],
    availability: 'Ouvert aux opportunités de stage et missions freelance',
  }

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Titre de la section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {aboutData.title}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Colonne gauche - Description */}
          <div>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <FaUser className="text-primary text-2xl mr-3" />
                <h3 className="text-2xl font-semibold text-gray-800">Qui suis-je ?</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {aboutData.introduction}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {aboutData.description}
              </p>
            </div>

            {/* Langues */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <FaLanguage className="text-primary text-2xl mr-3" />
                <h3 className="text-2xl font-semibold text-gray-800">Langues</h3>
              </div>
              <ul className="space-y-2">
                {aboutData.languages.map((language, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    {language}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Colonne droite - Intérêts et disponibilité */}
          <div>
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <FaLaptopCode className="text-primary text-2xl mr-3" />
                <h3 className="text-2xl font-semibold text-gray-800">Centres d'intérêt</h3>
              </div>
              <ul className="space-y-3">
                {aboutData.interests.map((interest, index) => (
                  <li
                    key={index}
                    className="bg-blue-50 p-4 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disponibilité */}
            <div className="bg-gradient-to-br from-primary to-secondary text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Disponibilité</h3>
              <p className="leading-relaxed">{aboutData.availability}</p>
              <a
                href="#contact"
                className="inline-block mt-4 bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Me contacter
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
