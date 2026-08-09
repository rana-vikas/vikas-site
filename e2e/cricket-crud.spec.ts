import { expect, test } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const RUN_ID = Date.now();

test("manage team, tournament, player, match, and memory", async ({
  page,
}) => {
  test.setTimeout(90_000);

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  // Team: change the tagline, verify live, restore the original.
  await page.goto("/admin/cricket");
  const originalTagline = await page.getByLabel("Tagline").inputValue();
  await page.getByLabel("Tagline").fill(`E2E test tagline ${RUN_ID}`);
  await page.getByRole("button", { name: "Save" }).first().click();
  await expect(page.getByText("Saved.")).toBeVisible();

  await page.goto("/cricket");
  await expect(page.getByText(`E2E test tagline ${RUN_ID}`)).toBeVisible();

  await page.goto("/admin/cricket");
  await page.getByLabel("Tagline").fill(originalTagline);
  await page.getByRole("button", { name: "Save" }).first().click();
  await expect(page.getByText("Saved.")).toBeVisible();

  // Tournament: add, verify live, delete via its own row.
  const tournamentName = `E2E Test Tournament ${RUN_ID}`;
  await page.goto("/admin/cricket");
  await page.getByPlaceholder("Tournament").fill(tournamentName);
  await page.getByPlaceholder("Result (optional)").fill("Runners-up");
  await page
    .locator("form")
    .filter({ has: page.getByPlaceholder("Tournament") })
    .getByRole("button", { name: "Add" })
    .click();
  await expect(page.getByText(tournamentName)).toBeVisible();

  await page.goto("/cricket");
  await expect(page.getByText(tournamentName)).toBeVisible();

  await page.goto("/admin/cricket");
  const tournamentRow = page
    .getByText(tournamentName)
    .locator("xpath=ancestor::div[contains(@class,'justify-between')][1]");
  page.once("dialog", (dialog) => dialog.accept());
  await tournamentRow.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText(tournamentName)).not.toBeVisible();

  // Player: create, verify live, edit, verify edit live, delete.
  const playerName = `E2E Test Player ${RUN_ID}`;
  await page.goto("/admin/cricket/players/new");
  await page.getByLabel("Name").fill(playerName);
  await page.getByLabel("Role").fill("Bowler");
  await page.getByLabel("Published").check();
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForURL(/\/admin\/cricket\/players\/(?!new$)[^/]+$/);
  const playerEditUrl = page.url();

  await page.goto("/cricket");
  await expect(page.getByText(playerName)).toBeVisible();

  await page.goto(playerEditUrl);
  const playerNameEdited = `${playerName} (edited)`;
  await page.getByLabel("Name").fill(playerNameEdited);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved.")).toBeVisible();

  await page.goto("/cricket");
  await expect(page.getByText(playerNameEdited)).toBeVisible();

  await page.goto(playerEditUrl);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await page.waitForURL(/\/admin\/cricket$/);
  await page.goto("/cricket");
  await expect(page.getByText(playerNameEdited)).not.toBeVisible();

  // Match: create, verify live, edit, verify edit live, delete.
  const opponent = `E2E Test Opponent ${RUN_ID}`;
  await page.goto("/admin/cricket/matches/new");
  await page.getByLabel("Opponent").fill(opponent);
  await page.getByLabel("Match date").fill("2026-01-01");
  await page.getByLabel("Published").check();
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForURL(/\/admin\/cricket\/matches\/(?!new$)[^/]+$/);
  const matchEditUrl = page.url();

  await page.goto("/cricket");
  await expect(page.getByText(`vs ${opponent}`)).toBeVisible();

  await page.goto(matchEditUrl);
  await page.getByLabel("Result").fill("Won by 10 runs");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved.")).toBeVisible();

  await page.goto("/cricket");
  await expect(page.getByText("Won by 10 runs")).toBeVisible();

  await page.goto(matchEditUrl);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await page.waitForURL(/\/admin\/cricket$/);
  await page.goto("/cricket");
  await expect(page.getByText(`vs ${opponent}`)).not.toBeVisible();

  // Memory: add, verify live, delete.
  const memoryTitle = `E2E Test Memory ${RUN_ID}`;
  await page.goto("/admin/cricket");
  await page.getByPlaceholder("Memory title").fill(memoryTitle);
  await page.getByRole("button", { name: "Add memory" }).click();
  await expect(page.getByText(memoryTitle)).toBeVisible();

  await page.goto("/cricket");
  await expect(page.getByText(memoryTitle)).toBeVisible();

  await page.goto("/admin/cricket");
  const memoryCard = page
    .getByText(memoryTitle)
    .locator("xpath=ancestor::div[contains(@class,'rounded-xl')][1]");
  page.once("dialog", (dialog) => dialog.accept());
  await memoryCard.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText(memoryTitle)).not.toBeVisible();
});
