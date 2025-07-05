/**
 * Auto-assign initiative from DEX and resolve ties at combat start.
 *
 * • On `createCombatant` → if the GM adds a combatant with no initiative,
 *   copy the actor’s DEX statistic.
 * • On `combatStart` → for any initiatives that tie, roll 1d100 and
 *   append a two-decimal tiebreaker (e.g. 55 → +0.55).
 */
export function register() {

    // Give new combatants an initiative equal to their DEX
    Hooks.on("createCombatant", async combatant => {
        if (!game.user.isGM) return;
        if (combatant.initiative != null) return;

        const dex = combatant.actor?.system?.statistics?.dex?.value ?? 0;
        await combatant.update({ initiative: dex });
    });

    // Break initiative ties at combat start
    Hooks.on("combatStart", async combat => {
        if (!game.user.isGM) return;

        const tieGroups = {};

        // Group combatants by raw initiative
        for (const c of combat.turns) {
            if (c.initiative == null) continue;
            (tieGroups[c.initiative] ??= []).push(c);
        }

        // Only touch groups that are actually tied
        for (const group of Object.values(tieGroups)) {
            if (group.length <= 1) continue;

            for (const c of group) {
                const { total: tiebreaker } = await (new Roll("1d100")).roll({ async: true });

                // Two-decimal tiebreaker (0.01–0.99)
                const adjusted = Math.floor((c.initiative + tiebreaker / 100) * 100) / 100;
                await c.update({ initiative: adjusted });

                // Optional chat output
                ChatMessage.create({
                    content: `${c.name} rolls ${tiebreaker} for tiebreaker → initiative ${adjusted.toFixed(2)}`,
                    speaker: { actor: c.actor?.id ?? null }
                });
            }
        }
    });
}