#!/usr/bin/env python3
"""Check exhibit card layout - test both long and short content"""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 390, 'height': 844})  # iPhone size

    # Navigate to explore mode
    page.goto('http://localhost:5174/#/forbidden-city/on-site/explore')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)

    # Scroll to first exhibit
    page.evaluate('''() => {
        const container = document.querySelector('.snap-container');
        if (container) container.scrollTo(0, window.innerHeight * 2);
    }''')
    page.wait_for_timeout(1500)

    # Check all exhibits to find one with short content
    exhibits = page.evaluate('''() => {
        const cards = document.querySelectorAll('.exhibit-card');
        return Array.from(cards).slice(0, 3).map((card, i) => {
            const content = card.querySelector('.exhibit-content-scroll');
            const fallback = card.querySelector('.fallback-guide');
            const popular = card.querySelector('.popular-guide');
            return {
                index: i,
                contentScrollHeight: content?.scrollHeight || 0,
                hasFallback: !!fallback,
                hasPopular: !!popular,
            };
        });
    }''')

    print("=== Exhibit Content Analysis ===")
    for ex in exhibits:
        print(f"Exhibit {ex['index']}: scrollHeight={ex['contentScrollHeight']}px, fallback={ex['hasFallback']}, popular={ex['hasPopular']}")

    # Take screenshot of current exhibit
    page.screenshot(path='/Users/zhengzhiwei/Downloads/code/museum-guide/current_exhibit.png', full_page=False)
    print("\nScreenshot: current_exhibit.png")

    browser.close()
