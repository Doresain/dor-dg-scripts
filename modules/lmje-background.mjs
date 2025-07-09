export function register() {
    Hooks.on("renderJournalEntryPageSheet", (app, html, data) => {
        const backgroundStyle = "rgba(11, 10, 19, 0.9)";
        html.querySelectorAll("span.LMJE-link").forEach(span => {
            span.style.background = backgroundStyle;
        });
    });
}