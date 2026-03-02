# ✅ CHECKLIST SÉCURITÉ - AVANT PRODUCTION

## 🔴 CRITIQUE (Bloquer le déploiement si non fait)

- [ ] **Secrets sécurisés**
  - [ ] `.env.local` dans `.gitignore`
  - [ ] Aucun secret dans le code source
  - [ ] Variables d'environnement configurées dans Vercel
  - [ ] Aucun `NEXT_PUBLIC_*` utilisé pour des secrets
  - [ ] Vérifier historique Git pour fuites de secrets

- [ ] **Headers de sécurité**
  - [ ] `vercel.json` déployé avec tous les headers
  - [ ] CSP testée sans erreur dans la console
  - [ ] HTTPS forcé (HSTS activé)

- [ ] **Vulnérabilités**
  - [ ] `npm audit fix` exécuté
  - [ ] Aucune vulnérabilité CRITICAL ou HIGH

---

## 🟠 HAUTE PRIORITÉ (Avant mise en ligne publique)

- [ ] **Formulaire de contact**
  - [ ] Rate limiting testé (4+ messages → refus)
  - [ ] Honeypot field présent et testé
  - [ ] Validation stricte activée (email, longueurs)
  - [ ] Sanitization XSS vérifiée (`<script>` bloqué)
  - [ ] Service d'email configuré (Resend/SendGrid)
  - [ ] Test d'envoi réussi en production

- [ ] **Protections API**
  - [ ] CORS strict (si APIs custom)
  - [ ] Body size limit (10KB)
  - [ ] Pas de stack traces en production
  - [ ] Logging minimal (pas de données sensibles)

- [ ] **Tests de pénétration basiques**
  - [ ] Essayer XSS dans formulaire: `<script>alert('XSS')</script>`
  - [ ] Essayer injection SQL: `' OR '1'='1`
  - [ ] Essayer spam: "viagra casino lottery"
  - [ ] Essayer rate limiting: 5 messages en 30 secondes
  - [ ] Essayer champs trop longs (>2000 caractères)

---

## 🟡 MOYENNE PRIORITÉ (Première semaine)

- [ ] **Monitoring**
  - [ ] Vercel Analytics activé
  - [ ] Error tracking configuré (Sentry optionnel)
  - [ ] Logs vérifiés quotidiennement
  - [ ] Alertes configurées (email si erreurs)

- [ ] **SEO & Réputation**
  - [ ] Google Search Console configuré
  - [ ] Sitemap.xml généré
  - [ ] Meta tags optimisés
  - [ ] Copyright dans le footer
  - [ ] Domaine custom configuré (optionnel)

- [ ] **Dependencies**
  - [ ] Dependabot activé sur GitHub
  - [ ] Package-lock.json commité
  - [ ] CI/CD avec audit automatique

---

## 🟢 BASSE PRIORITÉ (Amélioration continue)

- [ ] **Optimisations avancées**
  - [ ] HSTS preload soumis (hstspreload.org)
  - [ ] DNSSEC activé (si domaine custom)
  - [ ] Cloudflare proxy (optionnel, DDoS protection)
  - [ ] CAPTCHA ajouté si spam élevé

- [ ] **Audits externes**
  - [ ] SecurityHeaders.com → Grade A+
  - [ ] Mozilla Observatory → Grade A+
  - [ ] Lighthouse Security → 100/100
  - [ ] Qualys SSL Labs → A+ (si domaine custom)

- [ ] **Documentation**
  - [ ] README.md à jour
  - [ ] SECURITY.md documenté
  - [ ] .env.example créé

---

## 🧪 TESTS DE SÉCURITÉ

### Test 1: Headers de sécurité
```bash
curl -I https://votre-site.vercel.app | grep -i "security\|x-frame\|x-content\|strict-transport"
```

**Attendu:**
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: ...
```

### Test 2: CSP
1. Ouvrir DevTools → Console
2. Vérifier: Aucune erreur "Content Security Policy"
3. Tester: https://csp-evaluator.withgoogle.com/

### Test 3: Rate Limiting
1. Ouvrir formulaire de contact
2. Envoyer 4 messages rapidement (< 30 secondes)
3. **Attendu:** 4ème message refusé avec erreur "Trop de requêtes"

### Test 4: Honeypot
1. Ouvrir DevTools → Console
2. Remplir le champ caché `website`:
   ```javascript
   document.querySelector('input[name="website"]').value = 'bot'
   ```
3. Envoyer le formulaire
4. **Attendu:** Réponse "200 OK" mais email non envoyé

### Test 5: XSS
1. Dans le formulaire, message: `<script>alert('XSS')</script>`
2. Envoyer
3. **Attendu:** Caractères `<>` retirés, pas d'alerte JavaScript

### Test 6: SQL Injection (non applicable mais bon réflexe)
1. Email: `admin' OR '1'='1`
2. **Attendu:** Validation email échoue (regex strict)

### Test 7: Secrets exposés
```bash
# Rechercher dans le build
grep -r "api_key\|secret\|password" .next/static/
# Attendu: Aucun résultat

# Vérifier l'historique Git
git log --all --full-history --source -- "*.env*"
# Attendu: Aucun commit avec .env.local
```

---

## 📊 SCORES CIBLES

| Outil | Score cible | URL |
|-------|-------------|-----|
| SecurityHeaders.com | **A+** | https://securityheaders.com/ |
| Mozilla Observatory | **A+** | https://observatory.mozilla.org/ |
| Lighthouse Security | **100/100** | DevTools → Lighthouse |
| npm audit | **0 vulnérabilités** | `npm audit` |
| Qualys SSL Labs | **A+** | https://www.ssllabs.com/ssltest/ |

---

## 🚀 COMMANDES RAPIDES

```bash
# Build de production
npm run build

# Audit de sécurité
npm audit --audit-level=high

# Test local
npm run dev
# → http://localhost:3000

# Déploiement Vercel
vercel --prod
```

---

## 📞 ACTIONS SI INCIDENT

### 🚨 Secret exposé (API key dans Git)
1. **Immédiatement:** Révoquer la clé
2. Générer une nouvelle clé
3. Mettre à jour dans Vercel Environment Variables
4. Supprimer de l'historique Git:
   ```bash
   git filter-repo --path .env.local --invert-paths
   git push --force
   ```

### 🚨 Spam massif sur le formulaire
1. Vérifier les logs Vercel
2. Identifier les IPs malveillantes
3. Ajouter Cloudflare (protection DDoS automatique)
4. Activer CAPTCHA (hCaptcha)
5. Réduire le rate limit (2 messages/minute → 1 message/minute)

### 🚨 Vulnérabilité critique détectée
1. `npm audit` → Identifier la dépendance
2. `npm update [package]` → Mettre à jour
3. Si breaking change: Tester le site
4. `git commit -m "security: fix vulnerability in [package]"`
5. `vercel --prod` → Redéployer immédiatement

---

## ✅ VALIDATION FINALE

**Avant de cocher "Production Ready":**

- [ ] Tous les items 🔴 CRITIQUES complétés
- [ ] Tous les items 🟠 HAUTE PRIORITÉ complétés
- [ ] Tests de sécurité passés (7/7)
- [ ] Build production réussi sans warning
- [ ] Site testé en navigation privée (cache vide)
- [ ] Formulaire testé avec succès
- [ ] Headers vérifiés sur SecurityHeaders.com
- [ ] Aucune erreur dans les logs Vercel

---

**🎉 Site sécurisé et prêt pour la production !**

**Date de validation:** ___/___/______  
**Validé par:** _________________  
**Prochaine revue:** Dans 3 mois (rotation secrets + audit dépendances)
