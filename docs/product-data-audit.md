# LELON — Audit des données produit

Lecture seule via l’Admin API, 23/09/2026. **Aucune donnée produit n’a été modifiée.** Chaque point à corriger
est une décision marchand (voir `BLOCKED_BY_MERCHANT.md`).

## 1. Vue d’ensemble

| Indicateur | Valeur |
|---|---|
| Produits | 17 (10 collection LELON, 7 Signature), tous `ACTIVE` et publiés |
| Variantes | **55** (VERA : 3 coloris × 2 formats = 6) |
| Prix | 35 € (8 modèles), 40 € (LYRA, VERA), 60 € (7 Signature) — aucun prix barré (`compareAtPrice` vide) |
| Stock | 0 partout, `DENY` → aucun produit achetable (voir `docs/inventory-cj-diagnostic.md`) |
| Vendeur | LELON (aucune mention fournisseur visible) |
| Catégorie produit Shopify (taxonomie) | **vide** sur les 17 produits |
| Metafields `lelon.*` créés pour le thème | 16 définitions, **0 valeur** (volontaire : rien de non vérifié) |
| Metafields existants | `lelon.launch_price_cents` et `lelon.pricing_tier` (17 produits) ; `shop.lelon.launch_campaign` désactivé |

## 2. Points relevés (tous produits)

| # | Constat | Impact | Proposition |
|---|---|---|---|
| D1 | Descriptions SEO coupées au milieu d’un mot sur 8 produits (ÉLÉA « contem », LILA, LUNA « collectio », MIRA « soupl », NAYA « naturel », NOVA « épu », SOLÉA « Port », VERA « e ») | Extrait Google peu soigné | Remplacer par une coupe à la fin d’une phrase (tableau §4), texte du marchand uniquement |
| D2 | Catégorie de taxonomie Shopify absente | Google Shopping / données structurées moins précises | Renseigner « Sacs à main » (ou sous-catégorie) dans chaque fiche |
| D3 | Type produit « Sac à main » pour les 7 Signature, dont AURÉA, ISAURE et NOREA décrits « À l’épaule » | Surtitre de fiche imprécis (le thème affiche le type) | Types plus justes : « Sac porté épaule », « Sac hobo », etc. |
| D4 | Dimensions publiées dans la description mais **ordre des axes non indiqué** et incohérent (ÉLÉA 26 × 14 × 5,5 ; AURÉA 33 × 6,5 × 18,5) | Impossible de remplir largeur / hauteur / profondeur sans supposition | Le marchand confirme L × H × P ; le composant Dimensions s’affiche dès que les metafields sont remplis |
| D5 | Longueurs de bandoulière (MIRA ~120 cm, LUNA ~112 cm) = longueur totale, pas la hauteur de porté | Le metafield `strap_drop_cm` (hauteur de bandoulière) ne doit pas recevoir ces valeurs | Mesurer la hauteur de porté réelle si on veut l’afficher |
| D6 | Matière des 7 Signature : « Cuir véritable selon les spécifications fournisseur » | Allégation de composition non vérifiée (prix de vente 60 €) | Preuve fournisseur ou contrôle d’un échantillon avant publication ; sinon retirer l’allégation |
| D7 | VERA : doublure « cuir synthétique » | En France le mot « cuir » est réservé aux matières d’origine animale (à faire confirmer par un juriste) | Formulation neutre, ex. « matière synthétique » |
| D8 | Variantes sans média associé : AURÉA Beige Sable, ISAURE Cognac, VERA Rouge M, VERA Rouge L | La fiche affiche un autre coloris (le thème DRAFT l’annonce honnêtement) | Ajouter les photos réelles (ISAURE Cognac et AURÉA Beige Sable existent dans le zip) |
| D9 | LUNA : photos probablement inversées entre Crème & Chocolat et Taupe & Chocolat (alt et variante) | La cliente voit la mauvaise couleur | Vérifier avec le SKU CJ puis corriger alt + média de variante |
| D10 | Médias hors format d’alt « LELON X — Coloris — Vue n » : 4 photos portées PNG, NAYA Ivoire, ISAURE Noir, VÉLORA Camel | Géré par le thème DRAFT (lecture du coloris dans l’alt) ; format homogène préférable | Harmoniser les alts |
| D11 | 4 photos portées PNG (ÉLÉA Cognac, NOVA Chocolat, SOLÉA Beige & Cognac, VÉLORA Ivoire) d’origine non documentée | Si ce sont des images générées : fidélité au sac non contrôlée | Contrôle humain (checklist `docs/generated-image-qa.md`) |
| D12 | Tags internes (`lelon-cj`, `lelon-source-review`, `lelon-qc-required`) | Invisibles dans le thème DRAFT ; visibles seulement si un filtre « tag » est activé dans Search & Discovery | Ne pas activer de filtre par tag |
| D13 | Phrase « Collection en préparation. Bientôt disponible. » dans les 17 descriptions | Retirée à l’affichage par le thème DRAFT (l’état réel est porté par le bouton) | À retirer des descriptions au lancement |
| D14 | Metafields de prix de lancement (`launch_price_cents` 30 / 35 / 50 €) et `duo_matrix` dans la campagne | Non utilisés par le thème DRAFT (campagne désactivée) : aucune fausse promotion affichée | Si une offre de lancement est décidée, elle doit passer par une vraie réduction Shopify |

## 3. Par produit

| Produit | Variantes | Prix | Dimensions publiées | Matière publiée | Porté publié | Médias (S) | Problèmes |
|---|---|---|---|---|---|---|---|
| ÉLÉA | Cognac, Noir, Ivoire, Sable | 35 € | ~26 × 14 × 5,5 cm (+ largeur haute ~21 cm) | PU, doublure polyester | Épaule | 5 | D1, D11 ; 1 photo par coloris |
| MIRA | Ivoire, Taupe, Noir | 35 € | 21 × 16 × 6 cm | PU | anse + bandoulière ~120 cm | 6 | D1, D5 ; étiquette fournisseur visible |
| NOVA | Chocolat, Bordeaux, Noir, Camel | 35 € | 38 × 25 × 16 cm | Effet suède, doublure polyester | — (tote) | 7 | D1, D11 |
| SOLÉA | Beige & Cognac, Beige & Noir | 35 € | — | Tressage aspect paille, doublure polyester-coton | Main ou épaule | 3 | D1, D11 ; infographies anglaises dans le zip |
| LYRA | Chocolat, Ivoire, Noir | 40 € | ~24 × 17,5 × 10,5 cm | PU, doublure polyester | Épaule ou bandoulière | 3 | infographies fournisseur ; foulard fourni ? |
| LUNA | Crème & Chocolat, Taupe & Chocolat, Noir | 35 € | 14 × 16 × 14 cm | PU, effet suède | Épaule ou bandoulière ~112 cm | 5 | D1, D5, **D9** |
| ALYA | Cognac, Ivoire, Noir | 35 € | — | PU, doublure polyester | Épaule ou bandoulière | 6 | filigrane fournisseur (photo noir #6 du zip) |
| LILA | Chocolat, Ivoire, Noir, Vert | 35 € | 11 × 11 × 7 cm | PU, doublure polyester | Main ou bandoulière | 6 | D1 |
| VERA | Caramel / Noir / Rouge × M / L | 40 € | — (ni M ni L) | PVC, doublure « synthétique / cuir synthétique » | — | 8 | D1, **D7**, **D8** (Rouge), dimensions M/L absentes, ressemblance à vérifier |
| NAYA | Chocolat, Noir, Ivoire | 35 € | — | PU, doublure polyester | Une bandoulière | 3 | D1, D10 ; bleu et jaune du zip non vendus |
| AURÉA | Noir, Taupe / Greige, Beige Sable | 60 € | 33 × 6,5 × 18,5 cm | « Cuir véritable selon fournisseur » | Épaule | 2 | D3, D4, **D6**, **D8** |
| ELARA | Cognac, Noir | 60 € | 27 × 16 × 23 cm | « Cuir véritable selon fournisseur » | Main, épaule, bandoulière | 5 | D4, D6 |
| ISAURE | Cognac, Noir | 60 € | 27 × 26 × 7 cm | « Cuir véritable selon fournisseur » | Une bandoulière | **1** | D3, D6, **D8** (Cognac), D10 |
| CÉLÈNE | Taupe, Noir, Ivoire, Cognac | 60 € | 30 × 13 × 22 cm | « Cuir véritable selon fournisseur » | Main, épaule, bandoulière | 6 | D6 |
| VÉLORA | Camel, Noir, Ivoire | 60 € | — | « Cuir véritable selon fournisseur » | Poignée, courte et longue bandoulière | 4 | D6, D10, D11 |
| AMARA | Ivoire, Sauge, Rose Poudré | 60 € | 24 × 14 × 19 cm (ouverture ~21 cm) | « Cuir véritable selon fournisseur » | Main, épaule, bandoulière | 6 | D6 |
| NOREA | Noir, Ivoire, Chocolat | 60 € | — | « Cuir véritable selon fournisseur » | Épaule (bandoulière à double articulation) | 4 | D3, D6 ; taupe du zip non vendu |

## 4. Descriptions SEO — proposition (coupe à la fin d’une phrase, texte du marchand)

| Produit | Actuelle (fin) | Proposée |
|---|---|---|
| ÉLÉA | « …lui donnent une allure contem » | ÉLÉA accompagne les journées avec simplicité et caractère. |
| MIRA | « …tandis que son anse soupl » | MIRA joue avec les textures et les courbes. |
| NOVA | « …Ses lignes épu » | Pensé pour les journées qui ne tiennent pas dans un petit sac. NOVA associe une silhouette généreuse à un toucher visuel doux et chaleureux. |
| SOLÉA | « …détails cognac et dorés. Port » | L’élégance des journées ensoleillées. SOLÉA associe une silhouette souple et féminine à un tressage lumineux, sublimé par des détails cognac et dorés. |
| LUNA | « …à la collectio » | Une silhouette douce pour les essentiels du quotidien. |
| LILA | « …ce micro-sac apporte une touche » | LILA mise sur la ligne plutôt que sur le volume. |
| VERA | « …un rabat aux courbes douces e » | Une silhouette classique, réveillée par un détail qui change tout. |
| NAYA | « …qui accompagne naturel » | La simplicité comme signature. |

Les propositions courtes (ÉLÉA, MIRA, LUNA, LILA, VERA, NAYA) peuvent être complétées par le marchand ; aucun texte n’a été inventé ici.

## 5. Metafields du thème — état et règle

Les 16 définitions `lelon.*` (dimensions, capacité, matière, doublure, structure, fermeture, intérieur, bandoulière,
porté, détails, entretien, description courte, photos portées) sont **vides**. Le thème DRAFT masque chaque composant
sans donnée. Les remplir uniquement avec des valeurs mesurées ou prouvées (D4, D5, D6).
