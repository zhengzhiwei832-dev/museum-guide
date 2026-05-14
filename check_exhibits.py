from playwright.sync_api import sync_playwright
import time

exhibits = [
    ("sx-h1", "镶金兽首玛瑙杯"),
    ("sx-h2", "鎏金舞马衔杯纹银壶"),
    ("sx-h3", "鎏金鹦鹉纹提梁银罐"),
    ("sx-h4", "葡萄花鸟纹银香囊"),
    ("sx-h5", "鸳鸯莲瓣纹金碗"),
    ("sx-h6", "唐三彩载乐驼"),
    ("sx-h7", "青釉提梁倒灌壶"),
    ("sx-h8", "鎏金铁芯铜龙"),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    for exhibit_id, name in exhibits:
        url = f"http://localhost:5173/shaanxi-history/exhibit/{exhibit_id}"
        print(f"Navigating to {name} ({exhibit_id})...")
        page.goto(url)
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        screenshot_path = f"/Users/zhengzhiwei/Downloads/code/museum-guide/screenshot_{exhibit_id}.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"  Saved to {screenshot_path}")

    browser.close()
