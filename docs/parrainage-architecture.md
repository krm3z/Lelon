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
