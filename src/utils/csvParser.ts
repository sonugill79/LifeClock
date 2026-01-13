/**
 * Custom lightweight CSV parser (~0.5KB gzipped)
 *
 * Chosen over PapaParse (~8KB) to align with "Keep bundle small" guideline.
 * Optimized for well-formed, controlled CSV data (no edge cases like quoted fields).
 *
 * @see Decision #1 in /docs/DECISIONS_INCOME_LIFE_EXPECTANCY.md
 */

export function parseCSV<T = Record<string, unknown>>(csvText: string): T[] {
  const lines = csvText.trim().split('\n');

  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const dataRows = lines.slice(1);

  return dataRows.map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      const value = values[index];

      // Auto-convert numeric strings to numbers
      if (value === undefined || value === '') {
        obj[header] = null;
      } else {
        const numValue = Number(value);
        obj[header] = isNaN(numValue) ? value : numValue;
      }
    });

    return obj as T;
  });
}
