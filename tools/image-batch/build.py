# -*- coding: utf-8 -*-
"""
Construit le batch de photos portées LELON à partir de Shopify (source de vérité des variantes).

    python3 build.py <export-admin.json> <dossier LELON-Images> <racine du dépôt>

<export-admin.json> : réponse Admin GraphQL `products { handle title status options media { alt } variants {
id title sku availableForSale inventoryPolicy inventoryQuantity selectedOptions media inventoryItem … } }`.

Écrit :
  docs/product-image-matrix.md   matrice PRODUIT × COLORIS × TAILLE (source de vérité du batch)
  docs/image-generation-batch.md prompts A/B/C, contraintes, QA par variante
  docs/generated-image-qa.md     registre QA (vide tant qu'aucune image n'a été générée)
  docs/photo-coverage-report.md  couverture photo par variante + totaux
  tools/image-batch/batch.json   même batch, lisible par un script de génération
Ne modifie rien dans Shopify.
"""
import json
import os
import re
import sys
import unicodedata

from knowledge import (COLOR_EN, EN, ENV_EN, ENV_ROTATION, ENVIRONMENTS, OUTFITS, OUTFITS_EN, PERSONAS, PERSONAS_EN,
                       PRODUCTS, SHOPIFY_WORN_UNVERIFIED, ZIP_SHOTS)

export_path, imgs_root, repo = sys.argv[1:4]
nodes = json.load(open(export_path, encoding='utf-8'))['data']['products']['nodes']
ORDER = ['elea', 'mira', 'nova', 'solea', 'lyra', 'luna', 'alya', 'lila', 'vera', 'naya',
         'aurea', 'elara', 'isaure', 'celene', 'velora', 'amara', 'norea']
nodes.sort(key=lambda n: ORDER.index(n['handle']))


def slug(text):
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', text.lower().replace('&', ' ')).strip('-')


def media_color(alt, colors):
    """Same rule as the theme snippet lelon-media-color: longest color named in the alt, 'et' read as '&'."""
    hay = (alt or '').lower().replace(' et ', ' & ')
    found = ''
    for c in colors:
        if c.lower() in hay and len(c) > len(found):
            found = c
    return found


def outfit_key(color):
    s = slug(color)
    for key in OUTFITS:
        if s.startswith(key):
            return key
    return 'noir'


BLOCKING = {
    'NEEDS_REAL_REFERENCE': 'Aucune photo réelle de ce coloris : génération impossible sans référence.',
    'LEGAL_REVIEW_REQUIRED': 'Ressemblance forte avec un modèle iconique d’une maison : vérification juridique avant tout visuel publicitaire.',
    'SIZE_REFERENCE_REQUIRED': 'Dimensions M / L non publiées : aucune différence de taille ne peut être générée.',
    'VARIANT_MAPPING_TO_CONFIRM': 'Photos probablement inversées entre Crème & Chocolat et Taupe & Chocolat : confirmer avant génération.',
    'REFERENCE_TO_CONFIRM': 'Les 2 photos du zip n’ont pas le même ton : confirmer la teinte réelle.',
    'MERCHANT_DECISION_TAG': 'Étiquette fournisseur suspendue (texte « FASHION & … ») : livrée ou retirée ? Décide si elle apparaît.',
    'MERCHANT_DECISION_ACCESSORIES': 'Foulard et sangle « CLASSIC » visibles sur les références : fournis ou non ? Décide s’ils apparaissent.',
}
LIMITING = {
    'REFERENCE_WEAK': 'Une seule image fournisseur basse définition : 2 visuels maximum (A, B), QA renforcée.',
}

rows = []
for n in nodes:
    h = n['handle']
    k = PRODUCTS[h]
    en = EN[h]
    color_opt = next(o for o in n['options'] if o['name'].lower() in ('coloris', 'couleur', 'color', 'colour'))
    colors = color_opt['values']
    size_opt = next((o for o in n['options'] if o['name'].lower() in ('format', 'taille', 'size')), None)
    persona_a = ORDER.index(h) % len(PERSONAS)
    for vi, v in enumerate(n['variants']['nodes']):
        opts = {o['name']: o['value'] for o in v['selectedOptions']}
        color = opts[color_opt['name']]
        size = opts.get(size_opt['name']) if size_opt else ''
        shop_refs = [m for m in n['media']['nodes'] if media_color(m.get('alt'), colors) == color]
        zip_dir = os.path.join(imgs_root, k['folder'], slug(color))
        zip_refs = sorted(os.listdir(zip_dir)) if os.path.isdir(zip_dir) else []
        if h == 'alya' and color == 'Noir':
            zip_refs = [f for f in zip_refs if not f.startswith('6_')]  # filigrane fournisseur
        flags = list(k['flags'].get('*', [])) + list(k['flags'].get(color, []))
        if not shop_refs and not zip_refs and 'NEEDS_REAL_REFERENCE' not in flags:
            flags.append('NEEDS_REAL_REFERENCE')
        if 'NEEDS_REAL_REFERENCE' in flags:
            status = 'REAL_PHOTOS_REQUIRED'
        elif any(f in BLOCKING for f in flags):
            status = 'BLOCKED_BY_MERCHANT'
        elif any(f in LIMITING for f in flags):
            status = 'READY_LIMITED'
        else:
            status = 'READY_FOR_GENERATION'
        target = 0 if status in ('REAL_PHOTOS_REQUIRED',) else (2 if status == 'READY_LIMITED' else 3)
        shots = ZIP_SHOTS.get(h, {}).get(slug(color), [])
        worn_real = sum(1 for s in shots if s.startswith('porte'))
        base = f"lelon-{h}-{slug(color)}" + (f"-{slug(size)}" if size else '')
        oc = outfit_key(color)
        env = ENV_ROTATION[h]
        jobs = []
        for idx, shot in enumerate('ABC'):
            if target and idx >= target:
                break
            persona = persona_a if shot == 'A' else (persona_a + 1 + idx + vi) % len(PERSONAS)
            kind = 'lifestyle' if shot == 'C' else 'porte'
            filename = f"{base}-{kind}-{idx + 1:02d}"
            camera = {
                'A': 'full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame',
                'B': 'full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame',
                'C': 'full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame',
            }[shot]
            prompt = (
                f"Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. "
                f"{PERSONAS_EN[persona].capitalize()}, wearing {OUTFITS_EN[oc]}, {en[shot]}. "
                f"The bag is exactly the product shown in the reference images, in {COLOR_EN[color]}: {en['desc']}. "
                f"Do not change its shape, proportions, handles, strap, hardware, stitching or color. "
                f"Setting: {ENV_EN[env[idx]]}. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, "
                f"natural relaxed pose. Camera: {camera}. Portrait 4:5."
            )
            carry_short = re.split(r' \(| — |, ', k['carry'][shot])[0].replace('porté épaule', 'porté à l’épaule')
            alt = f"Sac {k['name']} {color.lower()}{(' format ' + size) if size else ''} LELON {carry_short}"
            jobs.append({'shot': shot, 'file': filename + '.jpg', 'persona': PERSONAS[persona], 'environment': ENVIRONMENTS[env[idx]],
                         'carry': k['carry'][shot], 'camera': camera, 'prompt': prompt, 'alt': alt,
                         'shopify_alt': f"LELON {k['name']} — {color} — Porté {idx + 1:02d}" + (f" — {size}" if size else '')})
        rows.append({
            'handle': h, 'name': k['name'], 'title': n['title'], 'product_id': n['id'].split('/')[-1], 'status_product': n['status'],
            'variant_id': v['id'].split('/')[-1], 'variant': v['title'], 'color': color, 'size': size, 'sku': v['sku'],
            'available': v['availableForSale'], 'qty': v['inventoryQuantity'], 'policy': v['inventoryPolicy'],
            'variant_media': bool(v['media']['nodes']), 'shop_refs': shop_refs, 'zip_refs': zip_refs, 'zip_dir': os.path.relpath(zip_dir, imgs_root),
            'shots': shots, 'worn_real': worn_real, 'worn_unverified': (h, color) in SHOPIFY_WORN_UNVERIFIED,
            'flags': flags, 'status': status, 'target': target, 'jobs': jobs, 'features': k['features'], 'hardware': k['hardware'],
            'refs_note': k['refs_note'], 'base': base,
        })

NEGATIVE_GLOBAL = (
    "no logo, no brand name, no text or letters anywhere (bag, tag, background), no supplier label, no invented pocket, "
    "no extra or missing handle, no strap change, no hardware color change, no added charm or accessory, no interior view, "
    "no deformation, no melted or warped edges, no hand passing through the bag, no strap passing through the body, "
    "correct hands with five fingers, no bag merged with clothing, no plastic CGI look, no oversaturation, "
    "no evening gown, no extravagant jewelry, no palace setting, no sexualised pose, no Eiffel Tower, no watermark"
)
QA_CHECKLIST = [
    'Silhouette et ratio largeur/hauteur identiques aux références (superposer le contour du packshot)',
    'Nombre d’anses / bandoulières, longueur relative et points d’attache identiques',
    'Fermeture, rabat, fermoir, zip, coutures, panneaux, coins identiques ; aucune poche inventée',
    'Métallerie : même couleur et même forme',
    'Texture : même grain / plissé / tressage / effet velours',
    'Couleur : ΔE moyen ≤ 5 entre la zone sac et le packshot de référence (tools/image-batch/qa_color.py)',
    'Taille cohérente avec les dimensions publiées et avec le corps (pas de sac géant ou miniature)',
    'Anatomie : mains, doigts, oreilles, cheveux, bijoux sans défaut',
    'Physique : aucune sangle ou main qui traverse, ombres et perspective plausibles',
    'Aucun texte, logo, étiquette fournisseur ni filigrane',
    'Direction LELON : tenue sobre, décor calme, lumière naturelle, pas d’esthétique IA reconnaissable',
    'Les 2–3 images d’une variante diffèrent vraiment (pose, angle, distance, décor)',
]

matrix = ['# LELON — Matrice photographique PRODUIT × COLORIS × TAILLE', '',
          'Source de vérité du batch de photos portées. Générée par `tools/image-batch/build.py` à partir de l’Admin API Shopify',
          '(lecture seule, 23/09/2026). Aucune variante n’est ajoutée ni supposée : une ligne = une variante Shopify réelle.', '',
          '**Références** : `S` = médias Shopify dont le texte alternatif nomme ce coloris ; `Z` = photos du zip fourni (dossier du coloris).',
          '**Générées A/B/C** : aucune image n’a été générée — aucun outil de génération d’images n’est disponible dans l’environnement de travail.', '',
          '| PRODUCT | PRODUCT ID | VARIANT | VARIANT ID | COLOR | SIZE | SKU | AVAILABLE | REFERENCE IMAGES | GENERATED A | GENERATED B | GENERATED C | QA STATUS | SHOPIFY STATUS |',
          '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|']
for r in rows:
    refs = f"S {len(r['shop_refs'])} · Z {len(r['zip_refs'])}"
    gen = ['— (non généré)' if i < r['target'] else 'n/a' for i in range(3)]
    qa = r['status'] + (' — ' + ', '.join(r['flags']) if r['flags'] else '')
    shop = f"{r['status_product']} · stock {r['qty']} · {r['policy']} · média variante {'oui' if r['variant_media'] else 'NON'}"
    matrix.append(f"| {r['name']} | {r['product_id']} | {r['variant']} | {r['variant_id']} | {r['color']} | {r['size'] or '—'} | {r['sku']} | "
                  f"{'oui' if r['available'] else 'non'} | {refs} | {gen[0]} | {gen[1]} | {gen[2]} | {qa} | {shop} |")
by_status = {}
for r in rows:
    by_status[r['status']] = by_status.get(r['status'], 0) + 1
matrix += ['', '## Totaux', '',
           f"- Produits : **{len(nodes)}** · variantes photographiques réelles : **{len(rows)}**",
           f"- Objectif photos portées : **{2 * len(rows)} à {3 * len(rows)}** (2 à 3 par variante)",
           f"- Cible réaliste compte tenu des références : **{sum(r['target'] for r in rows)}** images",
           '- Statuts : ' + ' · '.join(f"{k} **{v}**" for k, v in sorted(by_status.items())), '',
           '## Légende des statuts', '',
           '- `READY_FOR_GENERATION` : références suffisantes, 3 visuels visés.',
           '- `READY_LIMITED` : référence faible, 2 visuels maximum, QA renforcée.',
           '- `BLOCKED_BY_MERCHANT` : une décision ou une vérification marchand est nécessaire avant génération (voir BLOCKED_BY_MERCHANT.md).',
           '- `REAL_PHOTOS_REQUIRED` : aucune référence réelle du coloris → vraie séance photo.', '',
           '## Drapeaux', ''] + [f"- `{k}` : {v}" for k, v in {**BLOCKING, **LIMITING}.items()]
open(os.path.join(repo, 'docs/product-image-matrix.md'), 'w', encoding='utf-8').write('\n'.join(matrix) + '\n')

batch = ['# LELON — Batch de génération des photos portées', '',
         '> **ACTION NON EXÉCUTÉE — génération d’images.**',
         '> Raison : aucun outil de génération ou d’édition d’images n’est disponible dans l’environnement de travail',
         '> (pas d’outil image dans la session, pas de clé d’API de générateur, pas de GPU ; `lelon.fr`, `cdn.shopify.com`,',
         '> `huggingface.co`, `api.openai.com` et `api.replicate.com` sont bloqués par le proxy réseau).',
         '> Nécessaire : un générateur **avec images de référence** (image-to-image / « product reference ») puis la QA ci-dessous.',
         '> Ce document est prêt à être exécuté tel quel ; `tools/image-batch/batch.json` contient les mêmes tâches pour un script.', '',
         '## Méthode recommandée (fidélité maximale)', '',
         '1. **Détourer le vrai sac** depuis le meilleur packshot du coloris (fond supprimé, contour net).',
         '2. **Générer la mannequin et le décor autour du sac réel** (inpainting / « product placement » : le sac détouré reste un calque',
         '   fixe, seules la personne, la main, la sangle portée et la scène sont générées). C’est la seule méthode qui garantit que',
         '   le sac n’est pas réinventé. Ajuster uniquement lumière et ombre portée sur le sac (harmonisation), jamais sa forme.',
         '3. Si le générateur ne sait travailler qu’en « référence de style » (le sac est redessiné) : QA stricte, taux de rejet élevé attendu.',
         '4. QA image par image (checklist) → `ACCEPTED` / `REJECTED` / `NEEDS_HUMAN_REVIEW` / `REAL_PHOTO_REQUIRED` dans `docs/generated-image-qa.md`.',
         '5. Régénérer les rejets en corrigeant la cause (prompt, masque, référence), sans jamais valider une image infidèle pour atteindre 3/3.',
         '6. Procéder **produit par produit** (ÉLÉA → toutes ses variantes → QA → validation, puis MIRA…).', '',
         '## Intégration sans toucher au thème publié', '',
         '- Les médias produit sont partagés entre tous les thèmes : **ne pas** ajouter les images générées aux médias produit.',
         '- Déposer les images **acceptées** dans *Contenu → Fichiers* (Shopify Files), puis les référencer dans le metafield produit',
         '  `lelon.lifestyle_media` (liste de fichiers, déjà créé, vide). Seul le thème DRAFT lit ce metafield : le thème publié',
         '  (« Cinématique ») ne le lit pas — vérifié dans le code du thème publié.',
         '- Texte alternatif **obligatoire** au format `LELON <MODÈLE> — <Coloris> — Porté 01` : la galerie du DRAFT affiche automatiquement',
         '  les photos du coloris sélectionné (même règle que les photos produit) et, avec le réglage « Photo portée en premier »,',
         '  ouvre la fiche sur la photo portée du coloris.',
         '- Nommage des fichiers : `lelon-<modele>-<coloris>[-<taille>]-porte-01.jpg`, `…-porte-02.jpg`, `…-lifestyle-03.jpg`',
         '  (minuscules, tirets, sans accents). Export JPEG sRGB, 1600 × 2000 px (4:5), ≤ 600 Ko ; Shopify sert les tailles responsives.',
         '- Ces visuels sont des **visuels de marque**. Ne jamais les présenter comme des clientes, des avis ou de l’UGC.', '',
         '## Dossier de revue', '',
         '```', 'generated-review/', '  <modele>/', '    <coloris>[-<taille>]/', '      candidates/   toutes les générations',
         '      accepted/     images ACCEPTED (seules intégrables)', '      rejected/     avec la raison dans generated-image-qa.md', '```', '',
         '## Contraintes négatives communes', '', '```', NEGATIVE_GLOBAL, '```', '',
         '## Checklist QA (chaque image)', ''] + [f"- [ ] {c}" for c in QA_CHECKLIST] + ['', '---', '']
for h in ORDER:
    prows = [r for r in rows if r['handle'] == h]
    k = PRODUCTS[h]
    batch += [f"## {k['name']}", '', f"**Porté autorisé** (description Shopify ou photo réelle uniquement) :",
              f"A — {k['carry']['A']} · B — {k['carry']['B']} · C — {k['carry']['C']}", '',
              '**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :', '']
    batch += [f"- {f}" for f in k['features']] + [f"- métallerie : {k['hardware']}", '', f"_Note références_ : {k['refs_note']}", '']
    for r in prows:
        head = f"### {k['name']} — {r['color']}" + (f" — {r['size']}" if r['size'] else '')
        batch += [head, '',
                  f"- Variante Shopify `{r['variant_id']}` · SKU `{r['sku']}` · statut **{r['status']}**" + (f" · drapeaux : {', '.join(r['flags'])}" if r['flags'] else ''),
                  '- REFERENCE IMAGES :']
        for m in r['shop_refs']:
            caution = ' — ⚠ visuel porté d’origine inconnue, non contrôlé : ne pas l’utiliser comme référence de fidélité' if 'mannequin' in m['alt'] else ''
            batch.append(f"  - Shopify : « {m['alt']} » ({m['image']['width']}×{m['image']['height']}) — `{m['image']['url'].split('/')[-1].split('?')[0]}`{caution}")
        for f in r['zip_refs']:
            batch.append(f"  - Zip : `{r['zip_dir']}/{f}`")
        if not r['shop_refs'] and not r['zip_refs']:
            batch.append('  - **aucune** → NEEDS_REAL_REFERENCE')
        for flag in r['flags']:
            batch.append(f"- ⚠ `{flag}` : {BLOCKING.get(flag) or LIMITING.get(flag)}")
        batch.append(f"- COLOR TO PRESERVE : {r['color']} ({COLOR_EN[r['color']]}), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.")
        batch.append(f"- PRODUCT FEATURES TO PRESERVE : voir liste {k['name']} ci-dessus.")
        if not r['jobs'] or r['status'] == 'REAL_PHOTOS_REQUIRED':
            batch += ['- EXPECTED OUTPUT : **0 image générée** — REAL_PHOTOS_REQUIRED.', '']
            continue
        if r['status'] == 'BLOCKED_BY_MERCHANT':
            batch.append('- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.')
        for j in r['jobs']:
            batch += ['', f"**IMAGE {j['shot']} PROMPT** → `{j['file']}`", '', '```', j['prompt'], '```',
                      f"- CARRY MODE : {j['carry']}", f"- CAMERA : {j['camera']}",
                      f"- COMPOSITION : {'sac entier, net, non masqué par la main ou les cheveux' if j['shot'] != 'C' else 'scène lisible, sac net au tiers de l’image'} ; recadrage 4:5",
                      '- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin',
                      f"- ENVIRONMENT : {j['environment']}", f"- MANNEQUIN : {j['persona']}",
                      f"- NEGATIVE CONSTRAINTS : contraintes communes + {', '.join(r['flags']) and 'voir drapeaux' or 'aucune spécifique'}",
                      f"- EXPECTED OUTPUT : `{j['file']}` 1600 × 2000 JPEG sRGB · alt Shopify « {j['shopify_alt']} » · alt descriptif « {j['alt']} »",
                      '- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées']
        batch.append('')
open(os.path.join(repo, 'docs/image-generation-batch.md'), 'w', encoding='utf-8').write('\n'.join(batch) + '\n')

json.dump([{k2: v for k2, v in r.items() if k2 not in ('shop_refs',)} | {'shop_refs': [m['alt'] for m in r['shop_refs']]} for r in rows],
          open(os.path.join(repo, 'tools/image-batch/batch.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

qa = ['# LELON — Registre QA des images générées', '',
      '**Aucune image générée à ce jour** (aucun générateur disponible pendant la session du 23–24/09/2026).',
      'Ce registre est prêt : une ligne par image candidate, y compris les rejets.', '',
      'Statuts : `ACCEPTED` (seul statut intégrable dans le DRAFT) · `REJECTED` · `NEEDS_HUMAN_REVIEW` · `REAL_PHOTO_REQUIRED`.',
      'Notes FIDELITY / ANATOMY / LIGHTING / COLOR ACCURACY / PRODUCT ACCURACY : `OK` / `KO` + cause.', '',
      '| FILE | PRODUCT | VARIANT | COLOR | SIZE | SOURCE REFERENCES | FIDELITY | ANATOMY | LIGHTING | COLOR ACCURACY | PRODUCT ACCURACY | STATUS | REASON |',
      '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
      '| _(vide)_ | | | | | | | | | | | | |', '',
      '## Images déjà présentes dans Shopify à contrôler', '',
      'Quatre visuels « portés » PNG 1122 × 1402 sont déjà dans les médias produit (donc visibles aussi sur le thème publié).',
      'Leur origine n’est pas documentée et ils n’ont **pas pu être ouverts** depuis l’environnement de travail (CDN bloqué).',
      'Les passer dans la checklist avant de les mettre en avant :', '',
      '| FILE | PRODUCT | COLOR | STATUS | REASON |', '|---|---|---|---|---|',
      '| lelon-elea-cognac-02-mannequin.png | ÉLÉA | Cognac | NEEDS_HUMAN_REVIEW | origine inconnue, non consultable |',
      '| lelon-nova-chocolat-02-mannequin.png | NOVA | Chocolat | NEEDS_HUMAN_REVIEW | origine inconnue, non consultable |',
      '| lelon-solea-beige-cognac-02-mannequin.png | SOLÉA | Beige & Cognac | NEEDS_HUMAN_REVIEW | origine inconnue, non consultable |',
      '| lelon-velora-ivoire-02-mannequin.png | VÉLORA | Ivoire | NEEDS_HUMAN_REVIEW | origine inconnue, non consultable |', '',
      'Si ce sont des images générées : les garder uniquement si elles passent les 12 points, et ne jamais les légender comme une cliente.', '',
      '## Checklist', ''] + [f"{i + 1}. {c}" for i, c in enumerate(QA_CHECKLIST)]
open(os.path.join(repo, 'docs/generated-image-qa.md'), 'w', encoding='utf-8').write('\n'.join(qa) + '\n')

cov = ['# LELON — Rapport de couverture photographique', '',
       'Par variante Shopify réelle. `S` = médias Shopify du coloris, `Z` = photos du zip. Types relevés visuellement sur le zip :',
       'packshot, main (sac tenu, corps partiel), porté (mannequin), situation (posé en décor), détail, intérieur, infographie.', '',
       '| PRODUCT | COLOR | SIZE | REAL IMAGES | MODEL IMAGE 1 | MODEL IMAGE 2 | MODEL IMAGE 3 | PACKSHOT | INTERIOR | DETAIL | STATUS | MISSING |',
       '|---|---|---|---|---|---|---|---|---|---|---|---|']
tot_real_worn = 0
for r in rows:
    shots = r['shots']
    worn = ['réelle (zip)'] * r['worn_real']
    if r['worn_unverified']:
        worn.append('Shopify PNG — à contrôler')
    worn = (worn + ['—', '—', '—'])[:3]
    tot_real_worn += r['worn_real']
    has = lambda t: any(t in s for s in shots)
    missing = []
    if r['worn_real'] < 2:
        missing.append(f"{max(0, 2 - r['worn_real'])}–{max(0, 3 - r['worn_real'])} portées")
    if not has('packshot'):
        missing.append('packshot')
    if not has('interieur'):
        missing.append('intérieur')
    if not has('detail'):
        missing.append('détail')
    cov.append(f"| {r['name']} | {r['color']} | {r['size'] or '—'} | S {len(r['shop_refs'])} · Z {len(r['zip_refs'])} | {worn[0]} | {worn[1]} | {worn[2]} | "
               f"{'oui' if has('packshot') else 'non'} | {'oui' if has('interieur') else 'non'} | {'oui' if has('detail') else 'non'} | {r['status']} | {', '.join(missing) or '—'} |")
real_required = sum(1 for r in rows if r['status'] == 'REAL_PHOTOS_REQUIRED')
blocked = sum(1 for r in rows if r['status'] == 'BLOCKED_BY_MERCHANT')
cov += ['', '## Totaux', '',
        f"| Indicateur | Valeur |", '|---|---|',
        f"| Variantes photographiques réelles (modèle × coloris × format) | **{len(rows)}** |",
        f"| Objectif photos mannequin (2 à 3 par variante) | **{2 * len(rows)} – {3 * len(rows)}** |",
        f"| Cible atteignable avec les références actuelles | {sum(r['target'] for r in rows)} (dont {sum(r['target'] for r in rows if r['status'] == 'BLOCKED_BY_MERCHANT')} en attente de décision marchand) |",
        '| Photos mannequin générées | **0** |', '| Acceptées | 0 |', '| Rejetées | 0 |', '| Intégrées dans le DRAFT | 0 |',
        f"| Photos portées réelles déjà disponibles (zip) | {tot_real_worn} |",
        '| Photos portées Shopify à contrôler (origine inconnue) | 4 |',
        f"| Variantes bloquées par une décision marchand | {blocked} |",
        f"| Variantes nécessitant une vraie séance photo (aucune référence) | {real_required} |", '',
        '## Lecture', '',
        '- Aucune variante n’a d’intérieur photographié dans un coloris vendu, sauf CÉLÈNE Taupe, AMARA Sauge, MIRA Ivoire (composite) et LYRA Chocolat (infographie).',
        '  L’intérieur ne se génère pas : **séance photo réelle** nécessaire (galerie cible : 06 intérieur).',
        '- Les photos portées générées compléteront les galeries ; elles ne remplacent ni les packshots ni les détails réels.']
open(os.path.join(repo, 'docs/photo-coverage-report.md'), 'w', encoding='utf-8').write('\n'.join(cov) + '\n')

print(len(rows), 'variantes ·', by_status, '· cible', sum(r['target'] for r in rows))
