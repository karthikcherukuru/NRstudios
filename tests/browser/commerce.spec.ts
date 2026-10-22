import { expect, test } from "@playwright/test";

test("catalog filters and sorts, then preserves bag quantity across reloads", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.locator(".product-card")).toHaveCount(7);
  await page.getByRole("button", { name: "Celebration", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("button", { name: "All sarees", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search sarees" }).fill("teal");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-card")).toContainText("Mayura");
  await page.getByRole("button", { name: "Clear search" }).click();
  await page.getByRole("combobox", { name: "Sort by" }).selectOption("price-high");
  await expect(page.locator(".product-card").first()).toContainText("Mayura");
  await page.locator(".product-card").first().getByRole("link").click();
  await expect(page).toHaveURL(/\/product\/teal$/);
  await page.getByRole("button", { name: "View border study" }).click();
  await expect(page.getByRole("button", { name: "View border study" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(page.getByText("Added to your bag.", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "View bag", exact: true }).click();
  await expect(page.locator(".cart-line")).toHaveCount(1);
  await page.getByRole("button", { name: "Increase Mayura quantity" }).click();
  await expect(page.getByLabel("Mayura quantity", { exact: true })).toHaveText("2");
  await page.reload();
  await expect(page.getByLabel("Mayura quantity", { exact: true })).toHaveText("2");
  await expect(page.locator(".cart-total")).toContainText("57,000");
  await page.getByRole("button", { name: "Remove Mayura from bag" }).click();
  await expect(page.getByText("Your bag is empty.", { exact: false })).toBeVisible();
  await expect(page.locator(".cart-line")).toHaveCount(0);
});

test("contact validates and provides an honest local draft download", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Save enquiry draft" }).click();
  await expect(page.getByText("Please enter your name (at least 2 characters).")).toBeVisible();
  await expect(page.getByLabel("Your name (required)")).toBeFocused();
  await page.getByLabel("Your name (required)").fill("Test Visitor");
  await page.getByLabel("Email address (required)").fill("visitor@example.com");
  await page.getByLabel("Your message (required)").fill("I would like advice about the teal saree for an evening celebration.");
  await page.getByRole("button", { name: "Save enquiry draft" }).click();
  await expect(page.getByRole("heading", { name: "Your enquiry is saved." })).toBeVisible();
  await expect(page.getByText(/No message has been sent/)).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("nr-studios:inquiry:v1") || "null"));
  expect(saved.email).toBe("visitor@example.com");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download your enquiry" }).click();
  expect((await download).suggestedFilename()).toBe("nr-studios-enquiry.txt");
});

test("commerce remains within mobile viewport and accepts deep-linked filters", async ({ page }) => {
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of ["/catalog?category=Celebration", "/product/wine", "/cart", "/contact"]) {
      await page.goto(path);
      await expect(page.locator("main")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${path} at ${width}px`).toBe(true);
      if (path.startsWith("/catalog")) await expect(page.locator(".product-card")).toHaveCount(2);
    }
  }
});
