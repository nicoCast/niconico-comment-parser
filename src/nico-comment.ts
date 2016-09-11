/* eslint-disable camelcase */
declare namespace NicoComment {
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

  export interface ParsedChat {
    no: number;
    time: number;
    command: string[];
    content: string;
    pos: number;
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
