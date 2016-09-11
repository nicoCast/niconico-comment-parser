// import * as fs from 'fs';
// import * as eaw from 'eastasianwidth';
// import * as SAT from 'sat';
import NicoComment from './nico-comment';

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

    const chats = rawChats.map((rawChat) => {
      const chat = rawChat.chat;
      const parsedChat = <NicoComment.ParsedChat> {
        no: chat.no,
        time: chat.vpos / 100,
        command: (chat.mail || '').split('\x20').filter((c) => c),
        content: chat.content,
        pos: 0,
      };
      return parsedChat;
    });

    return chats;
  }
}

export default NicoCommentParser;
