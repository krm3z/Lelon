# LELON — Audit photographique produit

Sources auditées :
- **Zip fourni** `LELON-Images.zip` : 98 photos, 17 modèles, classées par coloris. Toutes examinées visuellement (planches contact).
- **Shopify** : nombre de médias par produit et textes alternatifs (Admin API). Les fichiers du CDN Shopify
  n'étaient **pas consultables visuellement** depuis cet environnement (réseau bloqué) : les 4 visuels
  « portés » `lelon-*-02-mannequin.png` utilisés sur l'accueil n'ont donc **pas pu être contrôlés** (fidélité au
  produit, mains, déformations). À vérifier par vos soins avant publication.

## Génération d'images

**ACTION NON EXÉCUTÉE**
- **Raison** : aucun outil de génération d'images n'est disponible dans cet environnement.
- **Nécessaire pour l'exécuter** : un outil de génération d'images avec référence produit (image-to-image),
  puis contrôle humain de fidélité (silhouette, attaches, coutures, fermetures, couleur) avant tout usage.
  Recommandation : pour un sac vendu, privilégier une **vraie séance photo** (porté, intérieur, capacité) —
  la génération ne peut pas documenter honnêtement un intérieur ou une capacité.

## Galerie cible (rappel)

01 porté hero · 02 packshot face · 03 porté (main/épaule/bandoulière selon le modèle) · 04 profil/dos ·
05 macro · 06 intérieur · 07 capacité (objets réellement testés) · 08 dimensions (schéma généré par le thème à
partir des metafields) · 09 lifestyle secondaire.

## Par produit

Légende : **Z** = photos du zip · **S** = médias Shopify.

| Produit | Existant | Conservé | Manquant | Généré | À photographier réellement |
|---|---|---|---|---|---|
| ÉLÉA | Z 4 · S 5 — 1 photo « main » par coloris, même décor (lit) | Les 4, cohérentes entre coloris | Packshot face, profil, porté épaule, intérieur | — | Porté épaule (hero), packshot fond neutre, intérieur |
| MIRA | Z 7 · S 6 — porté épaule/bandoulière, 1 composite de détails | Portés (#7, #8, #9), noir #5 | Packshot neutre, intérieur net | — | ⚠ Étiquette fournisseur « FASHION & … » visible : à rephotographier sans étiquette |
| NOVA | Z 6 · S 7 — packshots fond blanc (bordeaux, camel, noir) + chocolat en situation | Tous | Porté épaule, intérieur, macro suède | — | Porté, intérieur, macro texture |
| SOLÉA | Z 4 · S 3 — packshots + **infographies en anglais** (« Front/Side/Back », « Adjustable Strap », « Detachable Buckle ») | Packshots #2, #8 | Aucune photo portée | — | ⚠ Retirer ou traduire les infographies anglaises ; photo portée main/épaule |
| LYRA | Z 4 · S 3 — **infographies fournisseur** (« Bottom length 24CM », pictos « long wallet / ipad ») | Aucun en image principale sans vérification | Packshot propre, porté, intérieur | — | ⚠ Le foulard et la sangle « CLASSIC » visibles ne sont peut‑être pas fournis ; la capacité « ipad » annoncée n'est pas vérifiée → ne pas réutiliser |
| LUNA | Z 5 · S 5 — 5 photos en main | Toutes | Packshot, porté bandoulière, intérieur | — | ⚠ Les noms de fichiers « taupe-chocolat » portent le texte alternatif « Crème & Chocolat » (et inversement) : vérifier que chaque photo est rattachée à la bonne variante |
| ALYA | Z 7 · S 6 — lifestyle cohérent | Tous sauf #6 | Packshot, intérieur | — | ⚠ #6 : filigrane fournisseur « …om-design » visible |
| LILA | Z 6 · S 6 — main, bandoulière portée | Tous | Packshot, intérieur | — | Intérieur, capacité (micro‑sac : objets réels) |
| VERA | Z 8 · S 8 — portés (#6, #11), macros fermoir/sangle/tranche | Tous | **Coloris Rouge : aucune photo** | — | Photos Rouge M/L ; ⚠ voir risque de ressemblance ci‑dessous |
| NAYA | Z 5 · S 3 — portés « bleu » et « sable » (jaune) | Chocolat #4, Noir #2 | Ivoire (1 photo CJ seulement) | — | ⚠ Bleu et jaune ne sont **pas** des variantes Shopify (Chocolat/Noir/Ivoire) : ne pas les utiliser |
| AURÉA | Z 4 · S 2 — packshots homogènes sur décor beige | Tous | **Beige Sable sans image dans Shopify** (2 existent dans le zip) ; porté ; intérieur | — | Porté épaule ; ajouter Beige Sable (photos du zip) |
| ELARA | Z 5 · S 5 — studio avec modèle, qualité correcte | Tous | Intérieur, macro | — | Intérieur (poches annoncées) |
| ISAURE | Z 7 · S **1** (Noir) | — | **Cognac sans image dans Shopify** ; 5 photos cognac dans le zip | — | Ajouter les photos Cognac du zip ; ⚠ « blanc » n'est pas une variante ; visuel #18 avec texte « FASHION GIRL » |
| CÉLÈNE | Z 6 · S 6 — dont intérieur (#3) et porté (#1) | Tous | Macro | — | Macro fermeture |
| VÉLORA | Z 6 · S 4 — camel porté (#1, #2), packshots ivoire/noir | Tous | Intérieur | — | Intérieur, porté bandoulière |
| AMARA | Z 6 · S 6 — packshots 1600 px + intérieur (#3) | Tous | Aucune photo portée | — | Porté main/épaule |
| NOREA | Z 8 · S 4 — dont 5 **taupe** + intérieur taupe | Ivoire porté (#1), packshots | Intérieur dans un coloris vendu | — | ⚠ Taupe n'est pas une variante Shopify (Noir/Ivoire/Chocolat) ; #4 et #7 semblent identiques |

## Risque de marque à signaler

**VERA** (rabat rectangulaire, fermoir doré rectangulaire, sangle fine) présente une ressemblance forte avec un
modèle iconique d'une maison existante. Le brief demande de ne copier aucune maison : le thème ne met donc pas
VERA en avant sur l'accueil. Une vérification juridique (propriété intellectuelle / dessins et modèles) est
recommandée avant d'investir en publicité sur ce modèle.

## Intégration dans le thème

- Aucune image produit n'a été ajoutée, modifiée ou supprimée dans Shopify.
- Le thème lit les textes alternatifs « LELON X — Coloris — Vue n » pour **n'afficher que les photos du
  coloris sélectionné** : garder ce format lors des prochains ajouts.
- Metafield `lelon.lifestyle_media` (créé, vide) : y ajouter les photos portées **validées** ; la première
  s'affiche en grand sous la fiche produit.
