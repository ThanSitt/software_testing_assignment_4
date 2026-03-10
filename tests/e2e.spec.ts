import { test, expect } from '@playwright/test'

test('Test 3 - dog image is retrieved successfully when page is loaded', async ({ page }) => {
  await page.goto('/')

  const dogImage = page.locator('img.dog-image')
  await dogImage.waitFor({ state: 'visible' })

  const src = await dogImage.getAttribute('src')
  expect(src).toBeTruthy()

  expect(src).toMatch(/^https:\/\//)
})

test('Test 4 - dog image is retrieved successfully when button is clicked', async ({ page }) => {

  await page.goto('/')
  await page.locator('img.dog-image').waitFor({ state: 'visible' })

  const [response] = await Promise.all([
    page.waitForResponse(res => res.url().includes('/api/dogs/random') && res.status() === 200),
    page.locator('button.fetch-button').click(),
  ])

  expect(response.status()).toBe(200)

  const dogImage = page.locator('img.dog-image')
  await dogImage.waitFor({ state: 'visible' })

  const src = await dogImage.getAttribute('src')
  expect(src).toBeTruthy()

  expect(src).toMatch(/^https:\/\//)
})

test('Test 5 - shows error when API call fails', async ({ page }) => {
  await page.route('**/api/dogs/random', route => route.abort())

  await page.goto('/')

  const errorElement = page.locator('div.error')
  await errorElement.waitFor({ state: 'visible' })
  await expect(errorElement).toContainText(/error/i)
  await expect(errorElement).toBeVisible()
})