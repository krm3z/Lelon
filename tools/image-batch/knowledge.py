# -*- coding: utf-8 -*-
"""
Observations produit pour le batch de photos portées LELON.

Source de chaque information :
  - DESC  : description produit publiée dans Shopify (bloc « Les détails ») — jamais complétée.
  - REF   : ce qui est VISIBLE sur les photos de référence (zip LELON-Images + médias Shopify),
            relevé à l'œil sur planches contact le 23/09/2026. Aucune matière ni dimension n'est déduite
            d'une photo : on décrit uniquement la forme, les attaches, la métallerie et la couleur visibles.
Toute valeur marquée « à confirmer » doit être vérifiée sur le produit réel avant génération.
"""

# Modes de porté autorisés : uniquement ceux listés dans la description Shopify (DESC) ou visibles
# sur une photo de référence réelle (REF). Rien d'autre.
PRODUCTS = {
    'elea': {
        'name': 'ÉLÉA', 'folder': '01-elea',
        'carry': {'A': 'porté épaule (DESC « À l’épaule »)', 'B': 'tenu à la main par la bandoulière, bras le long du corps (REF : 4 photos)', 'C': 'porté épaule, scène quotidienne'},
        'features': [
            'silhouette rectangulaire horizontale structurée, compacte (DESC : environ 26 × 14 × 5,5 cm)',
            'rabat avant asymétrique aux angles légèrement arrondis, couvrant presque toute la face',
            'une ligne de surpiqûre horizontale sur le rabat',
            'large bandoulière plate du même coloris, fixée sur les côtés',
            'boucle / attache métallique dorée côté gauche de la bandoulière',
            'aspect lisse, légèrement satiné (REF)',
        ],
        'hardware': 'doré',
        'refs_note': 'Une seule photo par coloris, même angle (tenu à la main, décor lit blanc) : vues profil/dos absentes.',
        'flags': {},
    },
    'mira': {
        'name': 'MIRA', 'folder': '02-mira',
        'carry': {'A': 'porté épaule par la bandoulière (REF noir #7)', 'B': 'tenu à la main par l’anse froncée (DESC « anse souple », REF)', 'C': 'porté en bandoulière croisée (REF ivoire #8, DESC bandoulière réglable ~120 cm)'},
        'features': [
            'petit sac compact aux côtés arrondis (DESC : 21 × 16 × 6 cm)',
            'plissé vertical régulier sur toute la face (côtes fines)',
            'anse supérieure souple froncée (effet ruché)',
            'segments de chaîne dorée reliant l’anse au corps, mousquetons dorés',
            'bandoulière amovible réglable, boucle dorée',
            'étiquette suspendue avec texte fournisseur « FASHION & … » (REF) — voir décision marchand',
        ],
        'hardware': 'doré',
        'refs_note': 'Ivoire : anse et bandoulière d’un ton beige/taupe plus soutenu que le corps (REF #2) — conserver ce contraste.',
        'flags': {'*': ['MERCHANT_DECISION_TAG']},
    },
    'nova': {
        'name': 'NOVA', 'folder': '03-nova',
        'carry': {'A': 'tenu à la main par les deux anses (REF chocolat #5)', 'B': 'au creux du bras — UNIQUEMENT si la hauteur d’anse réelle le permet (à confirmer), sinon 2e prise main', 'C': 'tenu à la main, scène quotidienne (ville / campus)'},
        'features': [
            'grand tote horizontal évasé, haut souple légèrement affaissé (DESC : 38 × 25 × 16 cm)',
            'deux anses tubulaires arrondies, même coloris',
            'fine ceinture horizontale sur le haut de la face, passants, boucle rectangulaire argentée',
            'toucher visuel velouté « effet suède » (DESC) — pas de reflet cuir lisse',
        ],
        'hardware': 'argenté',
        'refs_note': 'Bordeaux, Camel, Noir : un seul packshot fond blanc chacun ; Chocolat : 3 photos en situation.',
        'flags': {},
    },
    'solea': {
        'name': 'SOLÉA', 'folder': '04-solea',
        'carry': {'A': 'tenu à la main par l’anse courte (DESC « À la main »)', 'B': 'porté épaule avec la bandoulière amovible (DESC)', 'C': 'lifestyle estival, porté main ou épaule'},
        'features': [
            'forme demi-lune / dôme souple, base plus large que le haut',
            'extérieur tressé aspect paille, trame régulière (DESC « Tressage / aspect paille »)',
            'anse courte : deux manchons rembourrés du coloris de finition (cognac ou noir) réunis au centre par une pièce dorée',
            'fermeture éclair principale dorée (DESC « Zip principal »)',
            'base renforcée du coloris de finition (DESC)',
            'bandoulière amovible réglable, boucle dorée (DESC « Amovible »)',
        ],
        'hardware': 'doré',
        'refs_note': 'Packshots propres + vues face/côté/dos/dessous sur l’infographie (texte anglais : ne jamais recopier le texte).',
        'flags': {},
    },
    'lyra': {
        'name': 'LYRA', 'folder': '05-lyra',
        'carry': {'A': 'tenu à la main par la poignée supérieure (DESC « poignée supérieure »)', 'B': 'porté en bandoulière (DESC « À l’épaule ou en bandoulière selon la configuration »)', 'C': 'porté épaule, scène quotidienne'},
        'features': [
            'sac structuré à rabat, format compact (DESC : environ 24 × 17,5 × 10,5 cm)',
            'fermoir carré rembourré au centre du rabat (DESC)',
            'poignée supérieure unique',
            'anneaux dorés sur les côtés pour la bandoulière',
            'foulard noué sur la poignée et sangle texte « CLASSIC » visibles sur les références : fournis ou non ? (décision marchand)',
        ],
        'hardware': 'doré',
        'refs_note': 'Références = infographies fournisseur (texte, pictos) : ne jamais reproduire le texte ni les pictos.',
        'flags': {'*': ['MERCHANT_DECISION_ACCESSORIES']},
    },
    'luna': {
        'name': 'LUNA', 'folder': '06-luna',
        'carry': {'A': 'tenu à la main par la poignée supérieure (REF)', 'B': 'porté en bandoulière (DESC « bandoulière réglable ~112 cm »)', 'C': 'porté épaule, scène quotidienne'},
        'features': [
            'petit sac seau arrondi compact (DESC : 14 × 16 × 14 cm)',
            'corps au toucher visuel velouté (DESC « Effet suède / finition douce »)',
            'bande de base et bordure supérieure contrastées (chocolat, ou noir sur la version Noir)',
            'petit rabat / patte supérieure, poignée supérieure, attaches dorées',
            'longue bandoulière fine réglable',
        ],
        'hardware': 'doré',
        'refs_note': '⚠ Inversion probable : photos « Vue 4/5 » (alt Crème & Chocolat) montrent un corps taupe ; « Vue 1/2 » (alt Taupe & Chocolat) un corps crème.',
        'flags': {'Crème & Chocolat': ['VARIANT_MAPPING_TO_CONFIRM'], 'Taupe & Chocolat': ['VARIANT_MAPPING_TO_CONFIRM']},
    },
    'alya': {
        'name': 'ALYA', 'folder': '07-alya',
        'carry': {'A': 'porté épaule (DESC)', 'B': 'porté en bandoulière (DESC « ou en bandoulière »)', 'C': 'tenu à la main par la sangle, scène intérieure (REF cognac #8)'},
        'features': [
            'forme allongée, cylindrique, souple (DESC)',
            'grain visible (aspect grainé, REF)',
            'large sangle plate du même coloris, rivets / boutons dorés aux attaches',
            'petits boutons dorés sur les extrémités',
        ],
        'hardware': 'doré',
        'refs_note': 'Exclure noir #6 des références (filigrane fournisseur « …om-design »).',
        'flags': {},
    },
    'lila': {
        'name': 'LILA', 'folder': '08-lila',
        'carry': {'A': 'tenu à la main par la petite poignée (DESC « À la main »)', 'B': 'porté en bandoulière (DESC, REF vert #3)', 'C': 'lifestyle, porté bandoulière'},
        'features': [
            'micro-sac carré (DESC : 11 × 11 × 7 cm) — rester très petit à l’échelle de la main',
            'petit rabat arrondi',
            'petite poignée supérieure',
            'bandoulière fine amovible, mousquetons dorés',
        ],
        'hardware': 'doré',
        'refs_note': 'Vert : 3 références ; autres coloris : 1 photo en situation chacun.',
        'flags': {},
    },
    'vera': {
        'name': 'VERA', 'folder': '09-vera',
        'carry': {'A': 'porté épaule (REF caramel #11)', 'B': 'tenu contre soi / à la main (REF caramel #6)', 'C': 'porté épaule, scène quotidienne'},
        'features': [
            'sac rectangulaire horizontal semi-rigide à rabat arrondi (DESC)',
            'fermoir rectangulaire doré au centre du rabat (DESC)',
            'fine bandoulière, passants dorés (REF)',
            'tranches et surpiqûres visibles (REF macro #9)',
            'aspect lisse et légèrement brillant (DESC « PVC »)',
        ],
        'hardware': 'doré',
        'refs_note': 'Aucune dimension publiée pour M et L ; les références ne permettent pas de distinguer les deux formats.',
        'flags': {'*': ['LEGAL_REVIEW_REQUIRED', 'SIZE_REFERENCE_REQUIRED'], 'Rouge': ['NEEDS_REAL_REFERENCE']},
    },
    'naya': {
        'name': 'NAYA', 'folder': '10-naya',
        'carry': {'A': 'porté épaule (DESC « Une bandoulière », REF)', 'B': 'porté épaule, angle ¾ dos (même porté, autre angle)', 'C': 'porté épaule, scène quotidienne'},
        'features': [
            'sac souple aux lignes épurées, ouverture supérieure incurvée en U (DESC)',
            'bandoulière plate du même coloris, petites attaches dorées',
            'aspect lisse (REF)',
        ],
        'hardware': 'doré (petites attaches)',
        'refs_note': 'Bleu et jaune (« sable ») du zip ne sont pas des variantes : ne jamais les utiliser. Ivoire : 1 seule image fournisseur (Shopify).',
        'flags': {'Ivoire': ['REFERENCE_WEAK']},
    },
    'aurea': {
        'name': 'AURÉA', 'folder': '11-aurea',
        'carry': {'A': 'porté épaule (DESC « À l’épaule »)', 'B': 'porté épaule, angle profil (même porté, autre angle)', 'C': 'porté épaule, scène galerie / architecture'},
        'features': [
            'silhouette hobo en croissant, souple (DESC : 33 × 6,5 × 18,5 cm)',
            'anse unique fine, réglable par boucle argentée',
            'fermeture à glissière le long de l’ouverture (DESC « Zip »)',
            'aspect lisse mat (REF)',
        ],
        'hardware': 'argenté',
        'refs_note': 'Beige Sable : 2 photos dans le zip (#1, #3) de tons différents ; aucune dans Shopify.',
        'flags': {'Beige Sable': ['REFERENCE_TO_CONFIRM']},
    },
    'elara': {
        'name': 'ELARA', 'folder': '12-elara',
        'carry': {'A': 'tenu à la main par les deux anses (DESC)', 'B': 'porté en bandoulière avec la large bandoulière amovible (DESC)', 'C': 'porté épaule, scène quotidienne'},
        'features': [
            'sac structuré à deux anses (DESC : 27 × 16 × 23 cm)',
            'panneaux découpés : couture horizontale et coutures verticales (REF)',
            'anses rivetées dorées',
            'large bandoulière amovible, attaches dorées (DESC « détails dorés »)',
            'grain visible (REF)',
        ],
        'hardware': 'doré',
        'refs_note': 'Références studio de bonne qualité, mannequin déjà présent.',
        'flags': {},
    },
    'isaure': {
        'name': 'ISAURE', 'folder': '13-isaure',
        'carry': {'A': 'porté épaule (DESC « Une bandoulière », REF)', 'B': 'porté épaule, angle ¾ dos (REF cognac #16)', 'C': 'porté épaule, scène quotidienne'},
        'features': [
            'grand sac aux lignes minimalistes, semi-structuré (DESC : 27 × 26 × 7 cm)',
            'large bandoulière unique réglable par passants latéraux (REF)',
            'aspect lisse (REF)',
        ],
        'hardware': 'discret (passants du même coloris)',
        'refs_note': 'Cognac : 5 bonnes photos dans le zip, 0 dans Shopify. Noir : 1 image fournisseur. « Blanc » n’est pas une variante.',
        'flags': {'Noir': ['REFERENCE_WEAK']},
    },
    'celene': {
        'name': 'CÉLÈNE', 'folder': '14-celene',
        'carry': {'A': 'tenu à la main par les deux anses (DESC)', 'B': 'porté en bandoulière (DESC)', 'C': 'porté épaule, scène quotidienne'},
        'features': [
            'forme Boston / bowling structurée (DESC : 30 × 13 × 22 cm)',
            'deux anses arrondies du même coloris',
            'double curseur de fermeture doré au centre du haut',
            'surpiqûres contrastées visibles le long des bords (REF)',
            'grain visible (REF)',
            'Ivoire : large sangle en tissu à motif (REF #9) — conserver la sangle propre à chaque coloris',
        ],
        'hardware': 'doré',
        'refs_note': 'Taupe : photo intérieur réelle (#3) — ne jamais générer d’intérieur.',
        'flags': {},
    },
    'velora': {
        'name': 'VÉLORA', 'folder': '15-velora',
        'carry': {'A': 'tenu à la main par la poignée (DESC « Une poignée »)', 'B': 'porté épaule avec la courte bandoulière (DESC)', 'C': 'porté en bandoulière avec la longue bandoulière (DESC)'},
        'features': [
            'sac horizontal structuré, silhouette trapèze (DESC)',
            'grand rabat couvrant la face, soufflets latéraux plissés',
            'poignée supérieure unique arrondie',
            'petite plaque rectangulaire embossée sur le rabat (REF) — ne pas y écrire de texte',
        ],
        'hardware': 'discret',
        'refs_note': 'Camel : 4 photos dont 2 portées ; Ivoire et Noir : 1 packshot. Ivoire porté PNG Shopify non contrôlé.',
        'flags': {},
    },
    'amara': {
        'name': 'AMARA', 'folder': '16-amara',
        'carry': {'A': 'tenu à la main par les deux anses (DESC)', 'B': 'porté épaule (DESC)', 'C': 'porté en bandoulière (DESC « selon la configuration fournie »)'},
        'features': [
            'sac seau souple (DESC : 24 × 14 × 19 cm, ouverture ~21 cm)',
            'deux anses fines ; nœud / boucle nouée sur l’attache d’une anse (REF)',
            'pièce ronde dorée sur le côté (REF)',
            'bandoulière fine amovible, mousquetons dorés (REF sauge #2, #5)',
            'intérieur contrasté brun visible à l’ouverture (REF) — ne pas le modifier ni l’agrandir',
        ],
        'hardware': 'doré',
        'refs_note': 'Packshots 1600 px nets ; Ivoire et Rose Poudré : 1 vue chacun.',
        'flags': {},
    },
    'norea': {
        'name': 'NOREA', 'folder': '17-norea',
        'carry': {'A': 'porté épaule (REF ivoire #1)', 'B': 'porté épaule, angle profil (même porté, autre angle)', 'C': 'porté épaule, scène architecture'},
        'features': [
            'forme carrée horizontale à rabat (DESC)',
            'bande avant enveloppante en plusieurs couches (REF)',
            'double curseur central argenté avec longues tirettes (REF)',
            'longue anse fine d’épaule (REF) ; bandoulière « à double articulation » (DESC)',
        ],
        'hardware': 'argenté',
        'refs_note': 'Les 4 photos « taupue » du zip ne sont pas une variante vendue : ne pas les utiliser.',
        'flags': {},
    },
}

# Planche de classification des photos du zip (relevé visuel) :
# type ∈ packshot · main (tenu, corps partiel) · porte (mannequin) · situation (posé en décor) · detail · interieur · infographie
ZIP_SHOTS = {
    'elea': {'cognac': ['main'], 'ivoire': ['main'], 'noir': ['main'], 'sable': ['main']},
    'mira': {'ivoire': ['main', 'detail+interieur', 'porte'], 'noir': ['main', 'porte'], 'taupe': ['main', 'porte']},
    'nova': {'bordeaux': ['packshot'], 'camel': ['packshot'], 'chocolat': ['situation', 'porte', 'situation'], 'noir': ['packshot']},
    'solea': {'beige-cognac': ['packshot', 'infographie', 'infographie+detail'], 'beige-noir': ['packshot']},
    'lyra': {'chocolat': ['infographie+interieur', 'packshot'], 'ivoire': ['situation'], 'noir': ['packshot+infographie']},
    'luna': {'creme-chocolat': ['situation', 'situation'], 'noir': ['situation'], 'taupe-chocolat': ['main', 'situation']},
    'alya': {'cognac': ['main', 'situation', 'main'], 'ivoire': ['main', 'main'], 'noir': ['porte', 'main (filigrane)']},
    'lila': {'chocolat': ['situation'], 'ivoire': ['situation'], 'noir': ['situation'], 'vert': ['main', 'situation', 'porte']},
    'vera': {'caramel': ['porte', 'packshot', 'situation', 'porte', 'detail', 'detail', 'detail'], 'noir': ['situation']},
    'naya': {'chocolat': ['porte'], 'noir': ['porte']},
    'aurea': {'beige-sable': ['packshot', 'packshot'], 'noir': ['packshot'], 'taupe-greige': ['packshot']},
    'elara': {'cognac': ['porte', 'porte', 'situation'], 'noir': ['porte', 'porte']},
    'isaure': {'cognac': ['porte', 'porte', 'situation', 'porte', 'packshot']},
    'celene': {'cognac': ['situation'], 'ivoire': ['situation'], 'noir': ['situation'], 'taupe': ['porte', 'interieur', 'situation']},
    'velora': {'camel': ['porte', 'porte', 'situation', 'packshot'], 'ivoire': ['packshot'], 'noir': ['packshot']},
    'amara': {'ivoire': ['packshot'], 'rose-poudre': ['packshot'], 'sauge': ['situation', 'interieur', 'packshot', 'packshot']},
    'norea': {'chocolat': ['packshot'], 'ivoire': ['porte', 'packshot'], 'noir': ['packshot']},
}

# Photos « portées » déjà présentes dans Shopify (PNG 1122 × 1402), origine inconnue, non consultables
# depuis l'environnement de travail (CDN bloqué) : à contrôler par un humain.
SHOPIFY_WORN_UNVERIFIED = {('elea', 'Cognac'), ('nova', 'Chocolat'), ('solea', 'Beige & Cognac'), ('velora', 'Ivoire')}

# Tenues : jamais du même coloris que le sac (le sac ne doit pas disparaître).
OUTFITS = {
    'noir': 'trench beige, chemise blanche, jean clair ou maille écrue',
    'ivoire': 'manteau chocolat, maille noire ou blazer marine, pantalon droit',
    'creme': 'maille noire, blazer marine',
    'cognac': 'chemise blanche, maille crème, jean brut ou pantalon gris clair',
    'camel': 'maille écrue, chemise blanche, jean brut',
    'caramel': 'chemise blanche, trench crème, pantalon gris',
    'chocolat': 'maille crème, chemise blanche, jean clair',
    'bordeaux': 'maille gris chiné, chemise écrue, jean clair',
    'taupe': 'chemise blanche, maille noire, pantalon marine',
    'sable': 'maille noire, blazer chocolat, jean brut',
    'beige': 'maille noire, chemise marine, jean brut',
    'vert': 'manteau crème, maille grise, chemise blanche (jamais de vert)',
    'rose': 'maille gris anthracite, chemise blanche, jean clair',
    'sauge': 'chemise écrue, maille chocolat, pantalon blanc',
    'rouge': 'trench crème, maille noire, jean brut',
}

# Familles de décors (brief §35) et rotation par produit.
ENVIRONMENTS = {
    'A': 'rue européenne calme, façades en pierre claire, trottoir, sans enseigne lisible',
    'B': 'café discret, table en bois, lumière de vitrine, arrière-plan flou sans texte',
    'C': 'appartement lumineux, murs ivoire, parquet clair, fenêtre haute',
    'D': 'galerie / architecture contemporaine, béton clair, grandes surfaces nues',
    'E': 'pierre claire en extérieur, escalier ou mur calcaire, lumière rasante douce',
    'F': 'intérieur bois et ivoire, chaise en bois, textiles naturels',
}
ENV_ROTATION = {  # (A hero, B alternatif, C lifestyle)
    'elea': 'ECB', 'mira': 'DAC', 'nova': 'EAB', 'solea': 'EAF', 'lyra': 'DCB', 'luna': 'ECF', 'alya': 'DAC',
    'lila': 'EAB', 'vera': 'DAC', 'naya': 'ECB', 'aurea': 'DEC', 'elara': 'DAB', 'isaure': 'ECF', 'celene': 'DAB',
    'velora': 'DFA', 'amara': 'ECF', 'norea': 'DEA',
}

# Silhouettes (diversité naturelle, jamais un gimmick). La photo A d'un même modèle garde la même
# silhouette, pose et lumière pour tous les coloris (comparaison des couleurs, brief §36) ;
# B et C varient.
PERSONAS = [
    'femme d’environ 30 ans, cheveux châtains mi-longs, teint clair, maquillage naturel',
    'femme d’environ 27 ans, longs cheveux noirs lisses, teint mat',
    'femme d’environ 42 ans, carré blond cendré, teint clair',
    'femme d’environ 33 ans, cheveux bouclés bruns, peau foncée',
    'femme d’environ 29 ans, cheveux roux attachés, taches de rousseur',
    'femme d’environ 36 ans, chignon bas brun, teint olive',
]

# ---------------------------------------------------------------------------------------------------
# Versions anglaises pour les prompts (les générateurs d'images suivent mieux l'anglais).
# Même contenu que ci-dessus, sans rien ajouter.
EN = {
    'elea': {'desc': 'compact structured horizontal rectangular shoulder bag, asymmetric slightly rounded front flap covering almost the whole front, one horizontal topstitch line on the flap, wide flat shoulder strap in the same color attached at the sides, small gold buckle on the left strap attachment, smooth slightly satin finish',
             'A': 'worn on the shoulder, strap over the shoulder, bag resting under the arm', 'B': 'carried in the hand by its strap, arm relaxed along the body', 'C': 'worn on the shoulder while walking'},
    'mira': {'desc': 'small compact bag with rounded sides, regular fine vertical pleats over the whole body, soft gathered (ruched) top handle, short gold chain links joining the handle to the body, gold lobster clasps, detachable adjustable crossbody strap with gold buckle',
             'A': 'worn on the shoulder with its long strap', 'B': 'held in the hand by the ruched top handle', 'C': 'worn crossbody with the adjustable strap'},
    'nova': {'desc': 'large wide tote, slightly flared shape with a soft slouchy top, two rounded tubular handles in the same color, thin horizontal belt across the upper front with belt loops and a small rectangular silver buckle, velvety suede-effect surface with no leather shine',
             'A': 'carried in the hand by both handles', 'B': 'carried in the crook of the arm (only if the real handle drop allows it)', 'C': 'carried in the hand while walking'},
    'solea': {'desc': 'soft half-moon dome-shaped bag, woven straw-look exterior with an even weave, short top handle made of two padded sleeves in the trim color joined by a gold piece in the center, gold zipper along the top, reinforced base in the trim color, detachable adjustable strap with gold buckle',
              'A': 'carried in the hand by the short top handle', 'B': 'worn on the shoulder with the detachable strap', 'C': 'carried in the hand or on the shoulder, summer day'},
    'lyra': {'desc': 'compact structured flap bag, padded square clasp tab in the center of the flap, single top handle, small gold rings on the sides for the strap',
             'A': 'carried in the hand by the top handle', 'B': 'worn crossbody with the strap', 'C': 'worn on the shoulder'},
    'luna': {'desc': 'small compact rounded bucket bag, velvety suede-effect body, contrasting trim band at the base and around the top, small top tab, top handle, gold hardware, long thin adjustable strap',
             'A': 'carried in the hand by the top handle', 'B': 'worn crossbody with the long strap', 'C': 'worn on the shoulder'},
    'alya': {'desc': 'elongated soft cylindrical bag with visible grain, wide flat strap in the same color with gold rivets at the attachments, small gold studs on the ends',
             'A': 'worn on the shoulder', 'B': 'worn crossbody', 'C': 'carried in the hand by the strap, indoors'},
    'lila': {'desc': 'tiny square micro bag (about 11 cm), small rounded flap, small top handle, thin detachable strap with gold clasps; it must stay very small relative to the hand',
             'A': 'held in the hand by the small top handle', 'B': 'worn crossbody with the thin strap', 'C': 'worn crossbody'},
    'vera': {'desc': 'semi-rigid horizontal rectangular flap bag, rounded flap edge, rectangular gold clasp in the center of the flap, thin shoulder strap with gold sliders, smooth slightly glossy surface, visible edge stitching',
             'A': 'worn on the shoulder', 'B': 'held against the body in the hand', 'C': 'worn on the shoulder'},
    'naya': {'desc': 'soft minimalist shoulder bag with a gently curved U-shaped top opening, flat shoulder strap in the same color with small gold attachments, smooth surface',
             'A': 'worn on the shoulder', 'B': 'worn on the shoulder, three-quarter back view', 'C': 'worn on the shoulder'},
    'aurea': {'desc': 'soft crescent-shaped hobo bag, single thin shoulder strap adjustable with a silver buckle, zipper along the opening, smooth matte surface',
              'A': 'worn on the shoulder', 'B': 'worn on the shoulder, profile view', 'C': 'worn on the shoulder'},
    'elara': {'desc': 'structured bag with two top handles, panel construction with one horizontal seam and vertical seams, gold rivets on the handles, wide detachable shoulder strap with gold attachments, visible grain',
              'A': 'carried in the hand by both handles', 'B': 'worn crossbody with the wide strap', 'C': 'worn on the shoulder'},
    'isaure': {'desc': 'large minimalist semi-structured tote-bucket bag, one wide shoulder strap adjusted through side loops, smooth surface',
               'A': 'worn on the shoulder', 'B': 'worn on the shoulder, three-quarter back view', 'C': 'worn on the shoulder'},
    'celene': {'desc': 'structured Boston / bowling bag, two rounded handles in the same color, double gold zipper pulls at the top center, contrast edge stitching, visible grain',
               'A': 'carried in the hand by both handles', 'B': 'worn crossbody with the strap', 'C': 'worn on the shoulder'},
    'velora': {'desc': 'structured horizontal trapezoid bag, large flap covering the front, pleated side gussets, single rounded top handle, small blank rectangular embossed plate on the flap (no text)',
               'A': 'carried in the hand by the top handle', 'B': 'worn on the shoulder with the short strap', 'C': 'worn crossbody with the long strap'},
    'amara': {'desc': 'soft bucket bag, two thin handles with a knotted loop on one handle attachment, small round gold piece on the side, thin detachable strap with gold clasps, contrasting brown interior visible at the opening',
              'A': 'carried in the hand by both handles', 'B': 'worn on the shoulder', 'C': 'worn crossbody'},
    'norea': {'desc': 'horizontal square-ish flap bag, layered wrap-around front band, double silver zipper pulls in the center with long leather tabs, long thin shoulder handle',
              'A': 'worn on the shoulder', 'B': 'worn on the shoulder, profile view', 'C': 'worn on the shoulder'},
}
COLOR_EN = {
    'Cognac': 'cognac brown', 'Noir': 'black', 'Ivoire': 'ivory', 'Sable': 'sand beige', 'Taupe': 'taupe',
    'Chocolat': 'chocolate brown', 'Bordeaux': 'burgundy', 'Camel': 'camel', 'Beige & Cognac': 'natural beige straw with cognac trims',
    'Beige & Noir': 'natural beige straw with black trims', 'Crème & Chocolat': 'cream body with chocolate trims',
    'Taupe & Chocolat': 'taupe body with chocolate trims', 'Vert': 'deep green', 'Caramel': 'caramel brown', 'Rouge': 'red',
    'Taupe / Greige': 'taupe greige', 'Beige Sable': 'sand beige', 'Sauge': 'sage green', 'Rose Poudré': 'powder pink',
}
OUTFITS_EN = {
    'noir': 'a beige trench coat, white shirt and light jeans', 'ivoire': 'a chocolate wool coat over a black knit and straight trousers',
    'creme': 'a black knit and navy blazer', 'cognac': 'a white shirt, cream knit and raw denim', 'camel': 'an ecru knit and raw denim',
    'caramel': 'a white shirt, cream trench and grey trousers', 'chocolat': 'a cream knit, white shirt and light jeans',
    'bordeaux': 'a heather grey knit and light jeans', 'taupe': 'a white shirt and navy trousers', 'sable': 'a black knit and chocolate blazer',
    'beige': 'a black knit and raw denim', 'vert': 'a cream coat and grey knit (no green clothing)', 'rose': 'a charcoal knit and white shirt',
    'sauge': 'an ecru shirt and chocolate knit', 'rouge': 'a cream trench and black knit',
}
ENV_EN = {
    'A': 'a calm European street with pale stone facades, no readable signs',
    'B': 'a discreet café with a wooden table and window light, blurred background without text',
    'C': 'a bright apartment with ivory walls, light oak floor and a tall window',
    'D': 'a contemporary gallery with pale concrete and large bare surfaces',
    'E': 'pale limestone outdoors, a stone staircase or wall in soft low sunlight',
    'F': 'a wood and ivory interior with a wooden chair and natural textiles',
}
PERSONAS_EN = [
    'a woman about 30, mid-length chestnut hair, fair skin, natural makeup',
    'a woman about 27, long straight black hair, light olive skin',
    'a woman about 42, ash-blond bob, fair skin',
    'a woman about 33, curly brown hair, dark skin',
    'a woman about 29, red hair tied back, freckles',
    'a woman about 36, low brown bun, olive skin',
]
