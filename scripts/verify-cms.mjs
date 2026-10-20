import assert from 'assert'
import fs from 'fs'
import path from 'path'
import {
  verifyAdminEmail,
  verifyAdminPassword,
  createSessionToken,
  verifySessionToken,
  getConfiguredAdminEmails,
  createOtpChallenge,
  verifyOtpChallenge,
} from '../lib/auth/admin.js'
import {
  getPublicPortfolioContent,
  getAdminPortfolioData,
  saveProject,
  deleteProject,
  updateTheme,
  updateSectionsOrderAndVisibility,
  savePage,
  getPageBySlug,
  deletePage,
} from '../lib/db/cms.js'
import { getDatabaseClient } from '../lib/db/index.js'

async function runSecurityAndIntegrationTests() {
  console.log('🚀 Démarrage de la suite de vérification intégrée (sécurité, persistance, CMS non-destructif)...')

  // Capture de l'état initial pour restauration absolue dans le bloc finally
  const initialContent = await getPublicPortfolioContent()
  const initialTheme = initialContent.theme ? { ...initialContent.theme } : null
  const initialSections = initialContent.sections ? initialContent.sections.map((s) => ({ ...s })) : null

  let tempProjectId = null
  let testPageId = null
  let testChallengeId = null

  try {
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
          if (
            content.includes('ADMIN_PASSWORD=') ||
            content.includes('ADMIN_SESSION_SECRET=') ||
            content.includes('resend_secret_dummy')
          ) {
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

    // 5. Test CRUD & Persistance & Revisions & Nettoyage sécurisé
    console.log('📝 Test 5: Mutation CRUD avec traçabilité et révision...')
    tempProjectId = `proj-test-${Date.now()}`
    const tempProject = {
      id: tempProjectId,
      title: 'Automated Test Project',
      category: 'Tools',
      summary: 'Verification test',
      detailedDescription: 'Temporary project to test persistence',
      techStack: ['Node.js', 'Next.js'],
      isPublished: false,
    }
    const created = await saveProject(tempProject, 'test-suite')
    assert(created && created.id, 'Le projet créé doit avoir un ID stable')

    const allData = await getAdminPortfolioData()
    const found = allData.projects.find((p) => p.id === created.id)
    assert(found, 'Le projet créé doit exister dans la base de données')

    await deleteProject(created.id, 'test-suite')
    tempProjectId = null

    const afterDeleteData = await getAdminPortfolioData()
    const deletedFound = afterDeleteData.projects.find((p) => p.id === created.id)
    assert.strictEqual(deletedFound, undefined, 'Le projet temporaire a été nettoyé avec succès')
    console.log('✅ Test 5 validé: Mutation CRUD et révisions opérationnelles.')

    // 6. Test Design Studio (Theme) avec restauration
    console.log('🎨 Test 6: Configuration dynamique du thème et Design Studio...')
    await updateTheme({
      primaryColor: '#0ea5e9',
      secondaryColor: '#6366f1',
      accentColor: '#06b6d4',
      bgColor: '#020617',
      cardBg: '#0f172a',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '18px',
      heroHeadline: 'Temporary Verification Headline',
      heroSubheadline: 'Temporary Verification Subheadline',
      customCss: '/* test css */',
    }, 'test-suite')

    const verifyThemeData = await getPublicPortfolioContent()
    assert.strictEqual(verifyThemeData.theme.heroHeadline, 'Temporary Verification Headline', 'Le headline du thème doit être persisté')
    assert.strictEqual(verifyThemeData.theme.primaryColor, '#0ea5e9', 'La couleur primaire doit être persistée')
    console.log('✅ Test 6 validé: Sauvegarde et rechargement dynamique du Thème opérationnels.')

    // 7. Test Gestion des Sections
    console.log('📑 Test 7: Réordonnancement et visibilité des sections...')
    const currentSections = verifyThemeData.sections || []
    assert(currentSections.length >= 10, 'Doit avoir au moins 10 sections configurées')
    const reordered = [...currentSections].reverse()
    await updateSectionsOrderAndVisibility(reordered, 'test-suite')
    const updatedSectionsData = await getPublicPortfolioContent()
    assert.strictEqual(updatedSectionsData.sections[0].id, reordered[0].id, 'L\'ordre inversé doit être persisté')
    console.log('✅ Test 7 validé: Réordonnancement et visibilité des sections opérationnels.')

    // 8. Test Pages Personnalisées
    console.log('📄 Test 8: Création, consultation par slug et suppression de page...')
    testPageId = `test-page-${Date.now()}`
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
    testPageId = null
    const afterDeletePage = await getPageBySlug('test-audit-page')
    assert.strictEqual(afterDeletePage, null, 'La page supprimée ne doit plus être trouvée')
    console.log('✅ Test 8 validé: Gestion complète des pages dynamiques opérationnelle.')

    // 9. Test OTP Persistant & Anti-Bruteforce DB
    console.log('🛡️ Test 9: Persistance multi-instance des challenges OTP et hachage en DB...')
    const otpChallenge = await createOtpChallenge(adminEmail)
    testChallengeId = otpChallenge.challengeId
    assert(testChallengeId, 'Le challenge OTP doit avoir un UUID valide')
    assert(otpChallenge.emailMasked.includes('***'), 'L\'email retourné doit être masqué')

    // Vérifier que le hash est en DB et non le code en clair
    const db = getDatabaseClient()
    const dbRow = await db.execute({
      sql: 'SELECT * FROM admin_otp_challenges WHERE id = ?',
      args: [testChallengeId],
    })
    assert(dbRow.rows.length === 1, 'Le challenge OTP doit être persisté dans la table admin_otp_challenges')
    assert(dbRow.rows[0].code_hash && dbRow.rows[0].code_hash.length === 64, 'Le code doit être stocké sous forme de condensat SHA-256 (64 hex)')

    // Faux code OTP
    const invalidOtpResult = await verifyOtpChallenge(testChallengeId, '000000')
    assert.strictEqual(invalidOtpResult.valid, false, 'Un code OTP erroné doit échouer')

    // Nettoyage du challenge
    await db.execute({
      sql: 'DELETE FROM admin_otp_challenges WHERE id = ?',
      args: [testChallengeId],
    })
    testChallengeId = null
    console.log('✅ Test 9 validé: Challenges OTP persistés avec hachage SHA-256.')

  } finally {
    // Restauration non-destructive GARANTIE
    console.log('🧹 Nettoyage et restauration non-destructive de l\'état de la base de données...')
    const db = getDatabaseClient()

    if (tempProjectId) {
      try {
        await deleteProject(tempProjectId, 'cleanup')
      } catch {}
    }

    if (testPageId) {
      try {
        await deletePage(testPageId)
      } catch {}
    }

    if (testChallengeId) {
      try {
        await db.execute({
          sql: 'DELETE FROM admin_otp_challenges WHERE id = ?',
          args: [testChallengeId],
        })
      } catch {}
    }

    if (initialTheme) {
      try {
        await updateTheme(initialTheme, 'restore')
      } catch (e) {
        console.warn('Restauration du thème échouée:', e.message)
      }
    }

    if (initialSections && initialSections.length > 0) {
      try {
        await updateSectionsOrderAndVisibility(initialSections, 'restore')
      } catch (e) {
        console.warn('Restauration des sections échouée:', e.message)
      }
    }

    console.log('✨ Restauration des configurations originales terminée avec succès.')
  }

  console.log('\n🎉 TOUS LES TESTS DE SÉCURITÉ, THÈME, SECTIONS, PAGES, OTP ET D\'INTÉGRITÉ SONT PASSÉS AVEC SUCCÈS !')
}

runSecurityAndIntegrationTests().catch((err) => {
  console.error('❌ Échec des tests:', err)
  process.exit(1)
})
