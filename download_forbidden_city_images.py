#!/usr/bin/env python3
"""Download Forbidden City exhibit images from Wikimedia Commons using curl."""

import os
import time
import subprocess
import urllib.parse
import json
import urllib.request

OUTPUT_DIR = "/Users/zhengzhiwei/Downloads/code/museum-guide/public/images/forbidden-city"
os.makedirs(OUTPUT_DIR, exist_ok=True)

CURL_HEADERS = [
    "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "-H", "Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "--max-time", "30",
    "-L",
]


def curl_download(url: str, filepath: str) -> bool:
    """Download image using curl."""
    cmd = ["curl", "-s", "-o", filepath] + CURL_HEADERS + [url]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0 and os.path.exists(filepath):
            size = os.path.getsize(filepath)
            if size > 1000:
                return True
    except Exception:
        pass
    return False


def download_image(url: str, filename: str) -> bool:
    """Download image from URL to OUTPUT_DIR/filename."""
    filepath = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
        print(f"  ✓ {filename} already exists ({os.path.getsize(filepath)} bytes)")
        return True

    if curl_download(url, filepath):
        print(f"  ✓ Downloaded {filename} ({os.path.getsize(filepath)} bytes)")
        return True
    else:
        print(f"  ✗ Failed to download {filename}")
        return False


def search_wikimedia(query: str) -> list:
    """Search Wikimedia Commons for images matching query."""
    encoded_query = urllib.parse.quote(query)
    search_url = (
        f"https://commons.wikimedia.org/w/api.php"
        f"?action=query&list=search&srsearch={encoded_query}"
        f"&srnamespace=6&srlimit=10&format=json"
        f"&origin=*"
    )
    req = urllib.request.Request(search_url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("query", {}).get("search", [])
    except Exception as e:
        print(f"  ✗ Search error: {e}")
        return []


def get_image_url_from_title(title: str, preferred_width: int = 1280):
    """Get direct image URL from Wikimedia file title."""
    if title.startswith("File:"):
        title = title[5:]
    encoded = urllib.parse.quote(title.replace(" ", "_"))

    info_url = (
        f"https://commons.wikimedia.org/w/api.php"
        f"?action=query&titles=File:{encoded}"
        f"&prop=imageinfo&iiprop=url|size|mime"
        f"&iiurlwidth={preferred_width}"
        f"&format=json&origin=*"
    )
    req = urllib.request.Request(info_url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            for page_id, page in pages.items():
                if "imageinfo" in page and page["imageinfo"]:
                    info = page["imageinfo"][0]
                    if "thumburl" in info:
                        return info["thumburl"]
                    if "url" in info:
                        return info["url"]
    except Exception as e:
        print(f"  ✗ Error getting image info: {e}")
    return None


# Define all exhibits with search queries
EXHIBITS = [
    ("cover.jpg", "Forbidden City aerial view Beijing", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/China_%28Beijing%29_Aerial_view_of_Forbidden_City_%2838884882275%29.jpg/1280px-China_%28Beijing%29_Aerial_view_of_Forbidden_City_%2838884882275%29.jpg"),
    ("qingming-festival.jpg", "Along the River During the Qingming Festival Qing Court", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Along_the_River_During_the_Qingming_Festival_%28Qing_Court_Version%29.jpg/1280px-Along_the_River_During_the_Qingming_Festival_%28Qing_Court_Version%29.jpg"),
    ("thousand-li.jpg", "Wang Ximeng A Thousand Li of Rivers and Mountains", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Wang_Ximeng._A_Thousand_Li_of_Rivers_and_Mountains._%28Complete%2C_51.3x1191.5_cm%29._1113._Palace_museum%2C_Beijing.jpg/1280px-Wang_Ximeng._A_Thousand_Li_of_Rivers_and_Mountains._%28Complete%2C_51.3x1191.5_cm%29._1113._Palace_museum%2C_Beijing.jpg"),
    ("jin-ou-yong-gu-cup.jpg", "金瓯永固杯 故宫", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%E9%87%91%E7%93%AF%E6%B0%B8%E5%9B%BA%E6%9D%AF.jpg/1280px-%E9%87%91%E7%93%AF%E6%B0%B8%E5%9B%BA%E6%9D%AF.jpg"),
    ("jade-mountain.jpg", "大禹治水图玉山 故宫", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Jade_Mountain_Illustrating_the_Taming_of_the_Waters_by_the_Great_Yu_01.jpg/1280px-Jade_Mountain_Illustrating_the_Taming_of_the_Waters_by_the_Great_Yu_01.jpg"),
    ("porcelain-mother.jpg", "各种釉彩大瓶 故宫", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/%E5%90%84%E7%A7%8D%E9%87%89%E5%BD%A9%E5%A4%A7%E7%93%B6.jpg/1280px-%E5%90%84%E7%A7%8D%E9%87%89%E5%BD%A9%E5%A4%A7%E7%93%B6.jpg"),
    ("hundred-horses.jpg", "Giuseppe Castiglione One Hundred Horses", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Giuseppe_Castiglione_One_Hundred_Horses.jpg/1280px-Giuseppe_Castiglione_One_Hundred_Horses.jpg"),
    ("writing-clock.jpg", "copper镀金写字人钟 故宫 英国", None),
    ("nine-dragon-wall.jpg", "Nine Dragon Wall Forbidden City Beijing", None),
    ("juanqin-studio.jpg", "倦勤斋 故宫 通景画", None),
    ("fuwangge.jpg", "符望阁 故宫 漆纱", None),
    ("yanxi-palace.jpg", "Yanxi Palace crystal palace Forbidden City", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Yanxi_Gong_-_Lingzhao_Xuan_%28Crystal_Palace%29.jpg/1280px-Yanxi_Gong_-_Lingzhao_Xuan_%28Crystal_Palace%29.jpg"),
    ("corner-tower.jpg", "Corner Tower Forbidden City Beijing", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Corner_Tower_of_Forbidden_City_20210807.jpg/1280px-Corner_Tower_of_Forbidden_City_20210807.jpg"),
]

print("=" * 60)
print("Downloading Forbidden City Images")
print("=" * 60)

failed = []
success = []

for i, (filename, search_query, known_url) in enumerate(EXHIBITS, 1):
    print(f"\n[{i}/{len(EXHIBITS)}] {filename}")

    if known_url:
        print(f"  Trying known URL...")
        if download_image(known_url, filename):
            success.append(filename)
            time.sleep(1.0)
            continue

    print(f"  Searching: {search_query}")
    results = search_wikimedia(search_query)
    if not results:
        print(f"  ✗ No search results found")
        failed.append(filename)
        continue

    downloaded = False
    for result in results[:5]:
        title = result["title"]
        print(f"  Trying: {title}")
        url = get_image_url_from_title(title)
        if url:
            if download_image(url, filename):
                success.append(filename)
                downloaded = True
                break
        time.sleep(0.5)

    if not downloaded:
        print(f"  ✗ Could not download any image for {filename}")
        failed.append(filename)

    time.sleep(1.0)

print("\n" + "=" * 60)
print(f"Done! Success: {len(success)}/{len(EXHIBITS)}, Failed: {len(failed)}")
if failed:
    print(f"Failed items: {failed}")
print("=" * 60)
