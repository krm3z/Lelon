# -*- coding: utf-8 -*-
"""
QA couleur et planche de comparaison pour les photos portées générées.

Écart de couleur (CIEDE2000) entre la zone du sac sur l'image générée et sur la référence réelle :

    python3 qa_color.py delta  <reference.jpg> x,y,w,h  <candidate.jpg> x,y,w,h

  x,y,w,h = rectangle entièrement DANS le sac (pas de fond, pas de métallerie), en pixels.
  Seuil du batch : ΔE00 médian ≤ 5 (au-delà : REJECTED, couleur incorrecte).

Planche côte à côte (références + candidates) pour la revue humaine :

    python3 qa_color.py sheet <sortie.jpg> <image1> <image2> …
"""
import math
import sys

from PIL import Image, ImageCms, ImageDraw

_SRGB = ImageCms.createProfile('sRGB')
_LAB = ImageCms.createProfile('LAB')
_TO_LAB = ImageCms.buildTransformFromOpenProfiles(_SRGB, _LAB, 'RGB', 'LAB')


def region_lab(path, box):
    x, y, w, h = (int(v) for v in box.split(','))
    img = Image.open(path).convert('RGB').crop((x, y, x + w, y + h))
    img.thumbnail((160, 160))
    lab = ImageCms.applyTransform(img, _TO_LAB)
    pixels = list(zip(*(band.tobytes() for band in lab.split())))
    # Lab 8 bits (LittleCMS) : L 0–255 → 0–100, a et b décalés de 128.
    return [(p[0] * 100 / 255, p[1] - 128, p[2] - 128) for p in pixels]


def ciede2000(lab1, lab2):
    L1, a1, b1 = lab1
    L2, a2, b2 = lab2
    C1, C2 = math.hypot(a1, b1), math.hypot(a2, b2)
    Cm = (C1 + C2) / 2
    G = 0.5 * (1 - math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = math.degrees(math.atan2(b1, a1p)) % 360
    h2p = math.degrees(math.atan2(b2, a2p)) % 360
    dLp, dCp = L2 - L1, C2p - C1p
    dh = h2p - h1p
    if C1p * C2p == 0:
        dh = 0
    elif dh > 180:
        dh -= 360
    elif dh < -180:
        dh += 360
    dHp = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dh / 2))
    Lm, Cmp = (L1 + L2) / 2, (C1p + C2p) / 2
    if C1p * C2p == 0:
        hm = h1p + h2p
    elif abs(h1p - h2p) <= 180:
        hm = (h1p + h2p) / 2
    else:
        hm = (h1p + h2p + 360) / 2 if h1p + h2p < 360 else (h1p + h2p - 360) / 2
    T = 1 - 0.17 * math.cos(math.radians(hm - 30)) + 0.24 * math.cos(math.radians(2 * hm)) \
        + 0.32 * math.cos(math.radians(3 * hm + 6)) - 0.20 * math.cos(math.radians(4 * hm - 63))
    Sl = 1 + 0.015 * (Lm - 50) ** 2 / math.sqrt(20 + (Lm - 50) ** 2)
    Sc, Sh = 1 + 0.045 * Cmp, 1 + 0.015 * Cmp * T
    Rt = -2 * math.sqrt(Cmp ** 7 / (Cmp ** 7 + 25 ** 7)) * math.sin(math.radians(60 * math.exp(-((hm - 275) / 25) ** 2)))
    return math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh))


def median(values):
    mid = len(values) // 2
    return tuple(sorted(v[i] for v in values)[mid] for i in range(3))


def delta(ref, ref_box, cand, cand_box):
    a, b = median(region_lab(ref, ref_box)), median(region_lab(cand, cand_box))
    d = ciede2000(a, b)
    print(f"référence Lab {tuple(round(x, 1) for x in a)} · candidate Lab {tuple(round(x, 1) for x in b)} · ΔE00 = {d:.2f}")
    print('COLOR ACCURACY : OK' if d <= 5 else 'COLOR ACCURACY : KO (ΔE00 > 5) → REJECTED')
    return d


def sheet(out, paths, cell=520):
    imgs = [Image.open(p).convert('RGB') for p in paths]
    board = Image.new('RGB', (cell * len(imgs), cell + 28), (251, 248, 243))
    draw = ImageDraw.Draw(board)
    for i, (img, path) in enumerate(zip(imgs, paths)):
        img.thumbnail((cell - 16, cell - 16))
        board.paste(img, (i * cell + (cell - img.width) // 2, 8 + (cell - 16 - img.height) // 2))
        draw.text((i * cell + 8, cell + 6), path.split('/')[-1][:60], fill=(73, 51, 45))
    board.save(out, quality=88)
    print('planche :', out)


if __name__ == '__main__':
    if len(sys.argv) >= 6 and sys.argv[1] == 'delta':
        delta(*sys.argv[2:6])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'sheet':
        sheet(sys.argv[2], sys.argv[3:])
    else:
        print(__doc__)
