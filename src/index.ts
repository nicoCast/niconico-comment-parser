import _ from './utils/lodash';
import NicoComment from './nico-comment';
import { Position } from './enum';

const PLAYER_HEIGHT = 385;

function hasKey(obj: any, key: string): boolean {
  return ({}).hasOwnProperty.call(obj, key);
}

class NicoCommentParser {
  static parse(rawdata: NicoComment.RawData[]): NicoComment.Result {
    const thread = NicoCommentParser.extractThread(rawdata);
    const chats = NicoCommentParser.extractChats(rawdata);
    const parsedChats = chats.map((chat) => new NicoComment.ParsedChat(chat));

    return {
      thread,
      chats: NicoCommentParser.calcPos(parsedChats),
    };
  }

  static extractThread(rawdata: NicoComment.RawData[]): NicoComment.Thread {
    const rawThreads =
      <NicoComment.RawThread[]> rawdata.filter((c) => hasKey(c, 'thread'));
    const thread =
      (rawThreads.length) ? rawThreads[0].thread : <NicoComment.Thread> {};
    return thread;
  }

  static extractChats(rawdata: NicoComment.RawData[]): NicoComment.Chat[] {
    const rawChats =
      <NicoComment.RawChat[]> rawdata.filter((c) => hasKey(c, 'chat'));
    const chats = rawChats.map((c) => c.chat);
    return chats;
  }

  static calcPos(chats: NicoComment.ParsedChat[]): NicoComment.ParsedChat[] {
    const groups = _.groupBy(chats, (chat: NicoComment.ParsedChat) => chat.getPosType());

    groups[Position.Top] = NicoCommentParser.calcTopPos(groups[Position.Top]);
    groups[Position.Bottom] = NicoCommentParser.calcBottomPos(groups[Position.Bottom]);
    groups[Position.Default] = NicoCommentParser.calcDefaultPos(groups[Position.Default]);

    const results =
      _.concat(groups[Position.Top], groups[Position.Bottom], groups[Position.Default]);
    return _.sortBy(results, ['time', 'no']);
  }

  static calcTopPos(chats : NicoComment.ParsedChat[] = []): NicoComment.ParsedChat[] {
    const sortedChats = _.sortBy(chats, ['time', 'no']);

    let fields = <number[]> new Array(PLAYER_HEIGHT).fill(0);
    let currentTime = 0;

    sortedChats.forEach((chat) => {
      const deltaTime = chat.time - currentTime;
      fields = fields.map((limit) => Math.max(0, limit - deltaTime));

      const height = chat.getHeightPx();
      let startIdx: number;
      for (
        startIdx = fields.indexOf(0);
        startIdx >= 0;
        startIdx = fields.indexOf(0, startIdx + 1)
      ) {
        const lastIdx = _.findIndex(fields, (limit: number) => (limit !== 0), startIdx);
        if (
          (lastIdx === -1 && fields.length - startIdx > height) ||
          ((lastIdx - (startIdx - 1)) > height)
        ) {
          fields.fill(4, startIdx, startIdx + height);
          break;
        }
      }

      if (startIdx < 0) {
        startIdx = Math.floor(Math.random() * (PLAYER_HEIGHT - height));
      }
      chat.setPos(startIdx);

      currentTime = chat.time;
    });

    return sortedChats;
  }

  static calcBottomPos(chats : NicoComment.ParsedChat[] = []): NicoComment.ParsedChat[] {
    return NicoCommentParser.calcTopPos(chats).map((chat) => {
      chat.setPos(PLAYER_HEIGHT - (chat.pos + chat.getHeightPx()));
      return chat;
    });
  }


  static calcDefaultPos(chats : NicoComment.ParsedChat[] = []): NicoComment.ParsedChat[] {
    const sortedChats = _.sortBy(chats, ['time', 'no']);

    let fields =
      <NicoComment.CommentFrame[][]> new Array(PLAYER_HEIGHT).fill([]);
    let currentTime = 0;

    sortedChats.forEach((chat) => {
      const deltaTime = chat.time - currentTime;
      fields = fields.map((arr) => arr.map((comment) => {
        const limit = Math.max(0, comment.limit - deltaTime);
        comment.setLimit(limit);
        return comment;
      }));
      fields = fields.map((arr) => arr.filter((comment) => (comment.limit !== 0)));

      const chatComment = new NicoComment.CommentFrame({
        width: chat.getWidthEm() * chat.getHeightPx(),
        time: chat.time
      });
      const checkCollided =
        (arr: NicoComment.CommentFrame[]) => chatComment.isCollided(arr);
      const checkNotCollided =
        (arr: NicoComment.CommentFrame[]) => !chatComment.isCollided(arr);

      const height = chat.getHeightPx();
      let startIdx: number;
      for (
        startIdx = _.findIndex(fields, checkNotCollided);
        startIdx >= 0;
        startIdx = _.findIndex(fields, checkNotCollided, startIdx + 1)
      ) {
        const lastIdx = _.findIndex(fields, checkCollided, startIdx);
        if (
          (lastIdx === -1 && fields.length - startIdx > height) ||
          ((lastIdx - (startIdx - 1)) > height)
        ) {
          break;
        }
      }

      if (startIdx < 0) {
        startIdx = Math.floor(Math.random() * (PLAYER_HEIGHT - height));
      } else {
        fields.forEach((arr, idx) => {
          if (startIdx <= idx && idx < startIdx + height) {
            arr.push(chatComment.clone());
          }
        });
      }
      chat.setPos(startIdx);

      currentTime = chat.time;
    });

    return sortedChats;
  }
}

export default NicoCommentParser;
