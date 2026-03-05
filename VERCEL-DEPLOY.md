# 🚀 Déployer sur Vercel - Guide étape par étape

## Prérequis

- [ ] Compte Resend créé (https://resend.com)
- [ ] Resend API Key obtenue (`re_...`)
- [ ] Code pushé sur GitHub/Git
- [ ] Projet connecté à Vercel

---

## Étape 1 : Préparer Resend

### 1.1 Créer/obtenir une adresse "From" validée

**Option A - Gratuit** (recommandé pour tests) :
- Utiliser `onboarding@resend.dev` (fourni par défaut)
- Aucune configuration nécessaire

**Option B - Professionnel** (domaine personnel) :
1. Resend Dashboard → **Domains**
2. Cliquer "Add Domain"
3. Entrer votre domaine (ex: `portfolio-tadnane.com`)
4. Résoudre les TXT/DKIM records (suivre les instructions)
5. Une fois vérifié, utiliser : `noreply@portfolio-tadnane.com`

**Pour cette démo, utiliser Option A** ✅

---

## Étape 2 : Ajouter les variables Vercel

### 2.1 Aller dans le dashboard Vercel

```
1. https://vercel.com/dashboard
2. Cliquer sur votre projet "portfolio"
3. Aller à Settings (onglet en haut)
```

### 2.2 Ajouter les variables d'environnement

Cliquer sur **"Environment Variables"**

Pour chaque variable :
1. Cliquer **"Add new"**
2. Remplir le formulaire :

#### Variable 1 : RESEND_API_KEY

| Champ | Valeur |
|-------|--------|
| Name | `RESEND_API_KEY` |
| Value | `re_...` (votre vraie clé Resend) |
| Environments | Sélectionner ✓ Production, ✓ Preview, ✓ Development |

Cliquer **Save**

#### Variable 2 : CONTACT_TO_EMAIL

| Champ | Valeur |
|-------|--------|
| Name | `CONTACT_TO_EMAIL` |
| Value | `taha.adnane.chiboub@gmail.com` |
| Environments | ✓ Production, ✓ Preview, ✓ Development |

Cliquer **Save**

#### Variable 3 : CONTACT_FROM_EMAIL

| Champ | Valeur |
|-------|--------|
| Name | `CONTACT_FROM_EMAIL` |
| Value | `onboarding@resend.dev` (ou votre domaine) |
| Environments | ✓ Production, ✓ Preview, ✓ Development |

Cliquer **Save**

---

## Étape 3 : Redéployer

Après avoir ajouté les 3 variables :

### Option A : Via Git Push (recommandé)
```bash
cd c:\Users\mlap\OneDrive\Desktop\appli-complete\portfolio
git add .
git commit -m "fix: contact form with Resend integration"
git push origin main
```

Vercel va **automatiquement** redéployer avec les nouvelles variables.

### Option B : Redeploy manuel
1. Vercel Dashboard → **Deployments**
2. Cliquer sur le dernier déploiement
3. Cliquer le menu **...** → **Redeploy**
4. Cocher **"Clear cache"**
5. Confirmer

---

## Étape 4 : Vérifier le déploiement

### 4.1 Attendre la build

- Aller à **Deployments**
- Attendre que le statut passe à "Ready" ✅

### 4.2 Tester le formulaire

1. Visiter : `https://votre-portfolio.vercel.app`
2. Scroller à la section **Contact**
3. Remplir et envoyer un message

### 4.3 Vérifier la réception

- Check votre boîte email (`CONTACT_TO_EMAIL`)
- L'email devrait arriver en 1-5 secondes

---

## 🔍 Si ça ne marche pas

### Message : "Configuration serveur: clé API manquante"

**Cause** : `RESEND_API_KEY` n'est pas définie
**Solution** :
1. Vercel Settings → Environment Variables
2. Vérifier que `RESEND_API_KEY` existe
3. Redéployer (Clear cache)

### Message : "Adresse 'from' n'est pas validée"

**Cause** : `CONTACT_FROM_EMAIL` n'existe pas ou invalide
**Solution** :
1. Si `onboarding@resend.dev` : doit marcher
2. Si domaine personnel : vérifier dans Resend Domains que c'est "Verified"
3. Redéployer

### Message : "Destinataire email manquant"

**Cause** : `CONTACT_TO_EMAIL` n'est pas définie
**Solution** :
1. Vercel → Environment Variables
2. Ajouter `CONTACT_TO_EMAIL=votre.email@gmail.com`
3. Redéployer

### Pas d'erreur mais pas d'email reçu

**Vérifications** :
1. Vérifier dossier Spam/Promotions
2. Vérifier Resend Dashboard → **Emails** (vérifier si l'email a été envoyé)
3. Vérifier Vercel Logs → **Deployments → Logs** (chercher "Error")

### Test via curl pour debug

```bash
curl -X POST https://votre-portfolio.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Ceci est un message de test",
    "website": ""
  }'
```

La réponse doit être : `{"ok":true}`

---

## ✅ Checklist final

- [ ] 3 variables d'env ajoutées en Vercel
- [ ] Redéploiement effectué (clair cache)
- [ ] Build status = "Ready" ✅
- [ ] Formulaire accessible
- [ ] Envoi produit "Message envoye"
- [ ] Email reçu dans la boîte

---

## 📚 Documents de référence

- [CONTACT-FORM-SETUP.md](CONTACT-FORM-SETUP.md) - Troubleshooting détaillé
- [API-CONTACT.md](API-CONTACT.md) - Spécifications de l'API
- [CONTACT-FIX-SUMMARY.md](CONTACT-FIX-SUMMARY.md) - Résumé des corrections

---

## 🎯 Résumé

Vous avez :
1. Backend Resend avec sécurité (rate limit, spam detection)
2. Frontend UX claire (loading, success, error)
3. Variables d'env sécurisées (jamais côté client)
4. Documentation complète pour Vercel

Le formulaire est **prêt pour la production** ! 🚀
