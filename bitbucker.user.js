let issueHeaderButtons = document.querySelector(".flfhlx-2");
let issueNr = document.querySelectorAll("header div li a span")[1].innerText;
let issueName = document.querySelector("div[role=dialog] h1").innerText;

function toSlug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

//adding branch button
let branchBtn = document.createElement("button");
branchBtn.innerHTML = "BRANCH";
branchBtn.addEventListener("click", () => navigator.clipboard.writeText(issueNr + "-" + toSlug(issueName)));
issueHeaderButtons.appendChild(branchBtn);
//adding issue button
let issueBtn = document.createElement("button");
issueBtn.innerHTML = "ISSUE";
issueBtn.addEventListener("click", () => navigator.clipboard.writeText(issueNr + ': ' + issueName));
issueHeaderButtons.appendChild(issueBtn);