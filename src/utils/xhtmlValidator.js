// xhtmlValidator.js

export const validateXHTML = (input) => {
    const allowedTags = ['a', 'code', 'i', 'strong'];
    const openingTagRegex = /<([a-z]+)([^>]*?)>/gi;
    const closingTagRegex = /<\/([a-z]+)>/gi;

    let match;
    let openTags = [];
    let isValid = true;
    let invalidTagFound = null;

    // Перевірка на відкриті та закриті дозволені теги
    while ((match = openingTagRegex.exec(input)) !== null) {
        const tag = match[1];
        if (!allowedTags.includes(tag)) {
            invalidTagFound = tag;
            isValid = false;
            break;
        }
        openTags.push(tag);
    }

    if (!isValid) {
        return `Invalid tag found: <${invalidTagFound}>`;
    }

    // Перевірка на закриті теги
    let closingMatch;
    while ((closingMatch = closingTagRegex.exec(input)) !== null) {
        const closingTag = closingMatch[1];
        const openingIndex = openTags.lastIndexOf(closingTag);

        if (openingIndex === -1 || openTags[openingIndex] !== closingTag) {
            return `Unmatched closing tag found: </${closingTag}>`;
        }
        openTags.splice(openTags.lastIndexOf(closingTag), 1);
    }

    // Якщо залишилися відкриті теги
    if (openTags.length > 0) {
        return `Unclosed tag found: <${openTags[0]}>`;
    }

    return 'Valid XHTML';
}


