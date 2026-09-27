# LELON — Registre QA des images générées

**Aucune image générée à ce jour** (aucun générateur disponible pendant la session du 23–24/09/2026).
Ce registre est prêt : une ligne par image candidate, y compris les rejets.

Statuts : `ACCEPTED` (seul statut intégrable dans le DRAFT) · `REJECTED` · `NEEDS_HUMAN_REVIEW` · `REAL_PHOTO_REQUIRED`.
Notes FIDELITY / ANATOMY / LIGHTING / COLOR ACCURACY / PRODUCT ACCURACY : `OK` / `KO` + cause.

| FILE | PRODUCT | VARIANT | COLOR | SIZE | SOURCE REFERENCES | FIDELITY | ANATOMY | LIGHTING | COLOR ACCURACY | PRODUCT ACCURACY | STATUS | REASON |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| _(vide)_ | | | | | | | | | | | | |

## Images déjà présentes dans Shopify à contrôler

Quatre visuels « portés » PNG 1122 × 1402 sont déjà dans les médias produit (donc visibles aussi sur le thème publié).
Leur origine n’est pas documentée et ils n’ont **pas pu être ouverts** depuis l’environnement de travail (CDN bloqué).
Les passer dans la checklist avant de les mettre en avant :

| FILE | PRODUCT | COLOR | STATUS | REASON |
|---|---|---|---|---|
| lelon-elea-cognac-02-mannequin.png | ÉLÉA | Cognac | NEEDS_HUMAN_REVIEW | origine inconnue, non consultable |
| lelon-nova-chocolat-02-mannequin.png | NOVA | Chocolat | NEEDS_HUMAN_REVIEW | origine inconnue, non consultable |
| lelon-solea-beige-cognac-02-mannequin.png | SOLÉA | Beige & Cognac | NEEDS_HUMAN_REVIEW | origine inconnue, non consultable |
| lelon-velora-ivoire-02-mannequin.png | VÉLORA | Ivoire | NEEDS_HUMAN_REVIEW | origine inconnue, non consultable |

Si ce sont des images générées : les garder uniquement si elles passent les 12 points, et ne jamais les légender comme une cliente.

## Checklist

1. Silhouette et ratio largeur/hauteur identiques aux références (superposer le contour du packshot)
2. Nombre d’anses / bandoulières, longueur relative et points d’attache identiques
3. Fermeture, rabat, fermoir, zip, coutures, panneaux, coins identiques ; aucune poche inventée
4. Métallerie : même couleur et même forme
5. Texture : même grain / plissé / tressage / effet velours
6. Couleur : ΔE moyen ≤ 5 entre la zone sac et le packshot de référence (tools/image-batch/qa_color.py)
7. Taille cohérente avec les dimensions publiées et avec le corps (pas de sac géant ou miniature)
8. Anatomie : mains, doigts, oreilles, cheveux, bijoux sans défaut
9. Physique : aucune sangle ou main qui traverse, ombres et perspective plausibles
10. Aucun texte, logo, étiquette fournisseur ni filigrane
11. Direction LELON : tenue sobre, décor calme, lumière naturelle, pas d’esthétique IA reconnaissable
12. Les 2–3 images d’une variante diffèrent vraiment (pose, angle, distance, décor)
