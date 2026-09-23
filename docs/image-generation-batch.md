# LELON — Batch de génération des photos portées

> **ACTION NON EXÉCUTÉE — génération d’images.**
> Raison : aucun outil de génération ou d’édition d’images n’est disponible dans l’environnement de travail
> (pas d’outil image dans la session, pas de clé d’API de générateur, pas de GPU ; `lelon.fr`, `cdn.shopify.com`,
> `huggingface.co`, `api.openai.com` et `api.replicate.com` sont bloqués par le proxy réseau).
> Nécessaire : un générateur **avec images de référence** (image-to-image / « product reference ») puis la QA ci-dessous.
> Ce document est prêt à être exécuté tel quel ; `tools/image-batch/batch.json` contient les mêmes tâches pour un script.

## Méthode recommandée (fidélité maximale)

1. **Détourer le vrai sac** depuis le meilleur packshot du coloris (fond supprimé, contour net).
2. **Générer la mannequin et le décor autour du sac réel** (inpainting / « product placement » : le sac détouré reste un calque
   fixe, seules la personne, la main, la sangle portée et la scène sont générées). C’est la seule méthode qui garantit que
   le sac n’est pas réinventé. Ajuster uniquement lumière et ombre portée sur le sac (harmonisation), jamais sa forme.
3. Si le générateur ne sait travailler qu’en « référence de style » (le sac est redessiné) : QA stricte, taux de rejet élevé attendu.
4. QA image par image (checklist) → `ACCEPTED` / `REJECTED` / `NEEDS_HUMAN_REVIEW` / `REAL_PHOTO_REQUIRED` dans `docs/generated-image-qa.md`.
5. Régénérer les rejets en corrigeant la cause (prompt, masque, référence), sans jamais valider une image infidèle pour atteindre 3/3.
6. Procéder **produit par produit** (ÉLÉA → toutes ses variantes → QA → validation, puis MIRA…).

## Intégration sans toucher au thème publié

- Les médias produit sont partagés entre tous les thèmes : **ne pas** ajouter les images générées aux médias produit.
- Déposer les images **acceptées** dans *Contenu → Fichiers* (Shopify Files), puis les référencer dans le metafield produit
  `lelon.lifestyle_media` (liste de fichiers, déjà créé, vide). Seul le thème DRAFT lit ce metafield : le thème publié
  (« Cinématique ») ne le lit pas — vérifié dans le code du thème publié.
- Texte alternatif **obligatoire** au format `LELON <MODÈLE> — <Coloris> — Porté 01` : la galerie du DRAFT affiche automatiquement
  les photos du coloris sélectionné (même règle que les photos produit) et, avec le réglage « Photo portée en premier »,
  ouvre la fiche sur la photo portée du coloris.
- Nommage des fichiers : `lelon-<modele>-<coloris>[-<taille>]-porte-01.jpg`, `…-porte-02.jpg`, `…-lifestyle-03.jpg`
  (minuscules, tirets, sans accents). Export JPEG sRGB, 1600 × 2000 px (4:5), ≤ 600 Ko ; Shopify sert les tailles responsives.
- Ces visuels sont des **visuels de marque**. Ne jamais les présenter comme des clientes, des avis ou de l’UGC.

## Dossier de revue

```
generated-review/
  <modele>/
    <coloris>[-<taille>]/
      candidates/   toutes les générations
      accepted/     images ACCEPTED (seules intégrables)
      rejected/     avec la raison dans generated-image-qa.md
```

## Contraintes négatives communes

```
no logo, no brand name, no text or letters anywhere (bag, tag, background), no supplier label, no invented pocket, no extra or missing handle, no strap change, no hardware color change, no added charm or accessory, no interior view, no deformation, no melted or warped edges, no hand passing through the bag, no strap passing through the body, correct hands with five fingers, no bag merged with clothing, no plastic CGI look, no oversaturation, no evening gown, no extravagant jewelry, no palace setting, no sexualised pose, no Eiffel Tower, no watermark
```

## Checklist QA (chaque image)

- [ ] Silhouette et ratio largeur/hauteur identiques aux références (superposer le contour du packshot)
- [ ] Nombre d’anses / bandoulières, longueur relative et points d’attache identiques
- [ ] Fermeture, rabat, fermoir, zip, coutures, panneaux, coins identiques ; aucune poche inventée
- [ ] Métallerie : même couleur et même forme
- [ ] Texture : même grain / plissé / tressage / effet velours
- [ ] Couleur : ΔE moyen ≤ 5 entre la zone sac et le packshot de référence (tools/image-batch/qa_color.py)
- [ ] Taille cohérente avec les dimensions publiées et avec le corps (pas de sac géant ou miniature)
- [ ] Anatomie : mains, doigts, oreilles, cheveux, bijoux sans défaut
- [ ] Physique : aucune sangle ou main qui traverse, ombres et perspective plausibles
- [ ] Aucun texte, logo, étiquette fournisseur ni filigrane
- [ ] Direction LELON : tenue sobre, décor calme, lumière naturelle, pas d’esthétique IA reconnaissable
- [ ] Les 2–3 images d’une variante diffèrent vraiment (pose, angle, distance, décor)

---

## ÉLÉA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — porté épaule (DESC « À l’épaule ») · B — tenu à la main par la bandoulière, bras le long du corps (REF : 4 photos) · C — porté épaule, scène quotidienne

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- silhouette rectangulaire horizontale structurée, compacte (DESC : environ 26 × 14 × 5,5 cm)
- rabat avant asymétrique aux angles légèrement arrondis, couvrant presque toute la face
- une ligne de surpiqûre horizontale sur le rabat
- large bandoulière plate du même coloris, fixée sur les côtés
- boucle / attache métallique dorée côté gauche de la bandoulière
- aspect lisse, légèrement satiné (REF)
- métallerie : doré

_Note références_ : Une seule photo par coloris, même angle (tenu à la main, décor lit blanc) : vues profil/dos absentes.

### ÉLÉA — Cognac

- Variante Shopify `60840299626830` · SKU `CJNS207059905EV` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON ÉLÉA — Cognac — Vue 1 » (800×800) — `lelon-elea-cognac-ef44ccfa3f.jpg`
  - Shopify : « LELON ÉLÉA Cognac porté par une mannequin » (1122×1402) — `lelon-elea-cognac-02-mannequin.png` — ⚠ visuel porté d’origine inconnue, non contrôlé : ne pas l’utiliser comme référence de fidélité
  - Zip : `01-elea/cognac/10_7f33e188-fe2d-44da-808d-37b2d8d44b3e.jpg`
- COLOR TO PRESERVE : Cognac (cognac brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ÉLÉA ci-dessus.

**IMAGE A PROMPT** → `lelon-elea-cognac-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a white shirt, cream knit and raw denim, worn on the shoulder, strap over the shoulder, bag resting under the arm. The bag is exactly the product shown in the reference images, in cognac brown: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « À l’épaule »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-cognac-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Cognac — Porté 01 » · alt descriptif « Sac ÉLÉA cognac LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-elea-cognac-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a white shirt, cream knit and raw denim, carried in the hand by its strap, arm relaxed along the body. The bag is exactly the product shown in the reference images, in cognac brown: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la bandoulière, bras le long du corps (REF : 4 photos)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-cognac-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Cognac — Porté 02 » · alt descriptif « Sac ÉLÉA cognac LELON tenu à la main par la bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-elea-cognac-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a white shirt, cream knit and raw denim, worn on the shoulder while walking. The bag is exactly the product shown in the reference images, in cognac brown: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-cognac-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Cognac — Porté 03 » · alt descriptif « Sac ÉLÉA cognac LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### ÉLÉA — Noir

- Variante Shopify `60826633142606` · SKU `CJNS207059901AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON ÉLÉA — Noir — Vue 3 » (800×800) — `lelon-elea-noir-1f931bddf5.jpg`
  - Zip : `01-elea/noir/13_7b83cb3a-6973-40d8-a14c-f5b74f620810.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ÉLÉA ci-dessus.

**IMAGE A PROMPT** → `lelon-elea-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder, strap over the shoulder, bag resting under the arm. The bag is exactly the product shown in the reference images, in black: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « À l’épaule »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Noir — Porté 01 » · alt descriptif « Sac ÉLÉA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-elea-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a beige trench coat, white shirt and light jeans, carried in the hand by its strap, arm relaxed along the body. The bag is exactly the product shown in the reference images, in black: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la bandoulière, bras le long du corps (REF : 4 photos)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Noir — Porté 02 » · alt descriptif « Sac ÉLÉA noir LELON tenu à la main par la bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-elea-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder while walking. The bag is exactly the product shown in the reference images, in black: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Noir — Porté 03 » · alt descriptif « Sac ÉLÉA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### ÉLÉA — Ivoire

- Variante Shopify `60840299659598` · SKU `CJNS207059902BY` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON ÉLÉA — Ivoire — Vue 2 » (800×800) — `lelon-elea-ivoire-3a43dfcf55.jpg`
  - Zip : `01-elea/ivoire/7_bc36a463-b149-49d1-b6b2-e326d58b2eb5.jpg`
- COLOR TO PRESERVE : Ivoire (ivory), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ÉLÉA ci-dessus.

**IMAGE A PROMPT** → `lelon-elea-ivoire-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder, strap over the shoulder, bag resting under the arm. The bag is exactly the product shown in the reference images, in ivory: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « À l’épaule »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-ivoire-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Ivoire — Porté 01 » · alt descriptif « Sac ÉLÉA ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-elea-ivoire-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a chocolate wool coat over a black knit and straight trousers, carried in the hand by its strap, arm relaxed along the body. The bag is exactly the product shown in the reference images, in ivory: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la bandoulière, bras le long du corps (REF : 4 photos)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-ivoire-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Ivoire — Porté 02 » · alt descriptif « Sac ÉLÉA ivoire LELON tenu à la main par la bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-elea-ivoire-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder while walking. The bag is exactly the product shown in the reference images, in ivory: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-ivoire-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Ivoire — Porté 03 » · alt descriptif « Sac ÉLÉA ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### ÉLÉA — Sable

- Variante Shopify `60840299725134` · SKU `CJNS207059904DW` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON ÉLÉA — Sable — Vue 4 » (800×800) — `lelon-elea-sable-0eb9d608c2.jpg`
  - Zip : `01-elea/sable/9_d70a5e2a-d31e-4def-ad98-2f2f14d5667a.jpg`
- COLOR TO PRESERVE : Sable (sand beige), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ÉLÉA ci-dessus.

**IMAGE A PROMPT** → `lelon-elea-sable-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a black knit and chocolate blazer, worn on the shoulder, strap over the shoulder, bag resting under the arm. The bag is exactly the product shown in the reference images, in sand beige: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « À l’épaule »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-sable-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Sable — Porté 01 » · alt descriptif « Sac ÉLÉA sable LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-elea-sable-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a black knit and chocolate blazer, carried in the hand by its strap, arm relaxed along the body. The bag is exactly the product shown in the reference images, in sand beige: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la bandoulière, bras le long du corps (REF : 4 photos)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-sable-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Sable — Porté 02 » · alt descriptif « Sac ÉLÉA sable LELON tenu à la main par la bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-elea-sable-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a black knit and chocolate blazer, worn on the shoulder while walking. The bag is exactly the product shown in the reference images, in sand beige: compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elea-sable-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ÉLÉA — Sable — Porté 03 » · alt descriptif « Sac ÉLÉA sable LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## MIRA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — porté épaule par la bandoulière (REF noir #7) · B — tenu à la main par l’anse froncée (DESC « anse souple », REF) · C — porté en bandoulière croisée (REF ivoire #8, DESC bandoulière réglable ~120 cm)

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- petit sac compact aux côtés arrondis (DESC : 21 × 16 × 6 cm)
- plissé vertical régulier sur toute la face (côtes fines)
- anse supérieure souple froncée (effet ruché)
- segments de chaîne dorée reliant l’anse au corps, mousquetons dorés
- bandoulière amovible réglable, boucle dorée
- étiquette suspendue avec texte fournisseur « FASHION & … » (REF) — voir décision marchand
- métallerie : doré

_Note références_ : Ivoire : anse et bandoulière d’un ton beige/taupe plus soutenu que le corps (REF #2) — conserver ce contraste.

### MIRA — Ivoire

- Variante Shopify `60840303165774` · SKU `CJNS231262802BY` · statut **BLOCKED_BY_MERCHANT** · drapeaux : MERCHANT_DECISION_TAG
- REFERENCE IMAGES :
  - Shopify : « LELON MIRA — Ivoire — Vue 1 » (800×800) — `lelon-mira-ivoire-0b53fff984.jpg`
  - Shopify : « LELON MIRA — Ivoire — Vue 3 » (800×800) — `lelon-mira-ivoire-e3b03749c5.jpg`
  - Zip : `02-mira/ivoire/2_50fae594-d75e-43eb-b3db-610e4c6595f4.jpg`
  - Zip : `02-mira/ivoire/76cb7e14-cd45-4b9c-af59-5d46b0343c7f (1).png`
  - Zip : `02-mira/ivoire/8_e1d95c5c-965f-4a5c-a316-0dcc4206b314.jpg`
- ⚠ `MERCHANT_DECISION_TAG` : Étiquette fournisseur suspendue (texte « FASHION & … ») : livrée ou retirée ? Décide si elle apparaît.
- COLOR TO PRESERVE : Ivoire (ivory), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste MIRA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-mira-ivoire-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder with its long strap. The bag is exactly the product shown in the reference images, in ivory: small compact bag with rounded sides, regular fine vertical pleats over the whole body, soft gathered (ruched) top handle, short gold chain links joining the handle to the body, gold lobster clasps, detachable adjustable crossbody strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule par la bandoulière (REF noir #7)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-mira-ivoire-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON MIRA — Ivoire — Porté 01 » · alt descriptif « Sac MIRA ivoire LELON porté à l’épaule par la bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-mira-ivoire-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a chocolate wool coat over a black knit and straight trousers, held in the hand by the ruched top handle. The bag is exactly the product shown in the reference images, in ivory: small compact bag with rounded sides, regular fine vertical pleats over the whole body, soft gathered (ruched) top handle, short gold chain links joining the handle to the body, gold lobster clasps, detachable adjustable crossbody strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par l’anse froncée (DESC « anse souple », REF)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-mira-ivoire-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON MIRA — Ivoire — Porté 02 » · alt descriptif « Sac MIRA ivoire LELON tenu à la main par l’anse froncée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-mira-ivoire-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a chocolate wool coat over a black knit and straight trousers, worn crossbody with the adjustable strap. The bag is exactly the product shown in the reference images, in ivory: small compact bag with rounded sides, regular fine vertical pleats over the whole body, soft gathered (ruched) top handle, short gold chain links joining the handle to the body, gold lobster clasps, detachable adjustable crossbody strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière croisée (REF ivoire #8, DESC bandoulière réglable ~120 cm)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-mira-ivoire-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON MIRA — Ivoire — Porté 03 » · alt descriptif « Sac MIRA ivoire LELON porté en bandoulière croisée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### MIRA — Taupe

- Variante Shopify `60840303198542` · SKU `CJNS231262803CX` · statut **BLOCKED_BY_MERCHANT** · drapeaux : MERCHANT_DECISION_TAG
- REFERENCE IMAGES :
  - Shopify : « LELON MIRA — Taupe — Vue 6 » (800×800) — `lelon-mira-taupe-71722fa6e0.jpg`
  - Shopify : « LELON MIRA — Taupe — Vue 7 » (800×800) — `lelon-mira-taupe-78fc1c4130.jpg`
  - Zip : `02-mira/taupe/4_b43fb013-607f-44d7-88b6-c865396a93bf.jpg`
  - Zip : `02-mira/taupe/9_2ac4229f-7617-4c42-bc96-f553ba86321c.jpg`
- ⚠ `MERCHANT_DECISION_TAG` : Étiquette fournisseur suspendue (texte « FASHION & … ») : livrée ou retirée ? Décide si elle apparaît.
- COLOR TO PRESERVE : Taupe (taupe), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste MIRA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-mira-taupe-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a white shirt and navy trousers, worn on the shoulder with its long strap. The bag is exactly the product shown in the reference images, in taupe: small compact bag with rounded sides, regular fine vertical pleats over the whole body, soft gathered (ruched) top handle, short gold chain links joining the handle to the body, gold lobster clasps, detachable adjustable crossbody strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule par la bandoulière (REF noir #7)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-mira-taupe-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON MIRA — Taupe — Porté 01 » · alt descriptif « Sac MIRA taupe LELON porté à l’épaule par la bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-mira-taupe-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a white shirt and navy trousers, held in the hand by the ruched top handle. The bag is exactly the product shown in the reference images, in taupe: small compact bag with rounded sides, regular fine vertical pleats over the whole body, soft gathered (ruched) top handle, short gold chain links joining the handle to the body, gold lobster clasps, detachable adjustable crossbody strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par l’anse froncée (DESC « anse souple », REF)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-mira-taupe-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON MIRA — Taupe — Porté 02 » · alt descriptif « Sac MIRA taupe LELON tenu à la main par l’anse froncée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-mira-taupe-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a white shirt and navy trousers, worn crossbody with the adjustable strap. The bag is exactly the product shown in the reference images, in taupe: small compact bag with rounded sides, regular fine vertical pleats over the whole body, soft gathered (ruched) top handle, short gold chain links joining the handle to the body, gold lobster clasps, detachable adjustable crossbody strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière croisée (REF ivoire #8, DESC bandoulière réglable ~120 cm)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-mira-taupe-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON MIRA — Taupe — Porté 03 » · alt descriptif « Sac MIRA taupe LELON porté en bandoulière croisée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### MIRA — Noir

- Variante Shopify `60826645561678` · SKU `CJNS231262801AZ` · statut **BLOCKED_BY_MERCHANT** · drapeaux : MERCHANT_DECISION_TAG
- REFERENCE IMAGES :
  - Shopify : « LELON MIRA — Noir — Vue 4 » (800×800) — `lelon-mira-noir-16853c5fa5.jpg`
  - Shopify : « LELON MIRA — Noir — Vue 5 » (800×800) — `lelon-mira-noir-a1529f8727.jpg`
  - Zip : `02-mira/noir/5_ae60f6e6-e0f8-484d-afa6-003d1affb61c.jpg`
  - Zip : `02-mira/noir/7_523a7a5b-d846-48ea-bd8b-c0cbdc9d9a22.jpg`
- ⚠ `MERCHANT_DECISION_TAG` : Étiquette fournisseur suspendue (texte « FASHION & … ») : livrée ou retirée ? Décide si elle apparaît.
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste MIRA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-mira-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder with its long strap. The bag is exactly the product shown in the reference images, in black: small compact bag with rounded sides, regular fine vertical pleats over the whole body, soft gathered (ruched) top handle, short gold chain links joining the handle to the body, gold lobster clasps, detachable adjustable crossbody strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule par la bandoulière (REF noir #7)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-mira-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON MIRA — Noir — Porté 01 » · alt descriptif « Sac MIRA noir LELON porté à l’épaule par la bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-mira-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a beige trench coat, white shirt and light jeans, held in the hand by the ruched top handle. The bag is exactly the product shown in the reference images, in black: small compact bag with rounded sides, regular fine vertical pleats over the whole body, soft gathered (ruched) top handle, short gold chain links joining the handle to the body, gold lobster clasps, detachable adjustable crossbody strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par l’anse froncée (DESC « anse souple », REF)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-mira-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON MIRA — Noir — Porté 02 » · alt descriptif « Sac MIRA noir LELON tenu à la main par l’anse froncée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-mira-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, worn crossbody with the adjustable strap. The bag is exactly the product shown in the reference images, in black: small compact bag with rounded sides, regular fine vertical pleats over the whole body, soft gathered (ruched) top handle, short gold chain links joining the handle to the body, gold lobster clasps, detachable adjustable crossbody strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière croisée (REF ivoire #8, DESC bandoulière réglable ~120 cm)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-mira-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON MIRA — Noir — Porté 03 » · alt descriptif « Sac MIRA noir LELON porté en bandoulière croisée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## NOVA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — tenu à la main par les deux anses (REF chocolat #5) · B — au creux du bras — UNIQUEMENT si la hauteur d’anse réelle le permet (à confirmer), sinon 2e prise main · C — tenu à la main, scène quotidienne (ville / campus)

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- grand tote horizontal évasé, haut souple légèrement affaissé (DESC : 38 × 25 × 16 cm)
- deux anses tubulaires arrondies, même coloris
- fine ceinture horizontale sur le haut de la face, passants, boucle rectangulaire argentée
- toucher visuel velouté « effet suède » (DESC) — pas de reflet cuir lisse
- métallerie : argenté

_Note références_ : Bordeaux, Camel, Noir : un seul packshot fond blanc chacun ; Chocolat : 3 photos en situation.

### NOVA — Chocolat

- Variante Shopify `60840303395150` · SKU `CJNS215226101AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON NOVA — Chocolat — Vue 3 » (800×800) — `lelon-nova-chocolat-98c4ec42cb.jpg`
  - Shopify : « LELON NOVA — Chocolat — Vue 4 » (800×800) — `lelon-nova-chocolat-1ee98f0ecf.jpg`
  - Shopify : « LELON NOVA — Chocolat — Vue 5 » (800×800) — `lelon-nova-chocolat-7fe55cefc0.jpg`
  - Shopify : « LELON NOVA Chocolat porté par une mannequin » (1122×1402) — `lelon-nova-chocolat-02-mannequin.png` — ⚠ visuel porté d’origine inconnue, non contrôlé : ne pas l’utiliser comme référence de fidélité
  - Zip : `03-nova/chocolat/4_84c26389-f4ec-4cf3-b824-fd6a53f3a95c.jpg`
  - Zip : `03-nova/chocolat/5_989c88e9-ead8-4c35-8459-979fa5752702.jpg`
  - Zip : `03-nova/chocolat/8_7fb2a113-8bf0-437e-87c8-10480508836e.jpg`
- COLOR TO PRESERVE : Chocolat (chocolate brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste NOVA ci-dessus.

**IMAGE A PROMPT** → `lelon-nova-chocolat-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a cream knit, white shirt and light jeans, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in chocolate brown: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (REF chocolat #5)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-chocolat-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Chocolat — Porté 01 » · alt descriptif « Sac NOVA chocolat LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-nova-chocolat-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a cream knit, white shirt and light jeans, carried in the crook of the arm (only if the real handle drop allows it). The bag is exactly the product shown in the reference images, in chocolate brown: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : au creux du bras — UNIQUEMENT si la hauteur d’anse réelle le permet (à confirmer), sinon 2e prise main
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-chocolat-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Chocolat — Porté 02 » · alt descriptif « Sac NOVA chocolat LELON au creux du bras »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-nova-chocolat-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a cream knit, white shirt and light jeans, carried in the hand while walking. The bag is exactly the product shown in the reference images, in chocolate brown: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main, scène quotidienne (ville / campus)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-chocolat-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Chocolat — Porté 03 » · alt descriptif « Sac NOVA chocolat LELON tenu à la main »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### NOVA — Bordeaux

- Variante Shopify `60840303427918` · SKU `CJNS215226102BY` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON NOVA — Bordeaux — Vue 1 » (800×800) — `lelon-nova-bordeaux-57884a1f47.jpg`
  - Zip : `03-nova/bordeaux/10_326b2074-6fe5-4793-93c8-fab7badfe599.jpg`
- COLOR TO PRESERVE : Bordeaux (burgundy), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste NOVA ci-dessus.

**IMAGE A PROMPT** → `lelon-nova-bordeaux-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a heather grey knit and light jeans, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in burgundy: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (REF chocolat #5)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-bordeaux-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Bordeaux — Porté 01 » · alt descriptif « Sac NOVA bordeaux LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-nova-bordeaux-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a heather grey knit and light jeans, carried in the crook of the arm (only if the real handle drop allows it). The bag is exactly the product shown in the reference images, in burgundy: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : au creux du bras — UNIQUEMENT si la hauteur d’anse réelle le permet (à confirmer), sinon 2e prise main
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-bordeaux-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Bordeaux — Porté 02 » · alt descriptif « Sac NOVA bordeaux LELON au creux du bras »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-nova-bordeaux-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a heather grey knit and light jeans, carried in the hand while walking. The bag is exactly the product shown in the reference images, in burgundy: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main, scène quotidienne (ville / campus)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-bordeaux-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Bordeaux — Porté 03 » · alt descriptif « Sac NOVA bordeaux LELON tenu à la main »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### NOVA — Noir

- Variante Shopify `60832981844302` · SKU `CJNS215226105EV` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON NOVA — Noir — Vue 6 » (800×800) — `lelon-nova-noir-4111773083.jpg`
  - Zip : `03-nova/noir/13_6f73dea4-6036-4359-bf89-d154bcd25a6b.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste NOVA ci-dessus.

**IMAGE A PROMPT** → `lelon-nova-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a beige trench coat, white shirt and light jeans, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in black: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (REF chocolat #5)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Noir — Porté 01 » · alt descriptif « Sac NOVA noir LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-nova-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, carried in the crook of the arm (only if the real handle drop allows it). The bag is exactly the product shown in the reference images, in black: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : au creux du bras — UNIQUEMENT si la hauteur d’anse réelle le permet (à confirmer), sinon 2e prise main
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Noir — Porté 02 » · alt descriptif « Sac NOVA noir LELON au creux du bras »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-nova-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a beige trench coat, white shirt and light jeans, carried in the hand while walking. The bag is exactly the product shown in the reference images, in black: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main, scène quotidienne (ville / campus)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Noir — Porté 03 » · alt descriptif « Sac NOVA noir LELON tenu à la main »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### NOVA — Camel

- Variante Shopify `60897863074126` · SKU `CJNS215226103CX` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON NOVA — Camel — Vue 2 » (800×800) — `lelon-nova-camel-3e1b45e568.jpg`
  - Zip : `03-nova/camel/11_3b828eae-7f8e-4286-8afe-4d26f6da2504.jpg`
- COLOR TO PRESERVE : Camel (camel), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste NOVA ci-dessus.

**IMAGE A PROMPT** → `lelon-nova-camel-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing an ecru knit and raw denim, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in camel: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (REF chocolat #5)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-camel-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Camel — Porté 01 » · alt descriptif « Sac NOVA camel LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-nova-camel-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing an ecru knit and raw denim, carried in the crook of the arm (only if the real handle drop allows it). The bag is exactly the product shown in the reference images, in camel: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : au creux du bras — UNIQUEMENT si la hauteur d’anse réelle le permet (à confirmer), sinon 2e prise main
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-camel-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Camel — Porté 02 » · alt descriptif « Sac NOVA camel LELON au creux du bras »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-nova-camel-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing an ecru knit and raw denim, carried in the hand while walking. The bag is exactly the product shown in the reference images, in camel: large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main, scène quotidienne (ville / campus)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-nova-camel-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOVA — Camel — Porté 03 » · alt descriptif « Sac NOVA camel LELON tenu à la main »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## SOLÉA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — tenu à la main par l’anse courte (DESC « À la main ») · B — porté épaule avec la bandoulière amovible (DESC) · C — lifestyle estival, porté main ou épaule

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- forme demi-lune / dôme souple, base plus large que le haut
- extérieur tressé aspect paille, trame régulière (DESC « Tressage / aspect paille »)
- anse courte : deux manchons rembourrés du coloris de finition (cognac ou noir) réunis au centre par une pièce dorée
- fermeture éclair principale dorée (DESC « Zip principal »)
- base renforcée du coloris de finition (DESC)
- bandoulière amovible réglable, boucle dorée (DESC « Amovible »)
- métallerie : doré

_Note références_ : Packshots propres + vues face/côté/dos/dessous sur l’infographie (texte anglais : ne jamais recopier le texte).

### SOLÉA — Beige & Cognac

- Variante Shopify `60832982827342` · SKU `CJNS238553101AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON SOLÉA — Beige & Cognac — Vue 1 » (800×799) — `lelon-solea-beige-cognac-6113440d2b.jpg`
  - Shopify : « LELON SOLÉA Beige et Cognac porté par une mannequin » (1122×1402) — `lelon-solea-beige-cognac-02-mannequin.png` — ⚠ visuel porté d’origine inconnue, non contrôlé : ne pas l’utiliser comme référence de fidélité
  - Zip : `04-solea/beige-cognac/2_7d01eb0b-7e1c-4d20-b157-3e8339fd6362.jpg`
  - Zip : `04-solea/beige-cognac/3_47f3c460-891e-4416-bea1-079b66f7830a.jpg`
  - Zip : `04-solea/beige-cognac/5_31453354-d1a7-4073-85d8-5892085bed5d.jpg`
- COLOR TO PRESERVE : Beige & Cognac (natural beige straw with cognac trims), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste SOLÉA ci-dessus.

**IMAGE A PROMPT** → `lelon-solea-beige-cognac-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a black knit and raw denim, carried in the hand by the short top handle. The bag is exactly the product shown in the reference images, in natural beige straw with cognac trims: soft half-moon dome-shaped bag, woven straw-look exterior with an even weave, short top handle made of two padded sleeves in the trim color joined by a gold piece in the center, gold zipper along the top, reinforced base in the trim color, detachable adjustable strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par l’anse courte (DESC « À la main »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-solea-beige-cognac-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON SOLÉA — Beige & Cognac — Porté 01 » · alt descriptif « Sac SOLÉA beige & cognac LELON tenu à la main par l’anse courte »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-solea-beige-cognac-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a black knit and raw denim, worn on the shoulder with the detachable strap. The bag is exactly the product shown in the reference images, in natural beige straw with cognac trims: soft half-moon dome-shaped bag, woven straw-look exterior with an even weave, short top handle made of two padded sleeves in the trim color joined by a gold piece in the center, gold zipper along the top, reinforced base in the trim color, detachable adjustable strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule avec la bandoulière amovible (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-solea-beige-cognac-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON SOLÉA — Beige & Cognac — Porté 02 » · alt descriptif « Sac SOLÉA beige & cognac LELON porté à l’épaule avec la bandoulière amovible »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-solea-beige-cognac-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a black knit and raw denim, carried in the hand or on the shoulder, summer day. The bag is exactly the product shown in the reference images, in natural beige straw with cognac trims: soft half-moon dome-shaped bag, woven straw-look exterior with an even weave, short top handle made of two padded sleeves in the trim color joined by a gold piece in the center, gold zipper along the top, reinforced base in the trim color, detachable adjustable strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : lifestyle estival, porté main ou épaule
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-solea-beige-cognac-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON SOLÉA — Beige & Cognac — Porté 03 » · alt descriptif « Sac SOLÉA beige & cognac LELON lifestyle estival »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### SOLÉA — Beige & Noir

- Variante Shopify `60840303657294` · SKU `CJNS238553102BY` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON SOLÉA — Beige & Noir — Vue 4 » (800×800) — `lelon-solea-beige-noir-e00693eecf.jpg`
  - Zip : `04-solea/beige-noir/8_29bc56e0-9452-47f3-a510-374880685d58.jpg`
- COLOR TO PRESERVE : Beige & Noir (natural beige straw with black trims), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste SOLÉA ci-dessus.

**IMAGE A PROMPT** → `lelon-solea-beige-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a black knit and raw denim, carried in the hand by the short top handle. The bag is exactly the product shown in the reference images, in natural beige straw with black trims: soft half-moon dome-shaped bag, woven straw-look exterior with an even weave, short top handle made of two padded sleeves in the trim color joined by a gold piece in the center, gold zipper along the top, reinforced base in the trim color, detachable adjustable strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par l’anse courte (DESC « À la main »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-solea-beige-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON SOLÉA — Beige & Noir — Porté 01 » · alt descriptif « Sac SOLÉA beige & noir LELON tenu à la main par l’anse courte »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-solea-beige-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a black knit and raw denim, worn on the shoulder with the detachable strap. The bag is exactly the product shown in the reference images, in natural beige straw with black trims: soft half-moon dome-shaped bag, woven straw-look exterior with an even weave, short top handle made of two padded sleeves in the trim color joined by a gold piece in the center, gold zipper along the top, reinforced base in the trim color, detachable adjustable strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule avec la bandoulière amovible (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-solea-beige-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON SOLÉA — Beige & Noir — Porté 02 » · alt descriptif « Sac SOLÉA beige & noir LELON porté à l’épaule avec la bandoulière amovible »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-solea-beige-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a black knit and raw denim, carried in the hand or on the shoulder, summer day. The bag is exactly the product shown in the reference images, in natural beige straw with black trims: soft half-moon dome-shaped bag, woven straw-look exterior with an even weave, short top handle made of two padded sleeves in the trim color joined by a gold piece in the center, gold zipper along the top, reinforced base in the trim color, detachable adjustable strap with gold buckle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : lifestyle estival, porté main ou épaule
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-solea-beige-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON SOLÉA — Beige & Noir — Porté 03 » · alt descriptif « Sac SOLÉA beige & noir LELON lifestyle estival »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## LYRA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — tenu à la main par la poignée supérieure (DESC « poignée supérieure ») · B — porté en bandoulière (DESC « À l’épaule ou en bandoulière selon la configuration ») · C — porté épaule, scène quotidienne

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- sac structuré à rabat, format compact (DESC : environ 24 × 17,5 × 10,5 cm)
- fermoir carré rembourré au centre du rabat (DESC)
- poignée supérieure unique
- anneaux dorés sur les côtés pour la bandoulière
- foulard noué sur la poignée et sangle texte « CLASSIC » visibles sur les références : fournis ou non ? (décision marchand)
- métallerie : doré

_Note références_ : Références = infographies fournisseur (texte, pictos) : ne jamais reproduire le texte ni les pictos.

### LYRA — Chocolat

- Variante Shopify `60840317714766` · SKU `CJNS197422902BY` · statut **BLOCKED_BY_MERCHANT** · drapeaux : MERCHANT_DECISION_ACCESSORIES
- REFERENCE IMAGES :
  - Shopify : « LELON LYRA — Chocolat — Vue 2 » (1000×1000) — `lelon-lyra-chocolat-0e0b7c105c.jpg`
  - Zip : `05-lyra/chocolat/3_0889352d-c26d-4c36-9a28-fb71b4fb0ab6_trans.jpeg`
  - Zip : `05-lyra/chocolat/4_3af0e4c0-b43c-434f-ba1d-5397b6f6910a_trans.jpeg`
- ⚠ `MERCHANT_DECISION_ACCESSORIES` : Foulard et sangle « CLASSIC » visibles sur les références : fournis ou non ? Décide s’ils apparaissent.
- COLOR TO PRESERVE : Chocolat (chocolate brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste LYRA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-lyra-chocolat-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a cream knit, white shirt and light jeans, carried in the hand by the top handle. The bag is exactly the product shown in the reference images, in chocolate brown: compact structured flap bag, padded square clasp tab in the center of the flap, single top handle, small gold rings on the sides for the strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la poignée supérieure (DESC « poignée supérieure »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-lyra-chocolat-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LYRA — Chocolat — Porté 01 » · alt descriptif « Sac LYRA chocolat LELON tenu à la main par la poignée supérieure »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-lyra-chocolat-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a cream knit, white shirt and light jeans, worn crossbody with the strap. The bag is exactly the product shown in the reference images, in chocolate brown: compact structured flap bag, padded square clasp tab in the center of the flap, single top handle, small gold rings on the sides for the strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « À l’épaule ou en bandoulière selon la configuration »)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-lyra-chocolat-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LYRA — Chocolat — Porté 02 » · alt descriptif « Sac LYRA chocolat LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-lyra-chocolat-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a cream knit, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in chocolate brown: compact structured flap bag, padded square clasp tab in the center of the flap, single top handle, small gold rings on the sides for the strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-lyra-chocolat-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LYRA — Chocolat — Porté 03 » · alt descriptif « Sac LYRA chocolat LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### LYRA — Ivoire

- Variante Shopify `60832983286094` · SKU `CJNS197422903CX` · statut **BLOCKED_BY_MERCHANT** · drapeaux : MERCHANT_DECISION_ACCESSORIES
- REFERENCE IMAGES :
  - Shopify : « LELON LYRA — Ivoire — Vue 3 » (800×800) — `lelon-lyra-ivoire-d1df175849.jpg`
  - Zip : `05-lyra/ivoire/1_be46054f-fb56-4aa8-b883-80bf1c36c2e3.jpg`
- ⚠ `MERCHANT_DECISION_ACCESSORIES` : Foulard et sangle « CLASSIC » visibles sur les références : fournis ou non ? Décide s’ils apparaissent.
- COLOR TO PRESERVE : Ivoire (ivory), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste LYRA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-lyra-ivoire-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a chocolate wool coat over a black knit and straight trousers, carried in the hand by the top handle. The bag is exactly the product shown in the reference images, in ivory: compact structured flap bag, padded square clasp tab in the center of the flap, single top handle, small gold rings on the sides for the strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la poignée supérieure (DESC « poignée supérieure »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-lyra-ivoire-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LYRA — Ivoire — Porté 01 » · alt descriptif « Sac LYRA ivoire LELON tenu à la main par la poignée supérieure »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-lyra-ivoire-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a chocolate wool coat over a black knit and straight trousers, worn crossbody with the strap. The bag is exactly the product shown in the reference images, in ivory: compact structured flap bag, padded square clasp tab in the center of the flap, single top handle, small gold rings on the sides for the strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « À l’épaule ou en bandoulière selon la configuration »)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-lyra-ivoire-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LYRA — Ivoire — Porté 02 » · alt descriptif « Sac LYRA ivoire LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-lyra-ivoire-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in ivory: compact structured flap bag, padded square clasp tab in the center of the flap, single top handle, small gold rings on the sides for the strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-lyra-ivoire-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LYRA — Ivoire — Porté 03 » · alt descriptif « Sac LYRA ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### LYRA — Noir

- Variante Shopify `60840317747534` · SKU `CJNS197422901AZ` · statut **BLOCKED_BY_MERCHANT** · drapeaux : MERCHANT_DECISION_ACCESSORIES
- REFERENCE IMAGES :
  - Shopify : « LELON LYRA — Noir — Vue 4 » (800×800) — `lelon-lyra-noir-dbf15d2a53.jpg`
  - Zip : `05-lyra/noir/5_f058e5f2-3d14-4fa1-931f-48d35ca5ebd6_trans.jpeg`
- ⚠ `MERCHANT_DECISION_ACCESSORIES` : Foulard et sangle « CLASSIC » visibles sur les références : fournis ou non ? Décide s’ils apparaissent.
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste LYRA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-lyra-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a beige trench coat, white shirt and light jeans, carried in the hand by the top handle. The bag is exactly the product shown in the reference images, in black: compact structured flap bag, padded square clasp tab in the center of the flap, single top handle, small gold rings on the sides for the strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la poignée supérieure (DESC « poignée supérieure »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-lyra-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LYRA — Noir — Porté 01 » · alt descriptif « Sac LYRA noir LELON tenu à la main par la poignée supérieure »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-lyra-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a beige trench coat, white shirt and light jeans, worn crossbody with the strap. The bag is exactly the product shown in the reference images, in black: compact structured flap bag, padded square clasp tab in the center of the flap, single top handle, small gold rings on the sides for the strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « À l’épaule ou en bandoulière selon la configuration »)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-lyra-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LYRA — Noir — Porté 02 » · alt descriptif « Sac LYRA noir LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-lyra-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: compact structured flap bag, padded square clasp tab in the center of the flap, single top handle, small gold rings on the sides for the strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-lyra-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LYRA — Noir — Porté 03 » · alt descriptif « Sac LYRA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## LUNA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — tenu à la main par la poignée supérieure (REF) · B — porté en bandoulière (DESC « bandoulière réglable ~112 cm ») · C — porté épaule, scène quotidienne

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- petit sac seau arrondi compact (DESC : 14 × 16 × 14 cm)
- corps au toucher visuel velouté (DESC « Effet suède / finition douce »)
- bande de base et bordure supérieure contrastées (chocolat, ou noir sur la version Noir)
- petit rabat / patte supérieure, poignée supérieure, attaches dorées
- longue bandoulière fine réglable
- métallerie : doré

_Note références_ : ⚠ Inversion probable : photos « Vue 4/5 » (alt Crème & Chocolat) montrent un corps taupe ; « Vue 1/2 » (alt Taupe & Chocolat) un corps crème.

### LUNA — Crème & Chocolat

- Variante Shopify `60832988037454` · SKU `CJNS105155204DW` · statut **BLOCKED_BY_MERCHANT** · drapeaux : VARIANT_MAPPING_TO_CONFIRM
- REFERENCE IMAGES :
  - Shopify : « LELON LUNA — Crème & Chocolat — Vue 4 » (800×800) — `lelon-luna-taupe-chocolat-dc7aae5b89.jpg`
  - Shopify : « LELON LUNA — Crème & Chocolat — Vue 5 » (800×800) — `lelon-luna-taupe-chocolat-c524e54e4d.jpg`
  - Zip : `06-luna/creme-chocolat/4_1616462088085.jpg`
  - Zip : `06-luna/creme-chocolat/5_1616462088083.jpg`
- ⚠ `VARIANT_MAPPING_TO_CONFIRM` : Photos probablement inversées entre Crème & Chocolat et Taupe & Chocolat : confirmer avant génération.
- COLOR TO PRESERVE : Crème & Chocolat (cream body with chocolate trims), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste LUNA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-luna-creme-chocolat-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a black knit and navy blazer, carried in the hand by the top handle. The bag is exactly the product shown in the reference images, in cream body with chocolate trims: small compact rounded bucket bag, velvety suede-effect body, contrasting trim band at the base and around the top, small top tab, top handle, gold hardware, long thin adjustable strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la poignée supérieure (REF)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-luna-creme-chocolat-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LUNA — Crème & Chocolat — Porté 01 » · alt descriptif « Sac LUNA crème & chocolat LELON tenu à la main par la poignée supérieure »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-luna-creme-chocolat-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a black knit and navy blazer, worn crossbody with the long strap. The bag is exactly the product shown in the reference images, in cream body with chocolate trims: small compact rounded bucket bag, velvety suede-effect body, contrasting trim band at the base and around the top, small top tab, top handle, gold hardware, long thin adjustable strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « bandoulière réglable ~112 cm »)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-luna-creme-chocolat-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LUNA — Crème & Chocolat — Porté 02 » · alt descriptif « Sac LUNA crème & chocolat LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-luna-creme-chocolat-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a black knit and navy blazer, worn on the shoulder. The bag is exactly the product shown in the reference images, in cream body with chocolate trims: small compact rounded bucket bag, velvety suede-effect body, contrasting trim band at the base and around the top, small top tab, top handle, gold hardware, long thin adjustable strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-luna-creme-chocolat-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LUNA — Crème & Chocolat — Porté 03 » · alt descriptif « Sac LUNA crème & chocolat LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### LUNA — Taupe & Chocolat

- Variante Shopify `60840322171214` · SKU `CJNS105155201AZ` · statut **BLOCKED_BY_MERCHANT** · drapeaux : VARIANT_MAPPING_TO_CONFIRM
- REFERENCE IMAGES :
  - Shopify : « LELON LUNA — Taupe & Chocolat — Vue 1 » (800×800) — `lelon-luna-creme-chocolat-45a1e760a4.jpg`
  - Shopify : « LELON LUNA — Taupe & Chocolat — Vue 2 » (800×800) — `lelon-luna-creme-chocolat-72d6f9647a.jpg`
  - Zip : `06-luna/taupe-chocolat/1_1616462088077.jpg`
  - Zip : `06-luna/taupe-chocolat/2_1616462088078.jpg`
- ⚠ `VARIANT_MAPPING_TO_CONFIRM` : Photos probablement inversées entre Crème & Chocolat et Taupe & Chocolat : confirmer avant génération.
- COLOR TO PRESERVE : Taupe & Chocolat (taupe body with chocolate trims), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste LUNA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-luna-taupe-chocolat-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a white shirt and navy trousers, carried in the hand by the top handle. The bag is exactly the product shown in the reference images, in taupe body with chocolate trims: small compact rounded bucket bag, velvety suede-effect body, contrasting trim band at the base and around the top, small top tab, top handle, gold hardware, long thin adjustable strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la poignée supérieure (REF)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-luna-taupe-chocolat-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LUNA — Taupe & Chocolat — Porté 01 » · alt descriptif « Sac LUNA taupe & chocolat LELON tenu à la main par la poignée supérieure »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-luna-taupe-chocolat-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a white shirt and navy trousers, worn crossbody with the long strap. The bag is exactly the product shown in the reference images, in taupe body with chocolate trims: small compact rounded bucket bag, velvety suede-effect body, contrasting trim band at the base and around the top, small top tab, top handle, gold hardware, long thin adjustable strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « bandoulière réglable ~112 cm »)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-luna-taupe-chocolat-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LUNA — Taupe & Chocolat — Porté 02 » · alt descriptif « Sac LUNA taupe & chocolat LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-luna-taupe-chocolat-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a white shirt and navy trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in taupe body with chocolate trims: small compact rounded bucket bag, velvety suede-effect body, contrasting trim band at the base and around the top, small top tab, top handle, gold hardware, long thin adjustable strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-luna-taupe-chocolat-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LUNA — Taupe & Chocolat — Porté 03 » · alt descriptif « Sac LUNA taupe & chocolat LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### LUNA — Noir

- Variante Shopify `60840322236750` · SKU `CJNS105155203CX` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON LUNA — Noir — Vue 3 » (800×800) — `lelon-luna-noir-e5d83f7364.jpg`
  - Zip : `06-luna/noir/6_1616462088147.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste LUNA ci-dessus.

**IMAGE A PROMPT** → `lelon-luna-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a beige trench coat, white shirt and light jeans, carried in the hand by the top handle. The bag is exactly the product shown in the reference images, in black: small compact rounded bucket bag, velvety suede-effect body, contrasting trim band at the base and around the top, small top tab, top handle, gold hardware, long thin adjustable strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la poignée supérieure (REF)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-luna-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LUNA — Noir — Porté 01 » · alt descriptif « Sac LUNA noir LELON tenu à la main par la poignée supérieure »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-luna-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a beige trench coat, white shirt and light jeans, worn crossbody with the long strap. The bag is exactly the product shown in the reference images, in black: small compact rounded bucket bag, velvety suede-effect body, contrasting trim band at the base and around the top, small top tab, top handle, gold hardware, long thin adjustable strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « bandoulière réglable ~112 cm »)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-luna-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LUNA — Noir — Porté 02 » · alt descriptif « Sac LUNA noir LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-luna-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: small compact rounded bucket bag, velvety suede-effect body, contrasting trim band at the base and around the top, small top tab, top handle, gold hardware, long thin adjustable strap. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-luna-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LUNA — Noir — Porté 03 » · alt descriptif « Sac LUNA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## ALYA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — porté épaule (DESC) · B — porté en bandoulière (DESC « ou en bandoulière ») · C — tenu à la main par la sangle, scène intérieure (REF cognac #8)

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- forme allongée, cylindrique, souple (DESC)
- grain visible (aspect grainé, REF)
- large sangle plate du même coloris, rivets / boutons dorés aux attaches
- petits boutons dorés sur les extrémités
- métallerie : doré

_Note références_ : Exclure noir #6 des références (filigrane fournisseur « …om-design »).

### ALYA — Cognac

- Variante Shopify `60840326594894` · SKU `CJNS230746503CX` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON ALYA — Cognac — Vue 1 » (750×750) — `lelon-alya-cognac-8a43419db9.jpg`
  - Shopify : « LELON ALYA — Cognac — Vue 2 » (750×750) — `lelon-alya-cognac-d0e68c7cdb.jpg`
  - Shopify : « LELON ALYA — Cognac — Vue 3 » (750×750) — `lelon-alya-cognac-515b4b21eb.jpg`
  - Zip : `07-alya/cognac/1_a77d88fa-295e-49f9-aa5f-b33f0a2e1255.jpg`
  - Zip : `07-alya/cognac/4_609e232a-3d1b-4687-920d-16cfaa6ca0a0.jpg`
  - Zip : `07-alya/cognac/8_5e83288a-4a91-4ff5-a214-e2f89e0fa19b.jpg`
- COLOR TO PRESERVE : Cognac (cognac brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ALYA ci-dessus.

**IMAGE A PROMPT** → `lelon-alya-cognac-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a white shirt, cream knit and raw denim, worn on the shoulder. The bag is exactly the product shown in the reference images, in cognac brown: elongated soft cylindrical bag with visible grain, wide flat strap in the same color with gold rivets at the attachments, small gold studs on the ends. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-alya-cognac-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ALYA — Cognac — Porté 01 » · alt descriptif « Sac ALYA cognac LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-alya-cognac-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a white shirt, cream knit and raw denim, worn crossbody. The bag is exactly the product shown in the reference images, in cognac brown: elongated soft cylindrical bag with visible grain, wide flat strap in the same color with gold rivets at the attachments, small gold studs on the ends. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « ou en bandoulière »)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-alya-cognac-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ALYA — Cognac — Porté 02 » · alt descriptif « Sac ALYA cognac LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-alya-cognac-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a white shirt, cream knit and raw denim, carried in the hand by the strap, indoors. The bag is exactly the product shown in the reference images, in cognac brown: elongated soft cylindrical bag with visible grain, wide flat strap in the same color with gold rivets at the attachments, small gold studs on the ends. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la sangle, scène intérieure (REF cognac #8)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-alya-cognac-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ALYA — Cognac — Porté 03 » · alt descriptif « Sac ALYA cognac LELON tenu à la main par la sangle »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### ALYA — Ivoire

- Variante Shopify `60832988102990` · SKU `CJNS230746502BY` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON ALYA — Ivoire — Vue 4 » (750×750) — `lelon-alya-ivoire-fc974b675a.jpg`
  - Zip : `07-alya/ivoire/3_5728ac2e-d95f-4575-b8d6-a1ef693374c9.jpg`
  - Zip : `07-alya/ivoire/7_9d2747f9-9d98-43cd-b969-4975a124de7d.jpg`
- COLOR TO PRESERVE : Ivoire (ivory), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ALYA ci-dessus.

**IMAGE A PROMPT** → `lelon-alya-ivoire-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in ivory: elongated soft cylindrical bag with visible grain, wide flat strap in the same color with gold rivets at the attachments, small gold studs on the ends. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-alya-ivoire-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ALYA — Ivoire — Porté 01 » · alt descriptif « Sac ALYA ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-alya-ivoire-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a chocolate wool coat over a black knit and straight trousers, worn crossbody. The bag is exactly the product shown in the reference images, in ivory: elongated soft cylindrical bag with visible grain, wide flat strap in the same color with gold rivets at the attachments, small gold studs on the ends. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « ou en bandoulière »)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-alya-ivoire-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ALYA — Ivoire — Porté 02 » · alt descriptif « Sac ALYA ivoire LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-alya-ivoire-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a chocolate wool coat over a black knit and straight trousers, carried in the hand by the strap, indoors. The bag is exactly the product shown in the reference images, in ivory: elongated soft cylindrical bag with visible grain, wide flat strap in the same color with gold rivets at the attachments, small gold studs on the ends. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la sangle, scène intérieure (REF cognac #8)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-alya-ivoire-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ALYA — Ivoire — Porté 03 » · alt descriptif « Sac ALYA ivoire LELON tenu à la main par la sangle »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### ALYA — Noir

- Variante Shopify `60840326627662` · SKU `CJNS230746501AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON ALYA — Noir — Vue 6 » (750×750) — `lelon-alya-noir-206a11ae4f.jpg`
  - Shopify : « LELON ALYA — Noir — Vue 7 » (750×750) — `lelon-alya-noir-0b843b75de.jpg`
  - Zip : `07-alya/noir/2_f159c8bf-a557-4ab6-b8ff-53585d6043a0.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ALYA ci-dessus.

**IMAGE A PROMPT** → `lelon-alya-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: elongated soft cylindrical bag with visible grain, wide flat strap in the same color with gold rivets at the attachments, small gold studs on the ends. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-alya-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ALYA — Noir — Porté 01 » · alt descriptif « Sac ALYA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-alya-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a beige trench coat, white shirt and light jeans, worn crossbody. The bag is exactly the product shown in the reference images, in black: elongated soft cylindrical bag with visible grain, wide flat strap in the same color with gold rivets at the attachments, small gold studs on the ends. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « ou en bandoulière »)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-alya-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ALYA — Noir — Porté 02 » · alt descriptif « Sac ALYA noir LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-alya-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a beige trench coat, white shirt and light jeans, carried in the hand by the strap, indoors. The bag is exactly the product shown in the reference images, in black: elongated soft cylindrical bag with visible grain, wide flat strap in the same color with gold rivets at the attachments, small gold studs on the ends. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la sangle, scène intérieure (REF cognac #8)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-alya-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ALYA — Noir — Porté 03 » · alt descriptif « Sac ALYA noir LELON tenu à la main par la sangle »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## LILA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — tenu à la main par la petite poignée (DESC « À la main ») · B — porté en bandoulière (DESC, REF vert #3) · C — lifestyle, porté bandoulière

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- micro-sac carré (DESC : 11 × 11 × 7 cm) — rester très petit à l’échelle de la main
- petit rabat arrondi
- petite poignée supérieure
- bandoulière fine amovible, mousquetons dorés
- métallerie : doré

_Note références_ : Vert : 3 références ; autres coloris : 1 photo en situation chacun.

### LILA — Chocolat

- Variante Shopify `60840332722510` · SKU `CJNS215116901AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON LILA — Chocolat — Vue 1 » (800×800) — `lelon-lila-chocolat-5933156969.jpg`
  - Zip : `08-lila/chocolat/6_607a0b5f-25c9-4b39-ba2d-02a20a0877a6.jpg`
- COLOR TO PRESERVE : Chocolat (chocolate brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste LILA ci-dessus.

**IMAGE A PROMPT** → `lelon-lila-chocolat-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a cream knit, white shirt and light jeans, held in the hand by the small top handle. The bag is exactly the product shown in the reference images, in chocolate brown: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la petite poignée (DESC « À la main »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-chocolat-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Chocolat — Porté 01 » · alt descriptif « Sac LILA chocolat LELON tenu à la main par la petite poignée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-lila-chocolat-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a cream knit, white shirt and light jeans, worn crossbody with the thin strap. The bag is exactly the product shown in the reference images, in chocolate brown: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC, REF vert #3)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-chocolat-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Chocolat — Porté 02 » · alt descriptif « Sac LILA chocolat LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-lila-chocolat-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a cream knit, white shirt and light jeans, worn crossbody. The bag is exactly the product shown in the reference images, in chocolate brown: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : lifestyle, porté bandoulière
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-chocolat-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Chocolat — Porté 03 » · alt descriptif « Sac LILA chocolat LELON lifestyle »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### LILA — Ivoire

- Variante Shopify `60840332788046` · SKU `CJNS215116904DW` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON LILA — Ivoire — Vue 2 » (800×800) — `lelon-lila-ivoire-b0ba2c705d.jpg`
  - Zip : `08-lila/ivoire/9_1732680e-0e51-4850-b9e5-7d581095c012.jpg`
- COLOR TO PRESERVE : Ivoire (ivory), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste LILA ci-dessus.

**IMAGE A PROMPT** → `lelon-lila-ivoire-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a chocolate wool coat over a black knit and straight trousers, held in the hand by the small top handle. The bag is exactly the product shown in the reference images, in ivory: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la petite poignée (DESC « À la main »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-ivoire-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Ivoire — Porté 01 » · alt descriptif « Sac LILA ivoire LELON tenu à la main par la petite poignée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-lila-ivoire-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a chocolate wool coat over a black knit and straight trousers, worn crossbody with the thin strap. The bag is exactly the product shown in the reference images, in ivory: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC, REF vert #3)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-ivoire-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Ivoire — Porté 02 » · alt descriptif « Sac LILA ivoire LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-lila-ivoire-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a chocolate wool coat over a black knit and straight trousers, worn crossbody. The bag is exactly the product shown in the reference images, in ivory: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : lifestyle, porté bandoulière
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-ivoire-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Ivoire — Porté 03 » · alt descriptif « Sac LILA ivoire LELON lifestyle »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### LILA — Noir

- Variante Shopify `60832988135758` · SKU `CJNS215116903CX` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON LILA — Noir — Vue 3 » (800×800) — `lelon-lila-noir-a8bda42404.jpg`
  - Zip : `08-lila/noir/8_4ab28d03-826d-4aab-bd15-7fc62da458dc.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste LILA ci-dessus.

**IMAGE A PROMPT** → `lelon-lila-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a beige trench coat, white shirt and light jeans, held in the hand by the small top handle. The bag is exactly the product shown in the reference images, in black: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la petite poignée (DESC « À la main »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Noir — Porté 01 » · alt descriptif « Sac LILA noir LELON tenu à la main par la petite poignée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-lila-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a beige trench coat, white shirt and light jeans, worn crossbody with the thin strap. The bag is exactly the product shown in the reference images, in black: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC, REF vert #3)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Noir — Porté 02 » · alt descriptif « Sac LILA noir LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-lila-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, worn crossbody. The bag is exactly the product shown in the reference images, in black: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : lifestyle, porté bandoulière
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Noir — Porté 03 » · alt descriptif « Sac LILA noir LELON lifestyle »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### LILA — Vert

- Variante Shopify `60840332820814` · SKU `CJNS215116905EV` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON LILA — Vert — Vue 5 » (800×800) — `lelon-lila-vert-af402f68e7.jpg`
  - Shopify : « LELON LILA — Vert — Vue 4 » (800×800) — `lelon-lila-vert-c55e740f7b.jpg`
  - Shopify : « LELON LILA — Vert — Vue 6 » (800×800) — `lelon-lila-vert-c764aaa700.jpg`
  - Zip : `08-lila/vert/1_43097750-8783-4fa6-855b-7b1ed39c9670.jpg`
  - Zip : `08-lila/vert/2_f75437a0-04f1-4f1e-b7a2-5d4d3eb57770.jpg`
  - Zip : `08-lila/vert/3_bdc29db1-4417-4dbf-b31f-139071122a37.jpg`
- COLOR TO PRESERVE : Vert (deep green), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste LILA ci-dessus.

**IMAGE A PROMPT** → `lelon-lila-vert-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a cream coat and grey knit (no green clothing), held in the hand by the small top handle. The bag is exactly the product shown in the reference images, in deep green: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la petite poignée (DESC « À la main »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-vert-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Vert — Porté 01 » · alt descriptif « Sac LILA vert LELON tenu à la main par la petite poignée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-lila-vert-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a cream coat and grey knit (no green clothing), worn crossbody with the thin strap. The bag is exactly the product shown in the reference images, in deep green: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC, REF vert #3)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-vert-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Vert — Porté 02 » · alt descriptif « Sac LILA vert LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-lila-vert-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a cream coat and grey knit (no green clothing), worn crossbody. The bag is exactly the product shown in the reference images, in deep green: tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : lifestyle, porté bandoulière
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-lila-vert-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON LILA — Vert — Porté 03 » · alt descriptif « Sac LILA vert LELON lifestyle »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## VERA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — porté épaule (REF caramel #11) · B — tenu contre soi / à la main (REF caramel #6) · C — porté épaule, scène quotidienne

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- sac rectangulaire horizontal semi-rigide à rabat arrondi (DESC)
- fermoir rectangulaire doré au centre du rabat (DESC)
- fine bandoulière, passants dorés (REF)
- tranches et surpiqûres visibles (REF macro #9)
- aspect lisse et légèrement brillant (DESC « PVC »)
- métallerie : doré

_Note références_ : Aucune dimension publiée pour M et L ; les références ne permettent pas de distinguer les deux formats.

### VERA — Caramel — M

- Variante Shopify `60840337899854` · SKU `CJNS192702804DW` · statut **BLOCKED_BY_MERCHANT** · drapeaux : LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED
- REFERENCE IMAGES :
  - Shopify : « LELON VERA — Caramel — Vue 2 » (800×800) — `lelon-vera-caramel-de4cae819b.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 1 » (800×800) — `lelon-vera-caramel-ab79f35e9d.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 3 » (800×800) — `lelon-vera-caramel-827d245c22.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 4 » (800×800) — `lelon-vera-caramel-c2acdf88fa.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 5 » (714×553) — `lelon-vera-caramel-a59a9f1dd5.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 6 » (716×545) — `lelon-vera-caramel-5cc9788da9.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 7 » (718×554) — `lelon-vera-caramel-d11ce76470.jpg`
  - Zip : `09-vera/caramel/11_1738031871784259584.jpg`
  - Zip : `09-vera/caramel/14_1738031872224661504.jpg`
  - Zip : `09-vera/caramel/4_e7b587f1-2c4c-4f82-90e4-7602baebb79a.jpg`
  - Zip : `09-vera/caramel/6_b9344412-c1a8-41d0-b4d2-3385241381c7.jpg`
  - Zip : `09-vera/caramel/7_1738031871058644992.jpg`
  - Zip : `09-vera/caramel/8_1738031871276748800.jpg`
  - Zip : `09-vera/caramel/9_1738031871402577920.jpg`
- ⚠ `LEGAL_REVIEW_REQUIRED` : Ressemblance forte avec un modèle iconique d’une maison : vérification juridique avant tout visuel publicitaire.
- ⚠ `SIZE_REFERENCE_REQUIRED` : Dimensions M / L non publiées : aucune différence de taille ne peut être générée.
- COLOR TO PRESERVE : Caramel (caramel brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste VERA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-vera-caramel-m-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a white shirt, cream trench and grey trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in caramel brown: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (REF caramel #11)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-caramel-m-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Caramel — Porté 01 — M » · alt descriptif « Sac VERA caramel format M LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-vera-caramel-m-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a white shirt, cream trench and grey trousers, held against the body in the hand. The bag is exactly the product shown in the reference images, in caramel brown: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu contre soi / à la main (REF caramel #6)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-caramel-m-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Caramel — Porté 02 — M » · alt descriptif « Sac VERA caramel format M LELON tenu contre soi / à la main »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-vera-caramel-m-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a white shirt, cream trench and grey trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in caramel brown: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-caramel-m-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Caramel — Porté 03 — M » · alt descriptif « Sac VERA caramel format M LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### VERA — Noir — M

- Variante Shopify `60840337932622` · SKU `CJNS192702802BY` · statut **BLOCKED_BY_MERCHANT** · drapeaux : LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED
- REFERENCE IMAGES :
  - Shopify : « LELON VERA — Noir — Vue 8 » (800×800) — `lelon-vera-noir-526260e866.jpg`
  - Zip : `09-vera/noir/3_bc4445f3-40e9-4b04-9c94-9dc25bd7b660.jpg`
- ⚠ `LEGAL_REVIEW_REQUIRED` : Ressemblance forte avec un modèle iconique d’une maison : vérification juridique avant tout visuel publicitaire.
- ⚠ `SIZE_REFERENCE_REQUIRED` : Dimensions M / L non publiées : aucune différence de taille ne peut être générée.
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste VERA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-vera-noir-m-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (REF caramel #11)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-noir-m-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Noir — Porté 01 — M » · alt descriptif « Sac VERA noir format M LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-vera-noir-m-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a beige trench coat, white shirt and light jeans, held against the body in the hand. The bag is exactly the product shown in the reference images, in black: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu contre soi / à la main (REF caramel #6)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-noir-m-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Noir — Porté 02 — M » · alt descriptif « Sac VERA noir format M LELON tenu contre soi / à la main »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-vera-noir-m-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-noir-m-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Noir — Porté 03 — M » · alt descriptif « Sac VERA noir format M LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### VERA — Noir — L

- Variante Shopify `60832995672398` · SKU `CJNS192702803CX` · statut **BLOCKED_BY_MERCHANT** · drapeaux : LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED
- REFERENCE IMAGES :
  - Shopify : « LELON VERA — Noir — Vue 8 » (800×800) — `lelon-vera-noir-526260e866.jpg`
  - Zip : `09-vera/noir/3_bc4445f3-40e9-4b04-9c94-9dc25bd7b660.jpg`
- ⚠ `LEGAL_REVIEW_REQUIRED` : Ressemblance forte avec un modèle iconique d’une maison : vérification juridique avant tout visuel publicitaire.
- ⚠ `SIZE_REFERENCE_REQUIRED` : Dimensions M / L non publiées : aucune différence de taille ne peut être générée.
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste VERA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-vera-noir-l-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (REF caramel #11)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-noir-l-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Noir — Porté 01 — L » · alt descriptif « Sac VERA noir format L LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-vera-noir-l-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, held against the body in the hand. The bag is exactly the product shown in the reference images, in black: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu contre soi / à la main (REF caramel #6)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-noir-l-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Noir — Porté 02 — L » · alt descriptif « Sac VERA noir format L LELON tenu contre soi / à la main »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-vera-noir-l-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-noir-l-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Noir — Porté 03 — L » · alt descriptif « Sac VERA noir format L LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### VERA — Caramel — L

- Variante Shopify `60840337965390` · SKU `CJNS192702805EV` · statut **BLOCKED_BY_MERCHANT** · drapeaux : LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED
- REFERENCE IMAGES :
  - Shopify : « LELON VERA — Caramel — Vue 2 » (800×800) — `lelon-vera-caramel-de4cae819b.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 1 » (800×800) — `lelon-vera-caramel-ab79f35e9d.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 3 » (800×800) — `lelon-vera-caramel-827d245c22.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 4 » (800×800) — `lelon-vera-caramel-c2acdf88fa.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 5 » (714×553) — `lelon-vera-caramel-a59a9f1dd5.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 6 » (716×545) — `lelon-vera-caramel-5cc9788da9.jpg`
  - Shopify : « LELON VERA — Caramel — Vue 7 » (718×554) — `lelon-vera-caramel-d11ce76470.jpg`
  - Zip : `09-vera/caramel/11_1738031871784259584.jpg`
  - Zip : `09-vera/caramel/14_1738031872224661504.jpg`
  - Zip : `09-vera/caramel/4_e7b587f1-2c4c-4f82-90e4-7602baebb79a.jpg`
  - Zip : `09-vera/caramel/6_b9344412-c1a8-41d0-b4d2-3385241381c7.jpg`
  - Zip : `09-vera/caramel/7_1738031871058644992.jpg`
  - Zip : `09-vera/caramel/8_1738031871276748800.jpg`
  - Zip : `09-vera/caramel/9_1738031871402577920.jpg`
- ⚠ `LEGAL_REVIEW_REQUIRED` : Ressemblance forte avec un modèle iconique d’une maison : vérification juridique avant tout visuel publicitaire.
- ⚠ `SIZE_REFERENCE_REQUIRED` : Dimensions M / L non publiées : aucune différence de taille ne peut être générée.
- COLOR TO PRESERVE : Caramel (caramel brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste VERA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-vera-caramel-l-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a white shirt, cream trench and grey trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in caramel brown: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (REF caramel #11)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-caramel-l-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Caramel — Porté 01 — L » · alt descriptif « Sac VERA caramel format L LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-vera-caramel-l-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a white shirt, cream trench and grey trousers, held against the body in the hand. The bag is exactly the product shown in the reference images, in caramel brown: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu contre soi / à la main (REF caramel #6)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-caramel-l-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Caramel — Porté 02 — L » · alt descriptif « Sac VERA caramel format L LELON tenu contre soi / à la main »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-vera-caramel-l-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a white shirt, cream trench and grey trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in caramel brown: semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-vera-caramel-l-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VERA — Caramel — Porté 03 — L » · alt descriptif « Sac VERA caramel format L LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### VERA — Rouge — M

- Variante Shopify `60840337998158` · SKU `CJNS192702806FU` · statut **REAL_PHOTOS_REQUIRED** · drapeaux : LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED, NEEDS_REAL_REFERENCE
- REFERENCE IMAGES :
  - **aucune** → NEEDS_REAL_REFERENCE
- ⚠ `LEGAL_REVIEW_REQUIRED` : Ressemblance forte avec un modèle iconique d’une maison : vérification juridique avant tout visuel publicitaire.
- ⚠ `SIZE_REFERENCE_REQUIRED` : Dimensions M / L non publiées : aucune différence de taille ne peut être générée.
- ⚠ `NEEDS_REAL_REFERENCE` : Aucune photo réelle de ce coloris : génération impossible sans référence.
- COLOR TO PRESERVE : Rouge (red), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste VERA ci-dessus.
- EXPECTED OUTPUT : **0 image générée** — REAL_PHOTOS_REQUIRED.

### VERA — Rouge — L

- Variante Shopify `60840338030926` · SKU `CJNS192702807GT` · statut **REAL_PHOTOS_REQUIRED** · drapeaux : LEGAL_REVIEW_REQUIRED, SIZE_REFERENCE_REQUIRED, NEEDS_REAL_REFERENCE
- REFERENCE IMAGES :
  - **aucune** → NEEDS_REAL_REFERENCE
- ⚠ `LEGAL_REVIEW_REQUIRED` : Ressemblance forte avec un modèle iconique d’une maison : vérification juridique avant tout visuel publicitaire.
- ⚠ `SIZE_REFERENCE_REQUIRED` : Dimensions M / L non publiées : aucune différence de taille ne peut être générée.
- ⚠ `NEEDS_REAL_REFERENCE` : Aucune photo réelle de ce coloris : génération impossible sans référence.
- COLOR TO PRESERVE : Rouge (red), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste VERA ci-dessus.
- EXPECTED OUTPUT : **0 image générée** — REAL_PHOTOS_REQUIRED.

## NAYA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — porté épaule (DESC « Une bandoulière », REF) · B — porté épaule, angle ¾ dos (même porté, autre angle) · C — porté épaule, scène quotidienne

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- sac souple aux lignes épurées, ouverture supérieure incurvée en U (DESC)
- bandoulière plate du même coloris, petites attaches dorées
- aspect lisse (REF)
- métallerie : doré (petites attaches)

_Note références_ : Bleu et jaune (« sable ») du zip ne sont pas des variantes : ne jamais les utiliser. Ivoire : 1 seule image fournisseur (Shopify).

### NAYA — Chocolat

- Variante Shopify `60840341733710` · SKU `CJNS194052705EV` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON NAYA — Chocolat — Vue 3 » (800×800) — `lelon-naya-chocolat-82f8fd5751.jpg`
  - Zip : `10-naya/chocolat/4_fa27e143-15e5-4058-b2d6-bc4b7e370b61.jpg`
- COLOR TO PRESERVE : Chocolat (chocolate brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste NAYA ci-dessus.

**IMAGE A PROMPT** → `lelon-naya-chocolat-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a cream knit, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in chocolate brown: soft minimalist shoulder bag with a gently curved U-shaped top opening, flat shoulder strap in the same color with small gold attachments, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « Une bandoulière », REF)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-naya-chocolat-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NAYA — Chocolat — Porté 01 » · alt descriptif « Sac NAYA chocolat LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-naya-chocolat-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a cream knit, white shirt and light jeans, worn on the shoulder, three-quarter back view. The bag is exactly the product shown in the reference images, in chocolate brown: soft minimalist shoulder bag with a gently curved U-shaped top opening, flat shoulder strap in the same color with small gold attachments, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle ¾ dos (même porté, autre angle)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-naya-chocolat-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NAYA — Chocolat — Porté 02 » · alt descriptif « Sac NAYA chocolat LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-naya-chocolat-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a cream knit, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in chocolate brown: soft minimalist shoulder bag with a gently curved U-shaped top opening, flat shoulder strap in the same color with small gold attachments, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-naya-chocolat-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NAYA — Chocolat — Porté 03 » · alt descriptif « Sac NAYA chocolat LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### NAYA — Noir

- Variante Shopify `60832995737934` · SKU `CJNS194052703CX` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON NAYA — Noir — Vue 4 » (800×800) — `lelon-naya-noir-4d5792443d.jpg`
  - Zip : `10-naya/noir/2_a1cab84e-7fed-4bb0-89eb-07aa29341ab5.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste NAYA ci-dessus.

**IMAGE A PROMPT** → `lelon-naya-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: soft minimalist shoulder bag with a gently curved U-shaped top opening, flat shoulder strap in the same color with small gold attachments, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « Une bandoulière », REF)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-naya-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NAYA — Noir — Porté 01 » · alt descriptif « Sac NAYA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-naya-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder, three-quarter back view. The bag is exactly the product shown in the reference images, in black: soft minimalist shoulder bag with a gently curved U-shaped top opening, flat shoulder strap in the same color with small gold attachments, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle ¾ dos (même porté, autre angle)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-naya-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NAYA — Noir — Porté 02 » · alt descriptif « Sac NAYA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-naya-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: soft minimalist shoulder bag with a gently curved U-shaped top opening, flat shoulder strap in the same color with small gold attachments, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-naya-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NAYA — Noir — Porté 03 » · alt descriptif « Sac NAYA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### NAYA — Ivoire

- Variante Shopify `60840341766478` · SKU `CJNS194052701AZ` · statut **READY_LIMITED** · drapeaux : REFERENCE_WEAK
- REFERENCE IMAGES :
  - Shopify : « LELON NAYA — Ivoire » (800×800) — `lelon-naya-04-cj.jpg`
- ⚠ `REFERENCE_WEAK` : Une seule image fournisseur basse définition : 2 visuels maximum (A, B), QA renforcée.
- COLOR TO PRESERVE : Ivoire (ivory), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste NAYA ci-dessus.

**IMAGE A PROMPT** → `lelon-naya-ivoire-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in ivory: soft minimalist shoulder bag with a gently curved U-shaped top opening, flat shoulder strap in the same color with small gold attachments, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « Une bandoulière », REF)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-naya-ivoire-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NAYA — Ivoire — Porté 01 » · alt descriptif « Sac NAYA ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-naya-ivoire-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder, three-quarter back view. The bag is exactly the product shown in the reference images, in ivory: soft minimalist shoulder bag with a gently curved U-shaped top opening, flat shoulder strap in the same color with small gold attachments, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle ¾ dos (même porté, autre angle)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-naya-ivoire-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NAYA — Ivoire — Porté 02 » · alt descriptif « Sac NAYA ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## AURÉA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — porté épaule (DESC « À l’épaule ») · B — porté épaule, angle profil (même porté, autre angle) · C — porté épaule, scène galerie / architecture

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- silhouette hobo en croissant, souple (DESC : 33 × 6,5 × 18,5 cm)
- anse unique fine, réglable par boucle argentée
- fermeture à glissière le long de l’ouverture (DESC « Zip »)
- aspect lisse mat (REF)
- métallerie : argenté

_Note références_ : Beige Sable : 2 photos dans le zip (#1, #3) de tons différents ; aucune dans Shopify.

### AURÉA — Noir

- Variante Shopify `60834320810318` · SKU `CJNS163017203CX` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature AURÉA — Noir — Vue 3 » (800×800) — `lelon-aurea-noir-c6b69859d1.jpg`
  - Zip : `11-aurea/noir/2_e0f8264b-101f-44c0-8624-6ed05954fc24.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste AURÉA ci-dessus.

**IMAGE A PROMPT** → `lelon-aurea-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: soft crescent-shaped hobo bag, single thin shoulder strap adjustable with a silver buckle, zipper along the opening, smooth matte surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « À l’épaule »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-aurea-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AURÉA — Noir — Porté 01 » · alt descriptif « Sac AURÉA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-aurea-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder, profile view. The bag is exactly the product shown in the reference images, in black: soft crescent-shaped hobo bag, single thin shoulder strap adjustable with a silver buckle, zipper along the opening, smooth matte surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle profil (même porté, autre angle)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-aurea-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AURÉA — Noir — Porté 02 » · alt descriptif « Sac AURÉA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-aurea-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: soft crescent-shaped hobo bag, single thin shoulder strap adjustable with a silver buckle, zipper along the opening, smooth matte surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène galerie / architecture
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-aurea-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AURÉA — Noir — Porté 03 » · alt descriptif « Sac AURÉA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### AURÉA — Taupe / Greige

- Variante Shopify `60840516714830` · SKU `CJNS163017201AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature AURÉA — Taupe / Greige — Vue 4 » (800×800) — `lelon-aurea-taupe-greige-3419ce02f4.jpg`
  - Zip : `11-aurea/taupe-greige/4_5b8c9603-4b39-4bb1-842b-17d04db39a74.jpg`
- COLOR TO PRESERVE : Taupe / Greige (taupe greige), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste AURÉA ci-dessus.

**IMAGE A PROMPT** → `lelon-aurea-taupe-greige-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a white shirt and navy trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in taupe greige: soft crescent-shaped hobo bag, single thin shoulder strap adjustable with a silver buckle, zipper along the opening, smooth matte surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « À l’épaule »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-aurea-taupe-greige-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AURÉA — Taupe / Greige — Porté 01 » · alt descriptif « Sac AURÉA taupe / greige LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-aurea-taupe-greige-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a white shirt and navy trousers, worn on the shoulder, profile view. The bag is exactly the product shown in the reference images, in taupe greige: soft crescent-shaped hobo bag, single thin shoulder strap adjustable with a silver buckle, zipper along the opening, smooth matte surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle profil (même porté, autre angle)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-aurea-taupe-greige-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AURÉA — Taupe / Greige — Porté 02 » · alt descriptif « Sac AURÉA taupe / greige LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-aurea-taupe-greige-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a white shirt and navy trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in taupe greige: soft crescent-shaped hobo bag, single thin shoulder strap adjustable with a silver buckle, zipper along the opening, smooth matte surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène galerie / architecture
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-aurea-taupe-greige-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AURÉA — Taupe / Greige — Porté 03 » · alt descriptif « Sac AURÉA taupe / greige LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### AURÉA — Beige Sable

- Variante Shopify `60840516747598` · SKU `CJNS163017202BY` · statut **BLOCKED_BY_MERCHANT** · drapeaux : REFERENCE_TO_CONFIRM
- REFERENCE IMAGES :
  - Zip : `11-aurea/beige-sable/1_cdc4c5d5-0c1c-4376-a080-fab3bdce04a2.jpg`
  - Zip : `11-aurea/beige-sable/3_fe3f9865-83b7-4ace-ade5-3fa3f0df5fb7.jpg`
- ⚠ `REFERENCE_TO_CONFIRM` : Les 2 photos du zip n’ont pas le même ton : confirmer la teinte réelle.
- COLOR TO PRESERVE : Beige Sable (sand beige), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste AURÉA ci-dessus.
- ⛔ **Ne pas lancer avant la décision marchand.** Les prompts sont prêts pour après validation.

**IMAGE A PROMPT** → `lelon-aurea-beige-sable-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a black knit and raw denim, worn on the shoulder. The bag is exactly the product shown in the reference images, in sand beige: soft crescent-shaped hobo bag, single thin shoulder strap adjustable with a silver buckle, zipper along the opening, smooth matte surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « À l’épaule »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-aurea-beige-sable-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AURÉA — Beige Sable — Porté 01 » · alt descriptif « Sac AURÉA beige sable LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-aurea-beige-sable-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a black knit and raw denim, worn on the shoulder, profile view. The bag is exactly the product shown in the reference images, in sand beige: soft crescent-shaped hobo bag, single thin shoulder strap adjustable with a silver buckle, zipper along the opening, smooth matte surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle profil (même porté, autre angle)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-aurea-beige-sable-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AURÉA — Beige Sable — Porté 02 » · alt descriptif « Sac AURÉA beige sable LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-aurea-beige-sable-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a black knit and raw denim, worn on the shoulder. The bag is exactly the product shown in the reference images, in sand beige: soft crescent-shaped hobo bag, single thin shoulder strap adjustable with a silver buckle, zipper along the opening, smooth matte surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène galerie / architecture
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-aurea-beige-sable-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AURÉA — Beige Sable — Porté 03 » · alt descriptif « Sac AURÉA beige sable LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## ELARA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — tenu à la main par les deux anses (DESC) · B — porté en bandoulière avec la large bandoulière amovible (DESC) · C — porté épaule, scène quotidienne

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- sac structuré à deux anses (DESC : 27 × 16 × 23 cm)
- panneaux découpés : couture horizontale et coutures verticales (REF)
- anses rivetées dorées
- large bandoulière amovible, attaches dorées (DESC « détails dorés »)
- grain visible (REF)
- métallerie : doré

_Note références_ : Références studio de bonne qualité, mannequin déjà présent.

### ELARA — Cognac

- Variante Shopify `60840520417614` · SKU `CJNS205176702BY` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature ELARA — Cognac — Vue 3 » (800×800) — `lelon-elara-cognac-9927cca023.jpg`
  - Shopify : « LELON Signature ELARA — Cognac — Vue 1 » (900×1200) — `lelon-elara-cognac-e4d1362f7b.jpg`
  - Shopify : « LELON Signature ELARA — Cognac — Vue 2 » (800×800) — `lelon-elara-cognac-7e34e80363.jpg`
  - Zip : `12-elara/cognac/13_9ab9cf93-a2f0-4de9-89dc-37f0a74452b5.jpg`
  - Zip : `12-elara/cognac/2_ba31efb4-ee48-4187-92fb-5ad69f592874.jpg`
  - Zip : `12-elara/cognac/4_331ffb13-9bd8-4820-bb48-582786e05b05.jpg`
- COLOR TO PRESERVE : Cognac (cognac brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ELARA ci-dessus.

**IMAGE A PROMPT** → `lelon-elara-cognac-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a white shirt, cream knit and raw denim, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in cognac brown: structured bag with two top handles, panel construction with one horizontal seam and vertical seams, gold rivets on the handles, wide detachable shoulder strap with gold attachments, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elara-cognac-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ELARA — Cognac — Porté 01 » · alt descriptif « Sac ELARA cognac LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-elara-cognac-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a white shirt, cream knit and raw denim, worn crossbody with the wide strap. The bag is exactly the product shown in the reference images, in cognac brown: structured bag with two top handles, panel construction with one horizontal seam and vertical seams, gold rivets on the handles, wide detachable shoulder strap with gold attachments, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière avec la large bandoulière amovible (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elara-cognac-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ELARA — Cognac — Porté 02 » · alt descriptif « Sac ELARA cognac LELON porté en bandoulière avec la large bandoulière amovible »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-elara-cognac-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a white shirt, cream knit and raw denim, worn on the shoulder. The bag is exactly the product shown in the reference images, in cognac brown: structured bag with two top handles, panel construction with one horizontal seam and vertical seams, gold rivets on the handles, wide detachable shoulder strap with gold attachments, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elara-cognac-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ELARA — Cognac — Porté 03 » · alt descriptif « Sac ELARA cognac LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### ELARA — Noir

- Variante Shopify `60834325659982` · SKU `CJNS205176701AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature ELARA — Noir — Vue 4 » (900×900) — `lelon-elara-noir-f729aa0f07.jpg`
  - Shopify : « LELON Signature ELARA — Noir — Vue 5 » (800×800) — `lelon-elara-noir-988a2020db.jpg`
  - Zip : `12-elara/noir/12_c8ce188f-d3ae-495a-9993-dbe1bbd153c5.jpg`
  - Zip : `12-elara/noir/3_433a67f7-ff24-43c5-bd9e-3fed7f1b4f9b.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ELARA ci-dessus.

**IMAGE A PROMPT** → `lelon-elara-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a beige trench coat, white shirt and light jeans, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in black: structured bag with two top handles, panel construction with one horizontal seam and vertical seams, gold rivets on the handles, wide detachable shoulder strap with gold attachments, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elara-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ELARA — Noir — Porté 01 » · alt descriptif « Sac ELARA noir LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-elara-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a beige trench coat, white shirt and light jeans, worn crossbody with the wide strap. The bag is exactly the product shown in the reference images, in black: structured bag with two top handles, panel construction with one horizontal seam and vertical seams, gold rivets on the handles, wide detachable shoulder strap with gold attachments, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière avec la large bandoulière amovible (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elara-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ELARA — Noir — Porté 02 » · alt descriptif « Sac ELARA noir LELON porté en bandoulière avec la large bandoulière amovible »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-elara-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: structured bag with two top handles, panel construction with one horizontal seam and vertical seams, gold rivets on the handles, wide detachable shoulder strap with gold attachments, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-elara-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ELARA — Noir — Porté 03 » · alt descriptif « Sac ELARA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## ISAURE

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — porté épaule (DESC « Une bandoulière », REF) · B — porté épaule, angle ¾ dos (REF cognac #16) · C — porté épaule, scène quotidienne

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- grand sac aux lignes minimalistes, semi-structuré (DESC : 27 × 26 × 7 cm)
- large bandoulière unique réglable par passants latéraux (REF)
- aspect lisse (REF)
- métallerie : discret (passants du même coloris)

_Note références_ : Cognac : 5 bonnes photos dans le zip, 0 dans Shopify. Noir : 1 image fournisseur. « Blanc » n’est pas une variante.

### ISAURE — Cognac

- Variante Shopify `60897873199438` · SKU `CJNS196662204DW` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Zip : `13-isaure/cognac/12_d99211ed-51dc-4c9e-8497-1c1ccda8e3f9.jpg`
  - Zip : `13-isaure/cognac/16_46071d51-ecd5-4d37-9dfc-e44f8123576a.jpg`
  - Zip : `13-isaure/cognac/17_d1733b99-91f2-4add-b620-3546987518b9.jpg`
  - Zip : `13-isaure/cognac/1_df0045b5-8cb6-4485-8da7-753fccf1bf06.jpg`
  - Zip : `13-isaure/cognac/28_a56199f5-83e2-4c0a-b449-7f8aeb467d44.jpg`
- COLOR TO PRESERVE : Cognac (cognac brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ISAURE ci-dessus.

**IMAGE A PROMPT** → `lelon-isaure-cognac-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a white shirt, cream knit and raw denim, worn on the shoulder. The bag is exactly the product shown in the reference images, in cognac brown: large minimalist semi-structured tote-bucket bag, one wide shoulder strap adjusted through side loops, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « Une bandoulière », REF)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-isaure-cognac-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ISAURE — Cognac — Porté 01 » · alt descriptif « Sac ISAURE cognac LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-isaure-cognac-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a white shirt, cream knit and raw denim, worn on the shoulder, three-quarter back view. The bag is exactly the product shown in the reference images, in cognac brown: large minimalist semi-structured tote-bucket bag, one wide shoulder strap adjusted through side loops, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle ¾ dos (REF cognac #16)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-isaure-cognac-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ISAURE — Cognac — Porté 02 » · alt descriptif « Sac ISAURE cognac LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-isaure-cognac-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a white shirt, cream knit and raw denim, worn on the shoulder. The bag is exactly the product shown in the reference images, in cognac brown: large minimalist semi-structured tote-bucket bag, one wide shoulder strap adjusted through side loops, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-isaure-cognac-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ISAURE — Cognac — Porté 03 » · alt descriptif « Sac ISAURE cognac LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### ISAURE — Noir

- Variante Shopify `60834329493838` · SKU `CJNS196662201AZ` · statut **READY_LIMITED** · drapeaux : REFERENCE_WEAK
- REFERENCE IMAGES :
  - Shopify : « LELON Signature ISAURE — Noir » (800×800) — `lelon-cj-cjns196662201az.jpg`
- ⚠ `REFERENCE_WEAK` : Une seule image fournisseur basse définition : 2 visuels maximum (A, B), QA renforcée.
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste ISAURE ci-dessus.

**IMAGE A PROMPT** → `lelon-isaure-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: large minimalist semi-structured tote-bucket bag, one wide shoulder strap adjusted through side loops, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC « Une bandoulière », REF)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-isaure-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ISAURE — Noir — Porté 01 » · alt descriptif « Sac ISAURE noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-isaure-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder, three-quarter back view. The bag is exactly the product shown in the reference images, in black: large minimalist semi-structured tote-bucket bag, one wide shoulder strap adjusted through side loops, smooth surface. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle ¾ dos (REF cognac #16)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + voir drapeaux
- EXPECTED OUTPUT : `lelon-isaure-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON ISAURE — Noir — Porté 02 » · alt descriptif « Sac ISAURE noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## CÉLÈNE

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — tenu à la main par les deux anses (DESC) · B — porté en bandoulière (DESC) · C — porté épaule, scène quotidienne

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- forme Boston / bowling structurée (DESC : 30 × 13 × 22 cm)
- deux anses arrondies du même coloris
- double curseur de fermeture doré au centre du haut
- surpiqûres contrastées visibles le long des bords (REF)
- grain visible (REF)
- Ivoire : large sangle en tissu à motif (REF #9) — conserver la sangle propre à chaque coloris
- métallerie : doré

_Note références_ : Taupe : photo intérieur réelle (#3) — ne jamais générer d’intérieur.

### CÉLÈNE — Taupe

- Variante Shopify `60897877754190` · SKU `CJNS237403703CX` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature CÉLÈNE — Taupe — Vue 6 » (1437×1437) — `lelon-celene-taupe-4d458fc3f8.jpg`
  - Shopify : « LELON Signature CÉLÈNE — Taupe — Vue 4 » (1235×1235) — `lelon-celene-taupe-452990b959.jpg`
  - Shopify : « LELON Signature CÉLÈNE — Taupe — Vue 5 » (609×609) — `lelon-celene-taupe-d4a963efe6.jpg`
  - Zip : `14-celene/taupe/1_0d6e5625-5776-4c4d-9d66-13cde33ba89a.jpg`
  - Zip : `14-celene/taupe/3_40eadcff-c048-4bef-a325-812013ccaeb5.jpg`
  - Zip : `14-celene/taupe/7_1f7b7071-b32a-4c96-9f43-645968a342e4.jpg`
- COLOR TO PRESERVE : Taupe (taupe), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste CÉLÈNE ci-dessus.

**IMAGE A PROMPT** → `lelon-celene-taupe-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a white shirt and navy trousers, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in taupe: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-taupe-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Taupe — Porté 01 » · alt descriptif « Sac CÉLÈNE taupe LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-celene-taupe-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a white shirt and navy trousers, worn crossbody with the strap. The bag is exactly the product shown in the reference images, in taupe: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-taupe-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Taupe — Porté 02 » · alt descriptif « Sac CÉLÈNE taupe LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-celene-taupe-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a white shirt and navy trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in taupe: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-taupe-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Taupe — Porté 03 » · alt descriptif « Sac CÉLÈNE taupe LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### CÉLÈNE — Noir

- Variante Shopify `60834331885902` · SKU `CJNS237403701AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature CÉLÈNE — Noir — Vue 3 » (1780×1780) — `lelon-celene-noir-477f051316.jpg`
  - Zip : `14-celene/noir/5_b56f14e2-f7c5-4338-b043-d37c2e0a7467.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste CÉLÈNE ci-dessus.

**IMAGE A PROMPT** → `lelon-celene-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a beige trench coat, white shirt and light jeans, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in black: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Noir — Porté 01 » · alt descriptif « Sac CÉLÈNE noir LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-celene-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a beige trench coat, white shirt and light jeans, worn crossbody with the strap. The bag is exactly the product shown in the reference images, in black: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Noir — Porté 02 » · alt descriptif « Sac CÉLÈNE noir LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-celene-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Noir — Porté 03 » · alt descriptif « Sac CÉLÈNE noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### CÉLÈNE — Ivoire

- Variante Shopify `60897877786958` · SKU `CJNS237403705EV` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature CÉLÈNE — Ivoire — Vue 2 » (1569×1569) — `lelon-celene-ivoire-e488087db1.jpg`
  - Zip : `14-celene/ivoire/9_0f94f57f-ebb5-4cda-8f3d-d9af80fcd140.jpg`
- COLOR TO PRESERVE : Ivoire (ivory), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste CÉLÈNE ci-dessus.

**IMAGE A PROMPT** → `lelon-celene-ivoire-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a chocolate wool coat over a black knit and straight trousers, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in ivory: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-ivoire-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Ivoire — Porté 01 » · alt descriptif « Sac CÉLÈNE ivoire LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-celene-ivoire-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a chocolate wool coat over a black knit and straight trousers, worn crossbody with the strap. The bag is exactly the product shown in the reference images, in ivory: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-ivoire-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Ivoire — Porté 02 » · alt descriptif « Sac CÉLÈNE ivoire LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-celene-ivoire-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in ivory: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-ivoire-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Ivoire — Porté 03 » · alt descriptif « Sac CÉLÈNE ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### CÉLÈNE — Cognac

- Variante Shopify `60897877819726` · SKU `CJNS237403704DW` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature CÉLÈNE — Cognac — Vue 1 » (1422×1422) — `lelon-celene-cognac-6f91edf9fe.jpg`
  - Zip : `14-celene/cognac/8_f5b4b0a0-69bc-43e6-bf7f-508b21f89323.jpg`
- COLOR TO PRESERVE : Cognac (cognac brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste CÉLÈNE ci-dessus.

**IMAGE A PROMPT** → `lelon-celene-cognac-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a white shirt, cream knit and raw denim, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in cognac brown: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-cognac-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Cognac — Porté 01 » · alt descriptif « Sac CÉLÈNE cognac LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-celene-cognac-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a white shirt, cream knit and raw denim, worn crossbody with the strap. The bag is exactly the product shown in the reference images, in cognac brown: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-cognac-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Cognac — Porté 02 » · alt descriptif « Sac CÉLÈNE cognac LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-celene-cognac-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a white shirt, cream knit and raw denim, worn on the shoulder. The bag is exactly the product shown in the reference images, in cognac brown: structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a discreet café with a wooden table and window light, blurred background without text. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène quotidienne
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-celene-cognac-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON CÉLÈNE — Cognac — Porté 03 » · alt descriptif « Sac CÉLÈNE cognac LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## VÉLORA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — tenu à la main par la poignée (DESC « Une poignée ») · B — porté épaule avec la courte bandoulière (DESC) · C — porté en bandoulière avec la longue bandoulière (DESC)

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- sac horizontal structuré, silhouette trapèze (DESC)
- grand rabat couvrant la face, soufflets latéraux plissés
- poignée supérieure unique arrondie
- petite plaque rectangulaire embossée sur le rabat (REF) — ne pas y écrire de texte
- métallerie : discret

_Note références_ : Camel : 4 photos dont 2 portées ; Ivoire et Noir : 1 packshot. Ivoire porté PNG Shopify non contrôlé.

### VÉLORA — Camel

- Variante Shopify `60834333917518` · SKU `CJNS244594103CX` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature VÉLORA — Camel » (800×800) — `lelon-cj-cjns244594103cx.jpg`
  - Zip : `15-velora/camel/1_f52e359c-2f71-4af5-84d8-f5bd4f7db9ad.jpg`
  - Zip : `15-velora/camel/2_5a868519-bb51-4233-a9b3-206c89c44baf.jpg`
  - Zip : `15-velora/camel/3_9ffd5d50-d6a0-46bc-ae8d-fe920ec3fb5d.jpg`
  - Zip : `15-velora/camel/9_814a4189-7542-41d7-98f3-b855ee307f4e.jpg`
- COLOR TO PRESERVE : Camel (camel), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste VÉLORA ci-dessus.

**IMAGE A PROMPT** → `lelon-velora-camel-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing an ecru knit and raw denim, carried in the hand by the top handle. The bag is exactly the product shown in the reference images, in camel: structured horizontal trapezoid bag, large flap covering the front, pleated side gussets, single rounded top handle, small blank rectangular embossed plate on the flap (no text). Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la poignée (DESC « Une poignée »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-velora-camel-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VÉLORA — Camel — Porté 01 » · alt descriptif « Sac VÉLORA camel LELON tenu à la main par la poignée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-velora-camel-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing an ecru knit and raw denim, worn on the shoulder with the short strap. The bag is exactly the product shown in the reference images, in camel: structured horizontal trapezoid bag, large flap covering the front, pleated side gussets, single rounded top handle, small blank rectangular embossed plate on the flap (no text). Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule avec la courte bandoulière (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-velora-camel-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VÉLORA — Camel — Porté 02 » · alt descriptif « Sac VÉLORA camel LELON porté à l’épaule avec la courte bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-velora-camel-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing an ecru knit and raw denim, worn crossbody with the long strap. The bag is exactly the product shown in the reference images, in camel: structured horizontal trapezoid bag, large flap covering the front, pleated side gussets, single rounded top handle, small blank rectangular embossed plate on the flap (no text). Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière avec la longue bandoulière (DESC)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-velora-camel-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VÉLORA — Camel — Porté 03 » · alt descriptif « Sac VÉLORA camel LELON porté en bandoulière avec la longue bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### VÉLORA — Noir

- Variante Shopify `60897879163214` · SKU `CJNS244594101AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature VÉLORA — Noir — Vue 6 » (800×800) — `lelon-velora-noir-70f71a39e5.jpg`
  - Zip : `15-velora/noir/6_b8b961eb-7b1a-4355-a398-4f0b2d974a3a.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste VÉLORA ci-dessus.

**IMAGE A PROMPT** → `lelon-velora-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a beige trench coat, white shirt and light jeans, carried in the hand by the top handle. The bag is exactly the product shown in the reference images, in black: structured horizontal trapezoid bag, large flap covering the front, pleated side gussets, single rounded top handle, small blank rectangular embossed plate on the flap (no text). Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la poignée (DESC « Une poignée »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-velora-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VÉLORA — Noir — Porté 01 » · alt descriptif « Sac VÉLORA noir LELON tenu à la main par la poignée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-velora-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder with the short strap. The bag is exactly the product shown in the reference images, in black: structured horizontal trapezoid bag, large flap covering the front, pleated side gussets, single rounded top handle, small blank rectangular embossed plate on the flap (no text). Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule avec la courte bandoulière (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-velora-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VÉLORA — Noir — Porté 02 » · alt descriptif « Sac VÉLORA noir LELON porté à l’épaule avec la courte bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-velora-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, worn crossbody with the long strap. The bag is exactly the product shown in the reference images, in black: structured horizontal trapezoid bag, large flap covering the front, pleated side gussets, single rounded top handle, small blank rectangular embossed plate on the flap (no text). Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière avec la longue bandoulière (DESC)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-velora-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VÉLORA — Noir — Porté 03 » · alt descriptif « Sac VÉLORA noir LELON porté en bandoulière avec la longue bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### VÉLORA — Ivoire

- Variante Shopify `60897879195982` · SKU `CJNS244594102BY` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature VÉLORA — Ivoire — Vue 5 » (800×800) — `lelon-velora-ivoire-0e88ad27dc.jpg`
  - Shopify : « LELON Signature VÉLORA Ivoire porté par une mannequin » (1122×1402) — `lelon-velora-ivoire-02-mannequin.png` — ⚠ visuel porté d’origine inconnue, non contrôlé : ne pas l’utiliser comme référence de fidélité
  - Zip : `15-velora/ivoire/7_dd65e4e2-25e5-4ffc-8e70-02ccb44ada20.jpg`
- COLOR TO PRESERVE : Ivoire (ivory), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste VÉLORA ci-dessus.

**IMAGE A PROMPT** → `lelon-velora-ivoire-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a chocolate wool coat over a black knit and straight trousers, carried in the hand by the top handle. The bag is exactly the product shown in the reference images, in ivory: structured horizontal trapezoid bag, large flap covering the front, pleated side gussets, single rounded top handle, small blank rectangular embossed plate on the flap (no text). Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par la poignée (DESC « Une poignée »)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-velora-ivoire-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VÉLORA — Ivoire — Porté 01 » · alt descriptif « Sac VÉLORA ivoire LELON tenu à la main par la poignée »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-velora-ivoire-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder with the short strap. The bag is exactly the product shown in the reference images, in ivory: structured horizontal trapezoid bag, large flap covering the front, pleated side gussets, single rounded top handle, small blank rectangular embossed plate on the flap (no text). Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule avec la courte bandoulière (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-velora-ivoire-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VÉLORA — Ivoire — Porté 02 » · alt descriptif « Sac VÉLORA ivoire LELON porté à l’épaule avec la courte bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-velora-ivoire-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a chocolate wool coat over a black knit and straight trousers, worn crossbody with the long strap. The bag is exactly the product shown in the reference images, in ivory: structured horizontal trapezoid bag, large flap covering the front, pleated side gussets, single rounded top handle, small blank rectangular embossed plate on the flap (no text). Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière avec la longue bandoulière (DESC)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-velora-ivoire-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON VÉLORA — Ivoire — Porté 03 » · alt descriptif « Sac VÉLORA ivoire LELON porté en bandoulière avec la longue bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## AMARA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — tenu à la main par les deux anses (DESC) · B — porté épaule (DESC) · C — porté en bandoulière (DESC « selon la configuration fournie »)

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- sac seau souple (DESC : 24 × 14 × 19 cm, ouverture ~21 cm)
- deux anses fines ; nœud / boucle nouée sur l’attache d’une anse (REF)
- pièce ronde dorée sur le côté (REF)
- bandoulière fine amovible, mousquetons dorés (REF sauge #2, #5)
- intérieur contrasté brun visible à l’ouverture (REF) — ne pas le modifier ni l’agrandir
- métallerie : doré

_Note références_ : Packshots 1600 px nets ; Ivoire et Rose Poudré : 1 vue chacun.

### AMARA — Ivoire

- Variante Shopify `60897885716814` · SKU `CJNS245663602BY` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature AMARA — Ivoire — Vue 1 » (1600×1600) — `lelon-amara-ivoire-e3bb682547.jpg`
  - Zip : `16-amara/ivoire/7_fc3fdcc6-24ee-4e56-bd10-ce5e96f331df.jpg`
- COLOR TO PRESERVE : Ivoire (ivory), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste AMARA ci-dessus.

**IMAGE A PROMPT** → `lelon-amara-ivoire-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a chocolate wool coat over a black knit and straight trousers, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in ivory: soft bucket bag, two thin handles with a knotted loop on one handle attachment, small round gold piece on the side, thin detachable strap with gold clasps, contrasting brown interior visible at the opening. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-amara-ivoire-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AMARA — Ivoire — Porté 01 » · alt descriptif « Sac AMARA ivoire LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-amara-ivoire-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 36, low brown bun, olive skin, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in ivory: soft bucket bag, two thin handles with a knotted loop on one handle attachment, small round gold piece on the side, thin detachable strap with gold clasps, contrasting brown interior visible at the opening. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 36 ans, chignon bas brun, teint olive
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-amara-ivoire-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AMARA — Ivoire — Porté 02 » · alt descriptif « Sac AMARA ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-amara-ivoire-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a chocolate wool coat over a black knit and straight trousers, worn crossbody. The bag is exactly the product shown in the reference images, in ivory: soft bucket bag, two thin handles with a knotted loop on one handle attachment, small round gold piece on the side, thin detachable strap with gold clasps, contrasting brown interior visible at the opening. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « selon la configuration fournie »)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-amara-ivoire-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AMARA — Ivoire — Porté 03 » · alt descriptif « Sac AMARA ivoire LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### AMARA — Sauge

- Variante Shopify `60834336997710` · SKU `CJNS245663601AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature AMARA — Sauge — Vue 5 » (1600×1600) — `lelon-amara-sauge-ac04723c3e.jpg`
  - Shopify : « LELON Signature AMARA — Sauge — Vue 3 » (1600×1600) — `lelon-amara-sauge-950f59fc90.jpg`
  - Shopify : « LELON Signature AMARA — Sauge — Vue 4 » (1600×1600) — `lelon-amara-sauge-5fce686fe9.jpg`
  - Shopify : « LELON Signature AMARA — Sauge — Vue 6 » (1600×1600) — `lelon-amara-sauge-3990e5d42a.jpg`
  - Zip : `16-amara/sauge/2_54f73a7f-3202-4dcd-8d6e-6f1680b6df88.jpg`
  - Zip : `16-amara/sauge/3_86196248-9b46-453e-a84e-f4f329bd2cc9.jpg`
  - Zip : `16-amara/sauge/5_060d3388-0efe-4311-aced-9e61e378beb0.jpg`
  - Zip : `16-amara/sauge/6_641ac26c-3551-4667-b42c-8fac08a93194.jpg`
- COLOR TO PRESERVE : Sauge (sage green), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste AMARA ci-dessus.

**IMAGE A PROMPT** → `lelon-amara-sauge-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing an ecru shirt and chocolate knit, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in sage green: soft bucket bag, two thin handles with a knotted loop on one handle attachment, small round gold piece on the side, thin detachable strap with gold clasps, contrasting brown interior visible at the opening. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-amara-sauge-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AMARA — Sauge — Porté 01 » · alt descriptif « Sac AMARA sauge LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-amara-sauge-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing an ecru shirt and chocolate knit, worn on the shoulder. The bag is exactly the product shown in the reference images, in sage green: soft bucket bag, two thin handles with a knotted loop on one handle attachment, small round gold piece on the side, thin detachable strap with gold clasps, contrasting brown interior visible at the opening. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-amara-sauge-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AMARA — Sauge — Porté 02 » · alt descriptif « Sac AMARA sauge LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-amara-sauge-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing an ecru shirt and chocolate knit, worn crossbody. The bag is exactly the product shown in the reference images, in sage green: soft bucket bag, two thin handles with a knotted loop on one handle attachment, small round gold piece on the side, thin detachable strap with gold clasps, contrasting brown interior visible at the opening. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « selon la configuration fournie »)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-amara-sauge-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AMARA — Sauge — Porté 03 » · alt descriptif « Sac AMARA sauge LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### AMARA — Rose Poudré

- Variante Shopify `60897885749582` · SKU `CJNS245663603CX` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature AMARA — Rose Poudré — Vue 2 » (1600×1600) — `lelon-amara-rose-poudre-7975780c25.jpg`
  - Zip : `16-amara/rose-poudre/8_4736d8ee-7e2e-479a-b107-1a6a0b3c9645.jpg`
- COLOR TO PRESERVE : Rose Poudré (powder pink), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste AMARA ci-dessus.

**IMAGE A PROMPT** → `lelon-amara-rose-poudre-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a charcoal knit and white shirt, carried in the hand by both handles. The bag is exactly the product shown in the reference images, in powder pink: soft bucket bag, two thin handles with a knotted loop on one handle attachment, small round gold piece on the side, thin detachable strap with gold clasps, contrasting brown interior visible at the opening. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : tenu à la main par les deux anses (DESC)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-amara-rose-poudre-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AMARA — Rose Poudré — Porté 01 » · alt descriptif « Sac AMARA rose poudré LELON tenu à la main par les deux anses »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-amara-rose-poudre-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a charcoal knit and white shirt, worn on the shoulder. The bag is exactly the product shown in the reference images, in powder pink: soft bucket bag, two thin handles with a knotted loop on one handle attachment, small round gold piece on the side, thin detachable strap with gold clasps, contrasting brown interior visible at the opening. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a bright apartment with ivory walls, light oak floor and a tall window. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (DESC)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : appartement lumineux, murs ivoire, parquet clair, fenêtre haute
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-amara-rose-poudre-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AMARA — Rose Poudré — Porté 02 » · alt descriptif « Sac AMARA rose poudré LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-amara-rose-poudre-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a charcoal knit and white shirt, worn crossbody. The bag is exactly the product shown in the reference images, in powder pink: soft bucket bag, two thin handles with a knotted loop on one handle attachment, small round gold piece on the side, thin detachable strap with gold clasps, contrasting brown interior visible at the opening. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a wood and ivory interior with a wooden chair and natural textiles. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté en bandoulière (DESC « selon la configuration fournie »)
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : intérieur bois et ivoire, chaise en bois, textiles naturels
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-amara-rose-poudre-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON AMARA — Rose Poudré — Porté 03 » · alt descriptif « Sac AMARA rose poudré LELON porté en bandoulière »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

## NOREA

**Porté autorisé** (description Shopify ou photo réelle uniquement) :
A — porté épaule (REF ivoire #1) · B — porté épaule, angle profil (même porté, autre angle) · C — porté épaule, scène architecture

**Caractéristiques à préserver** (relevé visuel des références ; aucune matière ni mesure ajoutée) :

- forme carrée horizontale à rabat (DESC)
- bande avant enveloppante en plusieurs couches (REF)
- double curseur central argenté avec longues tirettes (REF)
- longue anse fine d’épaule (REF) ; bandoulière « à double articulation » (DESC)
- métallerie : argenté

_Note références_ : Les 4 photos « taupue » du zip ne sont pas une variante vendue : ne pas les utiliser.

### NOREA — Noir

- Variante Shopify `60834344829262` · SKU `CJNS245664401AZ` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature NOREA — Noir — Vue 4 » (1600×1600) — `lelon-norea-noir-c8db832808.jpg`
  - Zip : `17-norea/noir/5_e78218d2-c1cd-4046-915b-381aaef5cd35.jpg`
- COLOR TO PRESERVE : Noir (black), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste NOREA ci-dessus.

**IMAGE A PROMPT** → `lelon-norea-noir-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: horizontal square-ish flap bag, layered wrap-around front band, double silver zipper pulls in the center with long leather tabs, long thin shoulder handle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (REF ivoire #1)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-norea-noir-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOREA — Noir — Porté 01 » · alt descriptif « Sac NOREA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-norea-noir-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 30, mid-length chestnut hair, fair skin, natural makeup, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder, profile view. The bag is exactly the product shown in the reference images, in black: horizontal square-ish flap bag, layered wrap-around front band, double silver zipper pulls in the center with long leather tabs, long thin shoulder handle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle profil (même porté, autre angle)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-norea-noir-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOREA — Noir — Porté 02 » · alt descriptif « Sac NOREA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-norea-noir-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a beige trench coat, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in black: horizontal square-ish flap bag, layered wrap-around front band, double silver zipper pulls in the center with long leather tabs, long thin shoulder handle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène architecture
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-norea-noir-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOREA — Noir — Porté 03 » · alt descriptif « Sac NOREA noir LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### NOREA — Ivoire

- Variante Shopify `60897888764238` · SKU `CJNS245664402BY` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature NOREA — Ivoire — Vue 3 » (1600×1600) — `lelon-norea-ivoire-92b6977494.jpg`
  - Shopify : « LELON Signature NOREA — Ivoire — Vue 2 » (1000×1000) — `lelon-norea-ivoire-9989bc9a7f.jpg`
  - Zip : `17-norea/ivoire/1_272dc7e7-f59a-4e5b-8689-cc573a274a55.jpg`
  - Zip : `17-norea/ivoire/6_c49371ab-62d9-4db0-9fe7-475cd4aa6959.jpg`
- COLOR TO PRESERVE : Ivoire (ivory), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste NOREA ci-dessus.

**IMAGE A PROMPT** → `lelon-norea-ivoire-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in ivory: horizontal square-ish flap bag, layered wrap-around front band, double silver zipper pulls in the center with long leather tabs, long thin shoulder handle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (REF ivoire #1)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-norea-ivoire-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOREA — Ivoire — Porté 01 » · alt descriptif « Sac NOREA ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-norea-ivoire-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 27, long straight black hair, light olive skin, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder, profile view. The bag is exactly the product shown in the reference images, in ivory: horizontal square-ish flap bag, layered wrap-around front band, double silver zipper pulls in the center with long leather tabs, long thin shoulder handle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle profil (même porté, autre angle)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 27 ans, longs cheveux noirs lisses, teint mat
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-norea-ivoire-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOREA — Ivoire — Porté 02 » · alt descriptif « Sac NOREA ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-norea-ivoire-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a chocolate wool coat over a black knit and straight trousers, worn on the shoulder. The bag is exactly the product shown in the reference images, in ivory: horizontal square-ish flap bag, layered wrap-around front band, double silver zipper pulls in the center with long leather tabs, long thin shoulder handle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène architecture
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-norea-ivoire-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOREA — Ivoire — Porté 03 » · alt descriptif « Sac NOREA ivoire LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

### NOREA — Chocolat

- Variante Shopify `60897888797006` · SKU `CJNS245664404DW` · statut **READY_FOR_GENERATION**
- REFERENCE IMAGES :
  - Shopify : « LELON Signature NOREA — Chocolat — Vue 1 » (1600×1600) — `lelon-norea-chocolat-4573341e7f.jpg`
  - Zip : `17-norea/chocolat/8_72b97f9c-eeac-42a7-b25a-6464f3754105.jpg`
- COLOR TO PRESERVE : Chocolat (chocolate brown), échantillonné sur le packshot de référence sous lumière neutre ; ΔE ≤ 5.
- PRODUCT FEATURES TO PRESERVE : voir liste NOREA ci-dessus.

**IMAGE A PROMPT** → `lelon-norea-chocolat-porte-01.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 29, red hair tied back, freckles, wearing a cream knit, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in chocolate brown: horizontal square-ish flap bag, layered wrap-around front band, double silver zipper pulls in the center with long leather tabs, long thin shoulder handle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a contemporary gallery with pale concrete and large bare surfaces. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule (REF ivoire #1)
- CAMERA : full-frame, 50 mm, f/2.8, eye level, three-quarter body framing (mid-thigh to head), bag fully visible and sharp, bag ≥ 15% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : galerie / architecture contemporaine, béton clair, grandes surfaces nues
- MANNEQUIN : femme d’environ 29 ans, cheveux roux attachés, taches de rousseur
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-norea-chocolat-porte-01.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOREA — Chocolat — Porté 01 » · alt descriptif « Sac NOREA chocolat LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE B PROMPT** → `lelon-norea-chocolat-porte-02.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 42, ash-blond bob, fair skin, wearing a cream knit, white shirt and light jeans, worn on the shoulder, profile view. The bag is exactly the product shown in the reference images, in chocolate brown: horizontal square-ish flap bag, layered wrap-around front band, double silver zipper pulls in the center with long leather tabs, long thin shoulder handle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: pale limestone outdoors, a stone staircase or wall in soft low sunlight. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, angle profil (même porté, autre angle)
- CAMERA : full-frame, 85 mm, f/2.8, waist-level framing focused on the bag and the hand/shoulder, bag ≥ 25% of the frame
- COMPOSITION : sac entier, net, non masqué par la main ou les cheveux ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce
- MANNEQUIN : femme d’environ 42 ans, carré blond cendré, teint clair
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-norea-chocolat-porte-02.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOREA — Chocolat — Porté 02 » · alt descriptif « Sac NOREA chocolat LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

**IMAGE C PROMPT** → `lelon-norea-chocolat-lifestyle-03.jpg`

```
Editorial fashion photograph for a French women's bag brand, warm minimal Parisian style. A woman about 33, curly brown hair, dark skin, wearing a cream knit, white shirt and light jeans, worn on the shoulder. The bag is exactly the product shown in the reference images, in chocolate brown: horizontal square-ish flap bag, layered wrap-around front band, double silver zipper pulls in the center with long leather tabs, long thin shoulder handle. Do not change its shape, proportions, handles, strap, hardware, stitching or color. Setting: a calm European street with pale stone facades, no readable signs. Soft natural daylight around 5000 K, gentle shadows, true-to-life colors, subtle film grain, natural relaxed pose. Camera: full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame. Portrait 4:5.
```
- CARRY MODE : porté épaule, scène architecture
- CAMERA : full-frame, 35 mm, f/4, environmental framing, the person in context, bag clearly visible and sharp, bag ≥ 10% of the frame
- COMPOSITION : scène lisible, sac net au tiers de l’image ; recadrage 4:5
- LIGHTING : lumière du jour douce ~5000 K, ombres légères, pas de flash, grain fin
- ENVIRONMENT : rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible
- MANNEQUIN : femme d’environ 33 ans, cheveux bouclés bruns, peau foncée
- NEGATIVE CONSTRAINTS : contraintes communes + aucune spécifique
- EXPECTED OUTPUT : `lelon-norea-chocolat-lifestyle-03.jpg` 1600 × 2000 JPEG sRGB · alt Shopify « LELON NOREA — Chocolat — Porté 03 » · alt descriptif « Sac NOREA chocolat LELON porté à l’épaule »
- QA CHECKLIST : checklist commune (12 points) + comparaison côte à côte avec les références listées

