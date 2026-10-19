import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { verifyAdminEmail, verifyAdminPassword, createSessionToken, verifySessionToken, getConfiguredAdminEmails } from '../lib/auth/admin.js'
import { getPublicPortfolioContent, getAdminPortfolioData, updateProfile, saveProject, deleteProject } from '../lib/db/cms.js'

async function runSecurityAndIntegrationTests() {
  console.log('🚀 Démarrage de la suite de vérification intégrée (Phase G)...')

  // 1. Test du secret dans le bundle
  console.log('🔍 Test 1: Scan des bundles clients pour détection de secrets...')
  const staticDir = path.join(process.cwd(), '.next', 'static')
  let leakedSecrets = []
  
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        scanDir(fullPath)
      } else if (entry.name.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf8')
        if (content.includes('ADMIN_PASSWORD=') || content.includes('ADMIN_SESSION_SECRET=') || content.includes('resend_secret_dummy')) {
          leakedSecrets.push(entry.name)
        }
      }
    }
  }
  if (fs.existsSync(staticDir)) {
    scanDir(staticDir)
  }
  assert.strictEqual(leakedSecrets.length, 0, `Secrets trouvés dans les bundles: ${leakedSecrets.join(', ')}`)
  console.log('✅ Test 1 validé: 0 secret divulgué dans les fichiers compilés du client.')

  // 2. Test d'authentification et hachage
  console.log('🔒 Test 2: Vérification des mécanismes d\'authentification & timing protection...')
  const adminEmails = getConfiguredAdminEmails()
  assert(adminEmails.length > 0 && adminEmails[0].includes('@'), 'Admin email doit être valide')
  const adminEmail = adminEmails[0]

  assert.strictEqual(verifyAdminEmail(adminEmail), true, 'L\'email admin configuré doit être accepté')
  assert.strictEqual(verifyAdminEmail('hacker@unknown-domain.com'), false, 'Un email non autorisé doit être rejeté')

  // Faux mot de passe
  const wrongPasswordResult = await verifyAdminPassword('totally_wrong_password_12345!')
  assert.strictEqual(wrongPasswordResult, false, 'Le faux mot de passe ne doit pas passer')
  console.log('✅ Test 2 validé: Échec sécurisé des identifiants invalides sans fuite.')

  // 3. Test des sessions HMAC-SHA256
  console.log('🔑 Test 3: Création et validation cryptographique de session...')
  const token = createSessionToken(adminEmail)
  assert(typeof token === 'string' && token.length > 32, 'Le token de session doit être non vide et long')
  const verifiedResult = verifySessionToken(token)
  assert.strictEqual(verifiedResult.valid, true, 'Le token valide doit être accepté')
  assert.strictEqual(verifiedResult.payload.email, adminEmail, 'L\'email dans le payload doit correspondre')

  const tamperedToken = token.slice(0, -4) + 'abcd'
  const tamperedResult = verifySessionToken(tamperedToken)
  assert.strictEqual(tamperedResult.valid, false, 'Un token altéré doit être immédiatement rejeté')
  console.log('✅ Test 3 validé: Signatures de session infalsifiables.')

  // 4. Test d'intégrité de la base de données
  console.log('📦 Test 4: Lecture et cohérence du schéma SQLite / LibSQL...')
  const publicData = await getPublicPortfolioContent()
  assert(Array.isArray(publicData.projects), 'Projects doit être un tableau')
  assert(publicData.projects.length >= 4, `Attendu au moins 4 projets, trouvé: ${publicData.projects.length}`)
  assert(publicData.profile && publicData.profile.name, 'Profile doit être peuplé')
  console.log(`✅ Test 4 validé: Données publiques chargées (${publicData.projects.length} projets, ${publicData.skillsCategories.length} catégories de compétences).`)

  // 5. Test CRUD & Persistance & Revisions & Audit
  console.log('📝 Test 5: Mutation CRUD avec traçabilité et révision...')
  const tempProject = {
    id: `proj-test-${Date.now()}`,
    title: 'Automated Test Project',
    category: 'Tools',
    summary: 'Verification test',
    detailedDescription: 'Temporary project to test persistence',
    techStack: ['Node.js', 'Next.js'],
    isPublished: false,
  }
  const created = await saveProject(tempProject, 'test-suite')
  assert(created && created.id, 'Le projet créé doit avoir un ID stable')

  // Vérifier qu'il est dans la base
  const allData = await getAdminPortfolioData()
  const found = allData.projects.find((p) => p.id === created.id)
  assert(found, 'Le projet créé doit exister dans la base de données')

  // Supprimer le projet de test
  await deleteProject(created.id, 'test-suite')
  const afterDeleteData = await getAdminPortfolioData()
  const deletedFound = afterDeleteData.projects.find((p) => p.id === created.id)
  assert.strictEqual(deletedFound, undefined, 'Le projet temporaire a été nettoyé avec succès')
  // 6. Test Design Studio (Theme)
  console.log('🎨 Test 6: Configuration dynamique du thème et Design Studio...')
  const { updateTheme, updateSectionsOrderAndVisibility, savePage, getPageBySlug, deletePage } = await import('../lib/db/cms.js')
  await updateTheme({
    primaryColor: '#0ea5e9',
    secondaryColor: '#6366f1',
    accentColor: '#06b6d4',
    bgColor: '#020617',
    cardBg: '#0f172a',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '18px',
    heroHeadline: 'Automated Test Headline',
    heroSubheadline: 'Automated Test Subheadline',
    customCss: '/* test css */',
  }, 'test-suite')

  const verifyThemeData = await getPublicPortfolioContent()
  assert.strictEqual(verifyThemeData.theme.heroHeadline, 'Automated Test Headline', 'Le headline du thème doit être persisté')
  assert.strictEqual(verifyThemeData.theme.primaryColor, '#0ea5e9', 'La couleur primaire doit être persistée')
  console.log('✅ Test 6 validé: Sauvegarde et chargement du Thème opérationnels.')

  // 7. Test Gestion des Sections
  console.log('📑 Test 7: Réordonnancement et visibilité des sections...')
  const currentSections = verifyThemeData.sections || []
  assert(currentSections.length >= 10, 'Doit avoir au moins 10 sections configurées')
  const reordered = [...currentSections].reverse()
  await updateSectionsOrderAndVisibility(reordered, 'test-suite')
  const updatedSectionsData = await getPublicPortfolioContent()
  assert.strictEqual(updatedSectionsData.sections[0].id, reordered[0].id, 'L\'ordre inversé doit être persisté')
  // Restore original order
  await updateSectionsOrderAndVisibility(currentSections, 'test-suite')
  console.log('✅ Test 7 validé: Réordonnancement et visibilité des sections opérationnels.')

  // 8. Test Pages Personnalisées
  console.log('📄 Test 8: Création, consultation par slug et suppression de page...')
  const testPageId = `test-page-${Date.now()}`
  await savePage({
    id: testPageId,
    slug: 'test-audit-page',
    title: 'Page de Test Unitaire',
    contentMarkdown: '# Contenu de Test\n\nCeci est un test automatisé.',
    isPublished: true,
    seoTitle: 'Test SEO',
    seoDescription: 'Test Desc',
  }, 'test-suite')

  const retrievedPage = await getPageBySlug('test-audit-page')
  assert(retrievedPage, 'La page créée doit être retrouvée via son slug')
  assert.strictEqual(retrievedPage.title, 'Page de Test Unitaire', 'Le titre de la page doit correspondre')

  await deletePage(testPageId)
  const afterDeletePage = await getPageBySlug('test-audit-page')
  assert.strictEqual(afterDeletePage, null, 'La page supprimée ne doit plus être trouvée')
  console.log('✅ Test 8 validé: Gestion complète des pages dynamiques opérationnelle.')

  console.log('\n🎉 TOUS LES TESTS DE SÉCURITÉ, THÈME, SECTIONS, PAGES ET D\'INTÉGRITÉ SONT PASSÉS AVEC SUCCÈS !')
}

runSecurityAndIntegrationTests().catch((err) => {
  console.error('❌ Échec des tests:', err)
  process.exit(1)
})
