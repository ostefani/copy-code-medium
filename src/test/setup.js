import { beforeEach, vi } from 'vitest';

beforeEach(() => {
    Object.assign(navigator, {
        clipboard: {
            writeText: vi.fn(() => Promise.resolve()),
        },
    });
});
