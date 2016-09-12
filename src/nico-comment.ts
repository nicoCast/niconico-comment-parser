/* eslint-disable camelcase */
import * as eaw from 'eastasianwidth';
import { Position, Size } from './enum';

namespace NicoComment {
  export class ParsedChat {
    no: number;
    time: number;
    command: string[];
    content: string;
    pos: number;

    constructor(raw: RawChat) {
      const chat = raw.chat;
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
