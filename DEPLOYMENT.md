# 🚀 Guide de Déploiement sur Vercel

Ce guide vous accompagne étape par étape pour déployer votre portfolio sur Vercel.

## 📋 Prérequis

- Un compte GitHub (gratuit) - [https://github.com/signup](https://github.com/signup)
- Un compte Vercel (gratuit) - [https://vercel.com/signup](https://vercel.com/signup)

## 🎯 Méthode 1 : Déploiement via GitHub (Recommandée)

### Étape 1 : Créer un repository GitHub

1. **Connectez-vous à GitHub**
   - Allez sur [https://github.com](https://github.com)
   - Connectez-vous avec votre compte

2. **Créer un nouveau repository**
   - Cliquez sur le bouton `+` en haut à droite
   - Sélectionnez `New repository`
   - Nom du repository : `portfolio` ou `mon-portfolio`
   - Description : "Mon portfolio professionnel"
   - Sélectionnez `Public` ou `Private`
   - **NE cochez PAS** "Initialize this repository with a README"
   - Cliquez sur `Create repository`

### Étape 2 : Pousser votre code sur GitHub

Ouvrez le terminal PowerShell dans le dossier du portfolio et exécutez :

```powershell
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Portfolio Next.js"

# Renommer la branche en main
git branch -M main

# Ajouter l'origine remote (REMPLACEZ 'votre-username' par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/votre-username/portfolio.git

# Pousser le code
git push -u origin main
```

**Note :** Si c'est votre première fois avec Git, vous devrez peut-être configurer :
```powershell
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@exemple.com"
```

### Étape 3 : Connecter Vercel à GitHub

1. **Allez sur Vercel**
   - Visitez [https://vercel.com](https://vercel.com)
   - Cliquez sur `Sign Up` si vous n'avez pas de compte
   - Sélectionnez `Continue with GitHub`
   - Autorisez Vercel à accéder à votre compte GitHub

2. **Importer votre projet**
   - Une fois connecté, cliquez sur `Add New...` puis `Project`
   - Vercel affichera la liste de vos repositories GitHub
   - Trouvez votre repository `portfolio`
   - Cliquez sur `Import`

### Étape 4 : Configurer le projet

Vercel détectera automatiquement qu'il s'agit d'un projet Next.js.

1. **Configuration du projet**
   - **Project Name** : Laissez le nom par défaut ou personnalisez-le
   - **Framework Preset** : Next.js (détection automatique)
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : `next build` (par défaut)
   - **Output Directory** : `.next` (par défaut)

2. **Variables d'environnement** (optionnel)
   - Pour l'instant, aucune variable d'environnement n'est nécessaire
   - Vous pouvez en ajouter plus tard si besoin

3. **Déployer**
   - Cliquez sur le bouton `Deploy`
   - Vercel va :
     - Installer les dépendances
     - Construire votre application
     - Déployer sur son CDN global
   - ⏱️ Attendez 2-3 minutes

### Étape 5 : Votre portfolio est en ligne ! 🎉

Une fois le déploiement terminé :

1. **URL de votre portfolio**
   - Vercel vous donnera une URL : `https://votre-portfolio.vercel.app`
   - Cette URL est permanente et publique

2. **Certificat SSL**
   - Votre site est automatiquement sécurisé avec HTTPS
   - Certificat SSL gratuit et automatique

3. **Domaine personnalisé** (optionnel)
   - Vous pouvez ajouter votre propre domaine
   - Allez dans `Settings` > `Domains`

## 🎯 Méthode 2 : Déploiement via Vercel CLI

Si vous préférez utiliser la ligne de commande :

### Étape 1 : Installer Vercel CLI

```powershell
npm install -g vercel
```

### Étape 2 : Se connecter

```powershell
vercel login
```

Suivez les instructions pour vous connecter via votre navigateur.

### Étape 3 : Déployer

```powershell
# Dans le dossier du portfolio
cd portfolio

# Déployer en preview
vercel

# Déployer en production
vercel --prod
```

Vercel vous posera quelques questions :
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Sélectionnez votre compte
- **Link to existing project?** → `N` (No)
- **What's your project's name?** → `portfolio` (ou votre choix)
- **In which directory is your code located?** → `./` (appuyez sur Entrée)

Attendez la fin du déploiement et votre URL s'affichera !

## 🔄 Mises à jour automatiques

Avec la méthode GitHub + Vercel :

1. **Modifiez votre code localement**
2. **Committez et poussez :**
   ```powershell
   git add .
   git commit -m "Mise à jour du portfolio"
   git push
   ```
3. **Vercel redéploie automatiquement !**
   - Chaque push déclenche un nouveau déploiement
   - Vous recevrez une notification par email
   - Preview des branches disponible

## 🌐 Ajouter le lien sur LinkedIn

### Étape 1 : Copier l'URL du portfolio

Copiez l'URL Vercel : `https://votre-portfolio.vercel.app`

### Étape 2 : Mettre à jour LinkedIn

1. **Allez sur votre profil LinkedIn**
   - [https://www.linkedin.com](https://www.linkedin.com)

2. **Modifier le profil**
   - Cliquez sur l'icône de crayon pour modifier

3. **Ajouter le site web**
   - Section "Contact info" ou "Informations de contact"
   - Cliquez sur l'icône de crayon
   - **Website** : Collez l'URL de votre portfolio
   - **Type** : Sélectionnez "Portfolio" ou "Personal Website"
   - Cliquez sur `Save`

4. **Ajouter dans le résumé**
   - Section "About" ou "À propos"
   - Ajoutez une ligne :
     ```
     🌐 Portfolio : https://votre-portfolio.vercel.app
     ```

5. **Partager une publication** (optionnel mais recommandé)
   - Créez une nouvelle publication
   - Texte suggéré :
     ```
     🚀 Heureux de partager mon nouveau portfolio en ligne !
     
     Développé avec Next.js et déployé sur Vercel, il présente mes 
     projets, compétences et parcours.
     
     N'hésitez pas à y jeter un œil et à me faire vos retours 😊
     
     🔗 [URL de votre portfolio]
     
     #WebDevelopment #NextJS #Portfolio #ESISA
     ```

## 🎨 Personnaliser votre domaine Vercel (optionnel)

### Domaine gratuit Vercel

Par défaut : `votre-portfolio.vercel.app`

Pour le personnaliser :
1. Allez dans les settings du projet sur Vercel
2. Section `Domains`
3. Cliquez sur `Edit` à côté de votre domaine
4. Vous pouvez changer le préfixe (ex: `taha-chiboub.vercel.app`)

### Domaine personnalisé (payant)

Si vous avez acheté un domaine (ex: `tahachiboub.com`) :
1. Allez dans `Settings` > `Domains`
2. Cliquez sur `Add`
3. Entrez votre domaine
4. Suivez les instructions pour configurer les DNS

## 🐛 Résolution de problèmes

### Erreur : "Build failed"

**Solution :**
1. Vérifiez que toutes les dépendances sont dans `package.json`
2. Testez localement : `npm run build`
3. Consultez les logs d'erreur sur Vercel

### Erreur : "Module not found"

**Solution :**
1. Vérifiez les imports dans vos fichiers
2. Assurez-vous que tous les composants existent
3. Vérifiez la casse des noms de fichiers

### Le site ne se met pas à jour

**Solution :**
1. Vérifiez que vous avez bien poussé sur GitHub
2. Allez sur Vercel > Deployments
3. Vérifiez le statut du dernier déploiement
4. Redéployer manuellement si nécessaire

## 📊 Analytics et monitoring (optionnel)

Vercel propose des analytics gratuits :
1. Allez sur votre projet dans Vercel
2. Onglet `Analytics`
3. Activez les analytics
4. Vous verrez les visites, performances, etc.

## ✅ Checklist de déploiement

- [ ] Code poussé sur GitHub
- [ ] Projet importé dans Vercel
- [ ] Déploiement réussi
- [ ] URL fonctionnelle
- [ ] Toutes les sections s'affichent correctement
- [ ] Responsive testé (mobile, tablette, desktop)
- [ ] Liens LinkedIn et GitHub fonctionnels
- [ ] Formulaire de contact testé
- [ ] URL ajoutée sur LinkedIn
- [ ] Publication partagée sur LinkedIn (optionnel)

## 🎉 Félicitations !

Votre portfolio est maintenant en ligne et accessible à tous !

**N'oubliez pas de :**
- ✅ Partager le lien sur vos réseaux sociaux
- ✅ L'ajouter dans votre CV
- ✅ L'utiliser lors de candidatures
- ✅ Le mettre à jour régulièrement

---

**Support :**
- Documentation Vercel : [https://vercel.com/docs](https://vercel.com/docs)
- Documentation Next.js : [https://nextjs.org/docs](https://nextjs.org/docs)

**Bonne chance ! 🚀**
