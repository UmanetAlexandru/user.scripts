let usSizes = {
    "MEN_TOMMY HILFIGER_6.5": "39",
    "MEN_TOMMY HILFIGER_7": "39.5",
    "MEN_TOMMY HILFIGER_7.5": "40",
    "MEN_TOMMY HILFIGER_8": "41",
    "MEN_TOMMY HILFIGER_8.5": "41.5",
    "MEN_TOMMY HILFIGER_9": "42",
    "MEN_TOMMY HILFIGER_9.5": "42.5",
    "MEN_TOMMY HILFIGER_10": "43",
    "MEN_TOMMY HILFIGER_10.5": "43.5",
    "MEN_TOMMY HILFIGER_11": "44",
    "MEN_TOMMY HILFIGER_11.5": "45",
    "MEN_TOMMY HILFIGER_12": "46",
    "MEN_TOMMY HILFIGER_12.5": "46.5",
    "MEN_TOMMY HILFIGER_13": "47.5"
};

console.log('{');
Object.entries(usSizes).forEach(entity => {
    let val = entity[1];
    if (val !== 'IGNORED') {
        let key = entity[0];
        let keySplit = key.split('_');
        let newKey = `${keySplit[0]}_${keySplit[1]}_${val}`;
        console.log(`  "${newKey}": "${keySplit[2]}",`);
    }
});
console.log('}');