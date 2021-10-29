// import original module declarations
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: {
      black: string;
      transparent: string;
      white: string;
    };
    fontFamily: {};
    fontSize: {
      inherit: string;
      initial: string;
    };
    fontStyle: {
      inherit: string;
      initial: string;
      italic: string;
      normal: string;
      oblique: string;
    };
    fontWeight: {
      black: string;
      bold: string;
      extraBold: string;
      extraLight: string;
      inherit: string;
      initial: string;
      light: string;
      medium: string;
      normal: string;
      thin: string;
    };
    grid: {
      columnWidth: number;
      gutterWidth: number;
      maxWidth: number;
      outerSpacing: number;
      sectionSpacing: number;
      totalColumns: number;
    };
  }
}
