Front-End Edit Lightbox (FEEL) for ProcessWire
================

Edit pages on the front-end using lightboxed admin.
Needs only one JavaScript file and placing edit link markups to template files.

Requires jQuery. Uses [Magnific Popup](http://dimsemenov.com/plugins/magnific-popup/) that is pulled from ProcessWire core so no need to add manually.

Features
---------------------------------------

- easy to setup: one JavaScript file only
- reload page only if page was saved
- auto-close lightbox on save if no errors (optional)
- load language tabs of the language currently browsed
- jump directly to a field, even in a tab
- hide elements from admin using jQuery selectors
- configurable lightbox properties
- edit link positioning helper classes
- utilizes built-in tools only (native ProcessWire features)

Usage
---------------------------------------

1. Add FEEL.js to your site:

  ```php
  <?php if($page->editable()) { ?>
  <script src="<?php echo $config->urls->templates ?>scripts/FEEL.js"></script>
  <?php } ?>
  ```

2. Place Edit links where you would like them to appear. Make sure only users with proper rights can see them.

  ```php
  <?php if($page->editable()) { ?>
  <a href="<?php echo $page->editUrl; ?>" class="feel feel-inline">Edit</a>
  <?php } ?>
  ```
  
  There is also a helper function that makes adding edit links easier, see below.

3. Configure options and styling (see below)

Helper function
---------------------------------------
To make outputting edit links easier, add this function to your "_func.php" file:

 ```php
function feel($item, $linkName = "", $classes = "", $targetField = "", $targetTab = "") {
	if ($item instanceof Page && $item->editable()) {
		$linkName = !$linkName ? "#" : $linkName;
		$classes = !$classes ? "feel-inline" : "feel-" . preg_replace("/\s/", " feel-", $classes);
		return '<a href="' . $item->editUrl . '&language=' . wire("user")->language->id . '" class="feel ' . $classes . ' " data-target-tab="' . $targetTab . '" data-target-field="' . $targetField . '">' . $linkName . '</a>';
	}
}
```

After this you can add edit links with a simple echo:

 ```php
 echo feel($page);
```

If you would like to set link name, classes, target field or tab, use this:

 ```php
echo feel($page, "Edit page", "fixed left", "images");
```

Using the code above will set "Edit page" for link name and classes "feel-fixed" and "feel-left".
It also sets target field "images", which will be highlighted.

**$page** can be any Page object. For example, looping over child pages:

 ```php
<?php foreach($homepage->children() as $p) { ?>
    <h3><?php echo $p->title . feel($p, "Edit"); ?><h3>
<?php } ?> 
```

This will output all subpage titles of the homepage plus links to edit them.

**$classes** are positioning/styling classes, see Styling below.

**target_field** and **target_tab** parameters are field and tab IDs from the admin.
If set, the admin will jump to this field or tab.
This can come handy if you would like to open the admin right at a given field.
This feature adds a small highlight (outline) to the field to make it easier to find (see "fieldHighlightStyle" option below to style or disable).

In case you don't use the helper function you can add field and tab targets manually using data attributes.
Note that you do not have to add the "#" characters.

 ```html
<a href... data-target-tab="TAB_ID" data-target-field="FIELD_ID">Edit</a
```

**Order of the parameters** is important - use 0 or false to skip a parameter:

 ```php
echo feel($page, 0, 0, "my_field");
```

### Multilanguage awareness

The helper function also takes the current language into account.
For example, when browsing the German section of a multilanguage site the German tabs will be opened by default in the admin.

Options
---------------------------------------

To modify global FEEL settings, edit FEEL.js:

- **selector**: this is a jQuery selector of a link that fires the lightbox when clicked on (eg. ".feel")
- **closeOnSave**: auto close lightbox if no validation errors (true/false)
- **fixedSaveButton**: the Save button in the lightboxed admin is at the bottom. Setting this to true will set its position to fixed so it will be always visible in the top-right corner.
- **wirePath**: path to ProcessWire "wire" directory (relative to domain root)
- **selectorsToHide**: list of selectors to hide elements from admin (for example some tabs)
- **fieldHighlightStyle**: CSS rules to style target field (leave empty to disable)
- **popupSettings**: object containing Magnific Popup settings, see [Magnific Popup documentation](http://dimsemenov.com/plugins/magnific-popup/documentation.html#options)

Styling
---------------------------------------

Add classes to edit links to modify position and appearance:

- **mode**: feel-inline, feel-fixed, feel-absolute
- **positioning**: feel-left, feel-top, feel-bottom
- **size**: feel-small
- **visual**: feel-invert

Examples:

```php
<a href="<?php echo $page->editUrl; ?>" class="feel feel-fixed feel-left feel-top">Edit</a>

<a href="<?php echo $page->editUrl; ?>" class="feel feel-inline">#</a>
```

```php
// jump to SEO keywords field under SEO tab (requires the MarkupSEO module)
echo feel($page, "Click to edit SEO keywords", "fixed left top", "seo_keywords", "Inputfield_seo_tab");
```

Note that if you are using the helper function (see above) then you don't have to add the "feel-" prefixes.

Troubleshooting
---------------------------------------

- jQuery is required: it has to be added to your site.
- Make sure the option "wirePath" points to a valid root. If your site is in a subdirectory, adjust accordingly
(eg. wirePath: '/path/wire/').
- Edit links inherit formatting from the site's CSS: manually override these in your site's CSS.

Forum: [https://processwire.com/talk/topic/10452-frontend-lightbox-admin-editor-simple/](https://processwire.com/talk/topic/10452-frontend-lightbox-admin-editor-simple/)

License
---------------------------------------

Licensed under the MIT license.

FEEL is provided "as-is" without warranty of any kind, express, implied or otherwise, including without limitation, any warranty of merchantability or fitness for a particular purpose. In no event shall the author of this software be held liable for data loss, damages, loss of profits or any other kind of loss while using or misusing this software.
