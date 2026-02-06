import { vi } from 'vitest';

const store = {};

const localStorageMock = {
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => { store[key] = String(value); }),
  removeItem: vi.fn((key) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
};

vi.stubGlobal('localStorage', localStorageMock);
