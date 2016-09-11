/* eslint-disable space-infix-ops */

export type Position = 'ue' | 'shita' | 'naka';

export namespace Position {
  export const Top: Position = 'ue';
  export const Bottom: Position = 'shita';
  export const Default: Position = 'naka';
}

export default {
  Position,
};
