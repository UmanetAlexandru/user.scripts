// ==UserScript==
// @name         Fill Automatically
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *://*/my-reviews
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// ==/UserScript==
(function () {
    'use strict';
    const httpGet = (theUrl, callback) => {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                callback(JSON.parse(xmlHttp.responseText));
            }
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.send(null);
    };
    const setTextOnEl = (text, el) => {
        el.value = text;
        Object.getOwnPropertyDescriptor(el, "value").set.call(el, text);
        el._valueTracker.setValue(text);
        el.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const chuckNorrisApi = "https://api.chucknorris.io/jokes/random";
    const actionFunction = () => {
        const el = document.querySelector("form > div:first-child");
        el.style.cursor = "pointer";
        el.title = "Click to auto fill this form";
        el.onclick = function () {
            document.querySelectorAll('div[id^="row"]')
                .forEach(row => {
                    let radios = row.querySelectorAll("input");
                    const mark = Math.floor(Math.random() * radios.length);
                    radios.item(mark).click();
                });
            httpGet(chuckNorrisApi, res => {
                setTextOnEl(res.value ,document.querySelector("textarea"));
                // document.querySelector("button[type=submit]").click();
            });
        };
        const css = 'form > div:first-child:hover{ color: #666 }';
        const style = document.createElement('style');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.getElementsByTagName('head')[0].appendChild(style);
    };
    waitForKeyElements("form > div:first-child", actionFunction);
})();