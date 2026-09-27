# LELON — Refonte 2026 · Rapport final

Date : 23 septembre 2026 · Boutique : `f113wf-dq.myshopify.com` (lelon.fr)
Thème de travail : **« LELON — Refonte 2026 — DRAFT »** · id `205057753422` · **NON PUBLIÉ**
Prévisualisation : `https://lelon.fr/?preview_theme_id=205057753422`

> **Limite importante de cet environnement.** Le site public (lelon.fr, myshopify.com, cdn.shopify.com) est
> bloqué par la politique réseau : **je n'ai pas pu naviguer visuellement sur le site en ligne ni sur la
> prévisualisation du brouillon.** L'audit s'appuie sur le **code source réel du thème publié** et les
> **données réelles** de la boutique (Admin API), et les tests de rendu ont été faits sur un banc local
> (Liquid + vraies données produit + Chromium). Une relecture visuelle de la prévisualisation par vos soins
> reste nécessaire avant publication (voir P0).

---

## PARTIE 1 — ÉTAT INITIAL

Thème publié : « LELON — Cinématique · correctif accueil » (sur mesure). Un second thème non publié,
« Cinématique · finitions », est une copie identique au fichier près (sommes MD5 comparées).

Ce que LELON réussissait déjà :
- **Identité** : mot‑marque LELON en Cormorant, palette crème / ivoire / chocolat / rose poudré, champagne discret.
- **Territoire éditorial** : « Chaque femme possède sa propre manière de s'épanouir », la rose, « L'allure en fleur ».
- **Honnêteté produit** : prix issus de Shopify, aucun avis ni faux compteur, campagne de lancement verrouillée côté serveur.
- **Bases techniques saines** : dialogs natifs, API Customer Privacy de Shopify, recherche prédictive, Section Rendering API.
- **Descriptions produit** structurées (intro + liste « Les détails »), meta titles et descriptions renseignés pour les 17 produits.
- **Politiques Shopify complètes** : confidentialité, retours, expédition, mentions légales, conditions d'utilisation.

## PARTIE 2 — PROBLÈMES TROUVÉS

| # | Problème | Pourquoi ça coûte une vente | Correction | Priorité |
|---|---|---|---|---|
| 1 | **Les 17 produits ont un stock à 0 avec la politique DENY** : rien n'est achetable | Aucune commande possible | Hors thème : stock ou synchronisation CJ (**non modifié**, votre validation est requise) | **CRITIQUE** |
| 2 | Mode `prelaunch` forcé : bouton désactivé et paiement fermé même si une variante devenait disponible | Ventes bloquées au lancement | Le CTA suit désormais la disponibilité réelle de la variante | CRITIQUE |
| 3 | Le footer pointait vers des pages `/pages/…` qui affichent « À compléter et valider avant l'ouverture des ventes » (CGV, mentions légales, confidentialité, cookies, rétractation) | Perte de confiance, non-conformité apparente | Ces pages affichent maintenant vos **vraies politiques Shopify** | CRITIQUE |
| 4 | Le corps des **CGV** (politique « Conditions générales de vente ») ne contient que la section « 7. Livraison » | CGV incomplètes : risque légal | **Non modifié**, donnée légale (voir P0) | CRITIQUE |
| 5 | **Médiateur de la consommation** : « À COMPLÉTER APRÈS ADHÉSION » | Obligation légale non remplie | **Non inventé** (voir P0) | CRITIQUE |
| 6 | Politique de cookies inexistante (la page contient un texte d'attente) | Consentement non documenté | Signalé ; bouton « Gérer mes cookies » ajouté sur la page | HAUTE |
| 7 | Les politiques contiennent des marqueurs Markdown bruts (`# …`, `**…**`, `- …`) affichés tels quels | Rendu peu professionnel | Nettoyage **à l'affichage** dans le thème ; le texte n'est pas modifié | HAUTE |
| 8 | three.js/WebGL (549 Ko) + GSAP (138 Ko) pour une rose et des fondus ; ouverture de 4,8 s | LCP et INP dégradés sur mobile, pubs moins rentables | Supprimés : CSS + IntersectionObserver ; ouverture de 4 s | HAUTE |
| 9 | Hero avec 3 CTA (collection, Signature, « Revoir l'éclosion ») et 3 photos | Dilution du message pour le trafic TikTok/Meta | Un seul CTA, une photo, produit et prix visibles | HAUTE |
| 10 | Page Livraison & retours et FAQ vides (« à compléter ») | Questions sans réponse avant achat | Remplies **uniquement** avec vos politiques et réglages vérifiés | HAUTE |
| 11 | Descriptions produit contenant « Collection en préparation. Bientôt disponible. » en dur | Contradiction dès la mise en stock | Phrase masquée à l'affichage ; à retirer des fiches (P0) | MOYENNE |
| 12 | Galerie : pas de filtre par coloris, pas de swipe mobile dédié | Confusion sur la couleur achetée | Galerie filtrée par coloris, swipe natif | MOYENNE |
| 13 | CSS de 66 Ko empilant des correctifs (`.header` défini 3 fois) | Maintenance fragile | Feuille unique et propre, 56 Ko | MOYENNE |
| 14 | Newsletter désactivée | Pas de capture d'audience avant lancement | Formulaire actif, consentement explicite, jamais précoché | MOYENNE |
| 15 | Photos : infographies en anglais (SOLÉA, LYRA), étiquette ou filigrane fournisseur (MIRA, ALYA), coloris affichés mais non vendus (NAYA, NOREA, ISAURE), variantes sans photo | Effet catalogue de dropshipping, erreurs de couleur | Voir `docs/photographie.md` | HAUTE |
| 16 | VERA ressemble fortement à un modèle iconique d'une maison existante | Risque juridique et d'image | Non mis en avant ; vérification recommandée | MOYENNE |

## PARTIE 3 — MODIFICATIONS EFFECTUÉES

**Dans Shopify (vérifié par relecture API)**
- Thème **dupliqué** → « LELON — Refonte 2026 — DRAFT » (`205057753422`), statut UNPUBLISHED. Thème publié **non modifié** (`updatedAt` inchangé au 22/09 21:56).
- 82 fichiers écrits sur le brouillon ; **sommes MD5 comparées fichier par fichier** avec le dépôt (identiques, hors `settings_data.json` que Shopify réécrit).
- 21 fichiers obsolètes neutralisés (vidés) : l'outil refuse toute suppression de fichier de thème. **Suppression à faire dans l'admin** (liste ci-dessous).
- **16 définitions de metafields produit créées, toutes vides** (namespace `lelon`) : `width_cm`, `height_cm`, `depth_cm`, `strap_drop_cm`, `capacity`, `material`, `lining`, `structure`, `closure`, `interior`, `strap`, `carry`, `details`, `care`, `short_description`, `lifestyle_media`. **Aucune valeur n'a été remplie.**
- **Rien n'a été modifié** en prix, stocks, produits, variantes, SKU, images produit, collections, menus, pages, politiques, CJ, paiements, domaine ou clients.

**Fichiers du thème** (dépôt `theme/`)
- Layout : `theme.liquid`, `password.liquid`
- Sections (33) : `lelon-header`, `lelon-footer`, `lelon-cart-drawer`, `lelon-hero`, `lelon-featured-collection`, `lelon-lifestyle`, `lelon-image-text`, `lelon-featured-product`, `lelon-detail-mosaic`, `lelon-philosophy`, `lelon-signature`, `lelon-triptych`, `lelon-journal`, `lelon-reassurance`, `lelon-newsletter`, `lelon-main-product`, `lelon-product-lifestyle`, `lelon-product-recommendations`, `lelon-main-collection`, `lelon-main-cart`, `lelon-main-search`, `predictive-search`, `lelon-story`, `lelon-contact`, `lelon-faq`, `lelon-shipping-returns`, `lelon-policy`, `lelon-main-page`, `lelon-account`, `lelon-referral`, `lelon-landing-product`, `lelon-404`, `lelon-password`
- Snippets (21) : cartes, prix, pastilles, galerie, médias, sélecteur de variantes, bouton d'achat, spécifications, dimensions, lignes du panier, livraison offerte, menu, recherche, consentement, ouverture, pagination, politiques, SEO, schema.org, icônes, JSON produit
- Templates (19) : `index`, `product`, `collection`, `cart`, `search`, `404`, `password`, `page`, `page.contact`, `page.faq`, `page.notre-histoire`, `page.livraison-retours`, `page.conditions-generales-de-vente`, `page.mentions-legales`, `page.politique-de-confidentialite`, `page.droit-de-retractation`, `page.politique-de-cookies`, `page.account`, **`page.landing`** (nouveau)
- Assets : `lelon.css`, `lelon.js` (nouveaux) ; polices et rose conservées à l'identique
- Réglages : `settings_schema.json` (palette, disponibilité, livraison, liens, ouverture, parrainage), locales `fr.json` et `en.default.json`

**Fichiers obsolètes à supprimer dans l'admin** (Boutique en ligne › Thèmes › DRAFT › Modifier le code) :
`assets/lelon-grain.svg`, `assets/lelon-motion-UHJ6RLMC.js` (+ `.LEGAL.txt`), `assets/lelon-scene-4ERBD53O.js` (+ `.LEGAL.txt`), `assets/lelon-storefront.js`, `assets/lelon-theme.css`, `sections/lelon-collection|lelon-duo|lelon-feature-story|lelon-legal-page|lelon-lookbook|lelon-maison|lelon-quick-product.liquid`, `snippets/lelon-campaign-state|lelon-cart-content|lelon-config|lelon-countdown|lelon-dialogs|lelon-duo|lelon-product-detail.liquid`.

## PARTIE 4 — HOMEPAGE

Structure finale : chaque section est configurable dans le Theme Editor, et les produits comme les prix viennent de Shopify.

0. **Ouverture « Éclosion »** : rose, mot LELON, phrase ; boutons DÉCOUVRIR et PASSER ; 4 s maximum, une fois par session, désactivée si l'appareil demande moins d'animations.
1. **Hero** : « L'élégance / dans chaque détail. » avec un seul CTA « Découvrir la collection », photo portée d'ÉLÉA, nom et prix réels.
2. **Notre collection** : ÉLÉA, NOVA, LUNA (produits choisis, sinon la collection).
3. **Respiration** : grande photo portée, sans texte.
4. **Récit éditorial** : « Des histoires à porter. »
5. **Produit phare** : VÉLORA, réglable dans l'éditeur.
6. **Détails** : mosaïque Porté / Texture / Détail / Silhouette / Intérieur, à partir de photos produit réelles.
7. **Philosophie** : « Chaque femme possède sa propre manière de s'épanouir. »
8. **Signature** : surface chocolat, « LELON Signature — Une autre expression. », AMARA, CÉLÈNE, NOREA.
9. **L'art de s'épanouir** : Libre / Confidente / Elle-même.
10. **LELON — Journal** : « Suivez notre univers. », avec la mention « pas un flux Instagram en direct ».
11. **Réassurance** : livraison France à 0,99 € et offerte dès 90 €, suivi, 14 jours de rétractation, contact.
12. **Newsletter** : « Entrez dans l'univers LELON. »
13. **Footer** : Maison / Aide / Informations légales, « Gérer mes cookies », réseaux réels, moyens de paiement Shopify.

## PARTIE 5 — PRODUCT PAGE

- Desktop : **miniatures à gauche**, **grande galerie au centre**, **informations en sticky à droite**. Mobile : galerie en swipe (scroll-snap), compteur et flèches, informations juste en dessous.
- Ordre des blocs (réordonnables dans l'éditeur) : fil d'Ariane, surtitre (LELON / Signature + type), **nom**, **prix Shopify**, **description courte** (metafield, sinon meta description), **coloris** (pastilles) puis **autres options** (ex. format M/L pour VERA), **disponibilité réelle**, **CTA**, réassurance, puis les accordéons **Description**, **Détails & matières**, **Dimensions**, **Ce qu'il peut accueillir**, **Livraison & retours**, **Entretien**, et enfin le bandeau **Porté** et les **recommandations** Shopify.
- **CTA** : « Ajouter au panier » uniquement si la variante est disponible ; sinon « Bientôt disponible » (mode pré-lancement) ou « Épuisé », bouton désactivé. Mise à jour instantanée au changement de variante, URL `?variant=`, barre d'achat collante sur mobile affichée seulement quand l'achat est possible.
- **Galerie** : n'affiche que les photos du coloris sélectionné, d'après les textes alternatifs « LELON X — Coloris — Vue n ».
- **Dimensions** : schéma **proportionnel** aux mesures réelles. Composant masqué tant que les metafields sont vides : aucune valeur n'est estimée.
- Paiement accéléré : désactivé par défaut, affiché uniquement si la variante est achetable.
- Données structurées : `product | structured_data` (Shopify) + BreadcrumbList. Aucune note ni avis.

## PARTIE 6 — MOBILE

Testé en **375, 390, 430 et 768 px** (et 1440 px) sur 14 pages : **0 débordement horizontal** et **0 violation axe-core WCAG 2.1 AA** sur les 70 combinaisons.
- Header de 60 px, logo 35 px identique au live, menu en tiroir (dialog natif), cibles tactiles ≥ 44 px (vérifié).
- Hero plein écran avec texte lisible sur dégradé, CTA visible au premier écran.
- Carrousels « Collection » et « Signature » en swipe horizontal ; grille collection sur 2 colonnes.
- Fiche produit : galerie pleine largeur, pastilles de 44 px, barre d'achat collante (safe-area iOS).
- Tiroir panier plein écran, CTA en bas ; bandeau cookies qui défile si l'écran est court.
- Champs de formulaire en 16 px (pas de zoom iOS), téléphone facultatif.

## PARTIE 7 — CONVERSION

- Le blocage artificiel du pré-lancement est levé : **dès qu'un stock existe, la vente s'ouvre sans toucher au thème.**
- Pour le trafic publicitaire, on comprend en quelques secondes : produit porté, marque, prix réel, coloris (pastilles et compteur), et un seul chemin vers l'achat.
- Réassurance factuelle aux trois moments clés (fiche, panier, accueil) : livraison à 0,99 € et offerte dès 90 €, délai de 3 à 10 jours ouvrables, suivi, 14 jours de rétractation, frais de retour annoncés honnêtement.
- Indication factuelle de livraison offerte dans le panier (« Plus que X € »), sans compte à rebours.
- **Landing pages publicitaires** : template `page.landing` (hero porté, produit, variantes, CTA, détails, réassurance, autres sacs). Pour TikTok → LUNA : créer une page « luna » et lui assigner le modèle « landing ». Aucune fiche produit n'est modifiée.
- Supprimé : faux sentiment de rareté, compteurs, promotions. Rien d'inventé.

## PARTIE 8 — BRAND

- **Logo inchangé** : mot LELON en Cormorant, interlettrage 0,04 em, 42 px sur desktop et 35 px sur mobile, repris exactement du CSS live.
- Palette respectée (Ivory, Cream, Powder, Chocolate, Ink, Champagne en accent rare, Beige, Taupe), exposée dans les réglages du thème.
- Signature traitée comme une évolution de LELON : surface chocolat, « Signature » en italique rose poudré, rythme plus lent. Ni noir, ni or.
- Mouvement doux : apparition en fondu, masque d'image avec léger zoom de 1,04 à 1, pas de rebond ni de scroll hijacking. Bouton « Réduire les animations » et respect de `prefers-reduced-motion`.
- Rose LELON conservée (ouverture, philosophie).

## PARTIE 9 — PHOTOGRAPHIE

Détail complet produit par produit : **`docs/photographie.md`** (existant / conservé / manquant / généré / à photographier).
- **Généré : aucun.** ACTION NON EXÉCUTÉE. Raison : aucun outil de génération d'images disponible ici. Nécessaire : un outil image-to-image avec contrôle humain de fidélité, et de préférence une vraie séance photo.
- Les 4 visuels portés `*-02-mannequin.png` utilisés sur l'accueil (déjà en ligne) **n'ont pas pu être contrôlés visuellement** (CDN bloqué). À vérifier.

## PARTIE 10 — CART / CHECKOUT

- Tiroir panier : image, nom, variante, quantité (− / +), prix de ligne, retrait, sous-total, réductions Shopify, « Plus que X € pour la livraison offerte ». CTA **COMMANDER** (vers le checkout Shopify) et **VOIR LE PANIER**. Aucun upsell, aucun produit ajouté automatiquement.
- Page panier : fonctionne **sans JavaScript** (formulaire natif, liens de retrait), mise à jour automatique des quantités.
- Checkout : **Shopify Checkout natif, non modifié.** Le passage au checkout se fait par le formulaire standard `name="checkout"`. Le paiement réel n'a pas été testé (aucun produit achetable ; stock à 0).
- Bug corrigé pendant les tests : `form.id` était écrasé par `<select name="id">` (DOM clobbering), ce qui aurait cassé l'ajout au panier.

## PARTIE 11 — ACCOUNT / REFERRAL

- Les comptes clients sont les **nouveaux comptes Shopify** (`account.lelon.fr`, menu Commandes / Profil). Ils ne sont **pas personnalisables par le thème**.
- Ajouté : template `page.account`, un espace LELON (commandes, profil, retours, connexion) à relier dans un menu si souhaité.
- **Parrainage** : architecture complète dans `docs/parrainage-architecture.md`. La section `lelon-referral` est **désactivée** par défaut et n'affiche que les données écrites par un service serveur (metafields client `lelon.referral_code` et `lelon.referral_summary`) : lien personnel, copie, partage, invitations, récompenses, « Votre invitation a fleuri. ». Aucune logique simulée en Liquid.
- Prochaines étapes backend : choisir une app ou une custom app, route `/r/:code`, webhooks de commande, antifraude côté serveur (l'IP n'est qu'un signal parmi d'autres), récompense configurable, extension Customer Account UI.

## PARTIE 12 — LEGAL / PRIVACY

Vérifié dans Shopify (Admin API, politiques publiées) :
- ✅ Mentions légales : éditeur, adresse, SIREN/SIRET, e-mail, téléphone, directeur de publication, hébergeur.
- ✅ Politique de confidentialité détaillée (RGPD, CNIL, droits).
- ✅ Retours et remboursement (14 jours, frais de retour à la charge du client en cas de changement d'avis, délai de remboursement).
- ✅ Expédition : France, 0,99 €, offerte dès 90 €, 3 à 10 jours ouvrables, suivi. **Cohérent avec le profil de livraison Shopify.**
- ❌ **Médiateur de la consommation non désigné** (« À COMPLÉTER APRÈS ADHÉSION »). Obligation légale : **à renseigner par vous.**
- ❌ **CGV incomplètes** : la politique ne contient que la section 7. De plus, la politique de retour renvoie à un « formulaire type de rétractation disponible dans nos CGV », qui est donc absent.
- ❌ **Politique de cookies absente** (la page affiche un texte d'attente) : liste des traceurs réellement actifs à rédiger.
- ⚠ Marqueurs Markdown bruts dans les politiques : le thème les nettoie à l'affichage, mais les pages `/policies/…` générées par Shopify les montrent encore. À re-saisir avec l'éditeur de texte riche.
- ⚠ Les pages Shopify « FAQ » et « Livraison & retours » contiennent un texte d'attente ; les nouveaux templates ne l'affichent plus.
- Cookies : bandeau avec **Tout accepter / Tout refuser / Personnaliser** de même poids visuel, aucune case précochée, préférences rouvrables (« Gérer mes cookies »), branché sur l'API Customer Privacy de Shopify. Vérifiez aussi la bannière de confidentialité de Shopify (Réglages › Confidentialité des clients) pour éviter un doublon.

## PARTIE 13 — TECHNICAL

- **Performance** : environ 687 Ko de JS tiers supprimés (three.js + GSAP), JS maison de 27 Ko en module différé, CSS de 56 Ko. Polices préchargées avec `font-display: swap`. Image LCP (hero, première photo de galerie) en `eager` avec `fetchpriority=high`, le reste en lazy. `srcset` et `sizes` partout via `image_url`/`image_tag`. Animations limitées à `transform` et `opacity`.
- **SEO** : titres et descriptions, canonical, Open Graph et Twitter, un seul H1 par page (titre du hero sur l'accueil), Organization + WebSite + SearchAction, Product (généré par Shopify, sans avis), BreadcrumbList. Titres de pagination distincts.
- **Accessibilité** : lien d'évitement, focus visible, dialogs natifs (focus piégé, Échap, retour du focus), combobox de recherche au clavier (`aria-activedescendant`), `aria-expanded`, `aria-current`, région live pour le panier, labels partout, cibles ≥ 44 px, `prefers-reduced-motion`. Résultat : **0 violation axe-core WCAG 2.1 AA** sur 70 combinaisons page × largeur.
- **Architecture Shopify OS 2.0** : templates JSON, sections avec blocs et presets, réglages globaux, metafields ; aucun prix ni produit codé en dur ; fonctionne sans JavaScript (formulaires natifs, `select` de variante en repli).
- **Theme Check** officiel de Shopify : **0 erreur, 0 avertissement.**

## PARTIE 14 — QA

Testé réellement :
- Theme Check : 0 remarque.
- Validation Liquid par Shopify à l'envoi (82 fichiers acceptés). Elle a révélé et permis de corriger une erreur de syntaxe (accolade dans une chaîne, snippet schema.org).
- Banc de rendu local (liquidjs avec shims Shopify, **vraies données** des 17 produits, vos photos) plus Chromium :
  - 14 pages × 5 largeurs : 0 débordement, 0 violation axe, 0 erreur JS.
  - 31 tests d'interaction réussis : CTA selon disponibilité ; changement de variante (URL, prix, galerie filtrée, état) ; combinaison indisponible désactivée ; ajout au panier et ouverture du tiroir ; Échap et retour du focus ; barre collante ; menu mobile (`aria-expanded`, cibles tactiles) ; recherche prédictive (résultats, flèches du clavier, état « aucun résultat ») ; bandeau cookies (visible à la première visite, boutons de même poids, rien de précoché) ; ouverture (≤ 4,5 s, pas rejouée, ignorée en mouvement réduit).
  - Composant Dimensions testé avec des valeurs **injectées dans le banc uniquement** (rien dans la boutique).
- Intégrité : MD5 du brouillon comparés au dépôt ; thème live contrôlé comme non modifié.

**Non testé (et pourquoi)** : rendu réel sur Shopify et navigation sur la prévisualisation (réseau bloqué), checkout et paiement (aucun stock), comptes clients réels, bannière de confidentialité native de Shopify, applications tierces éventuelles.

Outils rejouables : `tools/qa/` (voir le README).

## PARTIE 15 — PRIORITÉS RESTANTES

**P0 — AVANT LANCEMENT**
1. Ouvrir la prévisualisation `?preview_theme_id=205057753422` sur mobile et desktop, et relire chaque page.
2. **Stock** : le rendre réel (synchronisation CJ ou saisie). Aujourd'hui, 0 unité partout.
3. **Médiateur de la consommation** : adhérer, puis compléter les mentions légales et les CGV.
4. **CGV complètes** (sections 1 à 16, formulaire type de rétractation) : à rédiger et valider juridiquement.
5. **Politique de cookies** listant les traceurs réellement actifs.
6. Re-saisir les politiques sans marqueurs Markdown.
7. Retirer « Collection en préparation. Bientôt disponible. » des 17 descriptions.
8. Contrôler visuellement les 4 visuels `*-mannequin.png` (fidélité au produit).
9. Corriger les associations photo/variante (LUNA) et ajouter les photos manquantes : ISAURE Cognac, AURÉA Beige Sable. Écarter les coloris non vendus (NAYA bleu/jaune, NOREA taupe, ISAURE blanc).
10. Supprimer dans l'admin les 21 fichiers obsolètes du brouillon.
11. Publier le thème **uniquement après votre validation** (action non exécutée volontairement).

**P1 — LANCEMENT**
- Remplir les metafields vérifiés : dimensions (mesurées), matière, capacité (objets testés), entretien.
- Retirer ou traduire les infographies anglaises (SOLÉA, LYRA), les étiquettes et filigranes fournisseur (MIRA, ALYA).
- Séance photo : porté épaule par modèle, packshot face sur fond ivoire, intérieur, capacité.
- Créer la page « luna » avec le modèle « landing » pour les campagnes.
- Mettre le menu du footer Shopify à jour si vous souhaitez le gérer depuis l'admin.
- Vérification juridique du modèle VERA.

**P2 — APRÈS PREMIÈRES VENTES**
- Avis vérifiés (app Shopify) et UGC autorisé, sans aucune note inventée.
- Application de parrainage (voir `docs/parrainage-architecture.md`), puis activation de la section.
- Alerte de retour en stock (app) pour les variantes épuisées.

**P3 — CRO / SCALE**
- Tests A/B hero : photo portée ou packshot, titre.
- Landing pages par modèle et par canal ; mesure du LCP et de l'INP réels (Shopify Web Performance).
- Traduction anglaise si ouverture hors de France (le thème est prêt).
