export const delay = async (ms) => new Promise(resolve =>
    setTimeout(resolve, ms)
);

export const indexesOf = (string, substring) => {
    var a=[],i=-1;
    while((i=string.indexOf(substring,i+1)) >= 0) a.push(i);
    return a;
}


export const insertSubString = (str, index, value,length)  => {
    console.log({index,value,length});
    return str.substr(0, index) + value + str.substr(index+length+1);
}