// ==UserScript==
// @name         UShop Script
// @namespace    https://github.com/UmanetAlexandru/user.scripts
// @version      0.2
// @description  Script to copy UShop orders
// @author       Alexandru Umaneț
// @match        https://www.ushop.md/wp-admin/post.php?post=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ushop.md
// @updateURL    https://github.com/UmanetAlexandru/user.scripts/raw/master/ushop.order.user.js
// @downloadURL  https://github.com/UmanetAlexandru/user.scripts/raw/master/ushop.order.user.js
// @grant        none
// @run-at       document-end
// @require      file://D:\projects\Personal\Scripts\ushop.order.user.js
// ==/UserScript==
(function () {
    'use strict';
    if (document.querySelector(".woocommerce-layout__header-wrapper h1").textContent !== "Edit Order") {
        return;
    }
    const createCopyBtn = (name, copy) => {
        const btn = document.createElement("a");
        btn.innerText = name;
        btn.classList.add("page-title-action");
        btn.onclick = () => navigator.clipboard.writeText(copy);
        const parentEl = document.querySelector(".wrap");
        const beforeEl = document.querySelector("hr.wp-header-end");
        parentEl.insertBefore(btn, beforeEl);
    }

    const fullName = document.querySelector("p._billing_first_name_field input").getAttribute("value");

    //<--------------- CREATE COPY ORDER INFO BUTTON
    const supplierMap = {"SPM": "6PM", "ZP": "Zappos", "PMA": "Puma", "SPD": "SD", "JNB": "JNB"};
    const number = document.querySelector("h2.woocommerce-order-data__heading").textContent
        .replace("Order ", "")
        .replace(" details", "")
        .trim();
    const date = document.querySelector("input[name=order_date]").getAttribute("value");
    const itemEls = document.querySelectorAll("table.woocommerce_order_items tr.item");

    let orderInfo = "";
    itemEls.forEach(itemEl => {
        const productName = itemEl.querySelector(".wc-order-item-name").textContent.trim();
        const supplierPrefix = itemEl.querySelector(".wc-order-item-sku").childNodes[1].textContent
            .trim()
            .split("_")[0]
        const supplier = supplierMap[supplierPrefix];
        const size = itemEl.querySelector(".view p").textContent.trim();
        const price = itemEl.querySelector(".item_cost bdi").childNodes[0].textContent
            .replace(",00 ", "").replace(".", "")
        orderInfo += `${number}\t${date}\t\t\t${productName}\t${size}\t${price}\t${supplier}\t${fullName}\n`;
    });
    createCopyBtn("Copy Order Info", orderInfo)

    //<--------- ADD LINKS TO PRODUCT ITEMS
    const skuFuncMap = {
        "SPM": (sku) => {
            const s = sku.split("_");
            return `https://www.6pm.com/product/${s[1]}/color/${s[2]}`;
        },
        "ZP": (sku) => {
            const s = sku.split("_");
            return `https://www.zappos.com/product/${s[1]}/color/${s[2]}`;
        },
        "PMA": (sku) => `https://pumamoldova.md/ro/shop${sku.replaceAll("_", "/").replace("PMA_", "")}`,
        "SPD": (sku) => "https://www.sportsdirect.com/searchresults?descriptionfilter=" + sku.replace("SPD_", ""),
        "JNB": (sku) => {
            const s = sku.split("_");
            return `https://www.joesnewbalanceoutlet.com/product/${s[1]}/${s[2]}`;
        }
    }

    document.querySelectorAll(".wc-order-item-sku").forEach(el => {
        const sku = el.childNodes[1].textContent.trim();
        const link = skuFuncMap[sku.split("_")[0]](sku);
        el.onclick = () => window.open(link, "_blank");
        el.classList.add("page-title-action");
        el.style.cssText += 'display:block;max-width:30%;';
    });

    //<--------------- CREATE COPY CUSTOMER INFO BUTTON
    const statesMap = {
        "C": "Chișinău",
        "BL": "Bălți",
        "AN": "Anenii Noi",
        "BS": "Basarabeasca",
        "BR": "Briceni",
        "CH": "Cahul",
        "CT": "Cantemir",
        "CL": "Călărași",
        "CS": "Căușeni",
        "CM": "Cimișlia",
        "CR": "Criuleni",
        "DN": "Dondușeni",
        "DR": "Drochia",
        "DB": "Dubăsari",
        "ED": "Edineț",
        "FL": "Fălești",
        "FR": "Florești",
        "GE": "UTA Găgăuzia",
        "GL": "Glodeni",
        "HN": "Hîncești",
        "IL": "Ialoveni",
        "LV": "Leova",
        "NS": "Nisporeni",
        "OC": "Ocnița",
        "OR": "Orhei",
        "RZ": "Rezina",
        "RS": "Rîșcani",
        "SG": "Sîngerei",
        "SR": "Soroca",
        "ST": "Strășeni",
        "SD": "Șoldănești",
        "SV": "Ștefan Vodă",
        "TR": "Taraclia",
        "TL": "Telenești",
        "UN": "Ungheni"
    }
    const fullNameSplit = fullName.split(" ");
    const firstName = fullNameSplit[0];
    const lastName = fullNameSplit[1] || "\t";

    const email = document.querySelector("._billing_email_field input").getAttribute("value");
    const cityCode = document.querySelector("._billing_state_field input").getAttribute("value");
    const address = document.querySelector("._billing_address_1_field input").getAttribute("value");
    const phone = document.querySelector("._billing_phone_field input").getAttribute("value");
    const city = statesMap[cityCode];

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const todayDate = dd + '/' + mm + '/' + today.getFullYear();
    const customerInfo = `${email}\t${firstName}\t${lastName}\t${todayDate}\t\t\t${city}\t\t${address}\t\t${phone}`;
    createCopyBtn("Copy Customer Info", customerInfo);
})();