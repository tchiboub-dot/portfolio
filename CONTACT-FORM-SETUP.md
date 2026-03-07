# 📧 Configuration du Formulaire de Contact - Vercel + Resend

## ✅ État actuel
- ✅ Backend `/api/contact` avec Resend (envoi réel)
- ✅ Validation serveur (sécurité)
- ✅ Rate limiting (3 req/min par IP)
- ✅ Messages d'erreur clairs et spécifiques
- ✅ Timeout handling (15s)
- ✅ Honeypot anti-spam
- ✅ Frontend UX améliorée (loading, success, error)

---

## 🔧 Configuration Vercel (OBLIGATOIRE)

### 1. Créer un compte Resend
1. Aller sur https://resend.com
2. S'inscrire (gratuit pour les tests)
3. Vérifier la boîte email

### 2. Obtenir la Resend API Key
1. Dashboard Resend → **API Keys**
2. Copier la clé `re_...`
3. **La garder secrète** (jamais côté client)

### 3. Ajouter et vérifier une adresse "From"
Dans **Vercel → Settings → Environment Variables**, on doit avoir une adresse validée dans Resend.

Options :
- **Option A (Gratuit)** : Utiliser `onboarding@resend.dev` (fourni par défaut)
- **Option B (Professionnel)** : Ajouter votre domaine propre (voir Resend → Domains)

Pour option B :
1. Resend Dashboard → **Domains**
2. Ajouter votre domaine (ex: `contact@votredomaine.com`)
3. Suivre les étapes DNS (TXT records)
4. Une fois vérifié, utiliser cet email dans Vercel

---

## 🚀 Étapes d'installation sur Vercel

### Étape 1 : Ajouter les variables d'environnement

**Dans Vercel Dashboard** :

```
Projet → Settings → Environment Variables
```

Cliquer **"Add New"** pour chacune :

| Nom | Valeur | Exemple |
|-----|--------|---------|
| `RESEND_API_KEY` | Votre clé Resend (`re_...`) | `re_1234567890abcdef` |
| `CONTACT_TO_EMAIL` | Votre email de réception | `votre.email@gmail.com` |
| `CONTACT_EMAIL` | Fallback legacy (optionnel) | `votre.email@gmail.com` |
| `CONTACT_FROM_EMAIL` | Adresse "From" validée | `onboarding@resend.dev` ou `contact@votredomaine.com` |

**Important** : Ces variables doivent être disponibles en **Production** ET **Preview**.

### Étape 2 : Redéployer

Après ajout des variables :

1. Cliquer sur **"Deployments"**
2. Redéployer (rebuild) → le dernier déploiement
3. **IMPORTANT** : Cliquer sur les 3 points `...` → **"Redeploy"** → **"Clear cache"**

Ou simplement refaire un **git push** pour trigger un nouveau build.

---

## 🧪 Tests

### Local (développement)
```bash
npm run dev
# Accéder à http://localhost:3000
# Aller à section Contact
# Tester l'envoi (doit voir "Message envoyé ✅")
```

**Vérifier les logs** :
```bash
# Terminal du serveur (npm run dev)
# Doit voir : ✅ Email envoyé de user@example.com à votre.email@gmail.com
```

### Production (Vercel)
1. Pousser les changements : `git push`
2. Attendre le déploiement
3. Visiter : `https://votreurl-vercel.com`
4. Tester l'envoi

**Vérifier que l'email est reçu** dans votre boîte de réception (`CONTACT_TO_EMAIL`)

---

## 🐛 Troubleshooting

### ❌ "Erreur config: adresse 'from' n'est pas validée"

**Cause** : `CONTACT_FROM_EMAIL` n'existe pas ou n'est pas validé dans Resend

**Solution** :
- Vercel : Vérifier que `CONTACT_FROM_EMAIL` est bien défini
- Resend : Vérifier que cette adresse est dans **Domains** (verified)
- Utiliser `onboarding@resend.dev` temporairement pour tester

### ❌ "Erreur config: clé API invalide"

**Cause** : `RESEND_API_KEY` manquante ou mauvaise

**Solution** :
1. Resend → **API Keys** → Copier la bonne clé (`re_...`)
2. Vercel → Env Variables → Coller exactement
3. Redéployer

### ❌ "Configuration serveur: destinataire email manquant"

**Cause** : `CONTACT_TO_EMAIL` et `CONTACT_EMAIL` non définies

**Solution** : Vercel → Ajouter `CONTACT_TO_EMAIL` = votre email (et `CONTACT_EMAIL` si vous gardez l'ancien nom)

### ✅ Vérification production après fix

1. Vercel → `Settings` → `Environment Variables`
2. Vérifier: `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `RESEND_API_KEY`
3. `Deployments` → `...` → `Redeploy` → cocher `Use existing Build Cache` = **off** (clear cache)
4. Ouvrir le site en production et envoyer un message test
5. Vérifier réponse API `ok: true` et réception de l'email

### ❌ L'email n'est pas reçu

**Vérifier** :
1. Console Vercel Logs : `Deployments → Logs`
2. Spammer/Promotions : L'email peut être filtré
3. Resend Dashboard : Vérifier les **Emails échangés**

### ❌ Timeout (15 secondes)

**Cause** : Problème réseau ou serveur Resend lent

**Solution** :
- Vérifier la connexion internet
- Attendre quelques secondes, réessayer
- Vérifier Resend status : https://status.resend.com

---

## 🔐 Sécurité

✅ **Ce qui est sécurisé** :
- RESEND_API_KEY **jamais exposée** côté client
- Validation stricte serveur (email, longueur, spam)
- Rate limiting (3 requêtes/minute)
- Honeypot anti-bot
- Pas de données sensibles loggées
- Messages d'erreur utiles mais sûrs

---

## 📝 Modifications faites

### Backend (`/api/contact/route.js`)
- ✅ Utilise SDK Resend (plus fiable que fetch brut)
- ✅ Messages d'erreur spécifiques (config, validation, spam)
- ✅ Validation stricte (email, longueurs, contenu)
- ✅ Rate limiting amélioré
- ✅ Logging clairs en dev
- ✅ Support BOTH Next.js App Router

### Frontend (`components/Contact.js`)
- ✅ Sujet optionnel (pas obligatoire)
- ✅ Timeout AbortController (15s)
- ✅ Messages d'erreur du serveur affichés
- ✅ UX améliorée (aria-live, focus)
- ✅ Validation client robuste
- ✅ Honeypot field caché

---

## 🎯 Checkpoint

Avant de déployer, vérifier :

- [ ] ✅ npm run dev → pas d'erreur
- [ ] ✅ Remplir le formulaire → "Message envoyé ✅"
- [ ] ✅ Variable d'env locale : `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- [ ] ✅ Resend Dashboard : Vérifier l'email reçu
- [ ] ✅ Vercel : Ajouter les 3 variables d'env (Production + Preview)
- [ ] ✅ Redéployer sur Vercel
- [ ] ✅ Test en production : Formulaire fonctionne + email reçu

---

## 📚 Ressources

- **Resend Docs** : https://resend.com/docs
- **Next.js API Routes** : https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Vercel Env Vars** : https://vercel.com/docs/projects/environment-variables

---

## ❓ Questions supplémentaires ?

Si le formulaire ne marche pas en production :
1. Vérifier les logs Vercel : `Deployments → Logs`
2. Tester `/api/contact` directement : `curl -X POST https://votreurl/api/contact -d '...'`
3. Contacter support Resend ou Vercel
