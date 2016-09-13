import * as assert from 'power-assert';
import NicoCommentParser from '../src';
import NicoComment from '../src/nico-comment';

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
