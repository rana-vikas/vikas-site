import { expect, test } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const RUN_ID = Date.now();

test("manage journey, competitions, and a challenge with an entry", async ({
  page,
}) => {
  test.setTimeout(90_000);

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  // Journey: read the existing startYear back so this test doesn't
  // clobber real data — only change the story, then restore it after.
  await page.goto("/admin/fitness");
  const startYearInput = page.getByLabel("Start year");
  const originalStartYear = await startYearInput.inputValue();
  const originalStory = await page.getByLabel("Story").inputValue();

  await page.getByLabel("Story").fill(`E2E test story ${RUN_ID}`);
  await page.getByRole("button", { name: "Save" }).first().click();
  await expect(page.getByText("Saved.")).toBeVisible();

  await page.goto("/fitness");
  await expect(page.getByText(`E2E test story ${RUN_ID}`)).toBeVisible();

  // Restore the real story so this test doesn't leave fake content live.
  await page.goto("/admin/fitness");
  await page.getByLabel("Story").fill(originalStory);
  await page.getByRole("button", { name: "Save" }).first().click();
  await expect(page.getByText("Saved.")).toBeVisible();
  await expect(page.getByLabel("Start year")).toHaveValue(originalStartYear);

  // Competition: add, verify live, then remove via its own row's Delete
  // button (scoped to the row so it doesn't accidentally hit another one).
  await page.goto("/admin/fitness");
  await page.getByPlaceholder("Competition").fill(`E2E Test Race ${RUN_ID}`);
  await page.getByPlaceholder("Result (optional)").fill("1st");
  await page
    .locator("form")
    .filter({ has: page.getByPlaceholder("Competition") })
    .getByRole("button", { name: "Add" })
    .click();
  await expect(page.getByText(`E2E Test Race ${RUN_ID}`)).toBeVisible();

  await page.goto("/fitness");
  await expect(page.getByText(`E2E Test Race ${RUN_ID}`)).toBeVisible();

  await page.goto("/admin/fitness");
  const competitionRow = page
    .getByText(`E2E Test Race ${RUN_ID}`)
    .locator("xpath=ancestor::div[contains(@class,'justify-between')][1]");
  page.once("dialog", (dialog) => dialog.accept());
  await competitionRow.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText(`E2E Test Race ${RUN_ID}`)).not.toBeVisible();

  // Challenge + entry
  const slug = `e2e-test-challenge-${RUN_ID}`;
  const challengeTitle = `E2E Test Challenge ${RUN_ID}`;
  await page.goto("/admin/fitness/challenges/new");
  await page.getByLabel("Title").fill(challengeTitle);
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Length (days)").fill("10");
  await page.getByLabel("Published").check();
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForURL(/\/admin\/fitness\/challenges\/(?!new$)[^/]+$/);
  const editUrl = page.url();

  await page.goto("/fitness/challenges");
  await expect(page.getByText(challengeTitle)).toBeVisible();

  await page.goto(editUrl);
  await page.getByPlaceholder("Title (optional)").fill(`Day one ${RUN_ID}`);
  await page.getByRole("button", { name: "Add entry" }).click();
  await expect(page.getByText(`Day one ${RUN_ID}`)).toBeVisible();

  await page.goto(`/fitness/challenges/${slug}`);
  await expect(page.getByText("1 of 10 days logged")).toBeVisible();
  await expect(page.getByText(`Day one ${RUN_ID}`)).toBeVisible();

  // Delete the challenge — cascades the entry, confirmed via 404 after.
  // Two "Delete" buttons exist now (challenge header + the entry below it);
  // the challenge-level one is first in DOM order.
  await page.goto(editUrl);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).first().click();
  await page.waitForURL(/\/admin\/fitness$/);

  const response = await page.goto(`/fitness/challenges/${slug}`);
  expect(response?.status()).toBe(404);
});
