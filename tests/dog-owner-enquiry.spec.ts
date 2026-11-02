import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { dogOwnerEnquiryMessage, enquiryCampaign } from '../src/lib/enquiryCampaign'

test('accepts only a single known public campaign code', () => {
  expect(enquiryCampaign('?campaign=senior-dog-flyer-pilot')).toBe('senior-dog-flyer-pilot')
  expect(enquiryCampaign('?campaign=senior-dog-partner-pilot')).toBe('senior-dog-partner-pilot')
  for (const search of ['', '?campaign=', '?campaign=Jane', '?campaign=jane%40example.com', '?campaign=%3Cscript%3E', '?campaign=senior-dog-flyer-pilot&campaign=senior-dog-partner-pilot', '?utm_campaign=senior-dog-flyer-pilot']) {
    expect(enquiryCampaign(search)).toBeNull()
    expect(dogOwnerEnquiryMessage(search)).not.toContain('Campaign reference:')
  }
})

for (const width of [320, 390, 768, 1280, 1440]) {
  test(`education and enquiry work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/dog-owners?campaign=senior-dog-flyer-pilot&email=private%40example.com')
    const links = page.getByRole('link', { name: 'Ask us on WhatsApp', exact: true })
    await expect(links).toHaveCount(2)
    for (const link of await links.all()) {
      const href = new URL((await link.getAttribute('href'))!)
      expect(href.origin + href.pathname).toBe('https://wa.me/27721242377')
      expect(href.searchParams.get('text')).toContain('Campaign reference: senior-dog-flyer-pilot')
      expect(href.href).not.toContain('private')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    }
    await expect(page.getByText('We do not provide diagnoses, prescriptions or dosing.')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    // Audit the added enquiry section, rather than unrelated existing site widgets.
    const audit = await new AxeBuilder({ page }).include('section[aria-labelledby="enquiry-heading"]').analyze()
    expect(audit.violations).toEqual([])
    if (width < 1280) {
      const headerLink = page.locator('nav').getByRole('link', { name: 'WhatsApp us', exact: true }).filter({ visible: true })
      await expect(headerLink).toBeVisible()
      expect((await headerLink.boundingBox())!.width).toBeGreaterThanOrEqual(44)
      await headerLink.focus()
      await expect(headerLink).toBeFocused()
      expect(await headerLink.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none')
      await page.getByRole('button', { name: 'Open menu', exact: true }).click()
      const drawerLink = page.getByRole('link', { name: 'WhatsApp us', exact: true }).filter({ visible: true }).last()
      await drawerLink.scrollIntoViewIfNeeded()
      await expect(drawerLink).toBeInViewport()
      await expect(drawerLink).toHaveAttribute('href', /senior-dog-flyer-pilot/)
    }
  })
}

test('no attribution persists or leaks into later journeys', async ({ page }) => {
  await page.goto('/dog-owners?campaign=senior-dog-partner-pilot')
  await expect(page.getByRole('link', { name: 'Ask us on WhatsApp' }).first()).toHaveAttribute('href', /senior-dog-partner-pilot/)
  await page.goto('/dog-owners?campaign=someone%40example.com')
  await expect(page.getByRole('link', { name: 'Ask us on WhatsApp' }).first()).not.toHaveAttribute('href', /Campaign|someone/)
  await page.goto('/dog-owners')
  await expect(page.getByRole('link', { name: 'Ask us on WhatsApp' }).first()).not.toHaveAttribute('href', /Campaign/)
  await page.goto('/science?campaign=senior-dog-flyer-pilot')
  await expect(page.locator('nav').getByRole('link', { name: 'WhatsApp us', exact: true }).first()).not.toHaveAttribute('href', /Campaign|dog-owner/)
})
