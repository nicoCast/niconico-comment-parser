import * as assert from 'power-assert';
import NicoComment from '../src/nico-comment';
import Enum from '../src/enum';

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

  describe('#getWidthPx', () => {
    specify('', () => {
      chat.content = '日本語Width';
      chat.command = ['small'];
      const result = chat.getWidthPx();
      assert.strictEqual(result, 23 * 5.5);
    });
  });
});
