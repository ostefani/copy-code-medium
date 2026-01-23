/*
 * Copy Code from Medium articles - Adds a copy button to Medium.com code blocks
 * Copyright (C) 2026 Olha Stefanishyna (https://github.com/ostefani)
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY. See the GNU General Public License for more details.
 * Licensed under the GNU General Public License v3.0
 */

import { getFormattedCodeText, copyTextToClipboard, isClipboardAvailable, debounce } from './utils';
import { CONFIG } from './config';
import copyButtonStyles from './content.css?raw';
import buttonHTML from './copy-button.html?raw';

// Catch block for FF
function applyStyles(shadowRoot, sheet) {
    try {
        shadowRoot.adoptedStyleSheets = [sheet];
    } catch (e) {
        const style = document.createElement('style');
        style.textContent = copyButtonStyles;
        shadowRoot.appendChild(style);
    }
}

export function addButtonToBlock(targetContainer, templateHtml, sheet) {
    if (targetContainer.getAttribute(CONFIG.processedAttr) === '1') return;

    targetContainer.setAttribute(CONFIG.processedAttr, '1');
    targetContainer.classList.add(CONFIG.codeWrapperClass);

    if (getComputedStyle(targetContainer).position === 'static') {
        targetContainer.style.position = 'relative';
    }

    const host = document.createElement('div');
    host.className = CONFIG.shadowHostClass;
    const shadowRoot = host.attachShadow({ mode: 'open' });

    applyStyles(shadowRoot, sheet);

    const clone = templateHtml.content.cloneNode(true);

    // Set up button click handler
    const button = clone.querySelector(`.${CONFIG.buttonClass}`);
    const statusNode = clone.querySelector(`.${CONFIG.screenReadersClass}`);

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const codeText = getFormattedCodeText(targetContainer);
        const ok = await copyTextToClipboard(codeText);

        button.classList.toggle(CONFIG.copiedClass, ok);

        if (statusNode) {
            statusNode.textContent = ok ? 'Copied.' : 'Failed to copy.';
        }

        setTimeout(() => {
            button.classList.remove(CONFIG.copiedClass);
            if (statusNode) statusNode.textContent = '';
        }, CONFIG.copiedTimeout);
    });

    shadowRoot.appendChild(clone);
    targetContainer.appendChild(host);
}

// Process selectors and add buttons
function processCodeBlocks(templateHtml, sheet) {
    CONFIG.codeBlockSelectors.forEach((selector) => {
        const nodes = document.querySelectorAll(selector);

        nodes.forEach((node) => {
            addButtonToBlock(node, templateHtml, sheet);
        });
    });
}

// initialize extension
async function init() {
    if (!isClipboardAvailable()) {
        console.warn("Unsupported environment, Medium Copy Button won't run");
        return;
    }

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(copyButtonStyles);

    const template = document.createElement('template');
    template.innerHTML = buttonHTML;

    const processBatched = debounce(() => processCodeBlocks(template, sheet), CONFIG.debounceDelay);

    const observer = new MutationObserver((mutations) => {
        let relevant = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                relevant = true;
                break;
            }
        }
        if (relevant) processBatched();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    processCodeBlocks(template, sheet);
}

init();
