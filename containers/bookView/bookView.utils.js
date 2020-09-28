export const removeNotNeedContent = (content, punctuation, grammar) => {
    const contentWithoutTags = removeTag(content)
    return punctuation ? removePunctuation((grammar ? removeGrammar(contentWithoutTags) : contentWithoutTags)) : (grammar ? removeGrammar(contentWithoutTags) : contentWithoutTags)
}

export const removeGrammar = (content) => {
    return content.replace(/[^א-ת\s,:;־.-]/g, '')
}

export const removePunctuation = (content) => {
    return ([...content] || []).reduce((newString, char, index) => {
        if (!['?', '!', ',', ".", ":"].includes(char) || [...content].length - 1 === index) {
            newString += char;
        }
        return newString;
    }, '')
}

export const removeTag = (content) => {
    return content.replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, '').replace('>', '').replace('<', '').replace('/em', '')
}

export const removeGrayTag = (content) => {
    return content.replace(new RegExp(/<.כתיב./, 'g'), '').replace(/<\/?כתיב>/g, '')
}
export const removeSmallTag = (content) => {
    return content.replace(new RegExp(/<קטן>/, 'g'), '').replace(/<\/?קטן>/g, '')
}
export const removeBoldTag = (content) => {
    return content.replace(new RegExp(/<.דה./, 'g'), '').replace(/<\/?דה>/g, '').replace(new RegExp(/<.הדגשה./, 'g'), '').replace(/<\/?הדגשה>/g, '')
}