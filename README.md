# 🚀 Portfolio Professionnel - Chiboub Taha Adnane

Portfolio moderne et responsive développé avec **Next.js 14**, **React** et **Tailwind CSS**. Ce portfolio présente mon parcours académique, mes compétences techniques, mes projets et certifications.

## 📋 Table des matières

- [Caractéristiques](#caractéristiques)
- [Technologies utilisées](#technologies-utilisées)
- [Installation locale](#installation-locale)
- [Personnalisation](#personnalisation)
- [Déploiement sur Vercel](#déploiement-sur-vercel)
- [Structure du projet](#structure-du-projet)
- [Contact](#contact)

## ✨ Caractéristiques

- ✅ Design moderne et professionnel
- ✅ Entièrement responsive (mobile, tablette, desktop)
- ✅ Navigation fluide avec scroll smooth
- ✅ Animations et transitions élégantes
- ✅ Optimisé pour le SEO
- ✅ Performance optimisée avec Next.js
- ✅ Code commenté et réutilisable
- ✅ Facile à personnaliser

## 🛠️ Technologies utilisées

- **[Next.js 14](https://nextjs.org/)** - Framework React pour le web
- **[React 18](https://react.dev/)** - Bibliothèque JavaScript pour l'UI
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[React Icons](https://react-icons.github.io/react-icons/)** - Bibliothèque d'icônes

## 💻 Installation locale

### Prérequis

- Node.js 18.x ou supérieur
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository** (ou télécharger le dossier)
   ```bash
   cd portfolio
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   
   Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le portfolio.

## 🎨 Personnalisation

### Modifier vos informations personnelles

Tous les composants sont documentés avec des commentaires. Voici où modifier les informations principales :

#### 1. **Informations Hero (Page d'accueil)**
Fichier : `components/Hero.js`
```javascript
const heroData = {
  name: 'Votre Nom',
  title: 'Votre Titre',
  // ... autres informations
}
```

#### 2. **Section À propos**
Fichier : `components/About.js`
```javascript
const aboutData = {
  introduction: 'Votre présentation',
  // ... autres informations
}
```

#### 3. **Éducation**
Fichier : `components/Education.js`
```javascript
const educationData = [
  {
    degree: 'Votre diplôme',
    institution: 'Votre école',
    // ... autres informations
  }
]
```

#### 4. **Expérience**
Fichier : `components/Experience.js`
```javascript
const experienceData = [
  {
    title: 'Votre poste',
    company: 'Entreprise',
    // ... autres informations
  }
]
```

#### 5. **Projets**
Fichier : `components/Projects.js`
```javascript
const projectsData = [
  {
    title: 'Nom du projet',
    description: 'Description',
    demoLink: 'URL de la démo',
    // ... autres informations
  }
]
```

#### 6. **Certifications**
Fichier : `components/Certifications.js`
```javascript
const certificationsData = [
  {
    title: 'Nom de la certification',
    organization: 'Organisme',
    // ... autres informations
  }
]
```

#### 7. **Compétences**
Fichier : `components/Skills.js`
```javascript
const skillsData = {
  frontend: [...],
  backend: [...],
  // ... autres catégories
}
```

#### 8. **Contact**
Fichier : `components/Contact.js`
```javascript
const contactData = {
  email: 'votre.email@exemple.com',
  linkedin: 'URL LinkedIn',
  github: 'URL GitHub',
}
```

### Modifier les couleurs

Fichier : `tailwind.config.js`
```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',    // Couleur principale
      secondary: '#1e40af',  // Couleur secondaire
      accent: '#f59e0b',     // Couleur accent
    },
  },
}
```

## 🚀 Déploiement sur Vercel

### ✅ Où se trouve la vraie app

- L'application frontend est à la racine du repo (`./`), pas dans un sous-dossier `frontend/`.
- `package.json` est à la racine.
- Ne pas utiliser des commandes du type `cd frontend && npm install`.

### ✅ Vercel Settings (exact)

- **Framework Preset**: `Next.js`
- **Root Directory**: `.`
- **Install Command**: `npm ci`
- **Build Command**: `npm run build`
- **Output Directory**: laisser vide (auto Next.js)
- **Node.js Version**: `18.x` ou `20.x`

### Environment Variables (Production + Preview)

- `NEXT_PUBLIC_SITE_URL` = URL publique du site (ex: `https://portfolio.vercel.app`)
- `RESEND_API_KEY` = clé API Resend
- `CONTACT_FROM_EMAIL` = email validé côté Resend
- `CONTACT_TO_EMAIL` = email de réception

### Option 1 : Déploiement via GitHub (Recommandé)

1. **Créer un repository GitHub**
   - Allez sur [GitHub](https://github.com)
   - Créez un nouveau repository (ex: `mon-portfolio`)
   - Initialisez Git et poussez le code :
   
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Portfolio"
   git branch -M main
   git remote add origin https://github.com/votre-username/mon-portfolio.git
   git push -u origin main
   ```

2. **Déployer sur Vercel**
   - Allez sur [Vercel](https://vercel.com)
   - Connectez-vous avec votre compte GitHub
   - Cliquez sur "New Project"
   - Importez votre repository `mon-portfolio`
   - Vercel détectera automatiquement Next.js
   - Cliquez sur "Deploy"
   - ✅ Votre portfolio sera en ligne en quelques minutes !

### Option 2 : Déploiement direct via Vercel CLI

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Se connecter à Vercel**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel
   ```

4. **Déployer en production**
   ```bash
   vercel --prod
   ```

### Configuration additionnelle Vercel

Le fichier `next.config.js` est déjà configuré pour Vercel. Aucune configuration supplémentaire n'est nécessaire.

### Routing en production

- Routes directes supportées : `/`, `/about`, `/projects`, `/contact`.
- Les routes `/about`, `/projects`, `/contact` redirigent vers les sections de la page d'accueil pour un comportement SPA-friendly.
- Les routes API `/api/*` sont préservées (pas de rewrite destructif sur les endpoints backend).

## 📁 Structure du projet

```
portfolio/
├── app/
│   ├── layout.js          # Layout principal avec metadata
│   ├── page.js            # Page d'accueil (assemble tous les composants)
│   └── globals.css        # Styles globaux avec Tailwind
├── components/
│   ├── Header.js          # Navigation
│   ├── Hero.js            # Section héro
│   ├── About.js           # À propos
│   ├── Education.js       # Formation
│   ├── Experience.js      # Expérience
│   ├── Projects.js        # Projets
│   ├── Certifications.js  # Certifications
│   ├── Skills.js          # Compétences
│   ├── Contact.js         # Contact
│   └── Footer.js          # Pied de page
├── public/               # Assets statiques (images, etc.)
├── .gitignore           # Fichiers à ignorer par Git
├── next.config.js       # Configuration Next.js
├── package.json         # Dépendances du projet
├── tailwind.config.js   # Configuration Tailwind CSS
├── postcss.config.js    # Configuration PostCSS
└── README.md           # Ce fichier

```

## 📝 Scripts disponibles

```bash
# Développement
npm run dev        # Lance le serveur de développement

# Production
npm run build      # Crée le build de production
npm run preview    # Lance une prévisualisation production locale
npm run start      # Lance le serveur de production

# Linting
npm run lint       # Vérifie le code avec ESLint
```

## 🎯 Prochaines étapes recommandées

1. ✅ **Déployer sur Vercel** (suivez les instructions ci-dessus)
2. 📸 **Ajouter des images de projets** dans le dossier `public/projects/`
3. 🔗 **Mettre à jour votre profil LinkedIn** avec le lien du portfolio
4. 📧 **Configurer un service d'email** (optionnel) pour le formulaire de contact
5. 📊 **Ajouter Google Analytics** (optionnel) pour suivre les visiteurs

## 🔧 Maintenance et mises à jour

### Ajouter un nouveau projet

1. Ouvrez `components/Projects.js`
2. Ajoutez un nouvel objet dans le tableau `projectsData`
3. Le projet apparaîtra automatiquement

### Ajouter une certification

1. Ouvrez `components/Certifications.js`
2. Ajoutez un nouvel objet dans le tableau `certificationsData`
3. La certification apparaîtra automatiquement

### Mettre à jour les compétences

1. Ouvrez `components/Skills.js`
2. Ajoutez/modifiez les compétences dans `skillsData`
3. Ajustez les niveaux (pourcentages)

## 📞 Contact

**Chiboub Taha Adnane**

- 📧 Email: taha.adnane.chiboub@gmail.com
- 💼 LinkedIn: [Taha Adnane Chiboub](https://www.linkedin.com/in/taha-adnane-chiboub-1a5ab939a)
- 🐙 GitHub: [tchiboub-dot](https://github.com/tchiboub-dot)

## 📄 Licence

Ce projet est libre d'utilisation pour votre portfolio personnel. Si vous l'utilisez, une attribution serait appréciée mais n'est pas obligatoire.

---

**Fait avec ❤️ et Next.js**

*Dernière mise à jour : Mars 2026*
