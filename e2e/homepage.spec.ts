import { expect, test } from "@playwright/test";

test("homepage loads with hero content", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Vikas Rana/);
  await expect(
    page.getByRole("heading", { name: "Vikas Rana" }),
  ).toBeVisible();
  // Appears twice by design (Hero tagline paragraph + WorldsGrid section
  // heading) — scope to the paragraph role to avoid a strict-mode violation.
  await expect(
    page.getByRole("paragraph").filter({ hasText: "Different Worlds. One Person." }),
  ).toBeVisible();
});
