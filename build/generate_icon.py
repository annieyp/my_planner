from PIL import Image, ImageDraw
import math

SIZE = 1024
img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

INK = (33, 29, 26, 255)
CREAM = (247, 241, 230, 255)
PINK = (255, 211, 230, 255)
PINK_DEEP = (255, 157, 196, 255)
MINT = (205, 238, 224, 255)
MINT_DEEP = (143, 217, 185, 255)
YELLOW = (253, 238, 164, 255)

def rounded_square(draw_ctx, box, radius, fill, outline=None, width=0):
    draw_ctx.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

# squircle-ish base card, inset from edges (mac adds its own padding/shadow)
margin = 72
box = [margin, margin, SIZE - margin, SIZE - margin]
radius = 220
border_w = 20

rounded_square(draw, box, radius, CREAM, outline=INK, width=border_w)

# polka dots inside the card, clipped via a mask
mask = Image.new("L", (SIZE, SIZE), 0)
mask_draw = ImageDraw.Draw(mask)
rounded_square(mask_draw, box, radius, 255)

dots = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
dots_draw = ImageDraw.Draw(dots)
step = 92
r = 7
for y in range(margin, SIZE - margin, step):
    for x in range(margin, SIZE - margin, step):
        dots_draw.ellipse([x - r, y - r, x + r, y + r], fill=(33, 29, 26, 40))
img.paste(dots, (0, 0), Image.composite(dots, Image.new("RGBA", (SIZE, SIZE), (0,0,0,0)), mask).split()[3])

# yellow washi tape strip top-left
tape = Image.new("RGBA", (320, 110), (0, 0, 0, 0))
tape_draw = ImageDraw.Draw(tape)
tape_draw.rectangle([0, 0, 320, 110], fill=(253, 238, 164, 235), outline=(33,29,26,140), width=6)
tape = tape.rotate(-10, expand=True)
img.paste(tape, (60, 40), tape)

# central mint asterisk/sticker badge
cx, cy = SIZE // 2 + 10, SIZE // 2 + 30
badge_r = 250
draw.ellipse([cx - badge_r, cy - badge_r, cx + badge_r, cy + badge_r], fill=MINT_DEEP, outline=INK, width=18)

# checklist marks inside badge (three little rounded ticks + lines, like a checklist)
line_x0 = cx - 140
line_x1 = cx + 150
ys = [cy - 110, cy + 10, cy + 130]
for y in ys:
    # checkbox
    box2 = [line_x0 - 40, y - 34, line_x0 + 34, y + 34]
    rounded_square(draw, box2, 14, CREAM, outline=INK, width=10)
    draw.line([line_x0 - 24, y + 2, line_x0 - 4, y + 22], fill=INK, width=12, joint="curve")
    draw.line([line_x0 - 4, y + 22, line_x0 + 22, y - 16], fill=INK, width=12, joint="curve")
    # text line
    draw.line([line_x0 + 60, y, line_x1, y], fill=INK, width=16)

# small pink heart sticker bottom right of card
heart_cx, heart_cy = SIZE - margin - 150, SIZE - margin - 150
hr = 46
draw.ellipse([heart_cx - hr, heart_cy - hr*0.6 - hr*0.5, heart_cx, heart_cy + hr*0.5], fill=PINK_DEEP, outline=INK, width=8)
draw.ellipse([heart_cx, heart_cy - hr*0.6 - hr*0.5, heart_cx + hr, heart_cy + hr*0.5], fill=PINK_DEEP, outline=INK, width=8)
draw.polygon(
    [
        (heart_cx - hr, heart_cy - hr * 0.15),
        (heart_cx + hr, heart_cy - hr * 0.15),
        (heart_cx, heart_cy + hr * 1.15),
    ],
    fill=PINK_DEEP,
    outline=INK,
)

img.save("build/icon.png")
print("saved build/icon.png", img.size)
