/// <reference types="react-scripts" />

// fix annoying console import
declare module 'console' {
  export = typeof import('console');
}
