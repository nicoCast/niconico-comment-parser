// import * as fs from 'fs';
// import * as SAT from 'sat';
import _ from './lodash';
import NicoComment from './nico-comment';
import { Position } from './enum';

function hasKey(obj: any, key: string): boolean {
  return ({}).hasOwnProperty.call(obj, key);
}

class NicoCommentParser {
  static parse(rawdata: NicoComment.RawData[]): NicoComment.Result {
    const thread = NicoCommentParser.extractThread(rawdata);
    const chats = NicoCommentParser.extractChats(rawdata);

    return {
      thread,
      chats,
    };
  }

  static extractThread(rawdata: NicoComment.RawData[]): NicoComment.Thread {
    const rawThreads =
      <NicoComment.RawThread[]> rawdata.filter((c) => hasKey(c, 'thread'));
    const thread =
      (rawThreads.length) ? rawThreads[0].thread : <NicoComment.Thread> {};
    return thread;
  }

  static extractChats(rawdata: NicoComment.RawData[]): NicoComment.ParsedChat[] {
    const rawChats =
      <NicoComment.RawChat[]> rawdata.filter((c) => hasKey(c, 'chat'));
    const chats =
      rawChats.map((rawChat) => new NicoComment.ParsedChat(rawChat));

    return chats;
  }

  static calculatePosition(chats: NicoComment.ParsedChat[]): NicoComment.ParsedChat[] {
    const groups = _.groupBy(chats, (chat: NicoComment.ParsedChat) => chat.getPosType());
    groups[Position.Top] = groups[Position.Top] || [];
    groups[Position.Bottom] = groups[Position.Bottom] || [];
    groups[Position.Default] = groups[Position.Default] || [];

    return _.concat(groups[Position.Top], groups[Position.Bottom], groups[Position.Default]);
  }
}

export default NicoCommentParser;
