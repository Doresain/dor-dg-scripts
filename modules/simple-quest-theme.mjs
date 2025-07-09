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
            "simple-quest.simple-quest.title": "SENTINEL Case Management",
            "simple-quest.simple-quest.tabs.quests": "Cases",
            "simple-quest.simple-quest.tabs.lore": "Files",
            "simple-quest.simple-quest.tabs.my-journal": "Agent Activity Log",
            "simple-quest.simple-quest.tabs.party-journal": "JTF SITREP",
            "simple-quest.simple-quest.moveQuest.error": "You don't have permission to move cases to that category.",
            "simple-quest.simple-quest.tooltip.add-quest": "Add Case",
            "simple-quest.simple-quest.tooltip.add-map": "Add Map",
            "simple-quest.simple-quest.tooltip.add-lore": "Add File",
            "simple-quest.simple-quest.tooltip.add-page": "Add ICS-214",
            "simple-quest.simple-quest.tooltip.edit-lore": "Edit File",
            "simple-quest.simple-quest.tooltip.edit-quest": "Edit Case",
            "simple-quest.simple-quest.tooltip.delete-quest": "Delete Case",
            "simple-quest.simple-quest.tooltip.delete-lore": "Delete File",
            "simple-quest.simple-quest.tooltip.duplicate-quest": "Duplicate Case",
            "simple-quest.simple-quest.tooltip.duplicate-lore": "Duplicate File",
            "simple-quest.simple-quest.tooltip.mark-updated": "Mark Case as Updated",
            "simple-quest.simple-quest.tooltip.toggle-completed": "Show Completed",
            "simple-quest.importQuests.title": "Import Cases: ",
            "simple-quest.importQuests.content": "Are you sure you want to import cases from this journal? If a category with the same name already exists, the cases will be added to it.",
            "simple-quest.deleteQuest.title": "Delete Case? - ",
            "simple-quest.deleteQuest.content": "Are you sure you want to delete this case? This cannot be undone.",
            "simple-quest.deleteLore.title": "Delete File? - ",
            "simple-quest.deleteLore.content": "Are you sure you want to delete this file? This cannot be undone.",
            "simple-quest.deletePage.title": "Delete Page? - ",
            "simple-quest.deletePage.content": "Are you sure you want to delete this report? This cannot be undone.",
            "simple-quest.shareQuest.title": "Send Case to Chat",
            "simple-quest.shareQuest.content": "Are you sure you want to send the 'New Case' notification to chat?",
            "simple-quest.shareQuest.chatMessage": "New Case File Available!",
            "simple-quest.shareLore.title": "Send File to Chat",
            "simple-quest.shareLore.content": "Are you sure you want to send the 'New File' notification to chat?",
            "simple-quest.shareLore.chatMessage": "New File Available!",
            "simple-quest.showQuest.title": "Show Case",
            "simple-quest.welcomeScreen.title": "SENTINEL Access Approved.",
            "simple-quest.welcomeScreen.content": "Welcome to the FBI's SENTINEL Case Management System.<hr>Press <span class='hotkey'>J</span> to open the SENTINEL interface.",
            "simple-quest.questNotification.text": "Case %q has been updated!",
            "simple-quest.hotkeys.toggleSimpleQuest.name": "Toggle SENTINEL",
            "simple-quest.notifications.playerJournalUpdated": "Agent ICS-214 updated.",
            "simple-quest.notifications.noPage": "SENTINEL: Please select a page to delete.",
            "simple-quest.proseMirrorMenu.callout.title": "Callout",
            "simple-quest.proseMirrorMenu.callout.callout-lore": "Lore",
            "simple-quest.proseMirrorMenu.callout.callout-magic": "Magic",
            "simple-quest.proseMirrorMenu.callout.callout-item": "Item",
            "simple-quest.proseMirrorMenu.callout.callout-creature": "Creature",
            "simple-quest.proseMirrorMenu.callout.callout-event": "Event",
            "simple-quest.proseMirrorMenu.callout.callout-time": "Time",
            "simple-quest.proseMirrorMenu.callout.callout-npc": "NPC",
            "simple-quest.proseMirrorMenu.callout.callout-location": "Location",
            "simple-quest.proseMirrorMenu.pageInsert.title": "Insert Page",
            "simple-quest.proseMirrorMenu.pageInsert.parchment-note-1": "Parchment Note 1",
            "simple-quest.proseMirrorMenu.pageInsert.parchment-note-2": "Parchment Note 2",
            "simple-quest.proseMirrorMenu.pageInsert.parchment-note-3": "Parchment Note 3",
            "simple-quest.proseMirrorMenu.pageInsert.parchment-note-4": "Parchment Note 4",
            "simple-quest.proseMirrorMenu.pageInsert.parchment-book-1": "Book 1",
            "simple-quest.proseMirrorMenu.pageInsert.parchment-book-2": "Book 2",
            "simple-quest.proseMirrorMenu.pageInsert.parchment-scroll-1": "Scroll",
            "simple-quest.proseMirrorMenu.text.initial": "Large Initial",
            "simple-quest.page-template.label": "Page Template",
            "simple-quest.page-template.description": "This is a collection of HTML templates to format your journal pages. This formatting will continue to work even if the SENTINEL module is disabled. Click on a button to append the template to the end of the page.",
             "simple-quest.tours.interface.1.title": "Sections",
            "simple-quest.tours.interface.1.content": "This area shows the various sections of SENTINEL, you can click on a section to navigate to it, Right click to Edit tab names and Hover on the top right corner to bring up the Toggle full-screen button.",
            "simple-quest.tours.interface.2.title": "Case List",
            "simple-quest.tours.interface.2.content": "This area shows the list of case categories and the cases within them, You can Right Click a category to edit it's name. On the Top Right you will find button to Add a new Case and Add a new Category. Hover over the Left Side of a Case title to bring up the Toggle Hidden button.",
            "simple-quest.tours.interface.3.title": "Case Details",
            "simple-quest.tours.interface.3.content": "This area shows the details of the selected case. In the top right corner you will find buttons to manage the case, you can hover the buttons for a tooltip explaining what they do.",
            "simple-quest.tours.interface.4.title": "Font Size",
            "simple-quest.tours.interface.4.content": "This area allows you to change the font size of SENTINEL",
            "simple-quest.tours.interface.name": "Interface Tour & Quest Tab",
            "simple-quest.tours.interface.description": "This tour will show you how to use the SENTINEL main interface and the Cases tab.",
            "simple-quest.tours.lore-tab.1.title": "File Tab",
            "simple-quest.tours.lore-tab.1.content": "The File Tab displays all the Files present in the File folder within the SENTINEL interface. While this tab does not offer any special functionality, it is a convenient way to access your files. The Permissions to view files is mirrored from the Core Foundry Journal Permissions.",
            "simple-quest.tours.lore-tab.2.title": "File List",
            "simple-quest.tours.lore-tab.2.content": "This area shows the list of file categories and the files within them, You can Right Click a category to edit it's name. On the Top Right you will find button to Add a new File and Add a new Category. Hover over the Left Side of a File title to bring up the Toggle Hidden button.",
            "simple-quest.tours.lore-tab.3.title": "File Details",
            "simple-quest.tours.lore-tab.3.content": "This area shows the details of the selected file. In the top right corner you will find buttons to manage the file, you can hover the buttons for a tooltip explaining what they do.",
            "simple-quest.tours.lore-tab.name": "Files Tab",
            "simple-quest.tours.lore-tab.description": "This tour will show you how to use the Files tab.",
            "simple-quest.tours.map-tab.1.title": "Map Tab",
            "simple-quest.tours.map-tab.1.content": "The Map Tab displays all the Maps Present in the Maps Journal inside the Quests Folder.",
            "simple-quest.tours.map-tab.2.title": "Map List",
            "simple-quest.tours.map-tab.2.content": "This area shows the list of maps, On the Top Right you will find button to Add a new Map and a button that will explain the more advanced controls. Hover over the Left Side of a Map title to bring up the Toggle Hidden button.",
            "simple-quest.tours.map-tab.3.title": "Map Details",
            "simple-quest.tours.map-tab.3.content": "This area shows the selected map. You can pan the map by clicking and dragging, zoom in and out with the mouse wheel. On the top right corner you will find buttons to manage the map, you can hover the buttons for a tooltip explaining what they do.",
            "simple-quest.tours.map-tab.4.title": "Markers",
            "simple-quest.tours.map-tab.4.content": "You can Right click (you can hold for a preview) on the map to add a marker. You can also Right click on a marker to edit it or Right click and drag a marker to move it. You can Left click on a marker to open it's notes, quest or linked document. Drag and Dropping any document onto the map will create a marker linked to that document.",
            "simple-quest.tours.map-tab.5.title": "Fog of War",
            "simple-quest.tours.map-tab.5.content": "You can hold the Shift to display the Fog of War brush. Left Click to hide the map and Right Click to reveal the map.",
            "simple-quest.tours.map-tab.6.title": "Measuring",
            "simple-quest.tours.map-tab.6.content": "You can hold the Ctrl key to engage the measuring tool. While holding Ctrl, Left Click and drag to measure.",
            "simple-quest.tours.map-tab.name": "Map Tab",
            "simple-quest.tours.map-tab.description": "This tour will show you how to use the Map tab.",
            "simple-quest.tours.my-journal-tab.1.title": "Agent Activity Log Tab",
            "simple-quest.tours.my-journal-tab.1.content": "The Agent Activity Log Tab displays a personal Journal only you and the Game Master can see.",
            "simple-quest.tours.my-journal-tab.2.title": "Table of Contents",
            "simple-quest.tours.my-journal-tab.2.content": "This area shows the table of contents of your journal. Any Header you create within your journal will show here for easy navigation.",
            "simple-quest.tours.my-journal-tab.3.title": "Journal Content",
            "simple-quest.tours.my-journal-tab.3.content": "This area shows the contents of your journal. You can edit the contents of your journal by clicking the Edit button in the top right corner.",
            "simple-quest.tours.my-journal-tab.name": "Agent Activity Log Tab",
            "simple-quest.tours.my-journal-tab.description": "This tour will show you how to use the Agent Activity Log tab.",
            "simple-quest.tours.party-journal-tab.1.title": "JTF SITREP Tab",
            "simple-quest.tours.party-journal-tab.1.content": "The JTF SITREP Tab displays a Journal which is visible and editable by all users.",
            "simple-quest.tours.party-journal-tab.2.title": "Table of Contents",
            "simple-quest.tours.party-journal-tab.2.content": "This area shows the table of contents of your JTF SITREP. Any Header you create within this journal will show here for easy navigation.",
            "simple-quest.tours.party-journal-tab.3.title": "Journal Content",
            "simple-quest.tours.party-journal-tab.3.content": "This area shows the contents of the JTF SITREP. You can edit the contents of this journal by clicking the Edit button in the top right corner.",
            "simple-quest.tours.party-journal-tab.name": "JTF SITREP Tab",
            "simple-quest.tours.party-journal-tab.description": "This tour will show you how to use the JTF SITREP tab.",
            "simple-quest.tours.journal-page.1.title": "Page Templates",
            "simple-quest.tours.journal-page.1.content": "SENTINEL adds Page Tempates. A convinient feature to quickly append a pre-formatted template or section to your journal page. Click this button to see the available templates.",
            "simple-quest.tours.journal-page.2.title": "Formatting",
            "simple-quest.tours.journal-page.2.content": "Inside this dropdown you will find the new 'Callout' and 'Page Insert' option to give some extra flare to your documents.",
            "simple-quest.tours.journal-page.name": "Journal Page Features",
            "simple-quest.tours.journal-page.description": "This tour will show you how to use the Journal Page.",
            "simple-quest.default-structure.in-progress": "File Open",
            "simple-quest.default-structure.completed": "File Complete",
            "simple-quest.default-structure.failed": "Discarded",
            "simple-quest.default-structure.locations": "Locations",
            "simple-quest.default-structure.npcs": "NPCs",
            "simple-quest.default-structure.organizations": "Organizations",
            "simple-quest.default-structure.history": "History",
            "simple-quest.default-structure.bestiary": "Bestiary",
            "simple-quest.tooltip.add-quest": "Add Case",
            "simple-quest.tooltip.add-lore": "Add File",
            "simple-quest.tooltip.edit-lore": "Edit File",
            "simple-quest.tooltip.edit-quest": "Edit Case",
            "simple-quest.tooltip.delete-quest": "Delete Case",
            "simple-quest.tooltip.delete-lore": "Delete File",
            "simple-quest.tooltip.share-quest": "Send to Chat",
            "simple-quest.tooltip.duplicate-quest": "Duplicate Case",
            "simple-quest.tooltip.duplicate-lore": "Duplicate File",
            "simple-quest.tooltip.mark-updated": "Mark Case as Updated",
            "simple-quest.moveQuest.error": "You don't have permission to move Cases to that category.",
            "simple-quest.title": "SENTINEL Case Management"
        };



        // Apply overrides in place
        for (const [path, value] of Object.entries(REPLACEMENTS)) {
            foundry.utils.setProperty(game.i18n.translations, path, value);
        }
        Hooks.once("ready", () => ui.notifications.info("FBI SENTINEL Case Management System loaded. Press 'J' to access."));

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