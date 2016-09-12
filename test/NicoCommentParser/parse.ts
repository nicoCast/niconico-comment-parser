import 'mocha';
import * as assert from 'power-assert';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

import NicoCommentParser from '../../src';
import NicoComment from '../../src/nico-comment';

export default function NicoCommentParser$$parse$test(testList: string[]) : void {
  let baseThread : NicoComment.RawThread;
  let baseChats : NicoComment.RawChat[];
  let expectedResult : NicoComment.Result;

  function wrapFunc(func: () => void) {
    const testListClone = _.clone(testList);
    return () => {
      beforeEach(() => {
        const dataFolderPath = path.resolve(__dirname, `../data/${testListClone.shift()}`);
        baseThread =
          JSON.parse(fs.readFileSync(path.join(dataFolderPath, 'thread.json'), 'utf8'));
        baseChats =
          JSON.parse(fs.readFileSync(path.join(dataFolderPath, 'chats.json'), 'utf8'));
        expectedResult =
          JSON.parse(fs.readFileSync(path.join(dataFolderPath, 'result.json'), 'utf8'));
      });

      testList.forEach((testName) => {
        specify(testName, func);
      });
    };
  }

  describe('([])', wrapFunc(() => {
    const result = NicoCommentParser.parse([]);
    const expect : NicoComment.Result = {
      thread: <NicoComment.Thread> {},
      chats: <NicoComment.ParsedChat[]> [],
    };
    assert.deepEqual(result, expect);
  }));

  describe('([RawThread])', wrapFunc(() => {
    const originalData : NicoComment.RawData[] = [
      baseThread,
    ];

    const data : NicoComment.RawData[] = _.cloneDeep(originalData);
    const expect : NicoComment.Result = {
      thread: baseThread.thread,
      chats: <NicoComment.ParsedChat[]> [],
    };

    const result = NicoCommentParser.parse(data);
    assert.deepEqual(result, expect);
  }));

  describe('([RawThread, ...RawChat[]])', wrapFunc(() => {
    const originalData : NicoComment.RawData[] = [
      baseThread,
      ...baseChats,
    ];

    const data : NicoComment.RawData[] = _.cloneDeep(originalData);
    const expect = expectedResult;

    const result = NicoCommentParser.parse(data);
    assert.deepEqual(result, expect);
  }));
}
