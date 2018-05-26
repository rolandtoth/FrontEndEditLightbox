# Changelog


### 1.3.7 (2018-05-26)

- skip unnecessary redirect on modal save (by matjazp)
- new "page-add" action to add child (requested/contributed by matjazp)
- use monospace font in module settings field styleOverrides (by matjazp)
- new setting: disable loading FEEL CSS (requested by matjazp)
- remove system templates from module settings Excluded templates dropdown
- JavaScript callback updates and documentation
- several minor tweaks


### 1.3.6 (2017-06-01)

- fixed issue with "fields" mode in PW 2.7 (thanks to CarloC)


### 1.3.5 (2017-01-13)

- autoload module on front-end only (in 1.3.7 it's autoload again)


### 1.3.4 (2016-09-30)

- new feature: set fields to load in the lightbox instead of the full admin
- fix styleOverrides not working at all


### 1.3.3 (2016-09-28)

- only prefix module's own CSS classes with "feel-" (reported by Matjaž)


### 1.3.2 (2016-09-27)

- allow middle-click on feel button to open the admin in a new window


### 1.3.1 (2016-09-22)

- fixed default edit link text not saved in settings (reported by Matjaž)

### 1.3.0 (2016-09-21)

- fixed PHP error when no parameters was passed to feel()
- use non-minified version of JqueryMagnific.js (unavailable in earlier PW)

### 1.2.9 (2016-03-13)

- fixed disable autoloading scripts working the opposite way (reported by Matjaž) 

### 1.2.8 (2016-03-12)

- new: also load CSS assets by FrontEndEditLightbox.js

### 1.2.7 (2016-03-12)

- new option: disable autoloading FrontEndEditLightbox.js. This enables loading it manually, for example when using a script loader.
- new option: custom data-* attributes feature. Can be useful for further JS/CSS processing (eg. ajax reload parts using FEEL callbacks)
- load jQuery and Magnific Popup by FrontEndEditLightbox.js (only if they aren't loaded)
- added simple ajax reload implementation example to the readme file


### 1.2.1 (2016-01-30)

- removed php notice on module install (reported by Sevarf2)


### 1.2.0 (2015-12-03)

- fixed: do not add editlink markup if module is disabled (reported by Matjaž)
- a few minor CSS changes (suggested by Matjaž)
- new option: disabled templates list (only valid for non-SuperUsers)
- some JS/CSS files skipped if admin


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
