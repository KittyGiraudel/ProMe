import { expect, test } from '@playwright/test'

test.describe('public smoke', () => {
  test('home, generators, and character sheet navigation', async ({
    page,
  }) => {
    test.setTimeout(60_000)

    // HomeHub
    await page.goto('/')

    // Inhabitant generator (first load is "empty" because no `?i=` query param).
    await page.locator('a[href="/generators/inhabitant"]').click()
    await expect(page.locator('.layout__title')).toBeVisible()

    const inhabitantEmpty = page.locator('.inhabitant-summary--empty')
    await expect(inhabitantEmpty).toBeVisible()

    // Trigger a reroll to make the summary non-empty.
    await page.locator('.roll-actions').scrollIntoViewIfNeeded()
    await page.locator('.roll-actions .ant-btn-primary').first().click()
    await expect(inhabitantEmpty).toHaveCount(0)

    // Village generator
    await page.goto('/generators/village')
    const villageEmpty = page.locator('.village-summary--empty')
    await expect(villageEmpty).toBeVisible()

    await page.locator('.roll-actions').scrollIntoViewIfNeeded()
    await page.locator('.roll-actions .ant-btn-primary').first().click()
    await expect(villageEmpty).toHaveCount(0)

    // Characters library -> create a draft -> land on character sheet.
    await page.goto('/characters')

    const createButton = page
      .locator('.layout__body button.ant-btn-primary')
      .first()
    await expect(createButton).toBeVisible()
    await createButton.click()

    await expect(page).toHaveURL(/\/characters\/[^/]+/)
    const form = page.locator('form').first()
    await expect(form).toBeVisible()

    // In draft mode, the sheet does not show the layout back link.
    // Instead, it provides an explicit "cancel" button that returns to `/characters`.
    await expect(form.locator('button.ant-btn-primary')).toBeVisible()
    const cancelButton = form.locator('button.ant-btn:not(.ant-btn-primary)')
    await cancelButton.click()
    await expect(page).toHaveURL(/\/characters\/?$/)
    await expect(page.locator('.layout__title')).toBeVisible()
  })
})

