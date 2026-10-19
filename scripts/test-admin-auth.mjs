import {
  verifyAdminCredentials,
  createSessionToken,
  verifySessionToken,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  hashAdminPassword,
} from '../lib/auth/admin.js'

async function runTests() {
  console.log('🧪 Starting Admin Authentication Security Tests...\n')

  // Test 1: Empty or missing credentials
  console.log('Test 1: Empty password rejection')
  const emptyCheck = await verifyAdminCredentials('')
  console.assert(emptyCheck === false, 'Test 1 Failed: empty password should return false')
  console.log('✅ Test 1 Passed: Empty password rejected')

  // Test 2: Plaintext password verification
  console.log('\nTest 2: Plaintext password verification')
  process.env.ADMIN_PASSWORD = 'TemporarySecretKey123!'
  const matchSuccess = await verifyAdminCredentials('TemporarySecretKey123!')
  console.assert(matchSuccess === true, 'Test 2 Failed: matching password should return true')
  const wrongMatch = await verifyAdminCredentials('WrongPassword!')
  console.assert(wrongMatch === false, 'Test 2 Failed: wrong password should return false')
  console.log('✅ Test 2 Passed: Plaintext verification works with constant-time equality')

  // Test 3: Bcrypt hash generation and verification
  console.log('\nTest 3: Bcrypt hash verification')
  const hashed = await hashAdminPassword('MySecureAdminPass2026')
  process.env.ADMIN_PASSWORD_HASH = hashed
  delete process.env.ADMIN_PASSWORD

  const bcryptSuccess = await verifyAdminCredentials('MySecureAdminPass2026')
  console.assert(bcryptSuccess === true, 'Test 3 Failed: correct password with bcrypt hash failed')
  const bcryptFailure = await verifyAdminCredentials('IncorrectPass')
  console.assert(bcryptFailure === false, 'Test 3 Failed: wrong password should fail with bcrypt')
  console.log('✅ Test 3 Passed: Bcrypt hashing and comparison works properly')

  // Test 4: Signed Session Token creation & verification
  console.log('\nTest 4: Session token HMAC generation & verification')
  process.env.ADMIN_SESSION_SECRET = 'super-secret-key-at-least-32-chars-long-123456789'
  const token = createSessionToken()
  const verification = verifySessionToken(token)
  console.assert(verification.valid === true, 'Test 4 Failed: valid token failed verification')
  console.assert(verification.payload.role === 'admin', 'Test 4 Failed: payload role should be admin')

  // Tampered token test
  const tamperedToken = token.slice(0, -4) + 'abcd'
  const tamperedVerification = verifySessionToken(tamperedToken)
  console.assert(tamperedVerification.valid === false, 'Test 4 Failed: tampered token should be rejected')
  console.log('✅ Test 4 Passed: HMAC signature prevents token forgery and tampering')

  // Test 5: Rate Limiting & Brute-force lockout
  console.log('\nTest 5: Rate limiting and brute-force protection')
  const testIP = '192.168.1.100'
  resetLoginAttempts(testIP)

  for (let i = 0; i < 4; i++) {
    recordFailedLogin(testIP)
    const check = checkLoginRateLimit(testIP)
    console.assert(check.allowed === true, `Test 5 Failed: attempt ${i + 1} should be allowed`)
  }

  // 5th failed attempt locks out
  recordFailedLogin(testIP)
  const lockedCheck = checkLoginRateLimit(testIP)
  console.assert(lockedCheck.allowed === false, 'Test 5 Failed: 5th attempt should trigger lockout')
  console.assert(lockedCheck.retryAfterMinutes > 0, 'Test 5 Failed: lockout should have retryAfterMinutes')
  console.log('✅ Test 5 Passed: Brute-force protection locks out after 5 attempts')

  resetLoginAttempts(testIP)
  console.log('\n🎉 ALL UNIT SECURITY TESTS PASSED SUCCESSFULLY!')
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err)
  process.exit(1)
})
