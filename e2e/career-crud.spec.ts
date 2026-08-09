import { expect, test } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const RUN_ID = Date.now();

async function login(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("create, edit, publish, and delete an experience entry", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await login(page);

  await page.goto("/admin/career/experience/new");
  await page.getByLabel("Company").fill(`E2E Test Co ${RUN_ID}`);
  await page.getByLabel("Title").fill("E2E Test Role");
  await page.getByLabel("Start date").fill("2020-01-01");
  await page.getByLabel("Published").check();
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForURL(/\/admin\/career\/experience\/(?!new$)[^/]+$/);
  const editUrl = page.url();

  await page.goto("/career");
  await expect(page.getByText(`E2E Test Co ${RUN_ID}`)).toBeVisible();
  await expect(page.getByText("E2E Test Role")).toBeVisible();

  await page.goto(editUrl);
  await page.getByLabel("Title").fill("E2E Test Role (edited)");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved.")).toBeVisible();

  await page.goto("/career");
  await expect(page.getByText("E2E Test Role (edited)")).toBeVisible();

  await page.goto(editUrl);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await page.waitForURL(/\/admin\/career$/);

  await page.goto("/career");
  await expect(page.getByText(`E2E Test Co ${RUN_ID}`)).not.toBeVisible();
});

test("create, edit, publish, and delete a project", async ({ page }) => {
  test.setTimeout(60_000);
  await login(page);

  const slug = `e2e-test-project-${RUN_ID}`;

  await page.goto("/admin/career/projects/new");
  await page.getByLabel("Title").fill("E2E Test Project");
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Summary").fill("An automated test project.");
  await page.getByLabel("Published").check();
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForURL(/\/admin\/career\/projects\/(?!new$)[^/]+$/);
  const editUrl = page.url();

  await page.goto("/career");
  await expect(page.getByText("E2E Test Project")).toBeVisible();

  await page.goto(editUrl);
  await page.getByLabel("Title").fill("E2E Test Project (edited)");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved.")).toBeVisible();

  await page.goto("/career");
  await expect(page.getByText("E2E Test Project (edited)")).toBeVisible();

  await page.goto(editUrl);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await page.waitForURL(/\/admin\/career$/);

  await page.goto("/career");
  await expect(page.getByText("E2E Test Project (edited)")).not.toBeVisible();
});
