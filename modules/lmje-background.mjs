export function register() {
    Hooks.on("renderJournalEntryPageSheet", (app, html, data) => {
        const backgroundStyle = "#374e13";
        html.querySelectorAll("span.LMJE-link").forEach(span => {
            span.style.background = backgroundStyle;
        });
    });
}