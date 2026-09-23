# LELON — Décisions marchand en attente

Rien de ce qui suit n’a été exécuté : chaque point touche au stock, à CJ, à l’expédition, au juridique, aux données
produit visibles sur le thème publié, ou engage une dépense. Classement : **P0** = avant publication · **P1** = juste
après · **P2** = plus tard.

---

## P0-1 · Rattacher les 54 variantes au stock CJ

- **QUESTION** : les variantes doivent-elles être stockées à l’emplacement `cjdropshipping` (stock synchronisé par CJ) ?
- **CONTEXTE** : 54 variantes sur 55 sont stockées à l’emplacement manuel du marchand ; seule ÉLÉA Cognac est à
  l’emplacement CJ. Le stock CJ ne peut donc pas remonter dans Shopify. Détail : `docs/inventory-cj-diagnostic.md`.
- **OPTIONS** : (a) connecter les produits dans l’app CJ et lancer la synchro du stock ; (b) garder l’emplacement manuel et
  saisir le stock à la main ; (c) mixte (stock physique chez le marchand + CJ).
- **RECOMMANDATION TECHNIQUE** : (a), puis contrôle d’une variante par modèle dans *Produits → Inventaire*.
- **RISQUE** : sans correction, la boutique reste à 0 stock ou affiche un stock non synchronisé avec le fournisseur.

## P0-2 · Profil d’expédition : l’emplacement manuel n’expédie nulle part

- **QUESTION** : faut-il ajouter l’emplacement manuel au profil d’expédition, ou tout faire partir de CJ ?
- **CONTEXTE** : le profil général ne contient que `cjdropshipping`. L’emplacement manuel est « non assigné » : aucune zone,
  aucun tarif. Si du stock y est ajouté, le paiement n’affichera **aucune livraison** pour ces articles.
- **OPTIONS** : (a) P0-1 (a) : tout est chez CJ, rien à changer ici ; (b) ajouter l’emplacement manuel au profil avec les
  mêmes tarifs France (0,99 € / offerte dès 90 €).
- **RECOMMANDATION TECHNIQUE** : décider P0-1 d’abord, puis commande test sur 1 variante par emplacement.
- **RISQUE** : paniers bloqués au paiement le jour du lancement.

## P0-3 · Date de mise en vente et état « Bientôt disponible »

- **QUESTION** : quand les produits deviennent-ils achetables ?
- **CONTEXTE** : 0 stock + `DENY` : le thème DRAFT affiche « Bientôt disponible » et désactive l’achat. Les 17 descriptions
  contiennent « Collection en préparation. Bientôt disponible. » (masqué à l’affichage par le DRAFT).
- **OPTIONS** : lancement immédiat après P0-1/P0-2, ou pré-lancement prolongé.
- **RECOMMANDATION TECHNIQUE** : au lancement, passer le réglage du thème « Pré-lancement » sur non et retirer la phrase
  des descriptions.
- **RISQUE** : aucun faux stock ni fausse urgence n’est affiché dans l’intervalle.

## P0-4 · Informations légales manquantes

- **QUESTION** : médiateur de la consommation, CGV complètes, politique de cookies ?
- **CONTEXTE** : aucun médiateur renseigné ; les CGV Shopify ne contiennent que la section 7 ; pas de politique de cookies.
  Le DRAFT affiche les politiques réelles et n’invente rien.
- **OPTIONS** : rédaction par le marchand / un juriste, ou générateur de CGV puis relecture.
- **RECOMMANDATION TECHNIQUE** : compléter dans *Paramètres → Politiques* ; les pages du DRAFT se mettent à jour seules.
- **RISQUE** : obligation légale pour la vente en ligne en France (médiation, informations précontractuelles).

## P0-5 · Allégations de matière

- **QUESTION** : le « cuir véritable » des 7 Signature est-il prouvé ? VERA peut-elle garder « cuir synthétique » ?
- **CONTEXTE** : les descriptions indiquent « Cuir véritable selon les spécifications fournisseur ». En France le terme « cuir »
  est encadré (réservé aux matières d’origine animale ; à faire confirmer par un juriste).
- **OPTIONS** : preuve fournisseur ou contrôle d’un échantillon ; sinon formulation neutre.
- **RECOMMANDATION TECHNIQUE** : ne rien afficher de plus que ce qui est prouvé ; les metafields `lelon.material` restent vides.
- **RISQUE** : pratique commerciale trompeuse, retours clientes.

## P0-6 · VERA : vérification juridique

- **QUESTION** : VERA peut-elle être vendue et mise en avant ?
- **CONTEXTE** : rabat rectangulaire, fermoir doré rectangulaire, fine bandoulière : ressemblance forte avec un modèle iconique
  d’une maison existante. Le DRAFT ne met pas VERA en avant sur l’accueil ; aucune photo portée générée n’est prévue avant avis.
- **OPTIONS** : avis juridique (dessins et modèles) ; retrait ; vente sans mise en avant.
- **RECOMMANDATION TECHNIQUE** : avis avant toute publicité.
- **RISQUE** : action en contrefaçon.

---

## P1-1 · LUNA : photos inversées entre deux coloris

- **QUESTION** : les photos « Vue 4/5 » (corps taupe) sont-elles bien Crème & Chocolat ?
- **CONTEXTE** : visuellement, « Vue 4/5 » (alt et média de la variante Crème & Chocolat) montrent un corps taupe, « Vue 1/2 »
  (Taupe & Chocolat) un corps crème. Les noms de fichiers disent l’inverse des alts.
- **OPTIONS** : vérifier avec les SKU CJ (CJNS105155204DW / CJNS105155201AZ) puis corriger alt + média de variante.
- **RECOMMANDATION TECHNIQUE** : corriger dans Shopify (modifie aussi le thème publié, d’où la validation).
- **RISQUE** : la cliente reçoit une autre couleur que celle vue.

## P1-2 · Photos réelles manquantes dans Shopify

- **QUESTION** : ajouter les photos existantes ?
- **CONTEXTE** : ISAURE Cognac (5 photos dans le zip, 0 dans Shopify) ; AURÉA Beige Sable (2 photos de tons différents dans le
  zip — laquelle est juste ?) ; VERA Rouge M/L (aucune photo nulle part).
- **OPTIONS** : ajout aux médias produit avec alt « LELON X — Coloris — Vue n » + média de variante.
- **RECOMMANDATION TECHNIQUE** : le DRAFT affiche automatiquement les bonnes photos grâce au format d’alt.
- **RISQUE** : aujourd’hui ces coloris montrent un autre coloris (le DRAFT l’indique clairement à la cliente).

## P1-3 · Éléments fournisseur sur les photos

- **QUESTION** : l’étiquette « FASHION & … » de MIRA, le foulard et la sangle « CLASSIC » de LYRA sont-ils livrés ?
- **CONTEXTE** : visibles sur les références ; ALYA noir #6 porte un filigrane ; SOLÉA et LYRA ont des infographies
  fournisseur (texte anglais, pictos « ipad » non vérifiés).
- **OPTIONS** : rephotographier ; ou confirmer que ces éléments sont livrés.
- **RECOMMANDATION TECHNIQUE** : les photos portées de MIRA et LYRA restent en `BLOCKED_BY_MERCHANT` dans la matrice tant que ce
  n’est pas tranché.
- **RISQUE** : image « catalogue fournisseur », produit reçu différent de la photo.

## P1-4 · Quatre photos portées déjà en ligne, non contrôlées

- **QUESTION** : d’où viennent `lelon-elea-cognac-02-mannequin.png`, `lelon-nova-chocolat-02-mannequin.png`,
  `lelon-solea-beige-cognac-02-mannequin.png`, `lelon-velora-ivoire-02-mannequin.png` ?
- **CONTEXTE** : 1122 × 1402 px, dans les médias produit (donc aussi sur le thème publié), non consultables depuis
  l’environnement de travail.
- **OPTIONS** : contrôle avec la checklist `docs/generated-image-qa.md` ; retrait si le sac n’est pas fidèle.
- **RECOMMANDATION TECHNIQUE** : si ce sont des images générées, ne jamais les légender comme une cliente.
- **RISQUE** : sac représenté différent du produit réel.

## P1-5 · Générateur d’images pour les photos portées

- **QUESTION** : quel outil utiliser (dépense) ?
- **CONTEXTE** : aucun générateur disponible pendant la nuit. Le batch (157 visuels) est prêt :
  `docs/image-generation-batch.md` + `tools/image-batch/batch.json`.
- **OPTIONS** : outil avec **image de référence / inpainting autour du sac détouré** (recommandé) ; séance photo réelle (meilleure
  fidélité, et seule solution pour intérieur, capacité, VERA Rouge).
- **RECOMMANDATION TECHNIQUE** : commencer par ÉLÉA (4 coloris, références homogènes), valider la méthode, puis étendre.
- **RISQUE** : sac réinventé si le générateur ne conserve pas le produit réel.

## P1-6 · Dimensions et metafields

- **QUESTION** : quel est l’ordre des axes des dimensions publiées (L × H × P) ?
- **CONTEXTE** : ÉLÉA « 26 × 14 × 5,5 », AURÉA « 33 × 6,5 × 18,5 » : ordre incohérent. Longueurs de bandoulière MIRA/LUNA =
  longueur totale, pas hauteur de porté.
- **OPTIONS** : mesurer chaque modèle ; ou confirmer l’ordre avec CJ.
- **RECOMMANDATION TECHNIQUE** : remplir `lelon.width_cm` / `height_cm` / `depth_cm` → le schéma Dimensions s’affiche.
- **RISQUE** : dimensions fausses = retours.

## P1-7 · Tarif 0,99 € visible au-delà de 90 €

- **QUESTION** : masquer le tarif 0,99 € quand la livraison est offerte ?
- **CONTEXTE** : deux tarifs « France » ; le payant n’a pas de plafond.
- **OPTIONS** : condition « prix du panier < 90 € » sur le tarif 0,99 €.
- **RECOMMANDATION TECHNIQUE** : oui, pour un checkout plus clair.
- **RISQUE** : faible (la cliente peut choisir le tarif gratuit), mais confusion.

## P1-8 · SEO produit, catégories, types

- **QUESTION** : appliquer les descriptions SEO proposées et renseigner catégorie + type ?
- **CONTEXTE** : 8 descriptions SEO coupées au milieu d’un mot ; catégorie Shopify vide ; « Sac à main » pour des sacs d’épaule.
  Propositions dans `docs/product-data-audit.md` §4.
- **OPTIONS** : appliquer telles quelles ou réécrire.
- **RECOMMANDATION TECHNIQUE** : appliquer (texte du marchand, coupé proprement).
- **RISQUE** : faible.

## P1-9 · Offre de lancement

- **QUESTION** : y aura-t-il une offre de lancement (metafields `launch_price_cents`, `duo_matrix`) ?
- **CONTEXTE** : la campagne est désactivée ; le DRAFT n’affiche aucun prix de lancement ni prix barré.
- **OPTIONS** : vraie réduction Shopify (automatique ou code) ; ou suppression des metafields.
- **RECOMMANDATION TECHNIQUE** : une vraie réduction, affichée par Shopify au panier ; jamais de prix barré fictif.
- **RISQUE** : fausse promotion si un prix barré était affiché sans prix de référence réel.

---

## P2-1 · Supprimer les 21 fichiers obsolètes du DRAFT

- **CONTEXTE** : neutralisés (contenu vide), non référencés. La suppression par API est bloquée par la politique de sécurité
  de l’outil. Liste dans `docs/RAPPORT-FINAL.md`.
- **RECOMMANDATION TECHNIQUE** : *Boutique en ligne → Thèmes → DRAFT → Modifier le code* → supprimer. Sans risque.

## P2-2 · Parrainage

- **CONTEXTE** : architecture prête et inactive (`docs/parrainage-architecture.md`) ; nécessite une app ou un back-end (coût).
- **RECOMMANDATION TECHNIQUE** : choisir la solution avant d’activer le réglage du thème.

## P2-3 · Droits sur les photos fournisseur

- **CONTEXTE** : la plupart des photos proviennent du fournisseur (CJ).
- **RECOMMANDATION TECHNIQUE** : vérifier que l’usage commercial est autorisé ; remplacer progressivement par des photos LELON.

## Publication

Le thème **« LELON — Refonte 2026 — DRAFT »** (id `205057753422`) n’est pas publié. La publication reste une décision du
marchand, après P0-1 à P0-6.
