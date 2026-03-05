# 🧪 Test du formulaire Contact en local

## 1️⃣ Démarrer le serveur

```bash
cd c:\Users\mlap\OneDrive\Desktop\appli-complete\portfolio
npm run dev
```

Attendre le message :
```
- ready started server on [::]:3000, url: http://localhost:3000
```

---

## 2️⃣ Accéder au formulaire

1. Ouvrir le navigateur
2. Aller à : http://localhost:3000
3. Scroller jusqu'à la section "Contact"

---

## 3️⃣ Scénarios de test

### Test A : Succès nominal ✅

**Données** :
- Nom : "Jean Dupont"
- Email : "jean@example.com"
- Sujet : "Demande de devis" (optionnel)
- Message : "Bonjour, je souhaiterais discuter d'un projet web. Quel est votre tarif ?"

**Résultat attendu** :
- ✅ Bouton "Envoyer" passe à "Envoi en cours..."
- ✅ Après 1-3 secondes : "Message envoye ✅"
- ✅ Champs réinitialisés
- ✅ Message disparaît après 5 secondes

**Check terminal** :
```
✅ Email envoye de jean@example.com a taha.adnane.chiboub@gmail.com
```

**Vérifier inbox** :
- Email reçu dans `taha.adnane.chiboub@gmail.com`
- Subject : "[Portfolio] Demande de devis"
- Contient le message complet

---

### Test B : Validation - Nom manquant ❌

**Données** :
- Nom : (vide)
- Email : "test@example.com"
- Message : "Message de test"

**Résultat attendu** :
- ❌ Sous le champ Nom : "Le nom est requis" (texte rouge)
- Bouton désactivé tant qu'il n'est pas rempli
- Sous la card d'erreur rouge : "Veuillez corriger les champs"

**Action** : Taper un nom → l'erreur disparaît

---

### Test C : Validation - Email invalide ❌

**Données** :
- Nom : "Test"
- Email : "notanemail"
- Message : "Message de test"

**Résultat attendu** :
- ❌ Sous Email : "Email invalide"
- Impossible d'envoyer

**Action** : Corriger en "test@example.com" → l'erreur disparaît, envoi possible

---

### Test D : Validation - Message trop court ❌

**Données** :
- Nom : "Test"
- Email : "test@example.com"
- Message : "Coucou" (6 caractères)

**Résultat attendu** :
- ❌ Sous Message : "Min 10 caracteres"
- Impossible d'envoyer

**Action** : Ajouter 4 caractères → envoi possible

---

### Test E : Timeout réseau (optionnel) ⏱️

**Comment** : Couper l'internet pendant l'envoi

**Résultat attendu** :
- Card rouge : "Timeout. Verifiez votre connexion."
- Message reste affiché

**Action** : Rétablir connexion → réessayer l'envoi

---

### Test F : Message étendu (limite haute) 📝

**Données** :
- Nom : "Test"
- Email : "test@example.com"
- Message : (2000 caractères - MAX)

**Résultat attendu** :
- Envoi OK
- Compteur affiche "2000 / 2000"
- Email reçu

**Comment générer 2000 caractères** :
```javascript
// Dans la console browser
const text = "Lorem ipsum dolor sit amet... ".repeat(60);
console.log(text.length);  // ~1800+ caractères
```

---

### Test G : Remplir le honeypot 🍯

**Données** :
- Tous les champs valides
- Ouvrir DevTools (F12) → Elements
- Trouver l'input caché : `<input id="website" ...>`
- Remplir une valeur quelconque

**Résultat attendu** :
- ✅ L'UI affiche "Message envoye"
- ❌ **MAIS** : pas d'email réél envoyé (détecte le bot)
- Vérifier inbox : aucun nouvel email

---

## 4️⃣ Tests avancés

### Test comportement UI

**Pendant l'envoi** :
- [ ] Bouton désactivé (grisé, cursor: not-allowed)
- [ ] Champs de saisie désactivés
- [ ] Animation loading "..." visible
- [ ] Messages d'erreur précédents effacés

**Après succès** :
- [ ] Champs vidés
- [ ] Message succès affiché 5 secondes exactement
- [ ] Puis disparaît auto

**Après erreur** :
- [ ] Message d'erreur rouge affiché
- [ ] Champs conservés (pas reset)
- [ ] Impossible d'envoyer 2x rapidement (cooldown 20s)

---

### Test console Browser

Ouvrir DevTools (F12) → **Console**

**Attendu en succès** :
- Aucun erreur JS
- Aucun warning

**Attendu en erreur API** :
```javascript
API error: { ok: false, error: "..." }
```

---

### Test console Terminal (npm run dev)

**Attendu en succès** :
```
✅ Email envoye de test@example.com a taha.adnane.chiboub@gmail.com
```

**Attendu en erreur** :
```
❌ Email sending error: RESEND_API_KEY is not configured
```

---

## 5️⃣ Vérification Email reçu

L'email doit contenir :

✅ **Header** :
- From: onboarding@resend.dev
- To: taha.adnane.chiboub@gmail.com
- Reply-To: test@example.com (du visiteur)
- Subject: [Portfolio] Test

✅ **Body** (HTML) :
- Titre : "Nouveau message du portfolio"
- Champ Nom : "Jean Dupont"
- Champ Email : "jean@example.com" (en lien mailto)
- Champ Sujet : "Test"
- Champ Message : texte complet
- Timestamp + IP du visiteur

---

## 🔧 Troubleshooting Local

### ❌ "Erreur: Impossible de contacter le serveur"

**Cause** : Serveur dev ne tourne pas
**Solution** :
```bash
npm run dev
```

### ❌ "Erreur: Configuration serveur: clé API manquante"

**Cause** : `.env.local` ne contient pas `RESEND_API_KEY`
**Solution** :
1. Ouvrir `.env.local`
2. Vérifier : `RESEND_API_KEY=re_...`
3. Redémarrer : `npm run dev`

### ❌ Email non reçu malgré "Message envoye"

**Cause** : Resend API key valide en local ≠ sandbox vs production
**Solution** :
1. Vérifier la clé dans Resend Dashboard
2. Chercher l'email dans le dashboard Resend → Emails
3. Voir le statut : "Sent" ou "Failed"

### ❌ Spam folder

L'email arrive-t-il en spam ?
- Gmail : vérifier "Promotions" ou "Spam"
- Ajouter à contacts pour futur
- Vérifier SPF/DKIM (Resend gère ça)

---

## ✅ Checklist local

- [ ] `npm run dev` démarre sans erreur
- [ ] Accès à http://localhost:3000
- [ ] Formulaire visible et fonctionnel
- [ ] Validation client OK (erreurs sous champs)
- [ ] Envoi valide → "Message envoye ✅"
- [ ] Email reçu dans 5 secondes
- [ ] Message de succès disparaît après 5s
- [ ] Impossible d'envoyer 2 messages < 20s
- [ ] Console JS : 0 erreur

---

## Prochaine étape

Une fois tous les tests passés → Aller à `VERCEL-DEPLOY.md` pour déployer
