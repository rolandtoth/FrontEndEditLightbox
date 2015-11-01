Front-End Edit Lightbox (FEEL) for ProcessWire
================

Edit pages from the front-end using lightboxed admin in [ProcessWire CMS](http://processwire.com/).

Requires jQuery and uses [Magnific Popup](http://dimsemenov.com/plugins/magnific-popup/) (pulled from ProcessWire core so no need to add manually).

## Features

- add edit links to templates using $page->feel() ($page can be any Page object)
- open admin in a lightbox
- reload page only if page was saved
- auto-close lightbox on save if no errors (optional)
- edit page template on ctrl-click
- load language tabs of the language currently browsed
- jump directly to an admin field or tab
- hide elements from the admin using jQuery selectors
- edit page template on ctrl+click (optional)
- configurable lightbox properties
- edit link positioning helper classes
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

## Parameters

You can control how should edit links appear and behave passing an array parameters to the `feel()` method:

```php
<?php
echo $page->feel(array(
    "text" => "Edit page",
    "class" => "fixed left",
    "targetField" => "images"
    )
);
?>
```

Using the code above will set "Edit page" for link text and classes "fixed" and "left". It also sets target field to "images", which will scroll into view and gets highlighted when the admin loads.

**List of available parameters:**

- `$text`
- `$class`
- `$targetField`
- `$targetTab`
- `$options`

### Edit link text ($text)

This is the text of the edit link that will appear on the page. If not set, defaults to the "#" character.

### Positioning classes ($class)

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
if (function_exists("feel")) {
	echo feel($page, 0, "fixed bottom left button invert");
}
```

Please note that fixed positioned edit links will overlap if placed to the same position, eg. adding two edit links with classes "fixed top left".

### Target field and target tab ($targetField, $targetTab)

Parameters **targetField** and **targetTab** are field names and tab CSS IDs. If set, the admin will jump to this field or tab.

This can come handy if you would like to open the admin right at a given field.
It also adds a small highlight (outline) to the field to make it easier to find (see "fieldHighlightStyle" option to modify or disable).

*Example: jump to SEO keywords field under SEO tab (requires the MarkupSEO module):*

```php
echo feel($page->feel(array(
	"text" => "Click to edit SEO keywords",
    "class" => "fixed left top",
    "targetField" => "seo_keywords",
    "targetTab" => "#Inputfield_seo_tab"
    )
);
```

To find out tab IDs use the browser's Developer Tools (Inspector).

### Options

Per edit link options can be set here.

You can override global options on individual edit links if you wish. To do that, pass an array with the custom options.

Individual options only affect the current edit link.

*Example: set `closeOnSave` to false and set a custom highlight style on the "body" field:*

```php
echo $page->feel(array(
        "text" => Edit link with custom settings",
        "targetField" => "body",
        "options" => array(
            "closeOnSave" => false,
            "fieldHighlightStyle" => "outline: 4px double #E83561;"
        )
    )
);
```

*Example: disable template edit mode plus enable Magnific Popup to close on background click:*

```php
echo $page->feel(array(
	"options" => array(
        "enableTemplateEdit" => false,
        "popupOptions" => array(
            "closeOnBgClick" => true
        )
    )
);
```

## Options

## Global options

Global options can be set in the module's settings.


### Override global options using JavaScript

To set custom global FEEL options, define a FEEL object to override default values:

```javascript
var FEEL = {
    fixedSaveButton: false,
    popupOptions: {	// Magnific Popup settings
        enableEscapeKey: false
    }
};
```

Custom options should be defined before the module's JavaScript file is added to the page (eg. before `$(document).ready()`).

### List of options

- **closeOnSave**: auto close lightbox if no validation errors (true/false). Disabled in template edit mode (defaults to false).
- **fixedSaveButton**: the Save button is at the bottom in the lightboxed admin. Setting this to true will set its position to fixed so it will be always visible in the top-right corner.
- **enableTemplateEdit**: allow page template editing on ctrl-click (true/false)
- **selectorsToHide**: list of selectors to hide elements from admin (for example some tabs)
- **fieldHighlightStyle**: CSS declarations to style target field (leave empty to disable)
- **popupOptions**: an array containing Magnific Popup settings, see [Magnific Popup documentation](http://dimsemenov.com/plugins/magnific-popup/documentation.html#options)


## Template edit mode

If `enableTemplateEdit` option enabled you can edit the template of the page instead of the page itself. To do this, hold "ctrl" while clicking on the edit link.

Note that `closeOnSave` option has no effect in this mode, the admin lightbox will not close on save.


## Multilanguage awareness

The helper function takes the current language into account. For example, when browsing the German section of a multilanguage site the German tabs will be opened when the admin loads.


## Troubleshooting

- Edit links don't appear: ensure you are logged in and pages are editable with your role
- Edit links inherit formatting from the site's CSS: manually override these in your site's CSS

Forum: [https://processwire.com/talk/topic/10452-frontend-lightbox-admin-editor-simple/](https://processwire.com/talk/topic/10452-frontend-lightbox-admin-editor-simple/)

## License

Licensed under the MIT license. See the LICENSE file for details.