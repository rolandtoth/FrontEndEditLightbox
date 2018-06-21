/*!
 * Front-End Edit Lightbox (FEEL) for ProcessWire
 * https://goo.gl/wTeQ4z
 */

var processPageEdit = false;
var processPageAdd = false;
var processSaveRedirect = false;

// fix json_encode escapes (JSON_UNESCAPED_SLASHES is PHP 5.4+)
siteModules = siteModules.replace('\/', '/');
wireModules = wireModules.replace('\/', '/');

function initFEEL($) {

    var FEEL = $.extend(true, {}, {
        closeOnSave: true,
        fixedSaveButton: true,
        enableTemplateEdit: false,
        selectorsToHide: '#_ProcessPageEditChildren, #_ProcessPageEditDelete, #_ProcessPageEditSettings, #_WireTabDelete',
        fieldHighlightStyle: 'outline: 2px solid #89ADE2; outline-offset: -1px; z-index: 200; position: relative;',
        closeConfirmMessage: 'Are you sure you want to close the editor?',
        skipLoadingStyles: false,
        popupOptions: {  // settings to pass to Magnific Popup
            closeBtnInside: false,
            fixedContentPos: true,
            enableEscapeKey: true,
            closeOnBgClick: false,
            tClose: 'Close',
            preloader: false,
            overflowY: 'hidden'
        }
    }, window.FEEL_defaults, window.FEEL);

    if (!FEEL.skipLoadingStyles) {
        _loadAsset(siteModules + 'FrontEndEditLightbox/FrontEndEditLightbox.css');
    }

    FEEL.selector = '[data-feel]';

    if ($(FEEL.selector).length) {

        if (false === callCallback('onInit', {
                feel: FEEL
            })) {
            return false;
        }

        $(FEEL.selector).each(function () {

            var $editLink = $(this);

            if (false === callCallback('onEditLinkInit', {
                    feel: FEEL,
                    editlink: $editLink
                })) {
                return false;
            }

            var url = $editLink.attr("data-mfp-src"),
                // targetField = $(this).attr("data-target-field"),
                targetTab = $editLink.attr("data-target-tab") ? $editLink.attr("data-target-tab") : "";

            // page edit url is required
            if (!url) {
                return false;
            }

            // disable tab activation if the tab is set to hidden
            // target tab hash needs to be the tab link href
            if (FEEL.selectorsToHide.indexOf(targetTab.replace('#', '_')) > -1) {
                targetTab = '';
            }

            // using attr because data can't be re-set
            $editLink.attr("data-mfp-src", url + targetTab);

            callCallback('onEditLinkReady', {
                feel: FEEL,
                editLink: $editLink
            });

            // show feel links if JS is enabled
            $('body').attr('data-hide-feel', '0');
        });

        var adminIframe = "iframe.mfp-iframe";
        var lsNeedsReload = "feel-needs-reload";

        // extend Magnific Popup with user settings
        $.extend(true, $.magnificPopup.defaults, FEEL.popupOptions);

        // toggle editlink display hotkey
        $('body').on('keydown', function (e) {
            var body = $(this);
            if (e.ctrlKey && e.shiftKey) {
                body.attr('data-hide-feel', (body.attr('data-hide-feel') === '1' ? '0' : '1'));
            }
        });

        // initialize and open lightbox
        $(document).on('mousedown', FEEL.selector, function (e) {

            // todo add $editLink to all callback functions
            var iframeSrc = $(this).attr('data-mfp-src');
            var targetField = $(this).attr('data-target-field');
            var templateId = $(this).attr('data-template-id');
            var overrides = $(this).attr('data-overrides');
            var _FEEL = {};
            var $editLink = $(this);
            var mode = 'page-edit';

            // right click
            if (e.which === 3) {
                return true;
            }

            // if middle mouse button pressed, open the admin in a new page
            if (e.which === 2 || e.button === 4) {
                return true;
            }

            e.preventDefault();

            // create new _FEEL object to avoid overwriting original
            $.extend(_FEEL, FEEL, overrides ? JSON.parse(overrides) : null);

            // apply user popupOptions
            $.extend(true, $.magnificPopup.defaults, _FEEL.popupOptions);

            // set src to Template instead of Page if modifier key is pressed
            if (e.ctrlKey) {
                if (templateId && _FEEL.enableTemplateEdit) {
                    iframeSrc = iframeSrc.replace(/page\/edit\/\?id=[0-9]+/i, 'setup/template/edit?id=' + $(this).attr('data-template-id'));
                    mode = 'template-edit';
                } else {
                    alert('Template edit mode is not available.');
                    return false;
                }
            }

            if (false === callCallback('onIframeInit', {
                    event: e,
                    feel: _FEEL,
                    editlink: $editLink,
                    mode: mode
                })) {
                return false;
            }

            $.magnificPopup.open({
                type: 'iframe',
                removalDelay: 100,
                midClick: true,
                items: {
                    src: iframeSrc
                },
                mainClass: 'mfp-feel',
                callbacks: {
                    open: function () {

                        // pass execution to callback function
                        callCallback('onLightboxReady', {
                            event: e,
                            feel: _FEEL,
                            editlink: $editLink,
                            mode: mode
                        });

                        localStorage.removeItem(lsNeedsReload);

                        // add mfp-spinner
                        $('.mfp-iframe-holder .mfp-content').addClass('mfp-spinner');

                        // hide iframe to mask removing elements on initial load
                        $(adminIframe).css('visibility', 'hidden');

                        // wait until iframe is loaded
                        $(adminIframe).on("load", function () {

                            // find edit form ProcessPageEdit or ProcessTemplateEdit
                            var iframeContent = $(this).contents();
                            var editForm = iframeContent.find('form#' + (mode === 'template-edit' ? 'ProcessTemplateEdit' : 'ProcessPageEdit'));

                            if (!_FEEL.skipLoadingStyles) {
                                iframeContent.find('head').find(':last').after('<link rel="stylesheet" type="text/css" href="' + siteModules + 'FrontEndEditLightbox/FrontEndEditLightbox.css">');
                            }

                            // remove spinner
                            $('.mfp-iframe-holder .mfp-content').removeClass('mfp-spinner');

                            // if editForm.length > 0 then we are in ProcessPageEdit or ProcessTemplateEdit
                            // if editForm.length = 0 then we are either:
                            //   - in ProcessPageAdd or
                            //   - in ProcessPageEdit, but the beforeHook on ProcessPageEdit::processSaveRedirect
                            //     fired and prevented the redirect to itself, making the response empty
                            if (editForm.length) {
                                if (mode !== 'template-edit') mode = 'page-edit';
                                processPageEdit = true;
                            } else {
                                editForm = iframeContent.find('form#ProcessPageAdd');
                                if (editForm.length) {
                                    mode = 'page-add';
                                    processPageAdd = true;
                                } else {
                                    // close the modal
                                    processSaveRedirect = true;
                                    setTimeout(function () {
                                        $.magnificPopup.instance.close();
                                    }, 100);
                                    return false;
                                }
                            }

                            // add feel-modal to the iframe html for targetting elements inside the iframe
                            iframeContent.find('html').addClass('feel-modal');

                            // add html class to be able to target fixed save button
                            if (_FEEL.fixedSaveButton) {
                                iframeContent.find('html').addClass('feel-fixed-save');

                                // also make the Save+Keep unpublished button fixed (move it to the Save button's wrapper)
                                if (iframeContent.find('[name="submit_publish"]').length) {
                                    iframeContent.find('[name="submit_save"]').insertBefore(iframeContent.find('[name="submit_publish"]'));
                                }
                            }

                            // hide selectors
                            if (_FEEL.selectorsToHide) {
                                iframeContent.find(_FEEL.selectorsToHide).each(function () {
                                    if ($(this).attr('id') !== 'ProcessPageEditSettings') $(this).remove();
                                })
                            }

                            // highlight field
                            if (targetField) {

                                var selector = '#wrap_';
                                var target;

                                // try highlighting wrapper element first (that's above language tabs)
                                if (!editForm.has("#wrap_" + targetField).length) {
                                    selector = "#";
                                }

                                target = editForm.find(selector + targetField);

                                if (target.length) {
                                    if (_FEEL.fieldHighlightStyle) {
                                        target.attr("style", _FEEL.fieldHighlightStyle);
                                    }
                                    setTimeout(function () {
                                        if ($(adminIframe).length) {
                                            $(adminIframe).scrollTop(target.offset().top - 20);
                                        }
                                    }, 800)
                                }
                            }

                            if (!_FEEL.closeOnSave && mode !== 'template-edit') {
                                editForm.on("submit", function () {
                                    // save localStorageKey state
                                    localStorage.setItem(lsNeedsReload, '1');
                                });
                            }

                            if (processPageEdit && _FEEL.closeOnSave) {
                                // inject hidden input field that will be read by ProcessPageEdit::processSaveRedirect hook
                                $('<input type="hidden" name="_feelredirect" value="self">').appendTo(editForm);
                            }

                            // pass execution to callback function
                            callCallback('onIframeReady', {
                                event: e,
                                feel: _FEEL,
                                editlink: $editLink,
                                iframe: $(adminIframe),
                                editForm: editForm, // check in your callback, could be undefined!
                                mode: mode
                            });

                            // unhide frame
                            $(adminIframe).css('visibility', 'visible');

                        }); // $(adminIframe).on("load", function ()

                        // override "close" method in MagnificPopup object
                        $.magnificPopup.instance.close = function () {

                            var unsavedMsg;

                            // get any unsaved message (inputfields.js) - only for chrome
                            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                                if (document.querySelector('.mfp-feel .mfp-iframe').contentWindow.InputfieldFormBeforeUnloadEvent) {
                                    unsavedMsg = document.querySelector('.mfp-feel .mfp-iframe').contentWindow.InputfieldFormBeforeUnloadEvent({});
                                }
                            }

                            if (false === callCallback('onLightboxClose', {
                                    event: e,
                                    feel: _FEEL,
                                    editlink: $editLink,
                                    mode: mode
                                })) {
                                return false;
                            }

                            if (unsavedMsg && !confirm(unsavedMsg + '\n\n' + FEEL.closeConfirmMessage)) {
                                return false;
                            }

                            $.magnificPopup.proto.close.call(this);
                        };
                    },
                    afterClose: function (e) {

                        var needsReload = localStorage[lsNeedsReload]; // '1' or undefined

                        if (!(processSaveRedirect || needsReload)) return;

                        localStorage.removeItem(lsNeedsReload);

                        setTimeout(function () {

                            // fire onBeforeReload callback
                            if (false === callCallback('onBeforeReload', {
                                    event: e,
                                    feel: _FEEL,
                                    editlink: $editLink,
                                    mode: mode
                                })) {
                                return false;
                            }

                            // fire onReload callback
                            // callCallback('onReload', {
                            //     event: e,
                            //     feel: _FEEL,
                            //     obj: $(this)
                            // });

                            window.location.reload(true);
                        }, 100); //setTimeout
                    } //afterClose
                } //callbacks
            }); //$.magnificPopup.open

            e.stopImmediatePropagation();
            return false;
        }); //$(document).on('mousedown')
    } //if ($(FEEL.selector).length)
} //function initFEEL($)

function callCallback(fx, params) {
    if (window.FEEL && typeof FEEL[fx] === 'function') {
        params.callbackName = fx;   // add callback name
        return FEEL[fx](params);
    }

    return true;
}


function _loadAsset(path, callback, o) {
    var selector = getUrlParameter('selector', path).replace(/['"]+/g, '').trim(),
        async = getUrlParameter('async', path) === 'true',
        context = getUrlParameter('context', path).replace(/['"]+/g, '').trim(),
        assetType = 'js',
        assetTag = 'script',
        assetSrc = 'src',
        needAsset = true,
        doc = context ? document.querySelector(context).contentWindow.document : document;

    // todo if context is set, where to match selector?
    if (selector.length > 0 && !document.querySelector(selector)) return false;

    function getUrlParameter(name, url) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        url = url ? url : window.location.search;

        // var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        var regex = new RegExp('[\\?&]' + name + '=([^&]*)'),
            results = regex.exec(url);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    path = path.split(/\?(.+)/)[0]; // remove url parameters (settings)

    if (path.slice(-3) === 'css') {
        assetType = 'css';
        assetTag = 'link';
        assetSrc = 'href';
    }

    if (doc.querySelector(assetTag + '[' + assetSrc + '="' + path + '"]')) needAsset = false;

    function callCallback() {
        if (callback) {
            var obj = {};
            if (selector) obj.selector = selector;
            if (o) obj.o = o;
            callback.call(obj);
        }
    }

    if (needAsset) {
        var asset = doc.createElement(assetTag);
        asset[assetSrc] = path;

        if (assetType === 'js') {
            asset.type = "text/javascript";
            asset.async = async;

            if (asset.readyState) { // IE
                asset.onreadystatechange = function () {
                    if (asset.readyState === "loaded" || asset.readyState === "complete") {
                        asset.onreadystatechange = null;
                        callCallback();
                    }
                };
            } else {    // others
                asset.onload = callCallback;
            }

        } else {    // CSS
            asset.rel = "stylesheet";
            callCallback();
        }

        doc.getElementsByTagName("head")[0].appendChild(asset);

    } else {    // always run callback
        callCallback();
    }
}

jQuery(document).ready(function ($) {
    if (!$.magnificPopup) {
        _loadAsset(wireModules + "Jquery/JqueryMagnific/JqueryMagnific.js", function () {
            // console.log('FEEL: JqueryMagnific.js reloaded');
            // alert('FEEL: JqueryMagnific.js reloaded');
            _loadAsset(wireModules + "Jquery/JqueryMagnific/JqueryMagnific.css");
            initFEEL($);
        });
        return false;
    } else {
        initFEEL($);
    }
});
