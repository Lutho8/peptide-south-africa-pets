import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
const temp = await mkdtemp(path.resolve('.partner-tests-'))
try {
  for (const file of ['_shared/partners.ts', 'partner-application.ts', 'partner-attribution.ts', 'partner-programme.ts', 'pets-checkout.ts']) {
    const dest = path.join(temp, file.replace('.ts', '.js'))
    await mkdir(path.dirname(dest), { recursive: true })
    await writeFile(dest, ts.transpileModule(await readFile(path.join('api', file), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText)
  }
  const helper = await import(pathToFileURL(path.join(temp, '_shared/partners.js')))
  const origin = 'https://pets.peptide-south-africa.com'
  const req = (endpoint, method = 'POST', body = {}, other = {}) => new Request(`${origin}/api/${endpoint}`, { method, headers: { origin, 'content-type': 'application/json', ...other }, ...(method !== 'GET' ? { body: JSON.stringify(body) } : {}) })
  assert.equal(helper.sameOrigin(req('pets-checkout')), true)
  assert.equal(helper.sameOrigin(req('pets-checkout', 'POST', {}, { origin: 'https://evil.example' })), false)
  assert.equal(helper.readCookie(req('pets-checkout', 'POST', {}, { cookie: `${helper.COOKIE}=bad` })), null)
  const id = '11111111-1111-4111-8111-111111111111'
  assert.equal(helper.readCookie(req('pets-checkout', 'POST', {}, { cookie: `${helper.COOKIE}=${id}` })), id)
  assert.match(helper.cookie(id, 86400), /Max-Age=86400; Secure; HttpOnly; SameSite=Lax/)
  assert.doesNotMatch(helper.cookie(id), /Domain=/)
  const now = Date.now(), iso = n => new Date(n).toISOString()
  assert.equal(helper.currentClick(iso(now - 1000), iso(now + 1000), 86400, now), true)
  assert.equal(helper.currentClick(iso(now - 86400001), iso(now + 1000), 86400, now), false)
  assert.equal(helper.currentClick(iso(now + 1000), iso(now + 2000), 86400, now), false)
  assert.equal(helper.currentClick('invalid', iso(now + 1000), 86400, now), false)
  const checkout = (await import(pathToFileURL(path.join(temp, 'pets-checkout.js')))).default
  assert.equal((await checkout(req('pets-checkout', 'GET'))).status, 405)
  assert.equal((await checkout(req('pets-checkout', 'POST', {}, { origin: 'https://evil.example' }))).status, 403)
  assert.equal((await checkout(req('pets-checkout'))).status, 401)
  const application = (await import(pathToFileURL(path.join(temp, 'partner-application.js')))).default
  assert.equal((await application(req('partner-application', 'POST', { application_terms: false }))).status, 400)
  assert.equal((await application(req('partner-application', 'POST', { application_terms: true, website: 'bot' }))).status, 400)
  assert.equal((await application(req('partner-application', 'POST', { application_terms: true, email: 'invalid' }))).status, 400)
  let calls = 0
  const untouched = { from() { calls++; throw new Error('must not access database') } }
  assert.equal(await helper.resolveReferral(untouched, req('pets-checkout'), ''), null)
  assert.equal(await helper.activePartner(untouched, 'WELLNESS-123', null), null)
  await assert.rejects(() => helper.resolveReferral(untouched, req('pets-checkout'), 123), /PARTNER_CODE_INVALID/)
  assert.equal(calls, 0)
  console.log('PASS: Pets API method/origin/auth gates, consent/application validation, host-only cookie, expiry and future-date rejection, programme-code isolation, no-cookie checkout.')
} finally { await rm(temp, { recursive: true, force: true }) }
