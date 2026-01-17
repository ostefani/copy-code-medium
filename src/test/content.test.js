import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../content/utils', async () => {
    const actual = await vi.importActual('@/content/utils');
    return {
        ...actual,
        isClipboardAvailable: vi.fn(() => true),
    };
});

vi.mock('./content.css?raw', () => ({
    default: '.medium-copy-btn { position: absolute; }',
}));

vi.mock('./copy-button.html?raw', () => ({
    default: '<button class="medium-copy-btn">Copy</button><span class="sr-only"></span>',
}));

import { CONFIG } from '@/content/config';

import { addButtonToBlock } from '@/content/content';

describe('content.js - addButtonToBlock', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    function setupTest(preContent = '<span>console.log("test");<br>}</span>') {
        const pre = document.createElement('pre');
        pre.innerHTML = preContent;

        const template = document.createElement('template');
        template.innerHTML = `
            <button class="${CONFIG.buttonClass}">Copy</button>
            <span class="${CONFIG.screenReadersClass}"></span>
        `;

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`.${CONFIG.buttonClass} { position: absolute; }`);

        return { pre, template, sheet };
    }

    it('should add button with styles', () => {
        const { pre, template, sheet } = setupTest();

        addButtonToBlock(pre, template, sheet);

        expect(pre.getAttribute(CONFIG.processedAttr)).toBe('1');

        const host = pre.querySelector(`.${CONFIG.shadowHostClass}`);
        expect(host.shadowRoot.adoptedStyleSheets).toContain(sheet);
    });

    it('should copy code when button is clicked', async () => {
        const { pre, template, sheet } = setupTest();

        addButtonToBlock(pre, template, sheet);

        const host = pre.querySelector(`.${CONFIG.shadowHostClass}`);
        expect(host).toBeTruthy();

        const button = host.shadowRoot.querySelector(`.${CONFIG.buttonClass}`);
        expect(button).toBeTruthy();

        button.click();
        await Promise.resolve();

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('console.log("test");\n}');
    });
});
