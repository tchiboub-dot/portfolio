# 🎨 Système de Thème Dark/Light - Guide Complet

## ✅ Implémentation Complète

Votre portfolio a maintenant un système de thème robuste avec :

✅ **Anti-Flash (FOUC)** - Script exécuté AVANT React hydration  
✅ **CSS Variables** - `:root.light` et `:root.dark` pour tous les tokens  
✅ **Tailwind Integration** - `darkMode: 'class'` compatible avec `.dark`  
✅ **localStorage** - Mémorisation des préférences utilisateur  
✅ **Détection système** - `prefers-color-scheme` par défaut  
✅ **Transitions fluides** - 240ms pour les changements couleurs  
✅ **Accessibilité** - aria-labels et structure sémantique  

---

## 🔧 Architecture du Système

### 1. **Fichiers Modifiés**

| Fichier | Modification |
|---------|-------------|
| `app/layout.js` | Script early theme + ThemeProvider wrapper |
| `app/globals.css` | Variables `.dark` et `.light` unifiées |
| `components/Header.js` | Toggle cohérent avec HTML.classList |
| `components/ThemeProvider.js` | **NOUVEAU** - Sync React ↔ DOM ↔ localStorage |
| `tailwind.config.js` | `darkMode: 'class'` déjà activé ✅ |

### 2. **Flux du Changement de Thème**

```
Utilisateur clique toggle
      ↓
Header.js: toggleTheme()
      ↓
document.documentElement.classList.add('dark') OU .add('light')
      ↓
CSS variables changent instantanément (:root.dark / :root.light)
      ↓
Tailwind utilities s'appliquent (dark:text-white, etc.)
      ↓
localStorage.setItem('theme', 'dark' | 'light')
      ↓
Au refresh: early theme script relit localStorage → pas de flash
```

---

## 🎯 Utilisation Correcte dans les Composants

### ✅ BON - Utiliser des CSS variables existantes

```jsx
// ❌ PAS BON - Couleurs codées en dur
<div className="bg-blue-600 text-gray-100">Contenu</div>

// ✅ BON - Utiliser les classes Tailwind existantes
<div className="bg-primary text-text">Contenu</div>

// ✅ BON AUSSI - Utiliser les variables CSS directement
<div style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }}>
  Contenu
</div>
```

### ✅ Pour les différentes parties du design

#### 1. **Backgrounds**
```jsx
// Container/Section
<section className="bg-bg"> ... </section>
<div className="bg-surface"> ... </div>
<div className="bg-surface-2"> ... </div>
```

#### 2. **Textes**
```jsx
<h1 className="text-heading">Titre</h1>
<p className="text-text">Contenu normal</p>
<span className="text-muted">Texte secondaire</span>
```

#### 3. **Cartes & Conteneurs**
```jsx
<div className="bg-surface border border-border rounded-card shadow-medium">
  <h3 className="text-heading">Titre carte</h3>
  <p className="text-text">Description</p>
</div>
```

#### 4. **Boutons**
```jsx
// Primary Button
<button className="bg-primary text-primary-contrast hover:bg-primary-hover transition-colors">
  Action
</button>

// Secondary Button
<button className="bg-surface border border-primary text-primary hover:bg-primary-soft">
  Action secondaire
</button>
```

#### 5. **Accents & États**
```jsx
// Accent color
<span className="text-accent">Important</span>

// Success/Danger/Warning
<span className="bg-success text-primary-contrast">✓ Succès</span>
<span className="bg-danger text-primary-contrast">✗ Erreur</span>
<span className="bg-warning text-primary-contrast">⚠ Attention</span>
```

---

## 📝 Variables CSS Disponibles

### Backgrounds
```css
--bg              /* Fond général (blanc léger / bleu foncé) */
--bg-2            /* Fond secondaire (gradient/accent) */
--surface         /* Cartes, modales (blanc / surface foncée) */
--surface-2       /* Surfaces auxiliaires (gris clair / gris foncé) */
```

### Textes
```css
--heading         /* Titres (noir profond / blanc très clair) */
--text            /* Texte normal (gris foncé / gris clair) */
--muted           /* Texte secondaire (gris moyen) */
```

### Couleurs
```css
--primary              /* Blue principal (#2563EB light / #3B82F6 dark) */
--primary-hover        /* Hover state */
--primary-soft         /* Background clair avec primary */

--accent               /* Cyan accent */
--accent-soft          /* Background clair avec accent */

--success/danger/warning
```

### Espacements & Rayons
```css
--radius           /* Cartes: 22px */
--radius-sm        /* Boutons: 16px */
--radius-input     /* Inputs: 14px */
--radius-lg        /* Sections: 20px */
```

### Ombres
```css
--shadow           /* Ombre forte (cartes importantes) */
--shadow-md        /* Ombre moyenne (éléments normaux) */
--shadow-sm        /* Ombre légère (hover states) */
```

### Timings
```css
--duration-fast    /* 200ms (hover, petites transitions) */
--duration-normal  /* 240ms (thème, sections) */
--duration-slow    /* 300ms (animations d'entrée) */
```

---

## 🔍 Vérifier que tout fonctionne

### Test 1: Anti-Flash ✅
1. Ouvrez DevTools (F12)
2. Allez à localStorage
3. Changez `theme` de `dark` à `light`
4. Refresh la page
5. ❌ Si vous voyez un flash du mauvais thème → bug
6. ✅ Si la page charge directement au bon thème → OK

### Test 2: Toggle en Direct ✅
1. Cliquez le bouton lune/soleil en haut
2. Les couleurs changent sans délai
3. localStorage se met à jour
4. Refrash → le thème persiste

### Test 3: Préférences Système ✅
1. Supprimez localStorage (DevTools → Application)
2. Allez dans Paramètres Windows → Affichage → Mode sombre/clair
3. Ouvrez le site
4. ✅ Doit détecter et appliquer automatiquement

---

## 🛠 Si vous ajoutez une nouvelle section/composant

1. **Jamais** utiliser de couleurs en dur comme `#000000` ou `bg-blue-500`
2. **Toujours** utiliser les classes Tailwind existantes (`bg-primary`, `text-text`, etc.)
3. **Pour CSS personnalisé** utiliser `var(--primary)`, `var(--text)`, etc.

### Exemple: Nouveau composant
```jsx
export function MyNewComponent() {
  return (
    <div className="bg-surface border border-border rounded-card shadow-medium p-6">
      <h3 className="text-heading text-xl font-bold mb-3">Titre</h3>
      <p className="text-text mb-4">Description...</p>
      
      <button className="bg-primary text-white hover:bg-primary-hover transition-colors rounded-button px-4 py-2">
        Action
      </button>
    </div>
  )
}
```

---

## ⚠️ Erreurs Courantes à Éviter

### ❌ Au lieu de ceci
```jsx
<div className="bg-blue-600 text-white dark:bg-blue-900">...</div>
<button className="bg-[#2563EB]">Click</button>
<span style={{ color: '#000000' }}>Texte</span>
```

### ✅ Fais ceci
```jsx
<div className="bg-primary text-primary-contrast">...</div>
<button className="bg-primary">Click</button>
<span className="text-text">Texte</span>
```

---

## 📱 Responsive + Thème

Les variables CSS s'appliquent **partout** automatiquement:
- Mobile
- Tablette
- Desktop

Aucune classe spéciale à ajouter pour le responsive !

```jsx
// Le même composant s'adapte à tous les appareils ET aux 2 thèmes
<section className="bg-bg py-section md:py-section-lg">
  <h2 className="text-heading text-h2">Titre</h2>
  <p className="text-text">Contenu...</p>
</section>
```

---

## 🎬 Résumé de ce qui s'est passé

1. ✅ Créé `ThemeProvider.js` - synchronise localStorage + DOM
2. ✅ Mis à jour `layout.js` - ajoute le provider + early script
3. ✅ Unifié `globals.css` - `:root.dark` et `:root.light`
4. ✅ Nettoyé `Header.js` - toggle cohérent + aria-labels
5. ✅ Tailwind `darkMode: 'class'` était déjà OK

---

## 🚀 Déploiement

Le système fonctionne **partout** (Vercel, Netlify, etc.) car:
- Aucune dépendance externe
- Pas d'appels API
- localStorage disponible partout
- CSS variables supportées par tous les navigateurs modernes

---

## Questions Fréquentes

**Q: Pourquoi `.dark` et pas `.light`?**
A: Parce que Tailwind `darkMode: 'class'` cherche `.dark` par défaut. Garder `.light` pour éviter les conflits.

**Q: Et si je veux une troisième couleur (sépia, etc.)?**
A: Ajoutez une classe `.sepia` dans globals.css avec ses propres variables, puis modifiez le toggle.

**Q: Ça marche sans localStorage?**
A: Oui! Utilise `prefers-color-scheme` des préférences système.

**Q: Les images ont-elles besoin d'adaptation?**
A: Non, elles restent identiques. Utiliser des PNG/SVG avec transparence pour fluidité.

---

## 📚 Ressources de Vérification

- CSS Variables: ✅ Vérifiées dans `globals.css`
- Transititions: ✅ 240ms appliquées
- Accessibilité: ✅ aria-labels sur tous les boutons
- Responsive: ✅ Mobile-first dans Tailwind
