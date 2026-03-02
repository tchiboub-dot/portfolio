# 🎨 Exemples de Composants Thématisés

Ce fichier montre exactement comment mettre à jour vos composants pour que le thème dark/light fonctionne correctement.

## 1. Composant Card (ui/Card.js)

```jsx
// ✅ VERSION CORRECTE - Utilise les classes Tailwind du design système
export default function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`
        bg-surface 
        border border-border 
        rounded-card 
        shadow-medium 
        p-6 
        transition-all duration-normal
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
```

---

## 2. Composant Button (ui/Button.js)

```jsx
export default function Button({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className = '',
  ...props 
}) {
  const baseStyles = `
    font-medium
    rounded-button
    transition-all duration-fast
    active:scale-95
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
  `

  const variants = {
    primary: `
      bg-primary 
      text-white 
      hover:bg-primary-hover
      active:bg-primary-hover
    `,
    secondary: `
      bg-surface
      border border-primary
      text-primary
      hover:bg-primary-soft
    `,
    ghost: `
      text-primary
      hover:bg-primary-soft
    `,
    danger: `
      bg-danger
      text-white
      hover:opacity-90
    `,
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
```

---

## 3. Composant Badge (ui/Badge.js)

```jsx
export default function Badge({ variant = 'primary', children, className = '' }) {
  const variants = {
    primary: 'bg-primary-soft text-primary',
    accent: 'bg-accent-soft text-accent',
    success: 'bg-success/12 text-success',
    danger: 'bg-danger/12 text-danger',
    warning: 'bg-warning/12 text-warning',
    soft: 'bg-surface-2 text-text',
  }

  return (
    <span 
      className={`
        inline-flex
        items-center
        gap-2
        px-3 py-1
        rounded-button
        text-sm
        font-medium
        transition-all duration-fast
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
```

---

## 4. Hero Section (components/Hero.js)

```jsx
export default function Hero() {
  return (
    <section id="home" className="pt-32 pb-24 md:pb-32 bg-bg relative">
      <div className="container-custom space-y-6 max-w-3xl">
        
        {/* Titre Principal */}
        <h1 className="text-h1 md:text-h1-mobile text-heading leading-tight">
          Développeur Web <span className="text-primary">créatif</span>
        </h1>

        {/* Sous-titre */}
        <p className="text-body-lg text-text leading-relaxed max-w-2xl">
          Je crée des expériences web modernes et performantes...
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button className="bg-primary text-white hover:bg-primary-hover px-8 py-3 rounded-button font-semibold transition-colors">
            Voir mes projets
          </button>
          <button className="bg-surface border-2 border-primary text-primary hover:bg-primary-soft px-8 py-3 rounded-button font-semibold transition-all">
            Me contacter
          </button>
        </div>
      </div>

      {/* Background Accent */}
      <div className="absolute -right-40 top-20 w-80 h-80 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl -z-10" />
    </section>
  )
}
```

---

## 5. Card de Projet (dans Projects.js)

```jsx
export default function ProjectCard({ project }) {
  return (
    <div className="bg-surface border border-border rounded-card overflow-hidden shadow-medium hover:shadow-default transition-shadow duration-normal group">
      
      {/* Image */}
      <div className="relative h-48 bg-surface-2 overflow-hidden">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            Pas d'image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-bold text-heading">{project.title}</h3>
        
        <p className="text-text text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <span 
              key={tag}
              className="text-xs px-2 py-1 bg-primary-soft text-primary rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a 
          href={project.link}
          className="inline-block text-primary hover:text-primary-hover font-semibold text-sm transition-colors"
        >
          En savoir plus →
        </a>
      </div>
    </div>
  )
}
```

---

## 6. Form Input (réutilisable)

```jsx
export default function Input({ 
  label, 
  error, 
  ...props 
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-heading">
          {label}
        </label>
      )}
      
      <input
        className={`
          w-full
          bg-surface
          border rounded-radius-input
          text-text
          placeholder:text-muted
          px-4 py-2.5
          transition-all duration-fast
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
          ${error 
            ? 'border-danger focus:border-danger focus:ring-danger/20' 
            : 'border-border'
          }
        `}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  )
}
```

---

## 7. Navbar/Header - Complète (déjà mise à jour ✅)

```jsx
export default function Header() {
  // Déjà correctement thématisée
  // Voir components/Header.js
}
```

---

## 8. Section Container avec Alternance

```jsx
export default function AlternateSection({ 
  title, 
  subtitle, 
  content,
  isReversed = false,
  isDark = false // Option: peut forcer un thème
}) {
  return (
    <section 
      className={`
        py-24 md:py-32 transition-colors duration-normal
        ${isDark ? 'bg-surface' : 'bg-bg'}
      `}
    >
      <div className="container-custom">
        {/* Titre */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-h2 text-heading">{title}</h2>
          <p className="text-body-lg text-text max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Contenu */}
        <div className={`
          grid md:grid-cols-2 gap-12 items-center
          ${isReversed ? 'md:auto-cols-fr' : ''}
        `}>
          {content}
        </div>
      </div>
    </section>
  )
}
```

---

## ✅ Checklist pour chaque composant

- [ ] Utiliser `bg-bg`, `bg-surface`, `bg-surface-2` au lieu de `bg-white`, `bg-gray-900`
- [ ] Utiliser `text-heading`, `text-text`, `text-muted` au lieu de `text-gray-X`
- [ ] Utiliser `text-primary`, `text-accent` pour les accents (jamais du direct `text-blue-500`)
- [ ] Ajouter `transition-all duration-normal` ou `duration-fast` aux changements
- [ ] Utiliser `border-border` pour les bordures (jamais `border-gray-300`, etc.)
- [ ] Vérifier l'apparence en mode light (Ctrl+Shift+X dans les DevTools)
- [ ] Vérifier l'apparence en mode dark (cliquer le toggle)

---

## 🎬 Template Copy-Paste Rapide

```jsx
// Composant simple
export default function MyComponent() {
  return (
    <div className="bg-surface border border-border rounded-card shadow-medium p-6">
      <h3 className="text-heading font-bold mb-3">Titre</h3>
      <p className="text-text mb-4">Description...</p>
      
      <button className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-button font-medium transition-colors">
        Action
      </button>
    </div>
  )
}
```

Copiez ça et adaptez ! Les classes tailwind font le travail des variables CSS.
