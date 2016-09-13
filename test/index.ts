import 'mocha';
import * as assert from 'power-assert';
import NicoCommentParser from '../src';
import NicoComment from '../src/nico-comment';
import Enum from '../src/enum';

import NicoCommentParserTest from './NicoCommentParser';

describe('NicoCommentParser', () => {
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
    it('', () => {
      const expect = [
        { no: 123456 },
        { no: 654321 },
      ];
      const rawData = <NicoComment.RawData[]> [
        { chat: { no: 123456 } },
        { chat: { no: 654321 } },
      ];
      const result = NicoCommentParser.extractChats(rawData);
      assert.deepEqual(expect, result);
    });
  });

  describe('::calcTopPos', () => {});
  describe('::calcBottomPos', () => {});
  describe('::calcDefaultPos', () => {});

  describe('::calcPos', () => {
    const testList = [
      {
        description: 'no command',
        commands: [[], []],
        expect: [[], []],
      },
      {
        description: 'shita, ue -> ue, shita',
        commands: [['shita'], ['ue']],
        expect: [['ue'], ['shita']],
      },
    ];

    testList.forEach((test) => {
      specify(test.description, () => {
        const chats = <NicoComment.ParsedChat[]>
          test.commands.map((command) => {
            const chat = new NicoComment.ParsedChat(<NicoComment.Chat> {});
            chat.command = command;
            return chat;
          });
        const results =
          NicoCommentParser.calcPos(chats).map((c) => c.command);
        assert.deepStrictEqual(results, test.expect);
      });
    });
  });
});

describe('NicoComment.ParsedChat', () => {
  let chat: NicoComment.ParsedChat;
  beforeEach(() => {
    chat = new NicoComment.ParsedChat(<NicoComment.Chat> {});
  });

  describe('#getPosType', () => {
    const testList = [
      {
        description: 'no position command',
        command: ['big'],
        expect: Enum.Position.Default,
      },
      {
        description: 'one position command',
        command: ['ue'],
        expect: Enum.Position.Top,
      },
      {
        description: 'duplicated position commands',
        command: ['shita', 'ue'],
        expect: Enum.Position.Bottom,
      },
      {
        description: 'position and other commands',
        command: ['small', 'naka'],
        expect: Enum.Position.Default,
      },
    ];

    testList.forEach((test) => {
      specify(test.description, () => {
        chat.command = test.command;
        const result = chat.getPosType();
        assert.strictEqual(result, test.expect);
      });
    });
  });

  describe('#getSizeType', () => {
    const testList = [
      {
        description: 'no size command',
        command: ['shita'],
        expect: Enum.Size.Medium,
      },
      {
        description: 'one size command',
        command: ['big'],
        expect: Enum.Size.Big,
      },
      {
        description: 'duplicated size commands',
        command: ['small', 'big'],
        expect: Enum.Size.Small,
      },
      {
        description: 'size and other commands',
        command: ['naka', 'medium'],
        expect: Enum.Size.Medium,
      },
    ];

    testList.forEach((test) => {
      specify(test.description, () => {
        chat.command = test.command;
        const result = chat.getSizeType();
        assert.strictEqual(result, test.expect);
      });
    });
  });

  describe('#getWidthEm', () => {
    specify('one line', () => {
      chat.content = '日本語Width';
      const result = chat.getWidthEm();
      assert.strictEqual(result, 5.5);
    });
    specify('multi line', () => {
      chat.content = '日本語Width\n日本語長いWidth';
      const result = chat.getWidthEm();
      assert.strictEqual(result, 7.5);
    });
  });

  describe('#getHeightPx', () => {
    context('few lines', () => {
      const testList = [
        {
          description: 'Big',
          command: ['big'],
          content: 'oneline',
          expect: 50,
        },
        {
          description: 'Small',
          command: ['small'],
          content: 'oneline',
          expect: 23,
        },
        {
          description: 'Medium',
          command: [],
          content: 'oneline',
          expect: 34,
        },
      ];

      testList.forEach((test) => {
        specify(test.description, () => {
          chat.command = test.command;
          chat.content = test.content;
          const result = chat.getHeightPx();
          assert.strictEqual(result, test.expect);
        });
      });
    });

    context('many lines', () => {
      const testList = [
        {
          description: 'Big',
          command: ['big'],
          content: Array(3).fill('line').join('\n'),
          expect: 75,
        },
        {
          description: 'Small',
          command: ['small'],
          content: Array(7).fill('line').join('\n'),
          expect: 73,
        },
        {
          description: 'Medium',
          command: [],
          content: Array(5).fill('line').join('\n'),
          expect: 78,
        },
      ];

      testList.forEach((test) => {
        specify(test.description, () => {
          chat.command = test.command;
          chat.content = test.content;
          const result = chat.getHeightPx();
          assert.strictEqual(result, test.expect);
        });
      });
    });
  });
});
