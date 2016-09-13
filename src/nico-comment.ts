/* eslint-disable camelcase */
import * as SAT from 'sat';
import * as eaw from 'eastasianwidth';
import { Position, Size } from './enum';

const PLAYER_WIDTH = 672;

namespace NicoComment {
  export class CommentFrame {
    width: number;
    time: number;
    limit: number;
    polygon: SAT.Polygon;

    constructor({ width, time } : { width: number, time: number }) {
      this.limit = 4;
      this.width = width;
      this.time = time;
      this.polygon = new SAT.Polygon(
        new SAT.Vector(time, 0),
        [
          new SAT.Vector(time, - width),
          new SAT.Vector(time + 4, PLAYER_WIDTH),
          new SAT.Vector(time + 4, PLAYER_WIDTH + width),
        ]
      );
    }

    isCollided(comments: CommentFrame[]): boolean {
      return comments.some((comment) => SAT.testPolygonPolygon(comment.polygon, this.polygon));
    }

    setLimit(limit: number): void {
      this.limit = limit;
    }

    clone(): CommentFrame {
      return new CommentFrame({
        width: this.width,
        time: this.time,
      });
    }
  }

  export class ParsedChat {
    no: number;
    time: number;
    command: string[];
    content: string;
    pos: number;

    constructor(chat: Chat) {
      this.no = chat.no;
      this.time = chat.vpos / 100;
      this.command = (chat.mail || '').split('\x20').filter((c) => c);
      this.content = chat.content || '';
      this.pos = 0;
    }

    getSizeType(): Size {
      const commands = this.command;
      for (const cmd of commands) {
        switch (cmd.toLowerCase()) {
          case Size.Big: return Size.Big;
          case Size.Small: return Size.Small;
          case Size.Medium: return Size.Medium;
          default: break;
        }
      }
      return Size.Medium;
    }

    getHeightPx(): number {
      const size = this.getSizeType();
      const line = this.content.split('\n').length;
      switch (size) {
        case Size.Big: return (line > 2) ? ((24 * line) + 3) : ((45 * line) + 5);
        case Size.Small: return (line > 6) ? ((10 * line) + 3) : ((18 * line) + 5);
        case Size.Medium:
        default:
          return (line > 4) ? ((15 * line) + 3) : ((29 * line) + 5);
      }
    }

    getWidthEm(): number {
      const lines = this.content.split('\n');
      return Math.max(...lines.map((s) => eaw.length(s))) * 0.5;
    }

    getWidthPx(): number {
      return this.getWidthEm() * this.getHeightPx();
    }

    getPosType(): Position {
      const commands = this.command;
      for (const cmd of commands) {
        switch (cmd.toLowerCase()) {
          case Position.Top: return Position.Top;
          case Position.Bottom: return Position.Bottom;
          case Position.Default: return Position.Default;
          default: break;
        }
      }
      return Position.Default;
    }

    setPos(pos: number): void {
      this.pos = pos;
    }
  }

  export type RawData = RawChat | RawThread;

  export interface RawChat {
    chat: Chat
  }

  export interface Chat {
    thread: number;
    no: number;
    vpos: number;
    date: number;
    mail?: string;
    user_id?: string;
    anonymity?: number;
    leaf?: number;
    content?: string;
    premium?: number;
    score?: number;
    deleted?: number;
  }

  export interface RawThread {
    thread: Thread
  }

  export interface Thread {
    resultcode: number;
    thread: number;
    last_res: number;
    ticket: string;
    revision: number;
    server_time: number;
    click_revision: number;
    num_clicks: number;
  }

  export interface Result {
    thread: NicoComment.Thread;
    chats: NicoComment.ParsedChat[];
  }
}

export default NicoComment;
