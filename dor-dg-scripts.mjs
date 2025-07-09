import { registerSettings, isFeatureEnabled } from "./settings.mjs";

/* ---------- Feature imports (named) --------------------------- */
import { register as partyHudAlignment }   from "./modules/party-hud-alignment.mjs";
import { register as initiative } from "./modules/initiative.mjs";
import { register as simpleQuestTheme }   from "./modules/simple-quest-theme.mjs";
import { register as simpleQuestMask }   from "./modules/simple-quest-mask.mjs";
import { register as simpleQuestMapNote } from "./modules/simple-quest-map-note.mjs";
import { register as mapLayerTile }       from "./modules/map-layer-tile.mjs";
import { register as lmjeBackground }       from "./modules/lmje-background.mjs";


/* ---------- Feature list & human-readable labels -------------- */
const FEATURES = [
    {
        key:  "partyHudAlignment",                 // setting key
        name: "Party HUD Alignment",
        hint: "Keeps the Party HUD above the player menu.",
        init: partyHudAlignment                    // register() fn
    },
    {
        key:  "initiative",
        name: "Initiative Handling",
        hint: "Copies DEX for initiative and resolves ties with 1d100.",
        init: initiative
    },
    {
        key:  "simpleQuestTheme",
        name: "Simple-Quest FBI Theme",
        hint: "Rebrands Simple Quest as SENTINEL Case Management.",
        init: simpleQuestTheme
    },
    {
        key:  "simpleQuestMask",
        name: "Simple-Quest Map Mask Removal",
        hint: "Disables the dark vignette/mask on SQ map images.",
        init: simpleQuestMask
    },
    {
        key:  "simpleQuestMapNote",
        name: "Simple-Quest Map-Note Redirect",
        hint: "Clicks on flagged map notes open the Simple-Quest UI directly.",
        init: simpleQuestMapNote
    },
    {
        key:  "mapLayerTile",
        name: "Map-Layer Tile → Macro",
        hint: "Clicking a specific tile in a scene fires a macro, regardless of layer.",
        init: mapLayerTile
    },
    {
        key:  "lmjeBackground",
        name: "Lyynix More Journal Extenders Background Fix",
        hint: "Changes the white BG to a black one.",
        init: lmjeBackground
    }
    // { key:"something", name:"...", hint:"...", init: something },
];

/* ---------- Hook: init  --------------------------------------- */
Hooks.once("init", () => {
    // 1. Register Boolean settings for every feature
    registerSettings(FEATURES);

    // 2. Fire only the enabled features
    for (const f of FEATURES) {
        if (isFeatureEnabled(f.key)) f.init();
    }
});