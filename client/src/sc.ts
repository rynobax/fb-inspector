/**
 * Re-export styled-components with typed theme
 */

import * as styledComponents from 'styled-components';

export const theme = {
  color: {
    primary: {
      regular: '#000',
      light: '#555',
      extraLight: '#777',
    },
    text: {
      primary: '#555',
      light: '#777',
    },
  },
  font: {
    size: {
      12: '12px',
      14: '14px',
      16: '16px',
      18: '18px',
      20: '20px',
      24: '24px',
      30: '30px',
      36: '36px',
      48: '48px',
      60: '60px',
      72: '72px',
    },
  },
};

type ThemeInterface = typeof theme;

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  ThemeInterface
>;

export { css, createGlobalStyle, keyframes, ThemeProvider };
export default styled;
