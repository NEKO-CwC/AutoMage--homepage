import json
from playwright.sync_api import sync_playwright

URL = "http://localhost:3000"

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        print("1. Loading page...")
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(2000)

        page.screenshot(path="test-01-hero.png", full_page=False)
        print("   Screenshot: test-01-hero.png")

        # Check header
        header = page.locator('header[aria-label="AutoMage 主导航"]')
        box = header.bounding_box()
        print(f"   Header: x={box['x']:.0f} y={box['y']:.0f} w={box['width']:.0f} h={box['height']:.0f}")

        print("\n2. Scrolling to InfoLoop section...")

        # Get section-loop scroll offset
        section_top = page.evaluate("""
            () => document.getElementById('section-loop')?.getBoundingClientRect().top + window.scrollY || 0
        """)
        print(f"   section-loop at scrollY={section_top:.0f}")

        # Scroll to the start of the pin range using scrollTo (reliable with Lenis)
        page.evaluate(f"window.scrollTo(0, {int(section_top)})")
        page.wait_for_timeout(500)
        page.screenshot(path="test-02-loop-enter.png", full_page=False)
        print("   Screenshot: test-02-loop-enter.png")

        print("\n3. Scrolling through loop section to trigger pin + particle...")
        # Scroll incrementally through the pin range (2000px) using scrollTo
        for offset in range(200, 1200, 200):
            page.evaluate(f"window.scrollTo(0, {int(section_top + offset)})")
            page.wait_for_timeout(150)
        page.wait_for_timeout(500)

        page.screenshot(path="test-03-loop-mid.png", full_page=False)
        print("   Screenshot: test-03-loop-mid.png")

        # Read particle position
        info = page.evaluate("""() => {
            const svg = document.querySelector('#section-loop svg');
            if (!svg) return {error: 'no SVG'};
            const circles = Array.from(svg.querySelectorAll('circle'));
            const particle = circles.find(c => (c.getAttribute('fill')||'').includes('particle'));
            if (!particle) return {error: 'no particle'};
            const cx = parseFloat(particle.getAttribute('cx')||'0');
            const cy = parseFloat(particle.getAttribute('cy')||'0');
            const opacity = parseFloat(particle.getAttribute('opacity')||'0');
            const inBounds = cx>=20 && cx<=420 && cy>=20 && cy<=420;
            return {cx, cy, opacity, inBounds};
        }""")
        print(f"   Particle pos: {json.dumps(info)}")

        # Scroll further
        for offset in range(1200, 2000, 200):
            page.evaluate(f"window.scrollTo(0, {int(section_top + offset)})")
            page.wait_for_timeout(150)
        page.wait_for_timeout(500)

        info2 = page.evaluate("""() => {
            const svg = document.querySelector('#section-loop svg');
            if (!svg) return {error:'no SVG'};
            const circles = Array.from(svg.querySelectorAll('circle'));
            const particle = circles.find(c => (c.getAttribute('fill')||'').includes('particle'));
            if (!particle) return {error:'no particle'};
            return {cx: parseFloat(particle.getAttribute('cx')||'0'),
                    cy: parseFloat(particle.getAttribute('cy')||'0'),
                    opacity: parseFloat(particle.getAttribute('opacity')||'0')};
        }""")
        print(f"   Particle after scroll: {json.dumps(info2)}")

        if "error" not in info and "error" not in info2:
            moved = abs(info["cx"] - info2["cx"]) > 5 or abs(info["cy"] - info2["cy"]) > 5
            print(f"   Particle moved: {moved}")
            if not moved:
                print("   FAIL: particle did not move!")
            else:
                print("   PASS: particle moved correctly")
        else:
            print("   SKIP: could not find particle")

        page.screenshot(path="test-04-loop-later.png", full_page=False)
        print("   Screenshot: test-04-loop-later.png")

        print("\n4. Header dark mode at footer...")
        page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight)")
        page.wait_for_timeout(1000)
        page.screenshot(path="test-05-footer.png", full_page=False)
        print("   Screenshot: test-05-footer.png")

        browser.close()
        print("\nDone.")

if __name__ == "__main__":
    main()
