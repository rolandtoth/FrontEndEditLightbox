/*!
 * Front-End Edit Lightbox (FEEL) for ProcessWire
 * https://goo.gl/wTeQ4z
 */

var pwRootUrl = (window.FEEL_defaults && window.FEEL_defaults.pwRootUrl) ? window.FEEL_defaults.pwRootUrl : '/wire/';

// fix json_encode escapes (JSON_UNESCAPED_SLASHES is PHP 5.4+)
pwRootUrl = pwRootUrl.replace('\/', '/');

if (!window.jQuery) {
    loadScript(pwRootUrl + "wire/modules/Jquery/JqueryCore/JqueryCore.js", function () {
        startFEEL();
    });
} else {
    startFEEL();
}

function startFEEL() {

    // extra jQuery check
    if (!window.jQuery) {
        throw new Error("FEEL not loaded (jQuery is not available)");
    }

    $(function () {

        // set global cache true
        $.ajaxSetup({
            cache: true
        });

        feel_loadCSS(pwRootUrl + "site/modules/FrontEndEditLightbox/FrontEndEditLightbox.css");

        if (!$.magnificPopup) {
            jQuery.getScript(pwRootUrl + "wire/modules/Jquery/JqueryMagnific/JqueryMagnific.min.js")
                .done(function () {
                    // load MP css
                    feel_loadCSS(pwRootUrl + "wire/modules/Jquery/JqueryMagnific/JqueryMagnific.css");
                    initFEEL();
                })
                .fail(function () {
                    throw new Error("FEEL: Magnific Popup is not available");
                });
        } else {
            initFEEL();
        }

        function initFEEL() {

            var FEEL = $.extend(true, {}, {
                closeOnSave: true,  // auto close lightbox if no validation errors (true/false)
                fixedSaveButton: true,  // set Save button position fixed to the top-right corner
                enableTemplateEdit: false,  // allow page template editing on ctrl-click (true/false)
                selectorsToHide: '#_ProcessPageEditChildren, #_ProcessPageEditDelete, #_ProcessPageEditSettings, #_WireTabDelete',  // list of selectors to hide elements from admin
                fieldHighlightStyle: 'outline: 2px solid #89ADE2; outline-offset: -1px; z-index: 200; position: relative;',  // CSS declarations to style target field (leave empty to disable)
                closeConfirmMessage: 'Are you sure you want to close the editor?', // text to show on lightbox close if there are unsaved changes
                popupOptions: {    // settings to pass to Magnific Popup
                    closeBtnInside: false,
                    fixedContentPos: true,
                    enableEscapeKey: true,
                    closeOnBgClick: false,
                    preloader: false,
                    overflowY: 'hidden'
                }
            }, window.FEEL_defaults, window.FEEL);

            FEEL.selector = 'feel';


            if ($(FEEL.selector).length) {

                if (false === callCallback('onInit')) {
                    return false;
                }

                $(FEEL.selector).each(function (e) {

                    if (false === callCallback('onEditLinkInit', {
                            event: e,
                            obj: $(this)
                        })) {
                        return false;
                    }

                    var url = $(this).attr("data-mfp-src"),
                        targetField = $(this).attr("data-target-field"),
                        targetTab = $(this).attr("data-target-tab") ? $(this).attr("data-target-tab") : "";

                    // page edit url is required
                    if (!url) {
                        return false;
                    }

                    // disable tab activation if the tab is set to hidden
                    // target tab hash needs to be the tab link href
                    if (FEEL.selectorsToHide.indexOf(targetTab.replace('#', '_')) > -1) {
                        targetTab = "";
                    }

                    // using attr because data can't be re-set
                    $(this).attr("data-mfp-src", url + targetTab);

                    if (false === callCallback('onEditLinkReady', {
                            event: e,
                            obj: $(this)
                        })) {
                        return false;
                    }

                    // remove display: none !important;
                    $(this).removeAttr('style');

                });

                var adminIframe = "iframe.mfp-iframe",
                    localStorageKeyName = "FEELneedsReloadFlag";

                // extend Magnific Popup with user settings
                $.extend(true, $.magnificPopup.defaults, FEEL.popupOptions);


                // toggle editlink display hotkey
                $('body').on('keydown', function (e) {
                    if (e.ctrlKey && e.shiftKey) {
                        $('body').toggleClass('hide-feel');
                    }
                });


                // initialize and open lightbox
                $(document).on('click', FEEL.selector, function (e) {

                    e.preventDefault();

                    // todo add $editLink to all callback functions

                    var iframeSrc = $(this).attr('data-mfp-src'),
                        targetField = $(this).attr('data-target-field'),
                        templateId = $(this).attr('data-template-id'),
                        overrides = $(this).attr('data-overrides'),
                        _FEEL = {},
                        $editLink = $(this),
                        adminMode = 'page';

                    // create new _FEEL object to avoid overwriting original
                    $.extend(_FEEL, FEEL, overrides ? JSON.parse(overrides) : null);

                    // apply user popupOptions
                    $.extend(true, $.magnificPopup.defaults, _FEEL.popupOptions);


                    // set src to Template instead of Page if modifier key is pressed
                    if (templateId && _FEEL.enableTemplateEdit && e.ctrlKey) {
                        iframeSrc = iframeSrc.replace(/page\/edit\/\?id=[0-9]+/i, 'setup/template/edit?id=' + $(this).attr('data-template-id'));
                        adminMode = 'template';
                    }

                    if (false === callCallback('onIframeInit', {
                            event: e,
                            obj: $(this),
                            adminMode: adminMode
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

                                // override "close" method in MagnificPopup object
                                $.magnificPopup.instance.close = function () {

                                    var unsavedMsg;

                                    // get any unsaved message (inputfields.js) - only for chrome
                                    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                                        if (document.querySelector('.mfp-feel .mfp-iframe').contentWindow.InputfieldFormBeforeUnloadEvent) {
                                            unsavedMsg = document.querySelector('.mfp-feel .mfp-iframe').contentWindow.InputfieldFormBeforeUnloadEvent({});
                                        }
                                    }

                                    if (false === callCallback('onIframeClose', {
                                            event: e,
                                            obj: $(this),
                                            adminMode: adminMode
                                        })) {
                                        return false;
                                    }

                                    if (unsavedMsg && !confirm(unsavedMsg + '\n\n' + FEEL.closeConfirmMessage)) {
                                        return false;
                                    }

                                    $.magnificPopup.proto.close.call(this);
                                };

                                _FEEL.isFirstRun = true;

                                // add mfp-spinner
                                $('.mfp-iframe-holder .mfp-content').addClass('mfp-spinner');

                                // hide iframe to mask removing elements
                                $(adminIframe).css("display", "none");

                                // wait until iframe is loaded
                                $(adminIframe).on("load", function () {

                                    callCallback('onIframeReady', {
                                        event: e,
                                        iframe: $(this),
                                        adminMode: adminMode
                                    });

                                    // CSS needs to be loaded again
                                    feel_loadCSS(pwRootUrl + "site/modules/FrontEndEditLightbox/FrontEndEditLightbox.css", 'iframe.mfp-iframe');

                                    var editForm = $(adminIframe).contents().find('form#' + (adminMode == 'page' ? 'ProcessPageEdit' : 'ProcessTemplateEdit'));

                                    if (_FEEL.fixedSaveButton) {
                                        editForm.find("#submit_save, #Inputfield_submit").addClass('feel-fixed-save-button').appendTo(editForm);
                                    }

                                    if (_FEEL.selectorsToHide) {
                                        $(adminIframe).contents().find(_FEEL.selectorsToHide).remove();
                                    }

                                    editForm.on("submit", function () {
                                        $(adminIframe).fadeOut(_FEEL.removalDelay);

                                        // save localStorageKey state
                                        !window.localStorage || localStorage.setItem(localStorageKeyName, 1);
                                    });

                                    // close on save only if enabled and not in template edit mode
                                    if (_FEEL.closeOnSave && adminMode != 'template') {

                                        if (_FEEL.isFirstRun || $(adminIframe).contents().find('#notices .NoticeError').length) {
                                            // first run OR there was an error
                                            _FEEL.isFirstRun = false;
                                            $(adminIframe).fadeIn(_FEEL.removalDelay);
                                        } else {
                                            // close lightbox
                                            setTimeout(function () {
                                                $.magnificPopup.instance.close();
                                            }, 100);
                                        }
                                    } else {
                                        $(adminIframe).fadeIn(_FEEL.removalDelay);
                                    }

                                    // highlight field
                                    if (targetField) {

                                        var selector = '#wrap_',
                                            target;

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
                                                    $(adminIframe).contents().scrollTop(target.offset().top - 20);
                                                }
                                            }, 800)
                                        }
                                    }
                                });
                            },
                            afterClose: function (e) {

                                // check if page reload is needed
                                var needsReload = !window.localStorage || (window.localStorage && localStorage[localStorageKeyName]);

                                // clear localStorageKey
                                !window.localStorage || localStorage.removeItem(localStorageKeyName);

                                // reload page if necessary
                                !needsReload || setTimeout(function () {

                                    // fire onBeforeReload callback
                                    if (false === callCallback('onBeforeReload', {
                                            event: e,
                                            obj: $(this),
                                            editLink: $editLink
                                        })) {
                                        return false;
                                    }

                                    // fire onReload callback
                                    callCallback('onReload', {
                                        event: e,
                                        obj: $(this)
                                    });

                                    window.location.reload(true);

                                }, 100);
                            }
                        }
                    });

                    e.stopImmediatePropagation();
                    return false;
                });
            }
        }
    });
}

function callCallback(fx, parameters) {
    return (window.FEEL && typeof FEEL[fx] === 'function') ? FEEL[fx](parameters) : true;
}

function loadScript(url, callback) {

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) {  //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}


function feel_loadCSS(path, iframeSelector) {
    var links = document.getElementsByTagName('link'),
        needCSS = true,
        $head;

    if (iframeSelector) {
        links = $(iframeSelector).contents().find('link')
    }

    for (var i = 0; i < links.length; i++) {
        if (links[i].href == path)
            needCSS = false;
    }

    if (needCSS) {
        var ls = document.createElement('link');
        ls.rel = "stylesheet";
        ls.href = path;
        if (iframeSelector) {
            $head = $(iframeSelector).contents().find('head')[0];
        } else {
            $head = document.getElementsByTagName('head')[0];
        }
        $head.insertBefore(ls, $head.childNodes[0])
    }
};