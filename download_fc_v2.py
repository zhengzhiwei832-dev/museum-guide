#!/usr/bin/env python3
"""Download Forbidden City images - attempt 2 with direct file lookups."""

import os
import time
import json
import urllib.request
import urllib.parse
import subprocess

OUTPUT_DIR = "/Users/zhengzhiwei/Downloads/code/museum-guide/public/images/forbidden-city"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def api_request(url):
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


def get_image_url(title, thumb_width=1280):
    if title.startswith("File:"):
        title = title[5:]
    encoded = urllib.parse.quote(title.replace(" ", "_"))
    url = (f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{encoded}"
           f"&prop=imageinfo&iiprop=url|size|mime&iiurlwidth={thumb_width}&format=json&origin=*")
    data = api_request(url)
    if not data or "query" not in data:
        return None
    pages = data["query"].get("pages", {})
    for page_id, page in pages.items():
        if "imageinfo" in page and page["imageinfo"]:
            info = page["imageinfo"][0]
            if "thumburl" in info:
                return info["thumburl"]
            if "url" in info:
                return info["url"]
    return None


def curl_download(url, filepath):
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
                with open(filepath, "rb") as f:
                    header = f.read(20)
                    if header.startswith(b"\xff\xd8") or header.startswith(b"\x89PNG"):
                        return True
                os.remove(filepath)
    except Exception:
        pass
    return False


def download_image(url, filename):
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


# Direct file names on Wikimedia Commons
FILES = [
    # (filename, wikimedia_file_name, thumb_width)
    ("qingming-festival.jpg", "Along_the_River_During_the_Qingming_Festival_(Qing_Court_Version).jpg", 800),
    ("thousand-li.jpg", "Wang_Ximeng._A_Thousand_Li_of_Rivers_and_Mountains._(Complete,_51.3x1191.5_cm)._1113._Palace_museum,_Beijing.jpg", 800),
    ("jade-mountain.jpg", "Jade_Mountain_Illustrating_the_Taming_of_the_Waters_by_the_Great_Yu_01.jpg", 1280),
    ("porcelain-mother.jpg", "各种釉彩大瓶.jpg", 1280),
    ("hundred-horses.jpg", "Giuseppe_Castiglione_One_Hundred_Horses.jpg", 1280),
    ("writing-clock.jpg", "Musical_automaton_clock_with_rotating_glass_columns_and_eight_dolphins,_presented_by_Lord_Macartney_to_the_Qianlong_emperor,_made_in_London,_1780-1790_-_British_Museum_-_DSC01279.jpg", 1280),
    ("nine-dragon-wall.jpg", "Nine-Dragon_Wall,_Forbidden_City,_Beijing.jpg", 1280),
    ("yanxi-palace.jpg", "Yanxi_Gong_-_Lingzhao_Xuan_(Crystal_Palace).jpg", 1280),
    ("corner-tower.jpg", "Corner_Tower_of_Forbidden_City_20210807.jpg", 1280),
]

print("=" * 60)
print("Downloading Forbidden City Images - Direct File Lookup")
print("=" * 60)

failed = []
success = []

for i, (filename, file_name, thumb_width) in enumerate(FILES, 1):
    print(f"\n[{i}/{len(FILES)}] {filename}")
    print(f"  Looking up: {file_name}")

    url = get_image_url(file_name, thumb_width)
    time.sleep(2)  # Longer delay to avoid rate limiting

    if url:
        print(f"  URL: {url[:80]}...")
        if download_image(url, filename):
            success.append(filename)
        else:
            failed.append(filename)
    else:
        print(f"  ✗ Could not get URL for {filename}")
        failed.append(filename)

print("\n" + "=" * 60)
print(f"Done! Success: {len(success)}/{len(FILES)}, Failed: {len(failed)}")
if failed:
    print(f"Failed: {failed}")
print("=" * 60)
