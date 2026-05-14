#!/usr/bin/env python3
"""Download Forbidden City images using Wikimedia Commons API."""

import os
import time
import json
import urllib.request
import urllib.parse
import subprocess

OUTPUT_DIR = "/Users/zhengzhiwei/Downloads/code/museum-guide/public/images/forbidden-city"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def api_request(url):
    """Make API request with proper headers."""
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"    API error: {e}")
        return None


def search_commons(query):
    """Search Wikimedia Commons."""
    encoded = urllib.parse.quote(query)
    url = (f"https://commons.wikimedia.org/w/api.php?action=query&list=search"
           f"&srsearch={encoded}&srnamespace=6&srlimit=15&format=json&origin=*")
    data = api_request(url)
    if data and "query" in data:
        return data["query"].get("search", [])
    return []


def get_image_info(title):
    """Get image URL from file title."""
    if title.startswith("File:"):
        title = title[5:]
    encoded = urllib.parse.quote(title.replace(" ", "_"))
    url = (f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{encoded}"
           f"&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1280&format=json&origin=*")
    data = api_request(url)
    if not data or "query" not in data:
        return None
    pages = data["query"].get("pages", {})
    for page_id, page in pages.items():
        if "imageinfo" in page and page["imageinfo"]:
            info = page["imageinfo"][0]
            # Prefer thumburl at 1280px
            if "thumburl" in info:
                return info["thumburl"]
            if "url" in info:
                return info["url"]
    return None


def curl_download(url, filepath):
    """Download with curl."""
    cmd = [
        "curl", "-s", "-L", "-o", filepath,
        "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "-H", "Accept: image/webp,image/apng,image/*,*/*;q=0.8",
        "--max-time", "30",
        url
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0 and os.path.exists(filepath):
            size = os.path.getsize(filepath)
            if size > 5000:
                # Verify it's an image
                with open(filepath, "rb") as f:
                    header = f.read(20)
                    if header.startswith(b"\xff\xd8") or header.startswith(b"\x89PNG"):
                        return True
                # Not an image, remove it
                os.remove(filepath)
    except Exception:
        pass
    return False


def download_image(url, filename):
    """Download image if not exists."""
    filepath = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        if size > 5000:
            with open(filepath, "rb") as f:
                header = f.read(20)
                if header.startswith(b"\xff\xd8") or header.startswith(b"\x89PNG"):
                    print(f"  ✓ {filename} already exists ({size} bytes)")
                    return True
        os.remove(filepath)

    if curl_download(url, filepath):
        print(f"  ✓ Downloaded {filename} ({os.path.getsize(filepath)} bytes)")
        return True
    print(f"  ✗ Failed: {filename}")
    return False


# Exhibits to download with search queries
EXHIBITS = [
    ("qingming-festival.jpg", ["Along the River During the Qingming Festival Qing Court Version",
                                "清明上河图 清宫版本"]),
    ("thousand-li.jpg", ["Wang Ximeng A Thousand Li of Rivers and Mountains",
                          "千里江山图 王希孟"]),
    ("jin-ou-yong-gu-cup.jpg", ["金瓯永固杯", "Jin Ou Yong Gu Cup Palace Museum"]),
    ("jade-mountain.jpg", ["大禹治水图玉山", "Jade Mountain Yu the Great Palace Museum"]),
    ("porcelain-mother.jpg", ["各种釉彩大瓶 故宫", "Porcelain Mother Palace Museum"]),
    ("hundred-horses.jpg", ["Giuseppe Castiglione One Hundred Horses",
                             "郎世宁 百骏图"]),
    ("writing-clock.jpg", ["写字人钟 故宫", "Writing automaton clock Palace Museum",
                             "copper镀金写字人钟"]),
    ("nine-dragon-wall.jpg", ["Nine Dragon Wall Forbidden City",
                               "故宫 九龙壁"]),
    ("yanxi-palace.jpg", ["Yanxi Palace Crystal Palace Forbidden City",
                            "延禧宫 灵沼轩 水晶宫"]),
    ("corner-tower.jpg", ["Corner Tower Forbidden City Beijing",
                            "故宫 角楼"]),
]

print("=" * 60)
print("Downloading Missing Forbidden City Images")
print("=" * 60)

failed = []
success = []

for i, (filename, queries) in enumerate(EXHIBITS, 1):
    print(f"\n[{i}/{len(EXHIBITS)}] {filename}")

    found = False
    for query in queries:
        print(f"  Searching: {query}")
        results = search_commons(query)
        time.sleep(0.5)

        for result in results[:5]:
            title = result["title"]
            print(f"    Trying: {title}")
            url = get_image_info(title)
            time.sleep(0.3)

            if url:
                print(f"    URL: {url[:80]}...")
                if download_image(url, filename):
                    success.append(filename)
                    found = True
                    break

        if found:
            break

    if not found:
        print(f"  ✗ Could not find image for {filename}")
        failed.append(filename)

    time.sleep(1)

print("\n" + "=" * 60)
print(f"Done! Success: {len(success)}/{len(EXHIBITS)}, Failed: {len(failed)}")
if failed:
    print(f"Failed: {failed}")
print("=" * 60)
