# LELON — Diagnostic Inventaire / CJdropshipping

Enquête **en lecture seule** (Admin API, 23/09/2026 vers 22 h UTC). **Aucun stock, emplacement, mapping CJ, profil
d’expédition ni réglage n’a été modifié.** Rien ne doit être corrigé sans validation du marchand.

## 1. Ce que contient Shopify

| Élément | Constat |
|---|---|
| Produits | 17, tous `ACTIVE`, publiés sur la boutique en ligne |
| Variantes | **55** (dont 6 pour VERA : 3 coloris × 2 formats) |
| Suivi du stock | activé (`tracked: true`) sur les 55 articles |
| Politique hors stock | `DENY` sur les 55 (pas de vente sans stock) |
| Quantités | `available = 0`, `on_hand = 0`, `committed = 0`, `incoming = 0`, `reserved = 0` partout |
| SKU | 55 SKU `CJNS…`, aucun doublon (`duplicateSkuCount = 0`) |
| Commandes | 0 commande dans la boutique |

### Emplacements

| Emplacement | Type | Expédie les commandes en ligne | Dans le profil d’expédition | Variantes stockées |
|---|---|---|---|---|
| Emplacement manuel du marchand (adresse en France) | emplacement Shopify classique | oui | **NON — emplacement non assigné** | **54** |
| `cjdropshipping` | service de traitement tiers CJ (`inventoryManagement: true`, callback `newplatform.cjdropshipping.com`) | oui | **oui (seul emplacement du profil général)** | **1** (ÉLÉA Cognac) |

### Expédition (profil général)

- Zone **France** : tarif « France » **0,99 €** et tarif « France » **0,00 €** dès **90 €** de panier (condition `TOTAL_PRICE ≥ 90 EUR`).
  → Les réglages annoncés par le thème (0,99 € · offerte dès 90 €) sont **confirmés**.
- Le tarif 0,99 € n’a pas de plafond : au-delà de 90 € la cliente voit **deux** options (0,99 € et gratuite). À ajuster
  (condition « < 90 € » sur le tarif payant) — décision marchand.
- Le profil ne contient **que** l’emplacement `cjdropshipping`. L’emplacement manuel est **non assigné** : aucune zone,
  aucun tarif.

## 2. Diagnostic A → E

| Hypothèse | Verdict | Preuve |
|---|---|---|
| **A — mauvais InventoryLevel interrogé** | **Écartée** | Chaque article n’a qu’un seul niveau de stock (`locationsCount = 1`) ; tous les niveaux ont été lus, y compris l’emplacement CJ (non listé par défaut : requête `includeLegacy`). Tous valent 0. |
| **B — CJ possède du stock mais Shopify = 0** | **Non vérifiable ici, plausible** | L’environnement n’a pas accès au compte CJ. Pour 54 variantes, même si CJ avait du stock, il ne pourrait pas le remonter : ces articles ne sont pas stockés à l’emplacement `cjdropshipping` (seul emplacement dont CJ gère le stock). |
| **C — synchronisation absente** | **Probable pour 54 variantes** | Le service CJ déclare gérer le stock (`inventoryManagement: true`) mais seule ÉLÉA Cognac est rattachée à son emplacement ; les 54 autres ne peuvent pas être synchronisées. ÉLÉA Cognac est à 0 : stock CJ nul ou synchronisation non lancée — à vérifier dans l’app CJ. |
| **D — fulfillment service / emplacement incorrect** | **CONFIRMÉE** | 54 variantes sur 55 sont rattachées à l’emplacement manuel au lieu de `cjdropshipping`. Mapping incohérent : une seule variante (ÉLÉA Cognac) est côté CJ. |
| **E — autre** | **Deux points** | (1) **Blocage checkout** : l’emplacement manuel n’est pas dans le profil d’expédition. Si du stock y est ajouté, les 54 variantes n’auront **aucun mode de livraison** au paiement. (2) Pré-lancement : le stock à 0 + `DENY` + la phrase « Collection en préparation. Bientôt disponible. » dans les descriptions montrent que l’indisponibilité peut être **volontaire** ; la campagne `lelon.launch_campaign` est désactivée (`enabled: false`). |

## 3. Conséquences

- Aujourd’hui : **aucun produit n’est achetable** (0 stock + `DENY`). Le thème DRAFT l’affiche honnêtement
  (« Bientôt disponible », bouton désactivé, aucun faux stock).
- Après ajout de stock **à l’emplacement manuel** sans autre changement : fiches achetables mais **checkout sans livraison**
  pour 54 variantes.
- Commandes : l’app CJ récupère en général les commandes des articles liés à son service ; les 54 variantes
  rattachées à l’emplacement manuel risquent de ne **pas** être transmises automatiquement à CJ (à vérifier dans les
  réglages de l’app CJ : « order sync » / « connected products »).

## 4. Correction recommandée (NE PAS exécuter sans le marchand)

1. Dans l’app **CJdropshipping** : vérifier que les 17 produits / 55 variantes sont « connectés » (mapping SKU CJ ↔ variante Shopify)
   et lancer la **synchronisation du stock** : l’app rattache les articles à l’emplacement `cjdropshipping` et y écrit le stock CJ.
2. Vérifier dans Shopify (*Produits → variante → Inventaire*) que chaque variante est stockée à `cjdropshipping`
   (et plus à l’emplacement manuel, sauf stock physique réel chez le marchand).
3. **Ou**, si le marchand expédie lui-même une partie du stock : ajouter l’emplacement manuel au **profil d’expédition**
   (*Paramètres → Expédition et livraison → Profil général → Expédition depuis*), avec les mêmes tarifs France.
4. Contrôle final : commande test (paiement test) sur une variante de chaque emplacement → livraison proposée,
   commande visible dans CJ.

Aucune de ces actions n’a été faite : elles modifient le stock, les emplacements, CJ ou l’expédition (interdit sans validation).

## 5. Détail par variante

| Produit | Product ID | Variante | Variant ID | InventoryItem ID | SKU | inventory_management | inventory_policy | Emplacement (fulfillment) | available | on_hand | Lié au service CJ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ALYA | 16074450370894 | Cognac | 60840326594894 | 59274888806734 | `CJNS230746503CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| ALYA | 16074450370894 | Ivoire | 60832988102990 | 59267427565902 | `CJNS230746502BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| ALYA | 16074450370894 | Noir | 60840326627662 | 59274888839502 | `CJNS230746501AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| ÉLÉA | 16073632612686 | Cognac | 60840299626830 | 59274861642062 | `CJNS207059905EV` | Shopify (suivi) | DENY | **cjdropshipping** (service CJ) | 0 | 0 | oui |
| ÉLÉA | 16073632612686 | Noir | 60826633142606 | 59261036134734 | `CJNS207059901AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| ÉLÉA | 16073632612686 | Ivoire | 60840299659598 | 59274861674830 | `CJNS207059902BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| ÉLÉA | 16073632612686 | Sable | 60840299725134 | 59274861740366 | `CJNS207059904DW` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| LILA | 16074450403662 | Chocolat | 60840332722510 | 59274894967118 | `CJNS215116901AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| LILA | 16074450403662 | Ivoire | 60840332788046 | 59274895032654 | `CJNS215116904DW` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| LILA | 16074450403662 | Noir | 60832988135758 | 59267427598670 | `CJNS215116903CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| LILA | 16074450403662 | Vert | 60840332820814 | 59274895065422 | `CJNS215116905EV` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| LUNA | 16074450305358 | Crème & Chocolat | 60832988037454 | 59267427500366 | `CJNS105155204DW` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| LUNA | 16074450305358 | Taupe & Chocolat | 60840322171214 | 59274884350286 | `CJNS105155201AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| LUNA | 16074450305358 | Noir | 60840322236750 | 59274884415822 | `CJNS105155203CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| LYRA | 16074449191246 | Chocolat | 60840317714766 | 59274879861070 | `CJNS197422902BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| LYRA | 16074449191246 | Ivoire | 60832983286094 | 59267422617934 | `CJNS197422903CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| LYRA | 16074449191246 | Noir | 60840317747534 | 59274879893838 | `CJNS197422901AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| MIRA | 16073633497422 | Ivoire | 60840303165774 | 59274865213774 | `CJNS231262802BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| MIRA | 16073633497422 | Taupe | 60840303198542 | 59274865246542 | `CJNS231262803CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| MIRA | 16073633497422 | Noir | 60826645561678 | 59261048291662 | `CJNS231262801AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| NAYA | 16074452173134 | Chocolat | 60840341733710 | 59274904043854 | `CJNS194052705EV` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| NAYA | 16074452173134 | Noir | 60832995737934 | 59267435462990 | `CJNS194052703CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| NAYA | 16074452173134 | Ivoire | 60840341766478 | 59274904076622 | `CJNS194052701AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| NOVA | 16074448896334 | Chocolat | 60840303395150 | 59274865475918 | `CJNS215226101AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| NOVA | 16074448896334 | Bordeaux | 60840303427918 | 59274865508686 | `CJNS215226102BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| NOVA | 16074448896334 | Noir | 60832981844302 | 59267421110606 | `CJNS215226105EV` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| NOVA | 16074448896334 | Camel | 60897863074126 | 59333448728910 | `CJNS215226103CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| AMARA | 16074644586830 | Ivoire | 60897885716814 | 59333471568206 | `CJNS245663602BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| AMARA | 16074644586830 | Sauge | 60834336997710 | 59268812865870 | `CJNS245663601AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| AMARA | 16074644586830 | Rose Poudré | 60897885749582 | 59333471600974 | `CJNS245663603CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| AURÉA | 16074643210574 | Noir | 60834320810318 | 59268796645710 | `CJNS163017203CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| AURÉA | 16074643210574 | Taupe / Greige | 60840516714830 | 59275079254350 | `CJNS163017201AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| AURÉA | 16074643210574 | Beige Sable | 60840516747598 | 59275079287118 | `CJNS163017202BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| CÉLÈNE | 16074644095310 | Taupe | 60897877754190 | 59333463540046 | `CJNS237403703CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| CÉLÈNE | 16074644095310 | Noir | 60834331885902 | 59268807721294 | `CJNS237403701AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| CÉLÈNE | 16074644095310 | Ivoire | 60897877786958 | 59333463572814 | `CJNS237403705EV` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| CÉLÈNE | 16074644095310 | Cognac | 60897877819726 | 59333463605582 | `CJNS237403704DW` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| ELARA | 16074643538254 | Cognac | 60840520417614 | 59275082989902 | `CJNS205176702BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| ELARA | 16074643538254 | Noir | 60834325659982 | 59268801495374 | `CJNS205176701AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| ISAURE | 16074643833166 | Cognac | 60897873199438 | 59333458919758 | `CJNS196662204DW` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| ISAURE | 16074643833166 | Noir | 60834329493838 | 59268805329230 | `CJNS196662201AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| NOREA | 16074644947278 | Noir | 60834344829262 | 59268820730190 | `CJNS245664401AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| NOREA | 16074644947278 | Ivoire | 60897888764238 | 59333474648398 | `CJNS245664402BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| NOREA | 16074644947278 | Chocolat | 60897888797006 | 59333474681166 | `CJNS245664404DW` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| VÉLORA | 16074644291918 | Camel | 60834333917518 | 59268809752910 | `CJNS244594103CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| VÉLORA | 16074644291918 | Noir | 60897879163214 | 59333464981838 | `CJNS244594101AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| VÉLORA | 16074644291918 | Ivoire | 60897879195982 | 59333465014606 | `CJNS244594102BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| SOLÉA | 16074448994638 | Beige & Cognac | 60832982827342 | 59267422126414 | `CJNS238553101AZ` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| SOLÉA | 16074448994638 | Beige & Noir | 60840303657294 | 59274865770830 | `CJNS238553102BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| VERA | 16074452107598 | Caramel / M | 60840337899854 | 59274900177230 | `CJNS192702804DW` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| VERA | 16074452107598 | Noir / M | 60840337932622 | 59274900209998 | `CJNS192702802BY` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| VERA | 16074452107598 | Noir / L | 60832995672398 | 59267435397454 | `CJNS192702803CX` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| VERA | 16074452107598 | Caramel / L | 60840337965390 | 59274900242766 | `CJNS192702805EV` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| VERA | 16074452107598 | Rouge / M | 60840337998158 | 59274900275534 | `CJNS192702806FU` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
| VERA | 16074452107598 | Rouge / L | 60840338030926 | 59274900308302 | `CJNS192702807GT` | Shopify (suivi) | DENY | emplacement manuel | 0 | 0 | non |
