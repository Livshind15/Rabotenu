export const delay = async (ms) => new Promise(resolve =>
    setTimeout(resolve, ms)
);

export const indexesOf = (string, substring) => {
    var a = [], i = -1;
    while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i);
    return a;
}


export const insertSubString = (str, index, value) => {
    return str.substring(0, index) + "<em>" + str.substring(index, index + value.length) + "</em>" + str.substring(index + value.length);
}