#!/usr/bin/env node
/**
 * Utilitaire pour générer un hash bcrypt pour ADMIN_PASSWORD_HASH
 * 
 * Usage :
 *   node scripts/generate-admin-hash.mjs "votre_mot_de_passe_secret"
 * 
 * Ou interactif :
 *   node scripts/generate-admin-hash.mjs
 */

import bcrypt from 'bcryptjs'
import readline from 'readline'

async function generateHash(password) {
  if (!password || password.trim().length === 0) {
    console.error('❌ Le mot de passe ne peut pas être vide.')
    process.exit(1)
  }

  const saltRounds = 12
  console.log('\n🔒 Génération du hash sécurisé (bcrypt 12 rounds)...')
  const hash = await bcrypt.hash(password.trim(), saltRounds)

  console.log('\n======================================================')
  console.log('✅ HASH GÉNÉRÉ AVEC SUCCÈS :')
  console.log('======================================================\n')
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`)
  console.log('Ajoutez cette ligne dans votre fichier .env.local (ou dans Vercel Secrets).')
  console.log('⚠️ NE COMMITEZ JAMAIS CE HASH DANS GIT.')
  console.log('======================================================\n')
}

const argPassword = process.argv[2]

if (argPassword) {
  generateHash(argPassword)
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question('Entrez le mot de passe admin à hasher : ', (pwd) => {
    rl.close()
    generateHash(pwd)
  })
}
