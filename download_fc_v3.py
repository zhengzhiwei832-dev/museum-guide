#!/usr/bin/env python3
"""Download Forbidden City images - try multiple URL variants."""

import os
import time
import subprocess

OUTPUT_DIR = "/Users/zhengzhiwei/Downloads/code/museum-guide/public/images/forbidden-city"
os.makedirs(OUTPUT_DIR, exist_ok=True)


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


# For each image, try multiple URL variants
IMAGES = [
    ("cover.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/China_%28Beijing%29_Aerial_view_of_Forbidden_City_%2838884882275%29.jpg/1280px-China_%28Beijing%29_Aerial_view_of_Forbidden_City_%2838884882275%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/China_%28Beijing%29_Aerial_view_of_Forbidden_City_%2838884882275%29.jpg/800px-China_%28Beijing%29_Aerial_view_of_Forbidden_City_%2838884882275%29.jpg",
    ]),
    ("qingming-festival.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/2/2c/Along_the_River_During_the_Qingming_Festival_%28Qing_Court_Version%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Along_the_River_During_the_Qingming_Festival_%28Qing_Court_Version%29.jpg/640px-Along_the_River_During_the_Qingming_Festival_%28Qing_Court_Version%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Along_the_River_During_the_Qingming_Festival_%28Qing_Court_Version%29.jpg/400px-Along_the_River_During_the_Qingming_Festival_%28Qing_Court_Version%29.jpg",
    ]),
    ("thousand-li.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/6/64/Wang_Ximeng._A_Thousand_Li_of_Rivers_and_Mountains._%28Complete%2C_51.3x1191.5_cm%29._1113._Palace_museum%2C_Beijing.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Wang_Ximeng._A_Thousand_Li_of_Rivers_and_Mountains._%28Complete%2C_51.3x1191.5_cm%29._1113._Palace_museum%2C_Beijing.jpg/640px-Wang_Ximeng._A_Thousand_Li_of_Rivers_and_Mountains._%28Complete%2C_51.3x1191.5_cm%29._1113._Palace_museum%2C_Beijing.jpg",
    ]),
    ("jin-ou-yong-gu-cup.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%E9%87%91%E7%93%AF%E6%B0%B8%E5%9B%BA%E6%9D%AF.jpg/1280px-%E9%87%91%E7%93%AF%E6%B0%B8%E5%9B%BA%E6%9D%AF.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/%E9%87%91%E7%93%AF%E6%B0%B8%E5%9B%BA%E6%9D%AF.jpg",
    ]),
    ("jade-mountain.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/b/b6/Jade_Mountain_Illustrating_the_Taming_of_the_Waters_by_the_Great_Yu_01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Jade_Mountain_Illustrating_the_Taming_of_the_Waters_by_the_Great_Yu_01.jpg/640px-Jade_Mountain_Illustrating_the_Taming_of_the_Waters_by_the_Great_Yu_01.jpg",
    ]),
    ("porcelain-mother.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/8/83/%E5%90%84%E7%A7%8D%E9%87%89%E5%BD%A9%E5%A4%A7%E7%93%B6.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/%E5%90%84%E7%A7%8D%E9%87%89%E5%BD%A9%E5%A4%A7%E7%93%B6.jpg/640px-%E5%90%84%E7%A7%8D%E9%87%89%E5%BD%A9%E5%A4%A7%E7%93%B6.jpg",
    ]),
    ("hundred-horses.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/f/fd/Giuseppe_Castiglione_One_Hundred_Horses.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Giuseppe_Castiglione_One_Hundred_Horses.jpg/640px-Giuseppe_Castiglione_One_Hundred_Horses.jpg",
    ]),
    ("writing-clock.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/c/c4/Musical_automaton_clock_with_rotating_glass_columns_and_eight_dolphins%2C_presented_by_Lord_Macartney_to_the_Qianlong_emperor%2C_made_in_London%2C_1780-1790_-_British_Museum_-_DSC01279.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Musical_automaton_clock_with_rotating_glass_columns_and_eight_dolphins%2C_presented_by_Lord_Macartney_to_the_Qianlong_emperor%2C_made_in_London%2C_1780-1790_-_British_Museum_-_DSC01279.jpg/1280px-Musical_automaton_clock_with_rotating_glass_columns_and_eight_dolphins%2C_presented_by_Lord_Macartney_to_the_Qianlong_emperor%2C_made_in_London%2C_1780-1790_-_British_Museum_-_DSC01279.jpg",
    ]),
    ("nine-dragon-wall.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/8/80/Nine-Dragon_Wall%2C_Forbidden_City%2C_Beijing.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Nine-Dragon_Wall%2C_Forbidden_City%2C_Beijing.jpg/640px-Nine-Dragon_Wall%2C_Forbidden_City%2C_Beijing.jpg",
    ]),
    ("juanqin-studio.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Forbidden_City_-_Juanqin_Studio_01.jpg/1280px-Forbidden_City_-_Juanqin_Studio_01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/8/87/Forbidden_City_-_Juanqin_Studio_01.jpg",
    ]),
    ("fuwangge.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/National_Palace_Museum%2C_Beijing_%2810553879994%29.jpg/1280px-National_Palace_Museum%2C_Beijing_%2810553879994%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/1/16/National_Palace_Museum%2C_Beijing_%2810553879994%29.jpg",
    ]),
    ("yanxi-palace.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/4/4a/Yanxi_Gong_-_Lingzhao_Xuan_%28Crystal_Palace%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Yanxi_Gong_-_Lingzhao_Xuan_%28Crystal_Palace%29.jpg/640px-Yanxi_Gong_-_Lingzhao_Xuan_%28Crystal_Palace%29.jpg",
    ]),
    ("corner-tower.jpg", [
        "https://upload.wikimedia.org/wikipedia/commons/0/0c/Corner_Tower_of_Forbidden_City_20210807.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Corner_Tower_of_Forbidden_City_20210807.jpg/640px-Corner_Tower_of_Forbidden_City_20210807.jpg",
    ]),
]

print("=" * 60)
print("Downloading Forbidden City Images - Multiple URL Variants")
print("=" * 60)

failed = []
success = []

for i, (filename, urls) in enumerate(IMAGES, 1):
    print(f"\n[{i}/{len(IMAGES)}] {filename}")
    downloaded = False
    for url in urls:
        print(f"  Trying: {url[:70]}...")
        filepath = os.path.join(OUTPUT_DIR, filename)
        if curl_download(url, filepath):
            size = os.path.getsize(filepath)
            print(f"  ✓ Success ({size} bytes)")
            success.append(filename)
            downloaded = True
            break
        time.sleep(0.5)
    if not downloaded:
        print(f"  ✗ All variants failed")
        failed.append(filename)
    time.sleep(2)

print("\n" + "=" * 60)
print(f"Done! Success: {len(success)}/{len(IMAGES)}, Failed: {len(failed)}")
if failed:
    print(f"Failed: {failed}")
print("=" * 60)
