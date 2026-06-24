from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:5173")
        page.get_by_role("button", name="Sign In").click()

        # Click on Jobseeker signup tab
        page.get_by_role("button", name="Jobseeker Sign Up").click()

        # Fill signup form
        page.get_by_placeholder("john@example.com").fill("testai8@example.com")
        page.get_by_placeholder("••••••••").fill("password123")
        page.locator("button[type='submit']").click()

        # Wait for "Registration successful" or just login directly
        page.wait_for_timeout(2000) # Give API time

        # Try to screenshot to debug why it is not logging in or not showing dashboard
        page.screenshot(path="/app/debug.png")

        # Since registration switches to login automatically:
        page.locator("input[type='email']").fill("testai8@example.com")
        page.locator("input[type='password']").fill("password123")
        page.locator("button[type='submit']").click()

        page.wait_for_timeout(5000)

        page.screenshot(path="/app/verification.png")
        browser.close()

if __name__ == "__main__":
    verify()
