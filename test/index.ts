import 'mocha';
import * as assert from 'power-assert';
import NicoCommentParser from '../src';

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
});
