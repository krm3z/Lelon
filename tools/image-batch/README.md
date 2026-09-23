# Batch photos portées LELON

| Fichier | Rôle |
|---|---|
| `knowledge.py` | Relevé visuel des références et modes de porté autorisés (description Shopify ou photo réelle uniquement). |
| `build.py` | Génère la matrice, le batch, le registre QA et le rapport de couverture depuis un export Admin API. |
| `batch.json` | Les mêmes tâches (prompts, fichiers, alts) pour un script de génération. |
| `qa_color.py` | ΔE00 entre la zone sac générée et la référence réelle ; planche côte à côte pour la revue. |

```bash
python3 build.py export-admin.json /chemin/LELON-Images ../..
python3 qa_color.py delta ref.jpg 330,330,120,80 candidate.jpg 610,900,160,120
python3 qa_color.py sheet revue.jpg ref-1.jpg ref-2.jpg candidate.jpg
```

Aucune de ces commandes n'écrit dans Shopify.
