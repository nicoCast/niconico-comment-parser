import 'mocha';
import * as assert from 'power-assert';
import * as fs from 'fs';
import * as _ from 'lodash';
import NicoCommentParser from '../src';
import NicoComment from '../src/nico-comment';

describe('NicoCommentParser', () => {
  it('should be imported', () => {
    assert.ok(NicoCommentParser);
  });

  describe('::parse', () => {
    let baseThread : NicoComment.RawThread;
    let baseChats : NicoComment.RawChat[];
    before(() => {
      baseThread =
        JSON.parse(fs.readFileSync(`${__dirname}/data/simple_01/thread.json`, 'utf8'));
      baseChats =
        JSON.parse(fs.readFileSync(`${__dirname}/data/simple_01/chats.json`, 'utf8'));
    });

    specify('([])', () => {
      const result = NicoCommentParser.parse([]);
      const expect : NicoComment.Result = {
        thread: <NicoComment.Thread> {},
        chats: <NicoComment.Chat[]> [],
      };
      assert.deepStrictEqual(result, expect);
    });

    specify('([RawThread])', () => {
      const originalData : NicoComment.RawData[] = [
        baseThread,
      ];

      const data : NicoComment.RawData[] = _.cloneDeep(originalData);
      const expect : NicoComment.Result = {
        thread: baseThread.thread,
        chats: <NicoComment.Chat[]> [],
      };

      const result = NicoCommentParser.parse(data);
      assert.deepStrictEqual(result, expect);
    });

    specify('([RawThread, ...RawChat[]])', () => {
      const originalData : NicoComment.RawData[] = [
        baseThread,
        ...baseChats,
      ];

      const data : NicoComment.RawData[] = _.cloneDeep(originalData);
      const expect : NicoComment.Result = {
        thread: baseThread.thread,
        chats: baseChats.map((c) => c.chat),
      };

      const result = NicoCommentParser.parse(data);
      assert.deepStrictEqual(result, expect);
    });
  });
});
