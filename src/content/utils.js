/*
 * Copy Code from Medium articles - Adds a copy button to Medium.com code blocks
 * Copyright (C) 2026 Olha Stefanishyna (https://github.com/ostefani)
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY. See the GNU General Public License for more details.
 * Licensed under the GNU General Public License v3.0
 */

export function getFormattedCodeText(preElement) {
    if (!preElement) return '';

    const clone = preElement.cloneNode(true);
    const breakElement = clone.querySelectorAll('br');

    breakElement.forEach((br) => {
        const newLine = document.createTextNode('\n');
        br.parentNode.replaceChild(newLine, br);
    });

    return clone.textContent;
}

export function isClipboardAvailable() {
    return typeof navigator?.clipboard?.writeText === 'function';
}

export async function copyTextToClipboard(text) {
    if (!isClipboardAvailable()) return false;

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        return false;
    }
}

export const debounce = (callback, wait = 250) => {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), wait);
    };
};
