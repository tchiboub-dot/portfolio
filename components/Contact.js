'use client'

import { useState } from 'react'
import { FaEnvelope, FaLinkedin, FaGithub, FaPaperPlane, FaDownload } from 'react-icons/fa'
import SectionTitle from './ui/SectionTitle'
import Card from './ui/Card'
import Button from './ui/Button'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const contactData = {
    email: 'taha.adnane.chiboub@gmail.com',
    linkedin: 'https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a',
    github: 'https://github.com/tchiboub-dot',
    cvPath: '/cv-taha-adnane-chiboub.pdf',
  }

  const quickContacts = [
    { label: 'Email', icon: FaEnvelope, href: `mailto:${contactData.email}` },
    { label: 'LinkedIn', icon: FaLinkedin, href: contactData.linkedin },
    { label: 'GitHub', icon: FaGithub, href: contactData.github },
  ]

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (status.type) setStatus({ type: '', message: '' })
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully. I will reply soon.' })
        setFormData({ name: '', email: '', subject: '', message: '', website: '' })
      } else {
        setStatus({ type: 'error', message: data.error || 'Unable to send your message right now.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section py-24 md:py-32 bg-bg">
      <div className="container-custom">
        <SectionTitle
          title="Contact"
          subtitle="Open to internships, collaboration, and product-focused freelance opportunities"
          align="center"
        />

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mt-10">
          <Card>
            <h3 className="text-2xl font-bold text-heading mb-4">Let&apos;s connect</h3>
            <p className="text-text leading-relaxed mb-6">
              Reach out for internships, collaboration opportunities, or to discuss how I can contribute to your next product.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              {quickContacts.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.label === 'Email' ? '_self' : '_blank'}
                    rel={item.label === 'Email' ? undefined : 'noopener noreferrer'}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-400/35 text-blue-100 bg-blue-500/10 hover:bg-blue-500/20 transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </a>
                )
              })}
            </div>

            <a
              href={contactData.cvPath}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/20 transition-colors duration-300"
            >
              <FaDownload className="w-4 h-4" />
              Download CV
            </a>

            <p className="text-sm text-blue-200/85 mt-5">Response time: usually within 24 hours.</p>
          </Card>

          <Card hover={false}>
            <h3 className="text-2xl font-bold text-heading mb-5">Professional contact form</h3>

            {status.type && (
              <div
                className={`mb-4 p-3 rounded-xl border text-sm ${
                  status.type === 'success'
                    ? 'bg-green-500/15 border-green-400/30 text-green-100'
                    : 'bg-red-500/15 border-red-400/30 text-red-100'
                }`}
                role="alert"
              >
                {status.message}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="hidden">
                <label htmlFor="website">Leave empty</label>
                <input id="website" name="website" value={formData.website} onChange={onChange} />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-blue-100 mb-1.5">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-blue-100 mb-1.5">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-blue-100 mb-1.5">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text"
                  placeholder="Subject of your message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-blue-100 mb-1.5">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={onChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-[14px] focus:border-primary focus:ring-2 focus:ring-primary/30 text-text resize-none"
                  placeholder="Write your message..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <FaPaperPlane className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
