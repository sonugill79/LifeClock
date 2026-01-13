/**
 * Unit tests for custom CSV parser
 * Target: 100% code coverage
 */

import { describe, it, expect } from 'vitest';
import { parseCSV } from '../csvParser';

describe('csvParser', () => {
  describe('parseCSV', () => {
    it('should parse a simple CSV with 3 rows', () => {
      const csv = `name,age,city
John,30,NYC
Jane,25,LA
Bob,35,SF`;

      const result = parseCSV(csv);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ name: 'John', age: 30, city: 'NYC' });
      expect(result[1]).toEqual({ name: 'Jane', age: 25, city: 'LA' });
      expect(result[2]).toEqual({ name: 'Bob', age: 35, city: 'SF' });
    });

    it('should auto-convert numeric strings to numbers', () => {
      const csv = `item,price,quantity
Apple,1.50,10
Banana,0.75,20`;

      const result = parseCSV(csv);

      expect(result[0].price).toBe(1.5);
      expect(result[0].quantity).toBe(10);
      expect(typeof result[0].price).toBe('number');
      expect(typeof result[0].quantity).toBe('number');
    });

    it('should handle empty lines gracefully', () => {
      const csv = `name,value

Alice,100

Bob,200`;

      const result = parseCSV(csv);

      // Empty lines become objects with null values (parser doesn't filter them)
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({ name: null, value: null }); // Empty line
      expect(result[1]).toEqual({ name: 'Alice', value: 100 });
      expect(result[2]).toEqual({ name: null, value: null }); // Empty line
      expect(result[3]).toEqual({ name: 'Bob', value: 200 });
    });

    it('should correctly extract headers', () => {
      const csv = `firstName,lastName,email
John,Doe,john@example.com`;

      const result = parseCSV(csv);

      expect(result[0]).toHaveProperty('firstName');
      expect(result[0]).toHaveProperty('lastName');
      expect(result[0]).toHaveProperty('email');
      expect(result[0].firstName).toBe('John');
    });

    it('should handle mixed data types correctly', () => {
      const csv = `id,name,active,score
1,Alice,true,95.5
2,Bob,false,87.2`;

      const result = parseCSV(csv);

      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Alice');
      expect(result[0].active).toBe('true'); // Booleans stay as strings
      expect(result[0].score).toBe(95.5);
    });

    it('should handle single row CSV', () => {
      const csv = `name,value
Test,42`;

      const result = parseCSV(csv);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ name: 'Test', value: 42 });
    });

    it('should handle CSV with only headers', () => {
      const csv = `name,age,city`;

      const result = parseCSV(csv);

      expect(result).toHaveLength(0);
    });

    it('should work with TypeScript generics', () => {
      interface TestData {
        id: number;
        name: string;
      }

      const csv = `id,name
1,Alice
2,Bob`;

      const result = parseCSV<TestData>(csv);

      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Alice');
      // TypeScript should infer the type correctly
      const firstItem: TestData = result[0];
      expect(firstItem).toEqual({ id: 1, name: 'Alice' });
    });

    it('should handle trailing whitespace in CSV text', () => {
      const csv = `name,value
Test,100
`;

      const result = parseCSV(csv);

      expect(result).toHaveLength(1);
      expect(result[0].value).toBe(100);
    });

    it('should parse Health Inequality Project CSV format', () => {
      // Simulate actual dataset format
      const csv = `gnd,pctile,le_agg
M,50,81.59
F,50,84.98`;

      const result = parseCSV(csv);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ gnd: 'M', pctile: 50, le_agg: 81.59 });
      expect(result[1]).toEqual({ gnd: 'F', pctile: 50, le_agg: 84.98 });
    });
  });
});
