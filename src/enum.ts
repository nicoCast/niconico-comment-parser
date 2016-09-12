/* eslint-disable space-infix-ops */

export type Position = 'ue' | 'shita' | 'naka';

export namespace Position {
  export const Top: Position = 'ue';
  export const Bottom: Position = 'shita';
  export const Default: Position = 'naka';
}

export type Size = 'big' | 'small' | 'medium';

export namespace Size {
  export const Big: Size = 'big';
  export const Small: Size = 'small';
  export const Medium: Size = 'medium';
}

export default {
  Position,
  Size,
};
