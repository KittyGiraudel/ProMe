import { expect, test } from '@playwright/test'

test.describe('home tools', () => {
  test('rolls die ', async ({ page }) => {
    await page.goto('/')

    const quickTools = page.getByTestId('tools')
    await expect(quickTools).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Outils rapides' })).toBeVisible()

    const dieCard = quickTools.locator('.ant-card').filter({ hasText: 'Dé' })
    const dieButton = dieCard.getByRole('button', { name: 'Lancer 1D6' })

    await expect(dieCard.getByText('Aucun lancer')).toBeVisible()
    await expect(dieButton).toHaveText('Lancer 1D6')

    await dieButton.click()
    await expect(dieCard.getByRole('button', { name: 'Lancer en cours…' })).toBeVisible()
    await expect(dieCard.locator('.ant-btn-loading')).toHaveCount(1)

    await expect(dieCard.getByRole('button', { name: 'Lancer 1D6' })).toBeVisible()
    await expect(dieCard.locator('.ant-btn-loading')).toHaveCount(0)
    await expect(dieCard.getByRole('img', { name: /Dé [1-6]/ })).toBeVisible()
    await expect(dieCard.getByText('Aucun lancer')).toHaveCount(0)

  })

  test('draw cards', async ({ page }) => {
    await page.goto('/')

    const quickTools = page.getByTestId('tools')
    await expect(quickTools).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Outils rapides' })).toBeVisible()

    const cardCard = quickTools
      .locator('.ant-card')
      .filter({ hasText: 'Carte' })
    const cardButton = cardCard.getByRole('button', { name: 'Tirer 1 carte' })

    await expect(cardCard.getByText('Aucune carte')).toBeVisible()
    await expect(cardButton).toHaveText('Tirer 1 carte')

    await cardButton.click()
    await expect(cardCard.getByRole('button', { name: 'Tirage en cours…' })).toBeVisible()
    await expect(cardCard.locator('.ant-btn-loading')).toHaveCount(1)

    await expect(cardCard.getByRole('button', { name: 'Tirer 1 carte' })).toBeVisible()
    await expect(cardCard.locator('.ant-btn-loading')).toHaveCount(0)
    await expect(cardCard.getByRole('img', { name: / de / })).toBeVisible()
    await expect(cardCard.getByText('Aucune carte')).toHaveCount(0)
  })
})
