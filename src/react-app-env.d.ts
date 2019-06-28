/// <reference types="react-scripts" />

declare module '@reach/menu-button' {}
declare module '@reach/dialog' {}

// fix annoying console import
declare module 'console' {
  export = typeof import("console");
}
