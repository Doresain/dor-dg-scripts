export function register() {
    Hooks.on("renderJournalPageSheet", (app, html, data) => {
        const backgroundStyle = "rgba(11, 10, 19, 0.9)";
        html[0].querySelectorAll("span.LMJE-link").forEach(span => {
            span.style.background = backgroundStyle;
        });
    });
}