/**
 * FBI-style re-theme for the Simple Quest module.
 *
 * • On `setup`  → patch translation strings in‐place.
 * • On `renderSimpleQuest` → update the app/window title every time it opens.
 */
export function register() {
    if (!game.modules.get("simple-quest")?.active) return;
    /* ------------------------------------------------------------ *
     * 1. Patch translation strings once per world load             *
     * ------------------------------------------------------------ */
    Hooks.once("setup", () => {

        /** Path→replacement pairs (dot-notation keys) */
        const REPLACEMENTS = {
            // Tooltips
            "simple-quest.tooltip.add-quest":           "Add Lead",
            "simple-quest.tooltip.add-lore":            "Add File",
            "simple-quest.tooltip.edit-lore":           "Edit File",
            "simple-quest.tooltip.edit-quest":          "Edit Lead",
            "simple-quest.tooltip.delete-quest":        "Delete Lead",
            "simple-quest.tooltip.delete-lore":         "Delete File",
            "simple-quest.tooltip.share-quest":         "Send to Chat",
            "simple-quest.tooltip.duplicate-quest":     "Duplicate Lead",
            "simple-quest.tooltip.duplicate-lore":      "Duplicate File",
            "simple-quest.tooltip.mark-updated":        "Mark Lead as Updated",

            // Delete dialogs
            "simple-quest.deleteQuest.title":           "Delete Lead? - ",
            "simple-quest.deleteQuest.content":         "Are you sure you want to delete this Lead? This cannot be undone.",
            "simple-quest.deleteLore.title":            "Delete File? - ",
            "simple-quest.deleteLore.content":          "Are you sure you want to delete this file? This cannot be undone.",

            // Share dialogs
            "simple-quest.shareQuest.title":            "Send Lead to Chat",
            "simple-quest.shareQuest.content":          "Are you sure you want to send the 'New Lead' notification to chat?",
            "simple-quest.shareQuest.chatMessage":      "New Lead Available!",
            "simple-quest.shareLore.title":             "Send File to Chat",
            "simple-quest.shareLore.content":           "Are you sure you want to send the 'New File' notification to chat?",
            "simple-quest.shareLore.chatMessage":       "New File Available!",

            // Quest update notification
            "simple-quest.questNotification.text":      "Lead %q has been updated!",

            // Misc UI strings & welcome screen
            "simple-quest.moveQuest.error":             "You don't have permission to move Leads to that category.",
            "simple-quest.title":                       "SENTINEL Case Management",
            "simple-quest.default-structure.completed": "File Complete",
            "simple-quest.default-structure.failed":    "Discarded",
            "simple-quest.default-structure.in-progress":"File Open",
            "simple-quest.notifications.playerJournalUpdated": "Agent personal log updated.",
            "simple-quest.showQuest.title":             "Show Lead",
            "simple-quest.welcomeScreen.title":         "SENTINEL Access Approved.",
            "simple-quest.welcomeScreen.content":       "Welcome to the FBI's SENTINEL Case Management System.<hr>Press <span class='hotkey'>J</span> to open the SENTINEL interface."
        };

        // Apply overrides in place
        for (const [path, value] of Object.entries(REPLACEMENTS)) {
            foundry.utils.setProperty(game.i18n.translations, path, value);
        }

        ui.notifications.info(
            "FBI SENTINEL Case Management System loaded. Press 'J' to access."
        );
    });

    /* ------------------------------------------------------------ *
     * 2. Retitle every Simple Quest window when it renders         *
     * ------------------------------------------------------------ */
    Hooks.on("renderSimpleQuest", (app, html) => {
        const newTitle = game.i18n.format("simple-quest.title");   // your key

        /* 1️⃣  keep the Application object up-to-date */
        app.options.title = newTitle;

        /* 2️⃣  rewrite the header already rendered in the DOM */
        html.closest(".window-app")
            .find(".window-title")
            .text(newTitle);
    });

}