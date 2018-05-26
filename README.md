Front-End Edit Lightbox (FEEL) for ProcessWire
================

Edit pages from the front-end using lightboxed admin in [ProcessWire CMS](https://processwire.com/).

Requires jQuery and uses [Magnific Popup](http://dimsemenov.com/plugins/magnific-popup/) (pulled from ProcessWire core so no need to add manually).

## Features

- add edit links to templates using `$page->feel()` where $page can be any Page object
- add links to add new child page
- open admin in a lightbox
- load only specified fields instead the full admin page
- reload page only if page was saved
- auto-close lightbox on save if no errors (optional)
- edit page template on ctrl+click (optional)
- load language tabs of the language currently browsed
- jump directly to an admin field or tab
- hide elements from the admin using jQuery selectors
- confirm lightbox close if there are unsaved changes
- configurable lightbox properties
- edit link positioning helper classes
- load JavaScript dependencies only if they aren't loaded
- fail-safe: utilizes native ProcessWire operations only

## Usage

1. Install the module

1. Place edit links in your template files where you would like them to appear:

    ```php
    <?php echo $page->feel(); ?>
    ```
    `$page` is the page that you would like to edit. It can be any page, not only the current one.

    *Example: loop over subpages of the homepage and add edit links after their title:*

    ```php
    <?php foreach($homepage->children() as $p) { ?>
        <h3><?php
            echo $p->title;
            echo $p->feel();
        ?></h3>
    <?php } ?>
    ```

    *Example: edit the parent page:*

    ```php
    <?php echo $page->parent()->feel(); ?>
    ```

    *Example: edit the "Our Services" page on an arbitrary page:*

    ```php
    <?php echo $pages->get("/our-services/")->feel(); ?>
    ```

1. Set link text, positioning/styling classes, target field or tab, etc using [parameters](#parameters).

From version 1.3.2 you can also use the middle mouse button to open the admin in a new window (tab).


## Uninstall

1. Remove (or comment out) all instances of module reference in your template files.
2. Uninstall the module.

Note: on the module settings page there is an "Enable module" toggle. Use this to disable edit links in your templates globally, without needing to uninstall completely.


## Parameters

You can control how edit links should appear and behave passing an array of parameters to the `feel()` method:

```php
<?php
echo $page->feel(array(
    "text" => "Edit images",
    "class" => "fixed left",
    "targetField" => "images",
    "data-customValue" => "Lorem ipsum"
    )
);
?>
```

Short array syntax (PHP 5.4 and up):

```php
<?php echo $page->feel(["text" => "Edit images", "class" => "fixed left", "targetField" => "images"]); ?>
```

Using the code above will set "Edit images" for link text and classes "fixed" and "left". It also sets target field to "images", which will scroll into view and gets highlighted when the admin loads.

**List of available parameters:**

- [Edit link text](#edit-link-text-text)
- [Positioning classes](#positioning-classes-class)
- [Fields to load](#fields-to-load-fields)
- [Target field](#target-field-targetfield)
- [Target tab](#target-tab-targettab)
- [Custom data attributes](#custom-data-attributes)
- [Individual overrides](#individual-overrides-overrides)
- [Popup options](#popup-options-popupoptions)
- [Mode](#mode)

### Edit link text `text`

This is the text of the edit link that will appear on the page. If not set, defaults to the "#" character.

### Positioning classes `class`

By default edit links appear inline and with black font color. You can use the following classes to modify their position and appearance:

- `fixed`: sets "position: fixed"
- `relative`: sets "position: relative"
- `absolute`: sets "position: absolute"
- `left`, `right`, `top`, `bottom`: sets corresponding CSS value to zero (eg. "bottom: 0;")
- `button`: adds padding and sets background-color to 50% white
- `small`: sets a smaller font size (plus a smaller padding when used together with `button`)
- `invert`: sets font color to white (plus sets background-color to 50% black when used together with `button`)
- `transparent`: sets background-color to transparent (only for `button`)

*Example: set edit link to appear as a button in the bottom-left corner of the browser window, with black background and white font color:*

```php
<?php echo $page->feel(array("class" => "fixed bottom left button invert")); ?>
```

Notes:

- Fixed positioned edit links will overlap if placed to the same position, eg. adding two edit links with classes "fixed top left"
- Positioning classes will get a "feel-" prefix when rendered ("feel-top", "feel-left"). However, if you pass custom classes they won't get prefixed.


### Fields to load `fields`


**fields** allows to load only specified fields of $page instead of the full admin page.

You can specify multiple fields by separating them with comma. Fields will appear in the order you have set them.

*Example: show only the "title" and the "body" fields in the lightbox:*

```php
<?php
echo $page->feel(array(
	"text" => "Edit title and body fields",
    "fields" => "title,body"
    )
);
?>
```

Notes:

- fields that are not on the current page will be skipped to avoid ProcessWire error message
- fieldset and fieldsettab fields are unsupported, though specifying a tab field will show its fields (but not grouped in a tab)


### Target field `targetField`

**targetField** is the ProcessWire field name where the admin should jump on opening.

This can come handy if you would like to open the admin right at a given field.
It also adds a small highlight (outline) to the field to make it easier to find (see "fieldHighlightStyle" option to modify or disable).

*Example: jump to the "images" field:*

```php
<?php
echo $page->feel(array(
	"text" => "Click to edit images",
    "targetField" => "images"
    )
);
?>
```

### Target tab `targetTab`

**targetTab** is the CSS ID of the tab to activate on loading the admin.

*Example: activate the SEO tab (requires the MarkupSEO module):*

```php
<?php
echo $page->feel(array(
	"text" => "Click to edit SEO options",
    "targetTab" => "#Inputfield_seo_tab"
    )
);
?>
```

To find out tab IDs use the browser's Developer Tools (Inspector).

### Individual overrides `overrides`

You can override global options on individual edit links if you wish. To do that, pass an array with the custom options.

Individual options only affect the current edit link.

*Example: set `closeOnSave` to false and set a custom highlight style on the "body" field:*

```php
<?php
echo $page->feel(array(
        "targetField" => "body",
        "overrides" => array(
            "closeOnSave" => false,
            "fieldHighlightStyle" => "outline: 4px double red;"
        )
    )
);
?>
```

### Custom data attributes `data-*`

You can add custom data attributes to edit links passing "data-*" parameter.

*Example: add `data-ajax-target` to allow ajax reload part of page (requires an onBeforeReload callback that needs to be added manually to your site's frontend JavaScript file):*

```php
<?php
echo $page->feel(array(
        "class" => "ajax-link",
        "data-ajax-target" => "#ajax-wrap"
    )
);
?>
```

*The corresponding JavaScript snippet (simplified):*

```javascript
var FEEL = {
    onBeforeReload: function (o) {

        var editLink = o.editLink;

        if(!editLink.attr('data-ajax-target')) return true;

        $.ajax({
            url: location.href,
            type: 'POST',
            cache: false,
            success: function (response) {

                var ajaxTargetSelector = editLink.attr('data-ajax-target');

                $(ajaxTargetSelector).load(location.href + ' ' + ajaxTargetSelector + ' > *');
            }
        });

        return false;
    }
};
```

*Note: JavaScript events are removed when replacing elements with ajax so you may need to re-assign them.*

### Popup options `popupOptions`

An array containing [Magnific Popup settings](http://dimsemenov.com/plugins/magnific-popup/documentation.html#options) settings you would like to set.

*Example: enable Magnific Popup to close on background click:*

```php
<?php
echo $page->feel(array(
        "overrides" => array(
            "popupOptions" => array(
                "closeOnBgClick" => true
            )
        )
    )
);
?>
```

### Mode `mode`

By default FEEL uses `page-edit` mode to edit a page or `template-edit` to edit the template of the page.

These modes are for internal use only so you can not add them to edit links.

However, from v1.3.7 a new mode called `page-add` is available that allows adding a new child page:

```php
<?php
echo $page->feel(array('mode' => 'page-add', 'text' => 'Add child'));

echo $page->feel(array('mode' => 'page-add', 'text' => 'Add child to page 1051', 'parent' => 1051));
//or:
echo $pages->get(1051)->feel(array('mode' => 'page-add', 'text' => 'Add child to page 1051'));
?>
```

It is recommended to set `closeOnSave` setting to false when using the add mode to prevent closing the lightbox on publish.

Note: template edit on ctrl+click is unavailable in this mode.


## Options

### Global options

Global options can be set in the module's settings page.

**Available options:**

- **Enable module**: global toggle to enable/disable module.
- **Close on save**: auto close lightbox if no validation errors. Disabled in template edit mode (defaults to false).
- **Fixed save button**: the Save button is at the bottom in the lightboxed admin. Setting this to true will set its position to fixed so it will be always visible in the top-right corner. You can modify its style using the CSS selector `.feel-fixed-save-button`.
- **Enable template edit**: allow page template editing on ctrl+click (available only in "edit" mode)
- **Disable autoloading FrontEndEditLightbox.js**: disables loading FrontEndEditLightbox.js (and CSS assets as they are loaded by this file). Use if you need to load FEEL assets manually.
- **Disable autoloading FrontEndEditLightbox.css**: disables loading FrontEndEditLightbox.css. Use if you need to load FEEL assets manually. If checked, make sure to load your CSS file in the iframe too (eg. by using the `onIframeReady` callback) or use Style overrides global setting to inject your CSS rules.
- **Selectors to hide**: list of selectors to hide elements from admin (for example some tabs).
- **Field highlight style**: CSS declarations to style target field (leave empty to disable).
- **Style overrides**: CSS declarations to override styles. Note that these styles may affect everything on the page if not used with caution. Rules you set here will be loaded in the iframe admin too.
- **Default edit link text**: text to display on edit links, defaults to "#". Override in templates using `"text" => ""` to force no text.
- **Close confirm message**: text to show on lightbox close if there are unsaved changes.

### JavaScript

#### Override global options using JavaScript

Besides global module options, FEEL options can be also set using JavaScript. Option names will become camelCase.

To set custom global FEEL options, define a FEEL object to override default values.
This object needs to be in the global namespace, so put this outside of document.ready()

*Example: disable fixed save button and disable the ESC key on the lightbox:*

```javascript
var FEEL = {
    fixedSaveButton: false,
    popupOptions: {	// Magnific Popup settings
        enableEscapeKey: false
    }
};
```

### JavaScript callbacks

**List of available callbacks (list of arguments in the brackets):**

- **onInit** (`feel`): fires before setting up FEEL edit links
- **onEditLinkInit** (`feel`, `obj`): fires before each edit link init
- **onEditLinkReady** (`feel`, `obj`): fires after each edit link init is ready (*)
- **onLightboxInit** (`event`, `feel`, `obj`, `mode`): fires before starting the lightbox
- **onLightboxReady** (`event`, `feel`, `iframe`, `editForm`, `mode`): fires when the lightbox is ready  (*)
- **onIframeReady** (`event`, `feel`, `iframe`, `editForm`, `mode`): fires when the iframe content is loaded (that is, multiple times if closeOnSave is false or there were errors)  (*)
- **onLightboxClose** (`event`, `feel`, `obj`, `mode`): fires before closing the lightbox
- **onBeforeReload** (`event`, `feel`, `obj`, `mode`): fires before reloading the page

*Arguments*:

- `event`: the current event object (mousedown)
- `feel`: current FEEL settings (containing the overriden settings when available)
- `obj`: the current edit link jQuery element
- `iframe`: the current iframe jQuery /instance
- `editForm`: the current form jQuery instance (#ProcessPageEdit, #ProcessTemplateEdit, #ProcessPageAdd)
- `mode`: the current mode the admin is opened - `page-edit` (default), `template-edit` (ctrl+click, available only when enabled) or `page-add`. Note: mode is `page-edit` instead of `page-add` when "quick adding" a page (that is, parent-child relationship of the corresponding templates are set in ProcessWire so the add page screen is skipped)

Plus all callbacks with contain a property `callbackName` containing the name of the callback.


*Example*:

```javascript
var FEEL = {
    onEditLinkReady: function (o) {
        console.log('Edit link added with source: ' + o.obj.attr('data-mfp-src'));
    }
};
```

Using `return false;` in callbacks will stop script execution. Exception: "ready" type callbacks, marked with asterisk (*).

*Example: disable adding edit links if document body has "lang-klingon" class:*

```javascript
var FEEL = {
    onInit: function (o) {
        if($('body').hasClass('lang-klingon')) {
        	return false;
        }
    }
};
```

## Template edit mode

If `Enable template edit` option is enabled you can edit the template of the page instead of the page itself. To do this, hold the `control` button while clicking on the edit link.

Note that `Close on save` option has no effect in this mode, the admin lightbox will not close on save.


## Multilanguage awareness

FEEL takes the current language into account. For example, when browsing the German section of a multilanguage site the German tabs will be opened when the admin loads.

## Misc

To view the page without the edit links use hotkey ctrl+shift to toggle them on/off.


## Troubleshooting

- Edit links don't appear: ensure you are logged in and pages are editable with your role.
- Edit links inherit formatting from the site's CSS: manually override these in your site's CSS.

Forum: [https://processwire.com/talk/topic/10452-front-end-edit-lightbox-feel-for-processwire/](https://processwire.com/talk/topic/10452-front-end-edit-lightbox-feel-for-processwire/)

## License

Licensed under the MIT license. See the LICENSE file for details.