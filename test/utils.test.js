import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getFormattedCodeText, isClipboardAvailable, copyTextToClipboard, debounce } from '@/content/utils';

describe('getFormattedCodeText', () => {
    it('should return empty string when preElement is null or undefined', () => {
        expect(getFormattedCodeText(null)).toBe('');
        expect(getFormattedCodeText(undefined)).toBe('');
    });

    it('should extract text content from a simple pre element', () => {
        const pre = document.createElement('pre');
        pre.textContent = 'const x = 1;';

        expect(getFormattedCodeText(pre)).toBe('const x = 1;');
    });

    it('should convert <br> tags to newlines', () => {
        const pre = document.createElement('pre');
        pre.innerHTML = 'line1<br>line2<br>line3';

        const result = getFormattedCodeText(pre);
        expect(result).toBe('line1\nline2\nline3');
    });

    it('should handle nested elements with br tags', () => {
        const pre = document.createElement('pre');
        pre.innerHTML = '<span>function test() {<br>  return true;<br>}</span>';

        const result = getFormattedCodeText(pre);
        expect(result).toContain('\n');
        expect(result).toContain('function test()');
    });

    it('should not modify the original element', () => {
        const pre = document.createElement('pre');
        pre.innerHTML = 'line1<br>line2';

        const originalState = { html: pre.innerHTML };

        getFormattedCodeText(pre);
        expect({ html: pre.innerHTML }).toEqual(originalState);
    });
});

describe('isClipboardAvailable', () => {
    let originalClipboard;

    beforeEach(() => {
        originalClipboard = navigator.clipboard;
    });

    afterEach(() => {
        Object.defineProperty(navigator, 'clipboard', {
            value: originalClipboard,
            configurable: true,
        });
    });

    it('should return true when clipboard API is available', () => {
        expect(isClipboardAvailable()).toBe(true);
    });

    it('should return false when clipboard is undefined', () => {
        Object.defineProperty(navigator, 'clipboard', {
            value: undefined,
            configurable: true,
        });

        expect(isClipboardAvailable()).toBe(false);
    });

    it('should return false when writeText is not a function', () => {
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: null },
            configurable: true,
        });

        expect(isClipboardAvailable()).toBe(false);
    });
});

describe('copyTextToClipboard', () => {
    let originalClipboard;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    beforeEach(() => {
        originalClipboard = navigator.clipboard;
    });

    afterEach(() => {
        Object.defineProperty(navigator, 'clipboard', {
            value: originalClipboard,
            configurable: true,
        });
    });

    it('should copy text successfully', async () => {
        const text = 'console.log("test");';

        const result = await copyTextToClipboard(text);

        expect(result).toBe(true);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    });

    it('should return false when clipboard is not available', async () => {
        Object.defineProperty(navigator, 'clipboard', {
            value: undefined,
            configurable: true,
        });

        const result = await copyTextToClipboard('test');

        expect(result).toBe(false);
    });

    it('should return false when clipboard writeText fails', async () => {
        navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Permission denied'));

        const result = await copyTextToClipboard('test');

        expect(result).toBe(false);
    });
});

describe('debounce', () => {
    beforeEach(() => {
        // use controlled timers
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should delay function execution', () => {
        // a fake function that Vitest tracks.
        const mockFn = vi.fn();
        const debounced = debounce(mockFn, 250);

        debounced();
        expect(mockFn).not.toHaveBeenCalled();
        // "Fast-forward" 250ms INSTANTLY
        vi.advanceTimersByTime(250);
        // 250ms passed, fire the callback now
        expect(mockFn).toHaveBeenCalledOnce();
    });

    it('should cancel previous calls when called multiple times', () => {
        const mockFn = vi.fn();
        const debounced = debounce(mockFn, 250);

        debounced('first');
        vi.advanceTimersByTime(100);

        debounced('second');
        vi.advanceTimersByTime(100);

        debounced('third');
        vi.advanceTimersByTime(250);

        expect(mockFn).toHaveBeenCalledOnce();
        expect(mockFn).toHaveBeenCalledWith('third');
    });

    it('should pass arguments to the debounced function', () => {
        const mockFn = vi.fn();
        const debounced = debounce(mockFn, 100);

        debounced('arg1', 'arg2', 'arg3');
        vi.advanceTimersByTime(100);

        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });

    it('should use default wait time of 250ms', () => {
        const mockFn = vi.fn();
        const debounced = debounce(mockFn);

        debounced();
        vi.advanceTimersByTime(249);
        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(mockFn).toHaveBeenCalledOnce();
    });
});
