# Lelon

Configuration Claude Code du projet Lelon. Ouvre ce dépôt avec Claude Code et tu disposes d'environ 280 skills, 71 agents et 98 commandes pour créer des sites 3D immersifs, des interfaces soignées, des animations, des vidéos et du contenu marketing.

## Contenu

| Emplacement | Rôle |
|---|---|
| `CLAUDE.md` | Instructions lues à chaque session : ECC d'abord, puis l'ordre de priorité des skills |
| `.claude/skills/` | Les skills, un dossier par skill |
| `.claude/agents/` | Les 71 agents d'ECC |
| `.claude/commands/` | Les 98 commandes d'ECC (`/plan`, `/code-review`, etc.) |
| `.claude/rules/ecc/` | Les règles d'ECC : `common/` à chaque session, les règles d'un langage quand tu travailles sur ses fichiers |

## Domaines couverts

- **Sites 3D** : three.js, WebGPU et TSL, React Three Fiber, Spline, Babylon.js, A-Frame, mondes 3D pilotés par le scroll.
- **UI/UX** : Taste Skill, Impeccable, UI UX Pro Max, skills d'Emil Kowalski, shadcn/ui, accessibilité.
- **Motion** : GSAP, Motion (ex-Framer Motion), Lottie, Rive, Anime.js, Barba.js, principes de motion design.
- **Vidéo** : Remotion, montage, vidéos explicatives.
- **Marketing** : copywriting, SEO, publicité, réseaux sociaux, lancement, prix.
- **Méthode** : ECC (planification, revue de code, tests, vérification) et context engineering.

## Utilisation

1. Ouvre le dépôt dans Claude Code : terminal, application de bureau ou [claude.ai/code](https://claude.ai/code).
2. Décris ta tâche. Claude choisit le skill qui correspond.
3. Pour imposer un skill, tape `/` suivi de son nom, par exemple `/copywriting` ou `/stop-slop`. Avec autant de skills, c'est le moyen le plus sûr.

## Sources

Les skills et la configuration viennent de ces dépôts publics. Chacun reste sous la licence de son dépôt d'origine.

- [affaan-m/ECC](https://github.com/affaan-m/ECC)
- [anthropics/skills](https://github.com/anthropics/skills)
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- [remotion-dev/skills](https://github.com/remotion-dev/skills) et [remotion-dev/remotion](https://github.com/remotion-dev/remotion)
- [greensock/gsap-skills](https://github.com/greensock/gsap-skills)
- [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills)
- [dgreenheck/webgpu-claude-skill](https://github.com/dgreenheck/webgpu-claude-skill)
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- [emilkowalski/skill](https://github.com/emilkowalski/skill)
- [ibelick/ui-skills](https://github.com/ibelick/ui-skills)
- [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better)
- [kylezantos/design-motion-principles](https://github.com/kylezantos/design-motion-principles)
- [shadcn/ui](https://github.com/shadcn/ui)
- [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills)
- [MengTo/Skills](https://github.com/MengTo/Skills)
- [lottiefiles/motion-design-skill](https://github.com/lottiefiles/motion-design-skill)
- [motiondivision/motion](https://github.com/motiondivision/motion)
- [secondsky/claude-skills](https://github.com/secondsky/claude-skills)
- [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)
- [hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop)
- [muratcankoylan/Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering)
