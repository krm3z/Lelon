# Lelon : instructions pour Claude

## 1. ECC d'abord, à chaque conversation

ECC (Everything Claude Code, `affaan-m/ECC`, profil `minimal` + modules `business-content` et `media-generation`, sans hooks) est installé dans `.claude/` :

- règles `.claude/rules/ecc/` : `common/` est chargé à chaque conversation, les règles par langage seulement sur les fichiers concernés ;
- 71 agents dans `.claude/agents/`, 98 commandes dans `.claude/commands/`, 103 skills dans `.claude/skills/`.

À chaque conversation :

1. Appliquer les règles ECC.
2. Avant de commencer une tâche, chercher le skill, l'agent ou la commande ECC qui la couvre et l'utiliser en premier.
3. Points d'entrée utiles : `ecc-guide` (orientation dans ECC), `ecc-recipes`, `plan-canvas`, `verification-loop`, `tdd-workflow`, `brand-voice`, `content-engine`, `marketing-campaign`, `seo`, `remotion-video-creation`.

## 2. Ordre de priorité des skills

Quand plusieurs skills couvrent la même tâche, utiliser le premier de cette liste :

1. **ECC** : tous ses skills, agents et commandes.
2. **Taste Skill** : `design-taste-frontend`.
3. **UI UX Pro Max** : `ui-ux-pro-max`, `design-system`, `ui-styling`, `design`, `banner-design`, `brand`, `slides`.
4. **Design Motion Principles** : `design-motion-principles`.
5. **Claude Design Skills** : `motion-framer`, `threejs-webgl`, `react-three-fiber`, `spline-interactive`, `lottie-animations`, `rive-interactive`, `animejs`, `barba-js`, `locomotive-scroll`, `react-spring-physics`, `babylonjs-engine`, `playcanvas-engine`, `pixijs-2d`, `aframe-webxr`, `lightweight-3d-effects`, `web3d-integration-patterns`, `blender-web-pipeline`, `animated-component-libraries`, `scroll-reveal-libraries`, `modern-web-design`, `substance-3d-texturing`.
6. **Motion** : `improve`, `fix`.
7. **Marketing Skills** : `copywriting`, `copy-editing`, `cro`, `seo-audit`, `ai-seo`, `ads`, `ad-creative`, `social`, `content-strategy`, `launch`, `pricing`, `emails`, `influencer-marketing`, `marketing-plan` et les autres skills marketing.
8. **Stop Slop** : `stop-slop`, pour relire tout texte destiné au public.
9. **Remotion** : `remotion-best-practices`, `remotion-create`, `remotion-render` et les autres `remotion-*`.
10. **Context Engineering** : `context-engineering-collection`, `context-fundamentals`, `context-optimization`, `context-compression` et les autres skills du dépôt.
11. Ensuite seulement, les autres skills de `.claude/skills/` (three.js, GSAP, Emil Kowalski, Meng To, etc.).
