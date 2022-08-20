// ==UserScript==
// @name         HyperSkills
// @description  Script to copy HyperSkills content
// @match        https://hyperskill.org/learn/step/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hyperskill.org
// @namespace    https://github.com/UmanetAlexandru/user.scripts
// @version      0.1
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      file://D:\projects\Personal\Scripts\hyperskills.user.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @author       Alexandru Umaneț
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function () {
    'use strict';

    const computedStyleToInlineStyle = (element) => {
        if (element.children) {
            Array.from(element.children).forEach(child => computedStyleToInlineStyle(child));
        }
        const computedStyle = getComputedStyle(element);
        Array.from(computedStyle).forEach(property => {
            element.style[property] = computedStyle.getPropertyValue(property)
        });
    }

    const applyStyle = (el) => {
        const s = getComputedStyle(el);
        console.log(s);
        for (let key in s) {
            let prop = key.replace(/-([a-z])/g, v => v[1].toUpperCase());
            el.style[prop] = s[key];
        }
    }

    const download = (filename, text) => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    const addCopyOnClickToHeader = (text, html) => {
        const blobText = new Blob([text], {type: 'text/plain'});

        const tempTxt = document.createElement("textarea");
        tempTxt.innerHTML = html;
        const blobHtml = new Blob([tempTxt.value], {type: 'text/html'});
        const clipboardItem = new ClipboardItem({[blobText.type]: blobText, [blobHtml.type]: blobHtml});
        const headerElement = document.querySelector('#step-title');
        headerElement.onclick = () => navigator.clipboard.write([clipboardItem]).then(() => getClipboard());
    }

    const getClipboard = () => {
        setTimeout(() => navigator.clipboard.read().then(items => {
            for (const item of items)
                for (const type of item.types) {
                    item.getType(type).then(blob => {
                        const fileName = Math.random() + blob.type + ".txt";
                        blob.text().then(txt => download(fileName, txt));
                    });
                }
        }), 10000)
    }

    const copyTheory = () => {
        const titleElement = document.querySelector('#step-title');
        let copyText = titleElement.outerHTML;
        const content = document.querySelector('#step__text');

        content.querySelectorAll('.content-section')
            .forEach(section => copyText += section.outerHTML);
        copyText = '<div>' + copyText + '</div>';
        addCopyOnClickToHeader(copyText);
    }

    const copyExercises = () => waitForKeyElements('div.submission', () => {

        const title = `<h3>${document.querySelector(".card-body h5.mb-2").textContent.trim()}</h3>`;
        const question = document.querySelector("#step__text div div").outerHTML;

        const responseEl = document.querySelector("div.submission .step-problem div");
        const responseType = responseEl.getAttribute('data-component-name');


        let response = '<h5>Answer:</h5>';
        switch (responseType) {
            case 'StringProblem':
                response += `<div>${responseEl.querySelector("textarea").value}</div>`;
                break;
            case 'ChoiceProblem':
                response += '<ul>';
                responseEl.querySelectorAll(".custom-control").forEach(el => {
                    response += '<li>';
                    const checked = el.querySelector("input").checked;
                    if (checked) response += '<b>';
                    response += el.querySelector("label").textContent;
                    if (checked) response += '</b>';
                    response += '</li>';
                });
                response += '</ul>';
                break;
            case 'BTabs':
                break;
            case 'MatchingProblem':
                response += '<table>';
                const lefts = responseEl.querySelectorAll('[id^=left-side]');
                const rights = responseEl.querySelectorAll('[id^=right-side]');
                for (let i = 0; i < lefts.length; i++) {
                    response += `<tr><td>${lefts[i].textContent}</td><td>${rights[i].textContent}</td></tr>`;
                }
                response += '</table>';
                break;
        }

        let copyText = title + question + response;
        addCopyOnClickToHeader(copyText);
    });

    waitForKeyElements('.card-body h5.mb-2', () => {
        console.log("LOADED...");
        // let copyText = "";
        // let copyHtml = "";
        // document.querySelectorAll("#step__text div[id^=content_section]")
        //     .forEach(el => {
        //         copyText += el.textContent.trim()
        //         computedStyleToInlineStyle(el);
        //         copyHtml += el.outerHTML.replace("\r\n", "").replace("\t", "").trim()
        //     });
        // addCopyOnClickToHeader(copyText, copyHtml);
        // getClipboard();
    });
})();