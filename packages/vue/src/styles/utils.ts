import type { CSSProperties } from 'vue';

export type CSSVariables = {
  [key: `--vue-${string}`]: string | number;
};

export const containerStyle: CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
};

export const applyStyleVariables = (variables: CSSVariables) => {
  return Object.entries(variables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('');
};