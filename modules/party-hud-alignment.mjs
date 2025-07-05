
/**
 * Re-positions the Party Monitor dock (id="party-monitor-dock")
 * to sit 10 % up from the bottom of the UI column.
 */
export function register() {
    if (!game.modules.get("party-monitor-dock")?.active) return;
    Hooks.once("ready", () => {

        const findDock = () => document.getElementById("party-monitor-dock");

        /** Move the dock and report whether it was found. */
        const nudge = () => {
            const el = findDock();
            if (!el) return false;
            el.style.setProperty("bottom", "10%", "important");
            return true;
        };

        // 1. Try immediately (covers a cold reload where the element is already there).
        if (nudge()) return;

        // 2. Otherwise watch #ui-left-column-1 until the dock appears.
        const targetNode = document.getElementById("ui-left-column-1");
        if (!targetNode) return;   // should never happen, but guards against null

        const observer = new MutationObserver(() => {
            if (nudge()) observer.disconnect();
        });

        observer.observe(targetNode, { childList: true, subtree: true });
    });

}