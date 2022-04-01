// ==UserScript==
// @name         Maria Script
// @namespace    https://github.com/UmanetAlexandru/user.scripts
// @version      0.1
// @description  Maria scrip linkedin.
// @author       Alexandru Umaneț
// @match        https://www.linkedin.com/messaging/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// @run-at       document-end
// @require      file://D:\projects\Personal\Scripts\maria.linkedin.user.js
// ==/UserScript==
const SCROLL_PEOPLE_LIST = 3;
const SCROLL_MESSAGES_LIST = 3;
const SCROLL_HEIGHT = 500;
const MY_NAME = "Alexandru Umanet";

delay = (element, callback) => new Promise((resolve) =>
    setTimeout(() => {
        callback();
        resolve();
    }, 1000)
);

const wait = (time) => new Promise(r => setTimeout(r, time));

const scroll = async (selector, nrs, height = SCROLL_HEIGHT) => {
    let element = document.querySelector(selector);
    if (element.scrollHeight > element.clientHeight) {
        let numbers = Array.from(Array(nrs).keys());
        let h = 0;
        for await (const n of numbers) {
            if (element.scrollHeight > h) {
                h += height;
                await delay(element, () => element.scroll(0, h));
            }
        }
        await wait(1600);
    }
}

const script = async () => {
    await scroll("ul.msg-conversations-container__conversations-list", SCROLL_PEOPLE_LIST);
    let peopleCards = document.querySelectorAll(".msg-conversation-card");

    for (const card of peopleCards) {
        card.querySelector("h3.msg-conversation-listitem__participant-names").click();
        await wait(2000);
        const conversionEl = document.querySelector(".msg-s-message-list");
        await scroll(".msg-s-message-list", SCROLL_MESSAGES_LIST, -SCROLL_HEIGHT);
        const messageEls = conversionEl.querySelectorAll("li.msg-s-message-list__event");
        let nrOfMessages = 0;
        let hasReplied = false;
        Array.prototype.slice.call(messageEls)
            .map(el => el.querySelector("span.msg-s-message-group__name"))
            .filter(el => el !== null)
            .map(el => el.textContent.trim())
            .forEach(name => {
                if (name === MY_NAME) {
                    nrOfMessages++;
                } else {
                    hasReplied = true;
                }
            });
        let div = createCircle(nrOfMessages, hasReplied);
        let photoEl = card.querySelector(".presence-entity");
        if (photoEl != null) {
            photoEl.prepend(div);
        }
    }
}

const createCircle = (nrOfMessages, hasReplied) => {
    const div = document.createElement("div");
    div.style.width = "20px";
    div.style.height = "20px";
    div.style.background = hasReplied ? "#26753c" : "#ba3434";
    div.style.color = "white";
    div.style.borderRadius = "50%";
    div.style.position = "absolute";
    div.style.top = "41px";
    div.style.left = "-5px";
    div.style.textAlign = "center";
    div.style.fontWeight = "700";
    div.style.fontSize = "0.76em";
    div.innerHTML = nrOfMessages.toString();
    return div;
}


window.addEventListener('load', () => {
    let el = document.querySelector("h1.flex-grow-1");
    el.style.cursor = "pointer";
    el.onclick = () => script();
}, false);