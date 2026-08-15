import { expect, test } from "@playwright/test";

test("homepage loads with hero content", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Vikas Rana/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("MY WORLD");
  await expect(
    page.getByRole("heading", { name: /Different worlds/i }),
  ).toBeVisible();
});
