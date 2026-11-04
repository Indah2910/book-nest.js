import type { ValueTransformer } from 'typeorm';

// Kolom DECIMAL dari PostgreSQL dikembalikan sebagai string; ubah jadi number.
export const decimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) =>
    value === null || value === undefined ? value : parseFloat(value),
};
