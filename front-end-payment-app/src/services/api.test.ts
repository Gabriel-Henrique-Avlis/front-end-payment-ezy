import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('api', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetModules();
    });

    it('should create axios instance with proper headers', async () => {
        const mockAxiosInstance = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        };

        vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

        // Import api AFTER mocking to invoke axios.create with the mock
        await import('./api');

        expect(axios.create).toHaveBeenCalled();
        const callArgs = vi.mocked(axios.create).mock.calls[0]?.[0];
        expect(callArgs?.headers).toBeDefined();
        expect((callArgs?.headers as Record<string, string>)?.['Content-Type']).toBe('application/json');
    });

    it('should pass baseURL to axios.create', async () => {
        const mockAxiosInstance = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        };

        vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

        // Import api AFTER mocking to invoke axios.create with the mock
        await import('./api');

        expect(axios.create).toHaveBeenCalled();
        const callArgs = vi.mocked(axios.create).mock.calls[0]?.[0];
        expect(callArgs?.baseURL).toBeDefined();
        // baseURL can be either empty string or the environment variable value
        expect(typeof callArgs?.baseURL).toBe('string');
    });

    it('should have Content-Type header set to application/json', async () => {
        const mockAxiosInstance = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        };

        vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);

        // Import api AFTER mocking to invoke axios.create with the mock
        await import('./api');

        expect(axios.create).toHaveBeenCalled();
        const callArgs = vi.mocked(axios.create).mock.calls[0]?.[0];
        expect((callArgs?.headers as Record<string, string>)?.['Content-Type']).toBe('application/json');
    });
});
