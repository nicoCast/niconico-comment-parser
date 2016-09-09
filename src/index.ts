// import * as fs from 'fs';
// import * as eaw from 'eastasianwidth';
// import * as SAT from 'sat';
import NicoComment from './nico-comment';

function hasKey(obj: any, key: string) : boolean {
  return ({}).hasOwnProperty.call(obj, key);
}

class NicoCommentParser {
  static parse(comments : NicoComment.RawData[]) : NicoComment.Result {
    const rawThreads =
      <NicoComment.RawThread[]> comments.filter((c) => hasKey(c, 'thread'));
    const thread =
      (rawThreads.length) ? rawThreads[0].thread : <NicoComment.Thread> {};
    const rawChats =
      <NicoComment.RawChat[]> comments.filter((c) => hasKey(c, 'chat'));
    const chats = rawChats.map((c) => c.chat);

    return {
      thread,
      chats,
    };
  }
}

export default NicoCommentParser;
