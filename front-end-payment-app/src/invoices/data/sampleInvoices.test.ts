import { describe, it, expect } from 'vitest';
import { sampleData } from './sampleInvoices';

describe('sampleInvoices', () => {
    it('should have invoices array', () => {
        expect(sampleData.invoices).toBeDefined();
        expect(Array.isArray(sampleData.invoices)).toBe(true);
    });

    it('should have at least one invoice', () => {
        expect(sampleData.invoices.length).toBeGreaterThan(0);
    });

    it('should have lastUpdated date', () => {
        expect(sampleData.lastUpdated).toBeDefined();
        expect(typeof sampleData.lastUpdated).toBe('string');
    });

    it('each invoice should have required fields', () => {
        sampleData.invoices.forEach(invoice => {
            expect(invoice).toHaveProperty('id');
            expect(invoice).toHaveProperty('amount');
            expect(invoice).toHaveProperty('currency');
            expect(invoice).toHaveProperty('vendor');
            expect(invoice).toHaveProperty('dueDate');
            expect(invoice).toHaveProperty('issueDate');
            expect(invoice).toHaveProperty('priority');
        });
    });

    it('invoices should have valid amounts', () => {
        sampleData.invoices.forEach(invoice => {
            expect(typeof invoice.amount).toBe('number');
            expect(invoice.amount).toBeGreaterThan(0);
        });
    });

    it('invoices should have valid currency codes', () => {
        sampleData.invoices.forEach(invoice => {
            expect(typeof invoice.currency).toBe('string');
            expect(invoice.currency.length).toBeGreaterThan(0);
        });
    });

    it('invoices should have valid priority values', () => {
        const validPriorities = ['high', 'normal', 'urgent', 'critical'];
        sampleData.invoices.forEach(invoice => {
            expect(validPriorities).toContain(invoice.priority);
        });
    });

    it('invoices should have valid due dates', () => {
        sampleData.invoices.forEach(invoice => {
            expect(typeof invoice.dueDate).toBe('string');
            const date = new Date(invoice.dueDate);
            expect(isNaN(date.getTime())).toBe(false);
        });
    });

    it('invoices should have vendor names', () => {
        sampleData.invoices.forEach(invoice => {
            expect(typeof invoice.vendor).toBe('string');
            expect(invoice.vendor.length).toBeGreaterThan(0);
        });
    });

    it('invoices should have unique IDs', () => {
        const ids = sampleData.invoices.map(inv => inv.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it('lastUpdated should be a valid date string', () => {
        const date = new Date(sampleData.lastUpdated);
        expect(isNaN(date.getTime())).toBe(false);
    });

    it('should have totalAmount property', () => {
        expect(sampleData).toHaveProperty('totalAmount');
        expect(typeof sampleData.totalAmount).toBe('number');
        expect(sampleData.totalAmount).toBeGreaterThan(0);
    });
});
