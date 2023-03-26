// ==UserScript==
// @name         UShop Script
// @namespace    https://github.com/UmanetAlexandru/user.scripts
// @version      1.3
// @description  Script to copy UShop orders
// @author       Alexandru Umaneț
// @match        https://www.ushop.md/wp-admin/post.php?post=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ushop.md
// @updateURL    https://github.com/UmanetAlexandru/user.scripts/raw/master/ushop.order.user.js
// @downloadURL  https://github.com/UmanetAlexandru/user.scripts/raw/master/ushop.order.user.js
// @grant        none
// @run-at       document-end
// @require      file://D:\projects\personal\user.scripts\ushop.order.user.js
// ==/UserScript==
const prefix = "https://raw.githubusercontent.com/UmanetAlexandru/user.scripts/master/resources/";

const createCopyBtn = (name, copy) => {
    const btn = document.createElement("a");
    btn.innerText = name;
    btn.classList.add("page-title-action");
    btn.onclick = () => navigator.clipboard.writeText(copy);
    const parentEl = document.querySelector(".wrap");
    const beforeEl = document.querySelector("hr.wp-header-end");
    parentEl.insertBefore(btn, beforeEl);
}

const getJSON = (url) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
        } else {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        }
    };
    xhr.send();
});

const skuFuncMap = {
    "SPM": (sku) => {
        const s = sku.split("_");
        return `https://www.6pm.com/product/${s[1]}/color/${s[2]}`;
    },
    "ZP": (sku) => {
        const s = sku.split("_");
        return `https://www.zappos.com/product/${s[1]}/color/${s[2]}`;
    },
    "PMA": (sku) => `https://pumamoldova.md/ro/shop/${sku.replace("PMA_", "").replaceAll("_", "/")}`,
    "SPD": (sku) => "https://www.sportsdirect.com/searchresults?descriptionfilter=" + sku.replace("SPD_", ""),
    "JNB": (sku) => {
        const s = sku.split("_");
        return `https://www.joesnewbalanceoutlet.com/pd/${s[1]}.html?dwvar_${s[1]}_style=${s[2]}`;
    },
    "NIKE": (sku) => sku.replace("NIKE_", "https://www.nike.com/").replaceAll("_", "/")
}

const addLinkToProd = (el) => {
    const sku = el.childNodes[1].textContent.trim();
    let supplierPrefix = sku.split("_")[0];
    let skuFunc = skuFuncMap[supplierPrefix];
    if (skuFunc) {
        const link = skuFunc(sku);
        el.onclick = () => window.open(link, "_blank");
        el.classList.add("page-title-action");
        el.style.cssText += 'display:block;width:fit-content;padding-bottom:0;padding-top:0;margin-left:0;';
    } else {
        console.error(`No Provider for prefix: [${supplierPrefix}]`);
    }
}

const eurSizes = await getJSON(prefix + "eur_sizes.json");

const addUsSize = (prodEl, brand, gender) => {
    const sizeEl = prodEl.querySelector("div.view p");
    const eurSize = sizeEl.textContent.trim();
    brand = brand.replace("'", '');
    let key = `${gender}_${brand}_${eurSize}`.toUpperCase();
    let usSize = eurSizes[key];
    if (!usSize) {
        key = `${gender}_NIKE_${eurSize}`.toUpperCase();
        usSize = eurSizes[key];
    }
    sizeEl.textContent = `${eurSize}\t(${usSize})`;
}

const shoesCategories = ["Bocanci/Cizme", "Ghete", "Pantofi/Loafers", "Sandale/Șlapi", "Încălțăminte"]

const app = async () => {
    if (document.querySelector(".woocommerce-layout__header-wrapper h1").textContent !== "Edit Order") {
        return;
    }
    const firstName = document.getElementById("_billing_first_name").getAttribute("value");
    const lastName = document.getElementById("_billing_last_name").getAttribute("value");
    const fullName = `${firstName} ${lastName}`;
    const date = document.querySelector("input[name=order_date]").getAttribute("value");

    //<--------------- CREATE COPY ORDER INFO BUTTON
    const supplierMap = {"SPM": "6PM", "ZP": "Zappos", "PMA": "Puma", "SPD": "SD", "JNB": "JNB"};
    const number = document.querySelector("h2.woocommerce-order-data__heading").textContent
        .replace("Order ", "").replace(" details", "").trim();
    const itemEls = document.querySelectorAll("table.woocommerce_order_items tr.item");

    const shippingTxt = document.querySelector(".shipping .edit input.wc_input_price").getAttribute("value");
    const shipping = +shippingTxt.replace(',', '.');
    const shippingPerItem = shipping / itemEls.length;

    const brand = await getJSON(prefix + "brands.json");

    let orderInfo = "";
    itemEls.forEach(itemEl => {
        let productName = itemEl.querySelector(".wc-order-item-name").textContent.trim();
        const prodBrand = brand.find(b => productName.startsWith(b));
        productName = productName.replace(prodBrand, "");
        let skuEl = itemEl.querySelector(".wc-order-item-sku");
        addLinkToProd(skuEl);//ADDING LINK TO PRODUCT
        const supplierPrefix = skuEl.childNodes[1].textContent.trim().split("_")[0];
        const size = itemEl.querySelector(".view p").textContent.trim();
        if (prodBrand !== "Puma" && shoesCategories.find(c => productName.includes(c))) {//ADDING US SIZE
            const normalizedName = productName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            const gender = normalizedName.includes("Barbati") ? "MEN" : "WOMEN";
            addUsSize(itemEl, prodBrand, gender);
        }
        const supplier = supplierMap[supplierPrefix];
        let price = +itemEl.querySelector(".item_cost bdi").childNodes[0].textContent
            .replace(",00 ", "").replace(".", "") + shippingPerItem;
        price = Math.round(price * 100) / 100;
        orderInfo += `${number}\t${date}\t\t${prodBrand}\t${productName}\t${size}\t${price}\t${supplier}\t${fullName}\n`;
    });
    createCopyBtn("Copy Order Info", orderInfo);

    //<--------------- CREATE COPY CUSTOMER INFO BUTTON
    const lang = document.querySelector(".order_notes li:last-child p").textContent.trim().includes("Оплата") ? "Ru" : "Ro";
    const email = document.getElementById("_billing_email").getAttribute("value");
    const city = document.getElementById("select2-_billing_state-container").textContent;
    const address = document.getElementById("_billing_address_1").getAttribute("value");
    let phone = document.getElementById("_billing_phone").getAttribute("value");
    phone = '0' + phone.replace(/^\s*\+?(373)? ?0?/, "");
    phone = phone.slice(0, 4) + ' ' + phone.slice(4, 6) + ' ' + phone.slice(6);
    const lastNameChar = firstName.substring(firstName.length - 1);
    const gender = lastNameChar === 'a' || lastNameChar === 'а' ? "W" : "M";

    const customerInfo = `${email}\t${firstName}\t${lastName}\t${date}\t${lang}\t${gender}\t${city}\t\t${address}\tSubscribed\t${phone}`;
    createCopyBtn("Copy Customer Info", customerInfo);
}

(() => {
    'use strict';
    window.addEventListener('load', app(), false);
})();