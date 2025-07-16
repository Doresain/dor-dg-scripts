/**
 * Backgroundless Pins — Foundry VTT v13+
 * Globally hides the grey circle (“bg”) that Foundry draws under every
 * map-note ControlIcon.
 *
 * Strategy: patch ControlIcon#draw and #refresh once at startup, tell each
 * instance to keep its .bg sprite invisible.
 */

export function register() {
    // Guard so hot-reloads or re-enabling the feature don’t double-patch
    if (ControlIcon.prototype.__bglessPatched) return;

    /* ---- draw ------------------------------------------------------- */
    const coreDraw = ControlIcon.prototype.draw;
    ControlIcon.prototype.draw = async function (...args) {
        const icon = await coreDraw.apply(this, args);
        if (this.bg) this.bg.visible = false;
        return icon;
    };

    /* ---- refresh (hover, lock, etc.) -------------------------------- */
    const coreRefresh = ControlIcon.prototype.refresh;
    ControlIcon.prototype.refresh = function (...args) {
        const out = coreRefresh.apply(this, args);
        if (this.bg) this.bg.visible = false;
        return out;
    };

    ControlIcon.prototype.__bglessPatched = true;   // mark as done
}