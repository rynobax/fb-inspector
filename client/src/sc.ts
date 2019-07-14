/**
 * Re-export styled-components with typed theme
 */

import * as styledComponents from 'styled-components';

import theme from './theme';

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
