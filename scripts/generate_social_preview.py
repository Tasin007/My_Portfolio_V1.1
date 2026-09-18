from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH, HEIGHT = 1200, 630
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "social-preview.png"
REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REGULAR, size)


image = Image.new("RGB", (WIDTH, HEIGHT), "#06101d")
pixels = image.load()

for y in range(HEIGHT):
    for x in range(WIDTH):
        diagonal = (x / WIDTH + y / HEIGHT) / 2
        glow = max(0, 1 - (((x - 1050) ** 2 + (y - 90) ** 2) ** 0.5) / 430)
        pixels[x, y] = (
            int(6 + 5 * diagonal + 7 * glow),
            int(16 + 18 * diagonal + 38 * glow),
            int(29 + 21 * diagonal + 48 * glow),
        )

draw = ImageDraw.Draw(image, "RGBA")

for x in range(0, WIDTH, 96):
    draw.line((x, 0, x, HEIGHT), fill=(87, 223, 242, 24), width=1)
for y in range(0, HEIGHT, 96):
    draw.line((0, y, WIDTH, y), fill=(87, 223, 242, 24), width=1)

draw.rounded_rectangle((72, 66, 126, 120), radius=14, fill="#0d2a3c", outline="#4fdcf0", width=2)
draw.line((88, 96, 110, 96), fill="#55e0ef", width=4)
draw.line((92, 87, 106, 87), fill="#55e0ef", width=4)
draw.line((94, 105, 104, 105), fill="#55e0ef", width=4)
draw.ellipse((85, 93, 91, 99), fill="#55e0ef")
draw.ellipse((107, 93, 113, 99), fill="#55e0ef")
draw.text((144, 76), "Tasin.", font=font(30, True), fill="#f3f7fa")

draw.text((72, 180), "DEVOPS ENGINEER · AI RESEARCHER", font=font(18, True), fill="#9bb8c9")
draw.text((72, 226), "ALAM MD TASIN", font=font(70, True), fill="#f4f8fb", stroke_width=1)

for x in range(690):
    ratio = x / 689
    color = (int(83 - 14 * ratio), int(224 - 40 * ratio), int(239 + 16 * ratio), 255)
    draw.line((72 + x, 331, 72 + x, 337), fill=color)

draw.text((72, 370), "Reliable infrastructure. Intelligent automation.", font=font(25), fill="#b7cbd7")

chips = [("AWS", 120), ("CI/CD", 120), ("OBSERVABILITY", 190), ("AUTOMATION", 170)]
chip_x = 72
for label, chip_width in chips:
    draw.rounded_rectangle((chip_x, 430, chip_x + chip_width, 478), radius=12, fill="#102b3d", outline="#2f637c", width=1)
    draw.text((chip_x + 22, 443), label, font=font(18, True), fill="#d9f6fb")
    chip_x += chip_width + 18

points = [(810, 400), (890, 320), (970, 380), (1050, 265), (1130, 325)]
draw.line(points, fill=(71, 213, 237, 140), width=3)
for x, y in points:
    draw.rounded_rectangle((x - 25, y - 25, x + 25, y + 25), radius=14, fill="#0b2232", outline="#47d5ed", width=3)

draw.text((72, 552), "HIGASHI-HIROSHIMA · JAPAN", font=font(17), fill="#6fdfee")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT, "PNG", optimize=True)
print(f"Wrote {OUTPUT} ({WIDTH}x{HEIGHT})")
