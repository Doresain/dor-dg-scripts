export const MODULE_ID = "dor-dg-scripts";

/**
 * Register one Boolean setting for every feature.
 * @param {Array<{ key:string, name:string, hint:string }>} defs
 */
export function registerSettings(defs) {
    defs.forEach(({ key, name, hint }) => {
        game.settings.register(MODULE_ID, key, {
            name,                       // appears in Configure Settings
            hint,
            scope: "world",             // a world-wide toggle
            config: true,               // show in the GUI
            type: Boolean,
            default: true
        });
    });
}

/** Convenience helper */
export const isFeatureEnabled = (key) => game.settings.get(MODULE_ID, key);