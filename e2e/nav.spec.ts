import { expect, test } from "@playwright/test";

test("nav links navigate to the right pages", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("banner");

  await nav.getByRole("link", { name: "Career", exact: true }).click();
  await expect(page).toHaveURL(/\/career$/);
  await expect(page.getByRole("heading", { name: "Career" })).toBeVisible();

  await page.goto("/");
  await nav.getByRole("link", { name: "Travel", exact: true }).click();
  await expect(page).toHaveURL(/\/travel$/);
  await expect(page.getByRole("heading", { name: "Travel" })).toBeVisible();

  await page.goto("/");
  await nav.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
});
