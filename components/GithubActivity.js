'use client'

import { useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'

export default function GithubActivity() {
  const username = 'tchiboub-dot'
  const [repos, setRepos] = useState([])

  useEffect(() => {
    let active = true

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`)
      .then((res) => res.json())
      .then((data) => {
        if (!active || !Array.isArray(data)) return
        setRepos(data)
      })
      .catch(() => {
        setRepos([])
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <section id="github" className="section py-24 md:py-32 bg-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-parallax-slower" />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          title="GitHub Activity"
          subtitle="Latest repositories, contribution graph preview, and profile access"
          align="center"
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-12">
          <Card>
            <h3 className="text-xl font-bold text-heading mb-4">Latest Repositories</h3>
            <div className="space-y-3">
              {repos.length > 0 ? repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-xl border border-blue-400/25 bg-blue-500/10 hover:bg-blue-500/20 transition-colors duration-300"
                >
                  <p className="font-semibold text-blue-100">{repo.name}</p>
                  <p className="text-xs text-blue-200/80 mt-1 line-clamp-2">{repo.description || 'Repository details available on GitHub.'}</p>
                </a>
              )) : (
                <p className="text-sm text-blue-200/85">Repository feed unavailable right now. Visit the profile for full activity.</p>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-heading mb-4">Contribution Graph Preview</h3>
            <div className="rounded-xl overflow-hidden border border-blue-400/25 bg-blue-500/10">
              <img
                src={`https://ghchart.rshah.org/3b82f6/${username}`}
                alt="GitHub contribution graph"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-400/40 text-blue-100 hover:bg-blue-500/20 transition-colors duration-300"
            >
              <FaGithub className="w-4 h-4" />
              Visit GitHub Profile
            </a>
          </Card>
        </div>
      </div>
    </section>
  )
}
