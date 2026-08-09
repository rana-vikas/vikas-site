import { expect, test } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const TEST_SLUG = `e2e-test-trip-${Date.now()}`;

test("create, edit, publish, and delete a trip", async ({ page }) => {
  test.setTimeout(60_000);

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  // Create
  await page.goto("/admin/travel/new");
  await page.getByLabel("Title").fill("E2E Test Trip");
  await page.getByLabel("Slug").fill(TEST_SLUG);
  await page.getByLabel("Location").fill("Test Location");
  await page.getByLabel("Start date").fill("2026-01-01");
  await page.getByLabel("Published").check();
  await page.getByRole("button", { name: "Save" }).click();
  // Exclude "new" itself — it also matches [^/]+$ and would otherwise
  // resolve immediately against the pre-existing URL instead of waiting
  // for the actual post-save redirect to the real edit URL.
  await page.waitForURL(/\/admin\/travel\/(?!new$)[^/]+$/);
  const editUrl = page.url();

  // Verify it's live and published on the public site
  await page.goto(`/travel/${TEST_SLUG}`);
  await expect(
    page.getByRole("heading", { name: "E2E Test Trip" }),
  ).toBeVisible();
  await expect(page.getByText("Test Location")).toBeVisible();

  // Edit
  await page.goto(editUrl);
  await page.getByLabel("Title").fill("E2E Test Trip (edited)");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved.")).toBeVisible();

  // Verify the edit is live
  await page.goto(`/travel/${TEST_SLUG}`);
  await expect(
    page.getByRole("heading", { name: "E2E Test Trip (edited)" }),
  ).toBeVisible();

  // Clean up — delete the test trip so it doesn't linger in the real DB
  await page.goto(editUrl);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await page.waitForURL(/\/admin\/travel$/);

  const response = await page.goto(`/travel/${TEST_SLUG}`);
  expect(response?.status()).toBe(404);
});
