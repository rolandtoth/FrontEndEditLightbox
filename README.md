Front-End Edit Lightbox (FEEL) for ProcessWire
================

Edit pages from the front-end using lightboxed admin in [ProcessWire CMS](http://processwire.com/).

Requires jQuery and uses [Magnific Popup](http://dimsemenov.com/plugins/magnific-popup/) (pulled from ProcessWire core so no need to add manually).

## Features

- add edit links to templates using `$page->feel()` where $page can be any Page object
- open admin in a lightbox
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
    echo feel($page->parent());
    ```

    *Example: edit the "Our Services" page on an arbitrary page:*

    ```php
    echo $pages->get("/our-services/")->feel();
    ```

1. Set link text, positioning/styling classes, target field or tab, etc using [parameters](#parameters).

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
<?php
echo $page->feel(["text" => "Edit images", "class" => "fixed left", "targetField" => "images"]);
?>
```

Using the code above will set "Edit images" for link text and classes "fixed" and "left". It also sets target field to "images", which will scroll into view and gets highlighted when the admin loads.

**List of available parameters:**

- [Edit link text](#edit-link-text-text)
- [Positioning classes](#positioning-classes-class)
- [Target field](#target-field-targetfield)
- [Target tab](#target-tab-targettab)
- [Custom data attributes](#custom-data-attributes)
- [Individual overrides](#individual-overrides-overrides)
- [Popup options](#popup-options-popupoptions)

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
echo $page->feel(array("class" => "fixed bottom left button invert"));
```

Please note that fixed positioned edit links will overlap if placed to the same position, eg. adding two edit links with classes "fixed top left".

### Target field `targetField`

**targetField** is the ProcessWire field name where the admin should jump on opening.

This can come handy if you would like to open the admin right at a given field.
It also adds a small highlight (outline) to the field to make it easier to find (see "fieldHighlightStyle" option to modify or disable).

*Example: jump to the "images" field:*

```php
echo feel($page->feel(array(
	"text" => "Click to edit images",
    "targetField" => "images"
    )
);
```

### Target tab `targetTab`

**targetTab** is the CSS ID of the tab to activate on loading the admin.

*Example: activate the SEO tab (requires the MarkupSEO module):*

```php
echo feel($page->feel(array(
	"text" => "Click to edit SEO options",
    "targetTab" => "#Inputfield_seo_tab"
    )
);
```

To find out tab IDs use the browser's Developer Tools (Inspector).

### Individual overrides `overrides`

You can override global options on individual edit links if you wish. To do that, pass an array with the custom options.

Individual options only affect the current edit link.

*Example: set `closeOnSave` to false and set a custom highlight style on the "body" field:*

```php
echo $page->feel(array(
        "targetField" => "body",
        "overrides" => array(
            "closeOnSave" => false,
            "fieldHighlightStyle" => "outline: 4px double red;"
        )
    )
);
```

### Custom data attributes `data-*`

You can add custom data attributes to edit links passing "data-*" parameter.

*Example: add `data-ajax-target` to allow ajax reload part of page (requires an onBeforeReload callback that needs to be added manually to your site's frontend JavaScript file):*

```php
echo $page->feel(array(
        "class" => "ajax-link",
        "data-ajax-target" => "#ajax-wrap"
    )
);
```

*The corresponding JavaScript snippet (simplified):*

```javascript
var FEEL = {
    onBeforeReload: function (o) {

        var $editLink = o.editLink;

        $.ajax({
            url: location.href,
            type: 'POST',
            cache: false,
            success: function (response) {

                var ajaxTargetSelector = $editLink.attr('data-ajax-target');

                $(ajaxTargetSelector).load(location.href + ' ' + ajaxTargetSelector + ' > *');
            }
        });

        return false;
    }
};
```

*Note: JavaScript events are removed when replacing elements with ajax so you may need to re-assign them.*

###Popup options `popupOptions`

An array containing [Magnific Popup settings](http://dimsemenov.com/plugins/magnific-popup/documentation.html#options) settings you would like to set.

*Example: enable Magnific Popup to close on background click:*

```php
echo $page->feel(array(
	"overrides" => array(
        "popupOptions" => array(
            "closeOnBgClick" => true
        )
    )
);
```

## Options

### Global options

Global options can be set in the module's settings page.

![FEEL options](https://github.com/rolandtoth/FrontEndEditLightbox/raw/master/screens/FEEL-settings.png)

**Available options:**

- **Enable module**: global toggle to enable/disable module.
- **Close on save**: auto close lightbox if no validation errors. Disabled in template edit mode (defaults to false).
- **Fixed save button**: the Save button is at the bottom in the lightboxed admin. Setting this to true will set its position to fixed so it will be always visible in the top-right corner. You can modify its style using the CSS selector `.feel-fixed-save-button`.
- **Enable template edit**: allow page template editing on ctrl+click.
- **Selectors to hide**: list of selectors to hide elements from admin (for example some tabs).
- **Field highlight style**: CSS declarations to style target field (leave empty to disable).
- **Style overrides**: CSS declarations to override styles. Note that these styles may affect everything on the page if not used with caution.
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

**List of available callbacks:**

- onInit
- onEditLinkInit
- onEditLinkReady
- onIframeInit
- onIframeReady
- onIframeClose

Documentation of callbacks is in progress.

*Example*:

```javascript
var FEEL = {
    onEditLinkReady: function (o) {
        console.log('Edit link added with source: ' + o.obj.attr('data-mfp-src'));
    }
};
```

Using `return false;` in callbacks will stop script execution.

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