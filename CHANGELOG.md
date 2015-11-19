#Changelog

### 1.2.0 (2015-11-19)

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
