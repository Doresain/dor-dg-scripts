/**
 * Click-through tile → macro trigger
 * • Watches clicks on one Tile in one Scene.
 * • Fires the chosen macro no matter what canvas layer is active.
 *
 * Settings added (scope: world, editable from Module Settings):
 *   dor-dg-scripts.mapLayerSceneId   – Scene _id
 *   dor-dg-scripts.mapLayerTileId    – TileDocument _id
 *   dor-dg-scripts.mapLayerMacroKey  – Macro _id or exact name
 */
export function register() {

    const MODULE_ID = "dor-dg-scripts";

    const SETTINGS = {
        sceneId : "mapLayerSceneId",
        tileId  : "mapLayerTileId",
        macro   : "mapLayerMacroKey"
    };

    /* ------------------------------------------------------------ *
     * 1. Register the string settings                              *
     * ------------------------------------------------------------ */

    game.settings.register(MODULE_ID, SETTINGS.sceneId, {
        name:  "Map-Layer Tile • Scene ID",
        hint:  "Scene _id that contains the tile to monitor.",
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: true
    });

    game.settings.register(MODULE_ID, SETTINGS.tileId, {
        name:  "Map-Layer Tile • Tile ID",
        hint:  "TileDocument _id to watch inside that scene.",
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: true
    });

    game.settings.register(MODULE_ID, SETTINGS.macro, {
        name:  "Map-Layer Tile • Macro (id or name)",
        hint:  "Macro to execute when the tile is clicked.",
        scope: "world",
        config: true,
        type: String,
        default: "",
        requiresReload: true
    });


    /* ------------------------------------------------------------ *
     * 2. Helper – DOM client ➜ scene coordinates                   *
     * ------------------------------------------------------------ */
    function domToScene(clientX, clientY) {
        const p = new PIXI.Point();
        const r = canvas.app.renderer;

        if (r?.events?.mapPositionToPoint) {                 // PIXI-7
            r.events.mapPositionToPoint(p, clientX, clientY);
        } else if (r?.plugins?.interaction?.mapPositionToPoint) { // PIXI-6
            r.plugins.interaction.mapPositionToPoint(p, clientX, clientY);
        } else {                                             // fallback
            const rect = canvas.app.view.getBoundingClientRect();
            p.set(clientX - rect.left, clientY - rect.top);
        }
        return canvas.stage.worldTransform.applyInverse(p);  // to scene space
    }

    /* ------------------------------------------------------------ *
     * 3. Canvas-ready: attach listener if we’re on the target scene *
     * ------------------------------------------------------------ */
    Hooks.on("canvasReady", () => {

        const SCENE_ID = game.settings.get(MODULE_ID, SETTINGS.sceneId);
        const TILE_ID  = game.settings.get(MODULE_ID, SETTINGS.tileId);
        const MACRO_KEY = game.settings.get(MODULE_ID, SETTINGS.macro);

        if (!SCENE_ID || !TILE_ID || !MACRO_KEY) return;   // not configured

        if (canvas.scene?.id !== SCENE_ID) return;         // wrong scene

        const tile = canvas.scene.tiles.get(TILE_ID);
        if (!tile) {
            console.warn(
                `dor-dg-scripts | Map-Layer Tile: Tile ${TILE_ID} not found in scene ${SCENE_ID}`
            );
            return;
        }

        // --- listener -------------------------------------------------------
        async function fireMacro() {
            const macro = game.macros.get(MACRO_KEY) ?? game.macros.getName(MACRO_KEY);
            if (macro) return macro.execute();
            ui.notifications.error(`Macro "${MACRO_KEY}" not found.`);
        }

        /** @param {PointerEvent} ev */
        async function onPointerUp(ev) {
            const { x, y } = domToScene(ev.clientX, ev.clientY);
            if (x >= tile.x && x <= tile.x + tile.width &&
                y >= tile.y && y <= tile.y + tile.height) {
                await fireMacro();
            }
        }

        // Prevent duplicates on hot-reload
        canvas.app.view.removeEventListener("pointerup", onPointerUp, true);
        canvas.app.view.addEventListener("pointerup", onPointerUp, true);

        Hooks.once("canvasTearDown", () =>
            canvas.app.view.removeEventListener("pointerup", onPointerUp, true)
        );
    });

}