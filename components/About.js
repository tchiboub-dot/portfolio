'use client'

import { FaUser, FaLanguage, FaLaptopCode } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

/**
 * COMPOSANT ABOUT (À PROPOS)
 * Section présentant le profil professionnel avec design system
 * Pour modifier les données, changez l'objet aboutData ci-dessous
 */
export default function About() {
  const aboutData = {
    title: 'À propos de moi',
    subtitle: 'Étudiant en informatique passionné par le développement web, la cybersécurité et l\'IA',
    introduction: 'Je suis Chiboub Taha Adnane, 19 ans, étudiant en 1ère année Informatique à ESISA Fes. Je développe des projets concrets pour transformer ce que j\'apprends (algorithmique, programmation, systèmes) en applications web utiles, propres et agréables à utiliser.',
    description: 'Je m\'intéresse particulièrement au développement web (interfaces claires, responsive, expérience utilisateur) et je renforce progressivement mes bases en backend afin de construire des applications plus complètes. En parallèle, je garde un intérêt fort pour la cybersécurité et l\'usage de l\'IA.',
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
    <section id="about" className="section py-24 md:py-32 bg-background dark:bg-dark-background">
      <div className="container-custom">
        {/* Titre principal */}
        <SectionTitle 
          title={aboutData.title}
          subtitle={aboutData.subtitle}
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Colonne gauche - Description */}
          <div className="space-y-6">
            {/* Carte "Qui suis-je" */}
            <Card>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <FaUser className="w-6 h-6 text-primary dark:text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-3">
                    Qui suis-je ?
                  </h3>
                  <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed mb-3">
                    {aboutData.introduction}
                  </p>
                  <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                    {aboutData.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Langues */}
            <Card>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <FaLanguage className="w-6 h-6 text-primary dark:text-accent mt-1" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-4">
                    Langues
                  </h3>
                  <div className="space-y-2">
                    {aboutData.languages.map((language, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-primary dark:bg-accent rounded-full mr-3" />
                        <span className="text-text-primary dark:text-dark-text-primary">
                          {language}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Colonne droite - Intérêts et disponibilité */}
          <div className="space-y-6">
            {/* Centres d'intérêt */}
            <Card>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <FaLaptopCode className="w-6 h-6 text-primary dark:text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-4">
                    Centres d'intérêt
                  </h3>
                  <div className="space-y-2">
                    {aboutData.interests.map((interest, index) => (
                      <div
                        key={index}
                        className="bg-primary-soft dark:bg-dark-primary-soft text-text-primary dark:text-dark-text-primary p-3 rounded-lg text-sm leading-relaxed"
                      >
                        ✨ {interest}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Carte Disponibilité avec CTA */}
            <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary to-accent p-8 shadow-medium">
              {/* Décoration de fond */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20" />
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Prêt à collaborer ?
                </h3>
                <p className="text-blue-50 mb-6 leading-relaxed">
                  {aboutData.availability}
                </p>
                <Button 
                  href="#contact"
                  className="bg-white text-primary hover:bg-gray-50 dark:bg-gray-100 dark:hover:bg-gray-200"
                >
                  Démarrer une conversation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
