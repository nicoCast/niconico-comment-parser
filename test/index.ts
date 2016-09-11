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

  describe('::checkPosType', () => {
    const testList = [
      {
        descripton: 'no command',
        command: ['big'],
        expect: Enum.Position.Default,
      },
      {
        descripton: 'one command',
        command: ['ue'],
        expect: Enum.Position.Top,
      },
      {
        descripton: 'duplicated command',
        command: ['shita', 'ue'],
        expect: Enum.Position.Bottom,
      },
      {
        descripton: 'mixed command',
        command: ['small', 'naka'],
        expect: Enum.Position.Default,
      },
    ];

    testList.forEach((test) => {
      specify(test.descripton, () => {
        const chat = <NicoComment.ParsedChat> {
          command: <string[]> test.command,
        };
        const result = NicoCommentParser.checkPosType(chat);
        assert.strictEqual(result, test.expect);
      });
    });
  });
});
