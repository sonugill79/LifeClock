import type { ThemeConfig, ThemeName } from '../types';

export const THEMES: Record<ThemeName, ThemeConfig> = {
  'ocean-sunset': {
    name: 'ocean-sunset',
    displayName: 'Ocean Sunset',
    description: 'Calming blue and purple',
    livedPrimary: '#3b82f6',
    remainingPrimary: '#8b5cf6',
  },
  'neon-dreams': {
    name: 'neon-dreams',
    displayName: 'Neon Dreams',
    description: 'Vibrant pink and purple',
    livedPrimary: '#ec4899',
    remainingPrimary: '#8b5cf6',
  },
  'forest-fire': {
    name: 'forest-fire',
    displayName: 'Forest Fire',
    description: 'Bold green and red',
    livedPrimary: '#059669',
    remainingPrimary: '#dc2626',
  },
  'cyber-glow': {
    name: 'cyber-glow',
    displayName: 'Cyber Glow',
    description: 'Electric cyan and amber',
    livedPrimary: '#06b6d4',
    remainingPrimary: '#f59e0b',
  },
  'grape-punch': {
    name: 'grape-punch',
    displayName: 'Grape Punch',
    description: 'Deep purple and rose',
    livedPrimary: '#7c3aed',
    remainingPrimary: '#e11d48',
  },
  'sunset-glow': {
    name: 'sunset-glow',
    displayName: 'Sunset Glow',
    description: 'Warm coral and violet',
    livedPrimary: '#f97316',
    remainingPrimary: '#a855f7',
  },
  'electric-storm': {
    name: 'electric-storm',
    displayName: 'Electric Storm',
    description: 'Bold indigo and yellow',
    livedPrimary: '#6366f1',
    remainingPrimary: '#eab308',
  },
  'tropical-vibes': {
    name: 'tropical-vibes',
    displayName: 'Tropical Vibes',
    description: 'Lime green and hot pink',
    livedPrimary: '#84cc16',
    remainingPrimary: '#ec4899',
  },
};

export const DEFAULT_THEME: ThemeName = 'ocean-sunset';
