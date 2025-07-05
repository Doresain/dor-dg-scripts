/**
 * Removes the CSS mask from Simple-Quest’s map image for a cleaner look.
 */
export function register() {
    if (!game.modules.get("simple-quest")?.active) return;
    Hooks.once("setup", () => {
        const css = `
      .simple-quest-map-image {
        mask-image: none !important;
        -webkit-mask-image: none !important;
        mask: none !important;
        -webkit-mask: none !important;
      }`;

        const styleTag      = document.createElement("style");
        styleTag.id         = "sq-remove-mask";
        styleTag.textContent = css;

        document.head.appendChild(styleTag);
    });

}