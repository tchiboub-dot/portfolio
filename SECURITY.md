# 🔒 GUIDE DE SÉCURITÉ - PORTFOLIO VERCEL

## 📋 Table des matières
1. [Audit de sécurité](#audit)
2. [Configuration des headers](#headers)
3. [Formulaire sécurisé](#formulaire)
4. [Gestion des secrets](#secrets)
5. [Checklist avant production](#checklist)
6. [Protection contre le vol de site](#protection)
7. [Dépendances](#dependances)

---

## 🔍 1. AUDIT DE SÉCURITÉ {#audit}

### **CRITICAL** 🔴
- ✅ Secrets protégés (`.env.local` dans `.gitignore`)
- ⚠️ **6 vulnérabilités HIGH détectées** - À corriger immédiatement

### **HIGH** 🟠
- ✅ **Formulaire sécurisé** - Validation + Honeypot + Rate limiting
- ✅ **Headers de sécurité** - CSP, HSTS, X-Frame-Options, etc.
- ✅ **Rate limiting** - Protection contre les abus

### **MEDIUM** 🟡
- ✅ **CSP stricte** - Scripts et styles contrôlés
- ✅ **Sanitization** - Inputs nettoyés côté serveur
- ✅ **Logging sécurisé** - Pas de données sensibles

### **LOW** 🟢
- ✅ **Front-only** - Surface d'attaque minimale
- ✅ **Pas d'auth** - Pas de risque de vol de session

---

## 🛡️ 2. CONFIGURATION DES HEADERS {#headers}

### Fichier: `vercel.json`

Tous les headers de sécurité sont configurés dans `vercel.json`. Voici ce qui est protégé:

#### **Content-Security-Policy (CSP)**
```
default-src 'self'                    → Tout vient du même domaine par défaut
script-src 'self' 'unsafe-inline'     → Scripts du site + inline (Next.js nécessite)
                'unsafe-eval'         → Eval requis pour Next.js dev
                https://va.vercel-scripts.com → Vercel Analytics
style-src 'self' 'unsafe-inline'      → Styles du site + inline (Tailwind)
img-src 'self' data: https:           → Images du site + data URLs + HTTPS externe
font-src 'self' data:                 → Fonts du site + data URLs
connect-src 'self'                    → API calls vers le même domaine
            https://vitals.vercel-insights.com → Vercel Vitals
frame-ancestors 'none'                → Bloque clickjacking (=X-Frame-Options)
base-uri 'self'                       → Empêche injection de <base>
form-action 'self'                    → Formulaires vers le même domaine uniquement
upgrade-insecure-requests             → Force HTTPS pour toutes les ressources
```

#### **Autres headers expliqués**

| Header | Valeur | Protection |
|--------|--------|------------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS pendant 2 ans |
| `X-Frame-Options` | `DENY` | Empêche mise en iframe (clickjacking) |
| `X-Content-Type-Options` | `nosniff` | Empêche MIME type sniffing |
| `X-XSS-Protection` | `1; mode=block` | Active le filtre XSS du navigateur |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limite les infos dans Referer header |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Désactive caméra, micro, GPS |

### 🎯 Domaines whitelistés (CSP)

**Actuellement autorisés:**
- `'self'` → Votre domaine Vercel (`portfolio-flame-two-94.vercel.app`)
- `va.vercel-scripts.com` → Vercel Analytics
- `vitals.vercel-insights.com` → Vercel Web Vitals

**À ajouter si vous utilisez:**
- Google Fonts → `fonts.googleapis.com fonts.gstatic.com`
- Cloudflare CDN → `cdnjs.cloudflare.com`
- Images externes → Ajouter le domaine dans `img-src`

### ⚙️ Modifier la CSP

Si vous ajoutez un service externe (ex: Google Fonts):

```json
// vercel.json
"Content-Security-Policy": "... font-src 'self' data: https://fonts.gstatic.com; ..."
```

### 🧪 Tester la CSP

1. Déployer sur Vercel
2. Ouvrir DevTools → Console
3. Vérifier qu'il n'y a pas d'erreurs CSP
4. Utiliser [CSP Evaluator](https://csp-evaluator.withgoogle.com/) pour analyser

---

## 📧 3. FORMULAIRE SÉCURISÉ {#formulaire}

### Architecture

```
Client (Contact.js)  →  API Route (/api/contact)  →  Service Email (optionnel)
     ↓                        ↓                             ↓
 - Honeypot              - Rate limiting              - Resend/SendGrid
 - Validation            - Cooldown
 - Sanitization          - Spam detection
                         - XSS prevention
```

### Protections côté CLIENT (`components/Contact.js`)

#### **1. Honeypot field**
```jsx
<div style={{ position: 'absolute', left: '-9999px' }}>
  <input name="website" />  {/* Champ caché - si rempli = bot */}
</div>
```

#### **2. Validation stricte**
- Email: Regex RFC 5322
- Longueurs max: Nom (100), Email (150), Sujet (200), Message (2000)
- Détection spam basique (viagra, casino, etc.)

#### **3. UX sécurisée**
- Désactivation du formulaire pendant envoi
- Messages d'erreur génériques
- Compteur de caractères
- État de chargement

### Protections côté SERVEUR (`app/api/contact/route.js`)

#### **1. Rate Limiting**
```javascript
MAX_REQUESTS_PER_WINDOW = 3  // Max 3 messages par minute
RATE_LIMIT_WINDOW = 60000    // Fenêtre de 1 minute
COOLDOWN_PERIOD = 30000      // 30s entre chaque message
```

#### **2. Validation & Sanitization**
- Vérification honeypot → Si rempli, réponse fake "200 OK"
- Validation email (regex strict)
- Sanitization anti-XSS:
  - Retire `<>` (balises HTML)
  - Retire `javascript:` (XSS)  
  - Retire `onclick=`, `onerror=` (event handlers)

#### **3. Détection de spam**
- Patterns communs: viagra, casino, lottery, prize
- Plus de 3 URLs dans le message
- Caractère répété 10+ fois

#### **4. Sécurité générale**
- Body size limit: 10KB max
- Timeout implicite (Vercel: 10s pour hobby plan)
- Réponses génériques (pas de leak d'info)
- Pas de stack trace en production
- Logging minimal (pas de données sensibles)

### 📨 Service d'email (déjà intégré)

Le formulaire envoie déjà les emails via `app/api/contact/route.js` avec Resend.
Configuration requise côté serveur:

- `CONTACT_TO_EMAIL` (primaire)
- `CONTACT_EMAIL` (fallback legacy)
- `CONTACT_FROM_EMAIL` (sender vérifié Resend)
- `RESEND_API_KEY`

#### **Option 1: Resend (recommandé)**
```bash
npm install resend
```

```javascript
// app/api/contact/route.js
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'contact@votredomaine.com',
  to: process.env.CONTACT_TO_EMAIL || process.env.CONTACT_EMAIL,
  subject: `[Portfolio] ${safeSubject}`,
  html: `
    <h2>Nouveau message de ${safeName}</h2>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${safeMessage}</p>
  `
})
```

**Configuration Vercel:**
```bash
vercel env add RESEND_API_KEY
vercel env add CONTACT_TO_EMAIL
vercel env add CONTACT_FROM_EMAIL
```

Après ajout/modification des variables d'environnement, faites un **Redeploy avec Clear cache** sur Vercel.

#### **Option 2: SendGrid**
```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

await sgMail.send({
  to: process.env.CONTACT_TO_EMAIL || process.env.CONTACT_EMAIL,
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: `[Portfolio] ${safeSubject}`,
  text: `De: ${safeName} (${email})\n\n${safeMessage}`
})
```

### 🤖 Ajouter un CAPTCHA (si spam élevé)

Si vous recevez trop de spam malgré les protections:

**1. Ajouter hCaptcha (gratuit, privacy-first)**

```bash
npm install @hcaptcha/react-hcaptcha
```

```jsx
// components/Contact.js
import HCaptcha from '@hcaptcha/react-hcaptcha'

const [captchaToken, setCaptchaToken] = useState(null)

<HCaptcha
  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
  onVerify={(token) => setCaptchaToken(token)}
/>

// Dans handleSubmit
body: JSON.stringify({ ...formData, captchaToken })
```

```javascript
// app/api/contact/route.js
const verifyResponse = await fetch('https://hcaptcha.com/siteverify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `response=${captchaToken}&secret=${process.env.HCAPTCHA_SECRET_KEY}`
})

const { success } = await verifyResponse.json()
if (!success) return NextResponse.json({ error: 'CAPTCHA invalide' }, { status: 400 })
```

---

## 🔐 4. GESTION DES SECRETS {#secrets}

### ⚠️ RÈGLES D'OR

1. **NE JAMAIS** commiter `.env.local` dans Git
2. **NE JAMAIS** utiliser `NEXT_PUBLIC_*` pour des secrets
3. **TOUJOURS** utiliser Vercel Environment Variables pour la production
4. **ROTATION** des clés tous les 90 jours minimum

### Variables d'environnement Next.js

| Préfixe | Accessible où ? | Usage |
|---------|----------------|-------|
| `NEXT_PUBLIC_*` | Client **ET** Serveur | Clés publiques uniquement (Analytics, CAPTCHA site key) |
| Pas de préfixe | **SERVEUR UNIQUEMENT** | Secrets (API keys, tokens, passwords) |

### Vérifier qu'aucun secret n'est exposé

```bash
# Rechercher des clés potentiellement exposées dans le code
grep -r "NEXT_PUBLIC_" --include="*.js" --include="*.jsx" .

# Vérifier les secrets dans le build
npm run build
# Inspecter .next/static/ → Ne doit PAS contenir de secrets

# Vérifier qu'il n'y a pas de secrets dans l'historique Git
git log --all --full-history --source -- "*.env*"
```

### Configuration dans Vercel

```bash
# Ajouter une variable d'environnement
vercel env add RESEND_API_KEY

# Lister toutes les variables
vercel env ls

# Supprimer une variable
vercel env rm RESEND_API_KEY
```

**Via le dashboard:** `vercel.com/[projet]/settings/environment-variables`

### 🚨 Si un secret a été exposé

1. **Révoquer immédiatement** la clé compromise
2. **Générer une nouvelle** clé
3. **Supprimer de l'historique Git** (si dans un commit):
   ```bash
   # Utiliser BFG Repo-Cleaner ou git-filter-repo
   git filter-repo --path .env.local --invert-paths
   git push --force
   ```
4. **Vérifier GitHub/Vercel** pour les secrets scannés automatiquement

### Checklist Secrets

- [ ] `.env.local` dans `.gitignore`
- [ ] `.env.example` créé (sans valeurs réelles)
- [ ] Secrets en prod via Vercel Environment Variables
- [ ] Aucun `NEXT_PUBLIC_*` utilisé pour des secrets
- [ ] Rotation planifiée (tous les 90 jours)
- [ ] Pas de secrets dans l'historique Git
- [ ] Pas de secrets dans les logs
- [ ] Token OIDC Vercel non commité

---

## ✅ 5. CHECKLIST AVANT PRODUCTION {#checklist}

### 🔒 Sécurité

- [ ] **Headers de sécurité** configurés dans `vercel.json`
- [ ] **CSP** testée et aucune erreur dans la console
- [ ] **HTTPS** forcé (via `Strict-Transport-Security`)
- [ ] **Rate limiting** testé (envoyer 4+ messages rapidement)
- [ ] **Honeypot** vérifié (bots ne remplissent pas ce champ)
- [ ] **Validation** testée (emails invalides, champs trop longs)
- [ ] **Sanitization** vérifiée (essayer `<script>alert('XSS')</script>`)
- [ ] **Dépendances** auditées (`npm audit fix`)
- [ ] **Secrets** uniquement via Vercel Environment Variables
- [ ] **`.env.local`** dans `.gitignore` et non commité

### 📧 Formulaire

- [ ] Service d'email configuré (Resend/SendGrid)
- [ ] **Test d'envoi** réussi
- [ ] **Emails reçus** à la bonne adresse
- [ ] **UI d'erreur** testée (coupez internet, envoyez un message)
- [ ] **Spam détection** testée (envoyer "viagra casino")
- [ ] **Cooldown** testé (2 messages en 20 secondes → refusé)

### 🧪 Tests

- [ ] **Build réussi** (`npm run build`)
- [ ] **Aucune erreur** dans la console du navigateur
- [ ] **CSP testée** (aucun warning CSP)
- [ ] **Lighthouse Security** (vérifier les headers)
- [ ] **SecurityHeaders.com** scan [→ securityheaders.com](https://securityheaders.com/)
- [ ] **Mozilla Observatory** scan [→ observatory.mozilla.org](https://observatory.mozilla.org)

### 🚀 Déploiement

- [ ] **Vercel Environment Variables** configurées
- [ ] **Domaine custom** (optionnel) configuré avec HTTPS
- [ ] **HSTS preload** (optionnel) soumis à [hstspreload.org](https://hstspreload.org/)
- [ ] **Vercel Analytics** activé (optionnel)
- [ ] **Error tracking** (Sentry) configuré (optionnel)

### 📊 Monitoring

- [ ] **Logs** vérifiés (`vercel logs`)
- [ ] **Rate limiting** surveillé (alertes si abus)
- [ ] **Formulaire** testé en production
- [ ] **Performance** surveillée (Vercel Analytics ou Plausible)

---

## 🛡️ 6. PROTECTION CONTRE LE VOL DE SITE {#protection}

### ❌ Ce qui est IMPOSSIBLE à empêcher

- **Copier le code front** → Tout le JS/CSS/HTML est public par nature
- **Capturer le design** → Screenshot/DevTools accessibles
- **Dupliquer le site** → Code open-source sur GitHub

### ✅ Ce qui est PROTÉGEABLE

#### **1. Votre domaine**
- Enregistrer votre domaine (`votreportfolio.com`)
- Activer **domaine Vercel custom** gratuit
- **DNSSEC** activé (si votre registrar le supporte)
- **Cloudflare** en proxy (cache + DDoS protection) [optionnel]

#### **2. Vos APIs et données**
- **CORS strict** → Uniquement votre domaine peut appeler vos APIs
- **Rate limiting** → Empêche les abus
- **API keys** côté serveur uniquement
- **Pas d'auth = pas de vol de session**

#### **3. Votre contenu**
- **Copyright** dans le footer : `© 2026 Votre Nom. Tous droits réservés.`
- **Licence** dans README.md (ex: MIT, CC BY-NC-SA)
- **Watermark** sur images importantes (optionnel)

#### **4. Votre réputation**
- **Google Search Console** → Votre site indexé en premier
- **SEO robuste** → Meta tags, sitemap, structured data
- **LinkedIn/GitHub** → Liens vers votre site officiel

### 🔒 Protections supplémentaires

#### **CORS strict** (si vous avez des APIs)

```javascript
// middleware.js
export function middleware(request) {
  const allowedOrigins = ['https://portfolio-flame-two-94.vercel.app']
  const origin = request.headers.get('origin')
  
  if (!allowedOrigins.includes(origin)) {
    return new Response('Forbidden', { status: 403 })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
```

#### **Désactiver le clic droit** (optionnel, contournable)

```jsx
// components/ui/ContextBlock.js
export default function ContextBlock({ children }) {
  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      {children}
    </div>
  )
}
```

⚠️ **Avertissement:** Ça frustre les utilisateurs et est facilement contournable. Pas recommandé.

#### **Obfuscation du code** (optionnel)

```bash
npm install --save-dev webpack-obfuscator
```

```javascript
// next.config.js
const JavaScriptObfuscator = require('webpack-obfuscator')

const nextConfig = {
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins.push(
        new JavaScriptObfuscator({
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.75
        })
      )
    }
    return config
  }
}
```

⚠️ **Avertissement:** Ralentit le build, augmente la taille du bundle. Peu efficace.

### 💡 Approche recommandée

1. **Accepter** que le front est public
2. **Protéger** vos APIs et données backend
3. **Optimiser** votre SEO pour être trouvé en premier
4. **Monitorer** avec Google Search Console
5. **Focus sur** l'originalité de votre travail, pas sur la protection du code

> **"Le meilleur code est celui qu'on partage"** - Si quelqu'un copie votre site, c'est un compliment. Mettez votre vrai talent ailleurs (backend, projets complexes).

---

## 📦 7. DÉPENDANCES {#dependances}

### Audit actuel

```bash
npm audit
```

**Résultat:** 6 vulnérabilités HIGH détectées

### Correction des vulnérabilités

```bash
# Corriger automatiquement
npm audit fix

# Corriger avec breaking changes si nécessaire
npm audit fix --force

# Vérifier les détails
npm audit --json
```

### Maintenir les dépendances à jour

```bash
# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour toutes les dépendances (respecte semver)
npm update

# Mettre à jour une dépendance spécifique vers la dernière version
npm install react@latest react-dom@latest
```

### Supply Chain Protection

#### **1. Activer Dependabot (GitHub)**

Créer `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "votre-username"
    labels:
      - "dependencies"
      - "security"
```

#### **2. Lockfile integrity**

```bash
# Vérifier l'intégrité du package-lock.json
npm ci

# Régénérer si corrompu
rm -rf node_modules package-lock.json
npm install
```

#### **3. Audit régulier**

```bash
# Exécuter avant chaque déploiement
npm audit --audit-level=high

# Échouer le build si vulnérabilités critiques
npm audit --audit-level=critical
```

### Dépendances minimales

**Votre projet actuel:**
- `next` - Framework
- `react` + `react-dom` - Library
- `react-icons` - Icônes
- Tailwind CSS (dev) - Styles

✅ **Très bon** - Peu de dépendances = surface d'attaque réduite

### CI/CD Security Check

Ajouter dans **GitHub Actions** (`.github/workflows/security.yml`):

```yaml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'  # Tous les lundis

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm audit --audit-level=high
```

---

## 📞 Support

**Problème de sécurité ?**
- GitHub Issues: https://github.com/tchiboub-dot/portfolio/issues
- Email: taha.adnane.chiboub@gmail.com

**Ressources:**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Vercel Security Best Practices](https://vercel.com/docs/security)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [SecurityHeaders.com](https://securityheaders.com/)

---

**Dernière mise à jour:** Mars 2026  
**Version:** 1.0.0
