import { expect, test } from "@playwright/test";

test("submits the contact form successfully", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("E2E Test User");
  await page.getByLabel("Email").fill("e2e-test@example.com");
  await page
    .getByLabel("Message")
    .fill("This is an automated end-to-end test message.");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Thanks for reaching out")).toBeVisible();
});
