# 📸 Comment ajouter votre photo de profil

## 📁 Dossier public

Ce dossier contient tous les fichiers statiques (images, etc.) qui seront affichés dans votre portfolio.

## 🖼️ Ajouter votre photo

1. **Enregistrez votre photo** dans ce dossier (`/public`)
   - Nommez-la : `photo-profil.jpg` ou changez le nom dans `components/Hero.js`
   - Formats acceptés : `.jpg`, `.png`, `.webp`
   - Taille recommandée : 500x500 pixels minimum

2. **Formats de nom acceptés** :
   - `photo-profil.jpg` (par défaut)
   - `profile.jpg`
   - Quelconque autre nom de fichier

3. **Si vous changerez le nom** :
   - Ouvrez `components/Hero.js`
   - Trouvez : `photo: '/photo-profil.jpg'`
   - Changez par : `photo: '/votre-nom-fichier.jpg'`

## 📝 Étapes pour ajouter la photo

### Option 1 : Via VS Code
1. Clic droit sur le dossier `public`
2. Sélectionnez "Reveal in File Explorer"
3. Collez votre photo dans le dossier

### Option 2 : Directement sur le système de fichiers
1. Ouvrez l'Explorateur Windows
2. Allez à : `C:\Users\mlap\OneDrive\Desktop\appli-complete\portfolio\public`
3. Collez votre `photo-profil.jpg`

### Option 3 : Via Terminal
```bash
# Copier la photo
cp /chemin/vers/photo.jpg ./public/photo-profil.jpg
```

## ✅ Vérifier que ça marche

1. Sauvegardez la photo dans le dossier `public`
2. Lancez le serveur : `npm run dev`
3. Ouvrez http://localhost:3000
4. Votre photo devrait apparaître avec un cadre bleu rond

## 🆘 Aide

- **Image ne s'affiche pas ?**
  - Vérifiez le nom du fichier
  - Assurez-vous qu'il est dans le dossier `public`
  - Redémarrez le serveur : `Ctrl+C` puis `npm run dev`

- **Image floue ou zoomée ?**
  - Utilisez une image haute résolution (min 500x500)
  - Vérifiez que l'image est carrée

---

**Une fois ajoutée, la photo s'affichera automatiquement dans la section Hero de votre portfolio ! 📸**
