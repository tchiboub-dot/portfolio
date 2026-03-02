# Portfolio - Guide de mise à jour rapide

## 📝 Comment mettre à jour vos informations

### 1. Informations personnelles (Hero)
**Fichier :** `components/Hero.js`
**Ligne :** 13-20

Modifiez l'objet `heroData` :
```javascript
const heroData = {
  name: 'Votre Nom',
  title: 'Votre Titre',
  subtitle: 'Votre sous-titre',
  // ...
}
```

### 2. Ajouter un projet
**Fichier :** `components/Projects.js`
**Ligne :** 11-60

Ajoutez un nouvel objet dans `projectsData` :
```javascript
{
  title: 'Nom du projet',
  description: 'Description complète',
  technologies: ['Tech1', 'Tech2', 'Tech3'],
  demoLink: 'https://demo.com',
  githubLink: 'https://github.com/...',
  features: ['Feature 1', 'Feature 2'],
  image: '🎨',
}
```

### 3. Ajouter une certification
**Fichier :** `components/Certifications.js`
**Ligne :** 10-50

Ajoutez un nouvel objet dans `certificationsData` :
```javascript
{
  title: 'Nom de la certification',
  organization: 'Organisme',
  date: 'Date',
  certificateId: 'ID',
  logo: '🏆',
}
```

### 4. Modifier les compétences
**Fichier :** `components/Skills.js`
**Ligne :** 16-50

Modifiez ou ajoutez des compétences dans `skillsData` :
```javascript
frontend: [
  { name: 'HTML5', icon: <FaHtml5 />, level: 90, color: 'text-orange-600' },
  // Ajoutez d'autres compétences ici
]
```

### 5. Changer les couleurs
**Fichier :** `tailwind.config.js`
**Ligne :** 10-14

Modifiez les couleurs :
```javascript
colors: {
  primary: '#3b82f6',    // Bleu
  secondary: '#1e40af',  // Bleu foncé
  accent: '#f59e0b',     // Orange
},
```

### 6. Modifier le contact
**Fichier :** `components/Contact.js`
**Ligne :** 23-27

Changez les informations de contact :
```javascript
const contactData = {
  email: 'votre@email.com',
  linkedin: 'https://linkedin.com/in/...',
  github: 'https://github.com/...',
}
```

## 🚀 Appliquer les changements

### En local
```bash
npm run dev
```
Testez les modifications sur http://localhost:3000

### En production
```bash
git add .
git commit -m "Mise à jour du portfolio"
git push
```
Vercel redéploiera automatiquement !

## 🎨 Personnalisation avancée

### Ajouter une nouvelle section

1. Créez un nouveau composant dans `components/`
2. Importez-le dans `app/page.js`
3. Ajoutez-le entre les autres sections

Exemple :
```javascript
// components/Blog.js
export default function Blog() {
  return <section id="blog">...</section>
}

// app/page.js
import Blog from '@/components/Blog'
// ...
<Blog />
```

### Changer les polices

**Fichier :** `app/layout.js`
**Ligne :** 1

```javascript
import { Inter, Roboto } from 'next/font/google'
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] })
```

## 📱 Tester le responsive

1. Ouvrez Chrome DevTools (F12)
2. Cliquez sur l'icône mobile/tablette
3. Testez différentes tailles d'écran

## ✅ Checklist avant déploiement

- [ ] Toutes les informations sont à jour
- [ ] Les liens fonctionnent (LinkedIn, GitHub, démos)
- [ ] L'email de contact est correct
- [ ] Les images de projets sont optimisées
- [ ] Testé sur mobile, tablette, desktop
- [ ] Aucune erreur dans la console
- [ ] Build local réussi (`npm run build`)

## 🆘 Aide rapide

**Erreur lors du build :**
```bash
npm install
npm run build
```

**Réinitialiser les changements :**
```bash
git reset --hard
```

**Voir les modifications :**
```bash
git status
git diff
```

---

**Besoin d'aide ?** Consultez le README.md ou DEPLOYMENT.md pour plus de détails.
