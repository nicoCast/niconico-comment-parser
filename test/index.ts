import * as assert from 'power-assert';
import NicoCommentParser from '../src';
import NicoComment from '../src/nico-comment';

import NicoCommentParserTest from './NicoCommentParser';

describe('NicoCommentParser', () => {
  let chatBase : NicoComment.Chat;
  beforeEach(() => {
    chatBase = {
      thread: 0,
      no: 0,
      vpos: 0,
      date: 0,
    };
  });

  it('should be imported', () => {
    assert.ok(NicoCommentParser);
  });

  describe('::parse', () => {
    const testList = [
      'simple',
      'no-mail',
    ];
    NicoCommentParserTest.parseTest(testList);
  });

  describe('::extractThread', () => {
    it('', () => {
      const thread = <NicoComment.Thread> {
        thread: 123456,
      };
      const result = NicoCommentParser.extractThread([{ thread }]);
      assert.deepEqual(thread, result);
    });
  });

  describe('::extractChats', () => {
    it('chats have content', () => {
      const expect = [
        Object.assign({}, chatBase, { no: 123456, content: 'Hello' }),
        Object.assign({}, chatBase, { no: 654321, content: 'World' }),
      ];
      const rawData = <NicoComment.RawData[]> [
        {
          chat: <NicoComment.Chat>
            Object.assign({}, chatBase, { no: 123456, content: 'Hello' }),
        },
        {
          chat: <NicoComment.Chat>
            Object.assign({}, chatBase, { no: 654321, content: 'World' }),
        },
      ];
      const result = NicoCommentParser.extractChats(rawData);
      assert.deepEqual(expect, result);
    });

    it('chats haven\'t content', () => {
      const expect = [
        Object.assign({}, chatBase, { no: 123456, content: 'Hello' }),
      ];
      const rawData = <NicoComment.RawData[]> [
        {
          chat: <NicoComment.Chat>
            Object.assign({}, chatBase, { no: 123456, content: 'Hello' }),
        },
        {
          chat: <NicoComment.Chat>
            Object.assign({}, chatBase, { no: 654321 }),
        },
      ];
      const result = NicoCommentParser.extractChats(rawData);
      assert.deepEqual(expect, result);
    });
  });

  describe('::calcTopPos', () => {
    beforeEach(() => {
      chatBase.mail = 'ue';
    });

    const testList = [
      {
        description: 'simple',
        chats: [
          { no: 0, vpos: 600, content: '日本語' },
          { no: 1, vpos: 100, content: '日本語' },
        ],
        expectPos: [0, 0],
      },
      {
        description: 'duplicated',
        chats: [
          { no: 0, vpos: 200, content: '日本語' },
          { no: 1, vpos: 100, content: '日本語' },
        ],
        expectPos: [0, 34],
      },
    ];

    testList.forEach((test) => {
      specify(test.description, () => {
        const chats = <NicoComment.ParsedChat[]>
          test.chats
            .map((chat) => Object.assign({}, chatBase, chat))
            .map((chat) => new NicoComment.ParsedChat(<NicoComment.Chat> chat));
        const results =
          NicoCommentParser.calcPos(chats).map((c) => c.pos);
        assert.deepStrictEqual(results, test.expectPos);
      });
    });
  });

  describe('::calcBottomPos', () => {
    beforeEach(() => {
      chatBase.mail = 'shita';
    });

    const testList = [
      {
        description: 'simple',
        chats: [
          { no: 0, vpos: 600, content: '日本語' },
          { no: 1, vpos: 100, content: '日本語' },
        ],
        expectPos: [351, 351],
      },
      {
        description: 'duplicated',
        chats: [
          { no: 0, vpos: 400, content: '日本語' },
          { no: 1, vpos: 100, content: '日本語' },
        ],
        expectPos: [351, 317],
      },
    ];

    testList.forEach((test) => {
      specify(test.description, () => {
        const chats = <NicoComment.ParsedChat[]>
          test.chats
            .map((chat) => Object.assign({}, chatBase, chat))
            .map((chat) => new NicoComment.ParsedChat(<NicoComment.Chat> chat));
        const results =
          NicoCommentParser.calcPos(chats).map((c) => c.pos);
        assert.deepStrictEqual(results, test.expectPos);
      });
    });
  });

  describe('::calcDefaultPos', () => {
    beforeEach(() => {
      chatBase.mail = 'naka';
    });

    const testList = [
      {
        description: 'simple',
        chats: [
          { no: 0, vpos: 300, content: '日本語' },
          { no: 1, vpos: 100, content: '日本語' },
        ],
        expectPos: [0, 0],
      },
      {
        description: 'duplicated 01',
        chats: [
          { no: 0, vpos: 100, content: '日本語' },
          { no: 1, vpos: 130, content: '日本語' },
        ],
        expectPos: [0, 34],
      },
      {
        description: 'duplicated 02',
        chats: [
          { no: 0, vpos: 100, content: '日本語' },
          { no: 1, vpos: 170, content: '日本語日本語' },
        ],
        expectPos: [0, 34],
      },
      {
        description: 'duplicated 03',
        chats: [
          { no: 0, vpos: 100, content: '日本語' },
          { no: 1, vpos: 150, content: '日本語日本語' },
          { no: 2, vpos: 200, content: 'あいうえ' },
        ],
        expectPos: [0, 34, 0],
      },
    ];

    testList.forEach((test) => {
      specify(test.description, () => {
        const chats = <NicoComment.ParsedChat[]>
          test.chats
            .map((chat) => Object.assign({}, chatBase, chat))
            .map((chat) => new NicoComment.ParsedChat(<NicoComment.Chat> chat));
        const results =
          NicoCommentParser.calcPos(chats).map((c) => c.pos);
        assert.deepStrictEqual(results, test.expectPos);
      });
    });
  });

  describe('::calcPos', () => {
    // const testList = [
    //   {
    //     description: 'no command',
    //     commands: [[], []],
    //     expect: [[], []],
    //   },
    //   {
    //     description: 'shita, ue -> ue, shita',
    //     commands: [['shita'], ['ue']],
    //     expect: [['ue'], ['shita']],
    //   },
    // ];
    //
    // testList.forEach((test) => {
    //   specify(test.description, () => {
    //     const chats = <NicoComment.ParsedChat[]>
    //       test.commands.map((command) => {
    //         const chat = new NicoComment.ParsedChat(<NicoComment.Chat> {});
    //         chat.command = command;
    //         return chat;
    //       });
    //     const results =
    //       NicoCommentParser.calcPos(chats).map((c) => c.command);
    //     assert.deepStrictEqual(results, test.expect);
    //   });
    // });
  });
});
