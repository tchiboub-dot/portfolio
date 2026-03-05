# API Contact - Documentation technique

## Endpoint

```
POST /api/contact
```

## Headers requis

```
Content-Type: application/json
```

## Request Body

```json
{
  "name": "string (1-100)",
  "email": "string (email valide, 1-150)",
  "subject": "string (0-200) - optionnel",
  "message": "string (10-2000)",
  "website": "string - honeypot invisible"
}
```

### Notes
- `website` : champ caché (honeypot). Si rempli (bot), le serveur refuse silencieusement
- `subject` : optionnel. Si absent, fallback serveur = "Message depuis Portfolio"
- Message minimum 10 caractères requis

## Réponses

### ✅ Succès (200 OK)
```json
{
  "ok": true
}
```

### ❌ Erreurs validation (400 Bad Request)
```json
{
  "ok": false,
  "error": "Le nom est requis"
}
```

Possibles erreurs 4xx :
- "Le nom est requis"
- "Email requis"
- "Le message est requis"  
- "Le message doit contenir au moins 10 caractères"
- "Email invalide"
- "Format JSON invalide"
- Etc...

### ⏱️ Rate limit exceeded (429 Too Many Requests)
```json
{
  "ok": false,
  "error": "Trop de requetes. Attendez 45s..."
}
```

**Limites** :
- Max 5 requêtes / minute par IP
- Min 20 secondes entre 2 envois du même IP

### 🔴 Erreur serveur (500 Internal Server Error)
```json
{
  "ok": false,
  "error": "Configuration serveur: destinataire email manquant..."
}
```

Causes possibles :
- `RESEND_API_KEY` manquante
- `CONTACT_TO_EMAIL` manquante
- `CONTACT_FROM_EMAIL` invalide ou non vérifié
- Erreur lors de l'envoi via Resend

## Comportement serveur

### Sécurité
1. **Rate limiting** : par IP, stocké en mémoire
2. **Honeypot** : champ `website` caché - si rempli, l'API retourne 200 ok:true sans envoyer
3. **Validation stricte** : email, longueur, contenu
4. **Sanitization XSS** : escape HTML dans body email
5. **Détection spam** : patterns communs (viagra, cialis) → refuse silencieusement

### Envoi email
- Via Resend (SDK officiel)
- From : CONTACT_FROM_EMAIL (doit être vérifié Resend)
- To : CONTACT_TO_EMAIL
- Reply-To : email du visiteur
- Subject : `[Portfolio] {sujet}`
- Format : HTML + timestamps

### Logs
- Dev : log succès et erreurs pour debug
- Prod : erreurs seulement, pas de données sensibles

## Example complet

### Request
```bash
curl -X POST https://votreportfolio.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question freelance",
    "message": "Bonjour, je vous contacte pour discuter d'\''un projet web...",
    "website": ""
  }'
```

### Response (succès)
```json
{
  "ok": true
}
```

L'email est reçu dans la boîte `CONTACT_TO_EMAIL`.

### Response (erreur)
```json
{
  "ok": false,
  "error": "Email invalide"
}
```

## Frontend usage

```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name, email, subject, message, website
  })
})

const data = await response.json()

if (response.ok && data.ok) {
  // Succès
  showSuccess()
} else {
  // Erreur - afficher data.error
  showError(data.error)
}
```

## Variables d'env requises

```
RESEND_API_KEY       = Clé API Resend (re_...)
CONTACT_TO_EMAIL     = Email destinataire
CONTACT_FROM_EMAIL   = Email sender (must be verified in Resend)
```

## Limites

| Limite | Valeur |
|--------|--------|
| Max name | 100 caractères |
| Max email | 150 caractères |
| Max subject | 200 caractères |
| Max message | 2000 caractères |
| Min message | 10 caractères |
| Taille body | 10 KB |
| Requêtes/min | 5 par IP |
| Cooldown | 20 secondes |
