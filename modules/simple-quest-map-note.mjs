/**
 * Redirects map-note clicks that point to a Journal **page** flagged for
 * Simple-Quest. Instead of opening the journal sheet it launches the SQ UI
 * directly at that page.
 *
 * Requires `ui.simpleQuest.openToPage(uuid)` (or replace the stub below with
 * whatever API your Simple-Quest fork exposes).
 */
export function register() {
    if (!game.modules.get("simple-quest")?.active) return;
    const SQ_FLAG_SCOPE = "simple-quest";   // flag namespace on JournalEntryPage

    Hooks.on("activateNote", (note, opts) => {
        try {
            /* 1️⃣  Resolve the page being activated -------------------------- */
            const entryId = note.document.entryId;
            const pageId  = opts?.pageId ?? note.document.pageId;

            const entry = game.journal.get(entryId);
            if (!entry) return;

            const page = entry.pages.get(pageId) ?? entry.pages.contents[0];
            if (!page)  return;

            /* 2️⃣  Skip if the page isn’t marked for Simple-Quest ------------ */
            if (!page.flags?.[SQ_FLAG_SCOPE]) return;

            /* 3️⃣  Build UUID and hand off to SQ UI -------------------------- */
            const pageUUID = page.uuid;   // "JournalEntry.<id>.JournalEntryPage.<id>"
            console.debug(`Simple-Quest map-note redirect → ${pageUUID}`);

            launchSimpleQuestFromUuid(pageUUID);   // ← replace if needed

            return false;  // suppress Foundry's default journal opening
        }
        catch (err) {
            console.error("SQ Map-Note Redirector | Error in activateNote hook", err);
        }
    });

    /**
     * Stub – swap in the actual call your module (or Simple-Quest fork) needs.
     * @param {string} uuid Full UUID of the JournalEntryPage
     */
    function launchSimpleQuestFromUuid(uuid) {
        ui.simpleQuest?.openToPage(uuid);
    }
}