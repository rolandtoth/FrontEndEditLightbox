/*!
 * Front-End Edit Lightbox (FEEL) for ProcessWire
 * https://goo.gl/wTeQ4z
 */

var siteModules = (window.FEEL_defaults && window.FEEL_defaults.siteModules) ? window.FEEL_defaults.siteModules : '/site/modules/';
var wireModules = (window.FEEL_defaults && window.FEEL_defaults.wireModules) ? window.FEEL_defaults.wireModules : '/wire/modules/';

function FEEL_loadAssets(items) {

    var item = null;
    var load = true;

    function FEEL_itemOnLoad() {
        if(item && load && typeof item.after !== "undefined") {
            // console.log('FEEL: loaded ' + item.file);
            item.after();
        }
        if(!items.length) return;
        item = items.shift();
        load = typeof item.test === "undefined" || item.test();
        if(load) {
            FEEL_loadItem(item);
        } else {
            FEEL_itemOnLoad();
        }
    }

    function FEEL_loadItem(item) {
        var script = document.createElement('script');
        script.onload = FEEL_itemOnLoad;
        script.src = item.file;
        document.body.appendChild(script);
    }

    FEEL_itemOnLoad();
}

// to play nice with PageFrontEdit that is also loading JqueryCore
setTimeout(function () {
    FEEL_loadAssets([{
        'test': function() { return (typeof jQuery === 'undefined'); },
        'file': wireModules + 'Jquery/JqueryCore/JqueryCore.js',
        'after': function() { jQuery.noConflict(); }
    },{
        'test': function() { return (typeof jQuery.magnificPopup === 'undefined'); },
        'file': wireModules + 'Jquery/JqueryMagnific/JqueryMagnific.js',
        'after': function() {
            var asset = document.createElement('link');
            asset.rel = 'stylesheet';
            asset.href = wireModules + 'Jquery/JqueryMagnific/JqueryMagnific.css';
            document.getElementsByTagName('head')[0].appendChild(asset);
        }
    },{
        'file': siteModules + 'FrontEndEditLightbox/FrontEndEditLightbox.js'
    }]);
}, 100);
