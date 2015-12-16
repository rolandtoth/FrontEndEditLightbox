#Changelog

### 1.2.0 (2015-12-16)
- fixed: do not add editlink markup if module is disabled (reported by Matjaž)
- new option: excluded templates
- use markdown for examples in field notes (module settings page)
- make advanced fields collapsed if empty (module settings page)
- some JS/CSS files skipped if admin
- a few CSS changes (suggested by Matjaž)

### 1.1.9 (2015-12-01)
- do not add Magnific Popup assets to admin (suggested by Matjaž)
- fixed missing default values on module install
- fixed default editlink text override issue
- fixed: do not try to open Template editor if not SuperUser
- added ctrl+shift hotkey to toggle editlink display
- sanitize module settings inputs

### 1.1.6 (2015-11-22)

- fix: unchecking setting "Enable module" in module options causing PHP error

### 1.1.5 (2015-11-21)

- fixed: assets weren't added if FEEL was used on a non-editable page with edit links referencing other pages
- option to change default edit link text (request by adrianbj)
- FrontEndEditLightbox.js and JqueryMagnific.js moved back to the bottom of `<body>` to ensure jQuery is loaded
- usability: "Style override" option field placeholder was changed to field notes (suggested by Matjaž)
- fixed fixedSaveButton typo (reported by Matjaž)
- fixedSaveButton made overridable using CSS (class name `feel-fixed-save-button`)
- fixed user js overrides
- undefined notice fix (reported by adrianbj)
- added icon (paper-plane)
- lightbox max-width changed from 900px to 90%
- use close confirm message only on Chrome - other browsers display the default confirm message before closing the lightbox properly

### 1.1.2 (2015-11-19)

- added "Style overrides" textarea for custom CSS (thanks to Matjaž)
- moved JS/CSS to `<head>`

### 1.1.0 (2015-11-02)

- rewritten as a module, usage mode changed to `$page->feel($options)`
- array format for options (options can be accessed by their names)
- new option: "Enable module" - toggle module on/off globally
- new option: confirm iframe close if edit form has changed (only on Pages, uses the built-in admin notification message)
- fixed: wire("user")->language only available on multi-lang setups
- JS callback functions
- new: override options on individual edit links

### 1.0.1 (2015-10-28)

- new: edit page template on ctrl-click (optional, see enableTemplateEdit option)
- changed edit link html element to `<feel>`
- wrapper element removed
- redesigned class system
- extendable FEEL options
