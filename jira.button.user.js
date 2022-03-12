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

if (btnParentEl) {
    const issueNr = document.querySelector("li a[target='_blank'] span").innerText;
    const issueName = document.querySelector("h1[data-test-id='issue.views.issue-base.foundation.summary.heading']").innerText;
    const branchName = issueNr + '-' + toSlug(issueName);
    const fullName = issueNr + ': ' + issueName;

    const createCopyButton = (name, copyText, parent) => {
        const issueNameBtn = document.createElement("button");
        issueNameBtn.onclick = () => {
            console.log(copyText);
            navigator.clipboard.writeText(copyText);
        }
        issueNameBtn.innerText = name;
        parent.appendChild(issueNameBtn);
    }

    const btnParentEl = document.querySelector("#ak-main-content div.guBgLL");
    createCopyButton("Name", fullName, btnParentEl);
    createCopyButton("Branch", branchName, btnParentEl);
}