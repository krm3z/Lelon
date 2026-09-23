# LELON — Architecture du parrainage

État : **préparé côté thème, non actif.** Rien n'est simulé en Liquid. L'espace « Partagez LELON »
(`sections/lelon-referral.liquid`, template `page.account`) reste masqué tant que le réglage
*Thème › Parrainage › Afficher l'espace parrainage* est désactivé, et n'affiche ensuite **que** les
données écrites par le service serveur.

## 1. Pourquoi un service serveur est obligatoire

Le thème Shopify ne peut pas :
- générer un code unique et le garantir,
- vérifier qu'une commande est payée, non remboursée, non frauduleuse,
- émettre une récompense (code de réduction, crédit),
- stocker des signaux antifraude (IP, adresse normalisée).

Tout cela doit vivre dans une **application Shopify privée (custom app)** ou une app du Shopify App Store
choisie par le marchand (*action payante possible → validation du marchand requise*).

## 2. Flux

```
Marraine (cliente éligible)
  └─ compte client → code attribué par le service (ex. lelon.fr/r/AB12CD)
Filleule
  1. ouvre lelon.fr/r/AB12CD → redirection (URL redirect ou app proxy) vers l'accueil
     + cookie first-party « referral » posé UNIQUEMENT si consentement « préférences/marketing »
  2. crée son compte
  3. passe sa première commande éligible (code filleule appliqué au checkout via Shopify Discount)
  4. webhook orders/paid → le service enregistre l'événement en PENDING
  5. délai de contrôle (ex. fin du délai de rétractation de 14 jours + expédition)
  6. contrôles antifraude (§4) → VALID / PENDING_REVIEW / REJECTED
  7. VALID → récompense créée pour la marraine (Shopify discount code à usage unique)
  8. le service met à jour les metafields client → le thème affiche « Votre invitation a fleuri. »
```

## 3. Contrat de données avec le thème

| Propriétaire | Metafield | Type | Écrit par | Lu par |
|---|---|---|---|---|
| Customer | `lelon.referral_code` | single_line_text_field | service | `lelon-referral.liquid` |
| Customer | `lelon.referral_summary` | json | service | `lelon-referral.liquid` |

`lelon.referral_summary` (exemple) :

```json
{
  "invited": 3,
  "completed": 1,
  "rewards": [
    { "label": "−10 % sur votre prochaine commande · code LELON-XXXX", "status": "granted" },
    { "label": "Invitation en cours de vérification", "status": "pending_review" }
  ]
}
```

Statuts reconnus par le thème : `granted`, `pending_review`, tout autre statut est affiché sans mention.
Les définitions de ces deux metafields **ne sont pas créées** : elles doivent appartenir à l'app
(namespace réservé à l'app recommandé, accès Storefront en lecture).

## 4. Antifraude (server-side, RGPD)

Signaux, du plus faible au plus fort :

| Signal | Traitement | Seul, il suffit à rejeter ? |
|---|---|---|
| IP identique | hachée (SHA-256 + sel), conservée 30 jours max | **Non** — simple signal |
| E-mail normalisé identique (minuscules, suppression des `+alias`, points Gmail) | comparaison | Non → PENDING_REVIEW |
| Adresse de livraison normalisée identique | comparaison | Non → PENDING_REVIEW |
| Même moyen de paiement (empreinte fournie par la passerelle, si disponible) | comparaison | Fort |
| Commande remboursée / annulée / rétractée | statut commande | Oui → REJECTED |
| Combinaison ≥ 2 signaux forts | score | → REJECTED ou revue manuelle |

États : `VALID`, `PENDING_REVIEW`, `REJECTED`. Jamais de rejet automatique sur la seule IP.

Minimisation : aucune donnée brute d'IP ou d'adresse n'est exposée au thème ; mention à ajouter dans la
politique de confidentialité (base légale : intérêt légitime de prévention de la fraude), durée de
conservation documentée, droit d'opposition.

## 5. Règle de récompense configurable

Ne jamais coder « −10 % » dans le front. La règle vit dans le service (ou un metaobject
`lelon_referral_rule` lu par le service) :

```json
{ "reward_type": "percentage", "value": 10, "min_order_eur": 0, "validation_delay_days": 21,
  "max_rewards_per_customer": 5, "active": true }
```

## 6. Microcopy validée

- Titre : « Partagez LELON »
- Texte : « Invitez une personne à découvrir notre univers. »
- Récompense réellement attribuée : « Votre invitation a fleuri. » suivi du libellé réel.
- Pas de gamification, pas de compteur de rareté.

## 7. Prochaines étapes (backend)

1. Choisir : app existante (coût, conformité RGPD à vérifier) ou custom app.
2. Créer la route `/r/:code` (URL redirect Shopify ou app proxy).
3. Webhooks `orders/paid`, `refunds/create`, `orders/cancelled`.
4. Créer les codes via `discountCodeBasicCreate` (usage unique, client ciblé).
5. Écrire `lelon.referral_code` et `lelon.referral_summary` (Admin API `metafieldsSet`).
6. Rédiger les conditions du parrainage (page dédiée) → lien dans la section.
7. Activer *Afficher l'espace parrainage* dans les réglages du thème.

Note : les comptes clients LELON sont les **nouveaux comptes Shopify** (`account.lelon.fr`). Leur
interface (commandes, profil) n'est pas un template du thème : l'affichage du parrainage *dans*
account.lelon.fr demande une extension **Customer Account UI** fournie par l'app.

---

## 8. Révision du 24/09/2026 — architecture simplifiée recommandée

### 8.1 Le lien de parrainage = un lien de réduction Shopify natif

Plutôt qu’une route `/r/:code` (redirection par code ou app proxy), chaque marraine reçoit **un code de réduction
Shopify qui lui est propre**, partagé sous forme de lien natif :

```
https://lelon.fr/discount/AMI-AB12CD?redirect=/collections/lelon
```

- Shopify applique le code au panier et redirige : aucune route, aucun cookie maison, aucun app proxy.
- L’attribution est portée par la commande elle-même (`discount_codes` de la commande) : le webhook `orders/paid`
  retrouve la marraine à partir du code. Pas de cookie de suivi à justifier au titre du consentement.
- Le code filleule est créé par le service (`discountCodeBasicCreate`) avec :
  `appliesOncePerCustomer: true`, éligibilité limitée à un segment « aucune commande passée »
  (`customerSelection.customerSegments`), valeur lue dans la règle configurable (§5), date de fin facultative.
- Le thème reste inchangé : `lelon.referral_code` contient le code, et le réglage
  *Thème › Parrainage › Base du lien personnel* devient `https://lelon.fr/discount/` (le lien affiché = base + code).

### 8.2 Où la cliente trouve son espace

- Avec les nouveaux comptes clients (`account.lelon.fr`), l’espace parrainage du thème vit sur une **page de la
  boutique** (template `page.account`, ex. `/pages/mon-espace`). L’ajouter au menu `customer-account-main-menu`
  (*Paramètres → Comptes clients → Menu*) pour qu’il soit accessible depuis le compte.
- Le Liquid `customer` est bien renseigné sur la boutique quand la cliente est connectée à son compte.
- Pour afficher le parrainage **dans** `account.lelon.fr`, il faut une extension *Customer Account UI* (fournie par
  l’app retenue) : le thème ne peut pas le faire.

### 8.3 États affichés par le thème (à tester avant activation)

| Situation | Affichage |
|---|---|
| Réglage désactivé | rien |
| Non connectée | invitation à se connecter |
| Connectée, pas de code | « Votre lien personnel apparaîtra ici dès qu’il sera disponible. » (aucun code inventé) |
| Code présent | lien + copier + partager (si le navigateur le permet) |
| `referral_summary` présent | invitations, commandes validées, récompenses (`granted` → « Votre invitation a fleuri. », `pending_review` → mention de vérification) |

Test en prévisualisation : cliente de test + metafields écrits à la main dans l’admin, puis suppression.

### 8.4 Conditions à publier avant activation

Page « Conditions du parrainage » (liée depuis la section) : bénéficiaires, récompense exacte, délai de validation
(fin du délai de rétractation), cas d’annulation (remboursement, fraude), durée du programme, données traitées et
durée de conservation (à reprendre dans la politique de confidentialité).

### 8.5 Checklist d’activation

1. Solution choisie (app ou service) — décision et coût marchand.
2. Définitions de metafields client `lelon.referral_code` (texte) et `lelon.referral_summary` (JSON) créées.
3. Règle de récompense écrite (§5), conditions publiées (§8.4).
4. Webhooks `orders/paid`, `refunds/create`, `orders/cancelled` branchés et testés sur une commande test.
5. Tests des 5 états (§8.3) en prévisualisation.
6. Activation du réglage *Afficher l’espace parrainage*.
