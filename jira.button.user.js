// ==UserScript==
// @name         Add Jira Buttoms
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds two buttons to the jira issues (IssueName and BranchName)
// @author       You
// @match        https://28stone.atlassian.net/browse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener('load', async () => {


        const btnParentEl = document.querySelector("#ak-main-content div.guBgLL");
        const toSlug = (str) => {
            str = str.replace(/^\s+|\s+$/g, ''); // trim
            str = str.toLowerCase();
            // remove accents, swap ñ for n, etc
            const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
            const to = "aaaaeeeeiiiioooouuuunc------";
            for (let i = 0, l = from.length; i < l; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }
            return str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -
                .replace(/-+/g, '-'); // collapse dashes
        };

        if (btnParentEl !== undefined) {
            const issueNr = document.querySelector("li a[target='_blank'] span").innerText;
            const issueName = document.querySelector("h1[data-test-id='issue.views.issue-base.foundation.summary.heading']").innerText;
            const branchName = issueNr + '-' + toSlug(issueName);
            const fullName = issueNr + ': ' + issueName;

            const createCopyButton = (name, copyText, parent) => {
                const btn = document.createElement("button");
                btn.onclick = () => navigator.clipboard.writeText(copyText)
                btn.innerText = name;
                btn.style.cssText += 'margin-left:7px;border-color:#0000;color:#42526e;font-weight:600;border-radius:3px;font-size: 14px;';
                parent.appendChild(btn);
            }

            const btnParentEl = document.querySelector("#ak-main-content div.guBgLL");
            createCopyButton("Name", fullName, btnParentEl);
            createCopyButton("Branch", branchName, btnParentEl);
        }
    }, false);
})();