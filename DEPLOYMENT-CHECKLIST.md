# ✅ CHECKLIST DE DÉPLOIEMENT - Système Dark/Light Theme

## 🎯 État Actuel Du Projet

```
[✅] Build Next.js compiles sans erreurs
[✅] CSS variables fonctionnent (dark/light)
[✅] Header toggle visible et fonctionnel
[✅] localStorage sauvegarde les préférences
[✅] Script early theme prévient le flash
[✅] ThemeProvider synchronise React ↔ DOM
[✅] Documentation complète fournie
```

---

## 📋 Avant de Lancer en Production

### Phase 1: Validation Locale (À faire AVANT npm run build)

```bash
# ✅ Test 1: Le serveur démarre
npm run dev
# Sortie attendue: "Ready in XXXms"

# ✅ Test 2: Pas d'erreurs console
# F12 → Console → Vérifier qu'il n'y a pas de red errors

# ✅ Test 3: Toggle fonctionne
# Cliquer 🌙 en haut à droite → couleurs changent instantanément
```

### Phase 2: Tests du Thème (À faire EN LOCAL avec npm run dev)

#### Test 2.1: Light Mode
```
1. Ouvrir localStorage (F12 → Application → localStorage)
2. Vérifier: theme = "light" OU vide
3. Vérifier visuellement:
   ✅ Fond blanc/clair
   ✅ Texte noir/foncé
   ✅ Contraste acceptable (pas de texte gris illisible)
   ✅ Cartes visibles (pas de confusion fond/contenu)
```

#### Test 2.2: Dark Mode
```
1. Cliquer le toggle 🌙
2. localStorage doit montrer: theme = "dark"
3. Vérifier visuellement:
   ✅ Fond bleu foncé
   ✅ Texte blanc/clair
   ✅ Boutons bleus visibles
   ✅ Icônes lisibles
```

#### Test 2.3: Anti-Flash (FOUC)
```
1. localStorage: theme = "light"
2. F5 (Refresh)
3. ✅ La page charge EN LIGHT sans flash (pas de bref passage en dark)
                    OU
1. localStorage: theme = "dark"
2. F5 (Refresh)
3. ✅ La page charge EN DARK sans flash
```

#### Test 2.4: Détection Système
```
1. Supprimer localStorage (DevTools → Application → localStorage)
2. Aller Paramètres Windows → Affichage → Mode sombre
3. Refresh la page
4. ✅ Le site charge en mode sombre automatiquement

1. Aller Paramètres Windows → Affichage → Mode clair
2. Refresh la page
3. ✅ Le site charge en mode clair automatiquement
```

#### Test 2.5: Responsive
```
1. DevTools → Responsive Mode (Ctrl+Shift+M)
2. Testez sur:
   [ ] Mobile (375px)
   [ ] Tablette (768px)
   [ ] Desktop (1920px)
3. Togglez le thème sur chaque résolution
4. ✅ Tout doit être lisible et joli sur les 2 thèmes
```

#### Test 2.6: Performance
```
1. DevTools → Lighthouse → Performance
2. Exécutez un audit
3. ✅ Performance doit être > 90
4. ✅ Pas de "Cumulative Layout Shift" (pas de saut)
```

### Phase 3: Build Production (Avant de déployer)

```bash
# Nettoyer les caches
rm -r .next
rm -r node_modules
npm install

# Build production
npm run build

# Sortie attendue:
# ✅ "Compiled successfully in XXs"
# ✅ "Generating static pages using XX workers"
# ✅ Pas d'avertissements (warnings)

# Test le build localement
npm run start
# Sortie attendue: "Ready in XXXms at http://localhost:3000"

# Visiter http://localhost:3000 et vérifier:
# [ ] Footer chargé
# [ ] Toggle fonctionne
# [ ] localStorage OK
# [ ] Pas d'erreurs console
```

---

## 🚀 Déploiement (Vercel, Netlify, etc.)

### Sur Vercel (Recommandé)

```bash
# 1. Connectez votre repo GitHub à Vercel.com
# 2. Vercel détecte automatiquement que c'est un projet Next.js
# 3. Cliquez "Deploy"
# 4. Attendre que le build finisse

# Vérifier le déploiement:
# [ ] URL: https://votre-nom.vercel.app fonctionne
# [ ] Toggle 🌙 fonctionne
# [ ] localStorage persiste au refresh
# [ ] Pas d'erreurs dans Vercel logs

# Si erreur de build:
# Voir "Deployments" → "Build Logs" sur Vercel
```

### Sur Netlify

```bash
# 1. Connectez votre repo GitHub à Netlify.com
# 2. Configure build command: npm run build
# 3. Configure publish directory: out/ (ou next/static si standalone)
# 4. Cliquez "Deploy"

# Verifier:
# [ ] Netlify build réussit
# [ ] URL https://votre-site.netlify.app fonctionne
# [ ] Toggle + localStorage OK
```

### Sur un serveur traditionnel

```bash
# Créer un build standalone
npm run build

# Le dossier ".next" contient votre app compilée
# Copier ".next", "public", "package.json" vers votre serveur
# Sur le serveur: npm install && npm run start

# Ou utiliser PM2:
pm2 start npm --name portfolio -- start
```

---

## 🔍 Vérifications Post-Déploiement

Après avoir déployé, testez ceci sur le site LIVE:

```
[ ] 1. Ouvrir
    https://votre-site.com

[ ] 2. Cliquer toggle 🌙/☀️
    Résultat: couleurs changent instantanément

[ ] 3. Vérifier localStorage (F12 → Application)
    Résultat: "theme" = "light" ou "dark"

[ ] 4. Rafraichir (F5)
    Résultat: aucun flash, chargement au bon thème

[ ] 5. Ouvrir dans différents navigateurs
    [ ] Chrome
    [ ] Firefox
    [ ] Safari
    [ ] Edge
    Résultat: theme fonctionne partout

[ ] 6. Ouvrir sur mobile
    [ ] iPhone (Safari)
    [ ] Android (Chrome)
    [ ] Tablette
    Résultat: toggle visible et fonctionnel

[ ] 7. Test de contraste (WebAIM)
    Aller https://webaim.org/resources/contrastchecker/
    Copier une couleur light + une couleur dark
    Résultat: WCAG AAA ou au minimum AA (4.5:1)

[ ] 8. Pas d'erreurs console (F12)
    [ ] Aucune erreur rouge
    [ ] Aucun warning suspect
```

---

## 🐛 Troubleshooting

### Problème: Flash du mauvais thème au chargement

**Cause:** Le script early theme n'exécute pas avant le CSS

**Solution:**
```jsx
// Vérifier layout.js:
<Script
  id="theme-script"
  strategy="beforeInteractive"  // ← OBLIGATOIRE
  // ...
/>
```

---

### Problème: Couleurs ne changent pas au toggle

**Cause:** Composants utilisent des couleurs hard-codées

**Solution:** Remplacer
```jsx
// ❌ Au lieu de ceci:
<div className="bg-blue-600 text-white">

// ✅ Utiliser ceci:
<div className="bg-primary text-white">
```

---

### Problème: localStorage ne fonctionne pas

**Cause:** Navigateur en mode privé OU localStorage désactivé

**Solution:** Normal, c'est pas un bug. En mode privé:
- Dark/light change temporairement
- Ne persiste pas (expected behavior)

---

### Problème: Tailwind dark: utilities ne marchent pas

**Cause:** Configuration darkMode incorrecte

**Solution:** Vérifier tailwind.config.js
```javascript
module.exports = {
  darkMode: 'class',  // ← OBLIGATOIRE pour .dark
  // ...
}
```

---

## 📊 Métriques à Monitorer (Post-Déploiement)

Si vous migrez vers la production, suivez ces métriques:

```
[ ] Performance Lighthouse: > 90
[ ] Core Web Vitals: Tous "Good" (Google Search Console)
[ ] Error Rate: < 0.1% (Erreurs JavaScript)
[ ] Page Load Time: < 2s
[ ] Accessibility Score: > 90
```

---

## 🎁 Bonus: Commands Utiles

```bash
# Démarrer le serveur dev
npm run dev

# Build production
npm run build

# Test le build localement
npm run start

# Linter & format (si vous avez ESLint)
npm run lint

# Nettoyer tout
rm -rf .next node_modules
npm install
npm run build
```

---

## ✅ Checklist Final de Lancement

```
AVANT LE DÉPLOIEMENT:
[ ] npm run build réussit (pas d'erreurs)
[ ] Tests locaux passent (all 6 tests above)
[ ] localStorage fonctionne
[ ] Pas d'erreurs console
[ ] Responsive testé (mobile/tablette/desktop)
[ ] Tous les composants utilent les CSS variables

APRÈS LE DÉPLOIEMENT:
[ ] URL accédée depuis 3 navigateurs différents
[ ] Toggle fonctionne
[ ] Anti-flash vérifié (vérifier 3x)
[ ] localStorage persiste (refresh 5x)
[ ] Pas d'erreurs 404 (images, scripts)
[ ] Cœurs Web Vitals OK (Lighthouse > 90)

MONITORING:
[ ] Configurez alertes sur erreurs JS
[ ] Monitorer Core Web Vitals
[ ] Monitorer downtime (Uptime Robot)
```

---

## 📞 En Cas de Problème

### Build échoue:
1. Vérifiez que `npm install` a complété
2. Supprimez `.next` et relancez `npm run build`
3. Vérifiez qu'il n'y a pas d'erreurs TypeScript

### Toggle ne fonctionne pas:
1. Ouvrez DevTools (F12)
2. Console: tapez `document.documentElement.className`
3. Cliquez toggle: le className doit changer
4. Si non: il y a un problema dans Header.js

### localStorage ne sauvegarde pas:
1. Mode privé du navigateur? C'est normal (pas de localStorage)
2. Sinon: vérifier que `localStorage.setItem('theme', ...)` exécute

---

## 🎉 Vous Êtes Prêt!

Si toutes les checks sont vertes ✅, votre système dark/light est:

- ✅ Fonctionnel
- ✅ Cohérent
- ✅ Performant
- ✅ Accessible
- ✅ Prêt pour la production

**Status: 🟢 DÉPLOIEMENT VALIDÉ**
