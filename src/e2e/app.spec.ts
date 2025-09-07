import { test, expect } from '@playwright/test'

test.describe('Application', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')
    
    // Check that the page loads successfully
    await expect(page).toHaveTitle(/Optimind AI Ecosystem/)
    
    // Check for main content
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have responsive design', async ({ page }) => {
    await page.goto('/')
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('body')).toBeVisible()
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
  })

  test('should handle navigation', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check if navigation elements exist (if any)
    const navElements = page.locator('nav, header, .navigation, .nav')
    const navCount = await navElements.count()
    
    if (navCount > 0) {
      await expect(navElements.first()).toBeVisible()
    }
  })

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/')
    
    // Check for viewport meta tag
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toHaveAttribute('content', /width=device-width/)
    
    // Check for charset meta tag
    const charset = page.locator('meta[charset]')
    await expect(charset).toHaveAttribute('charset', 'utf-8')
  })
})