# niconico-comment-parser

niconico comment parser.


## Usage

```js
const axios = require('axios');
const NicoCommentParser = require('niconico-comment-parser').default;

const reqData = [{
  'thread_leaves': {
    'thread': 1173108780,
    'content': '0-9999:100,500',
    'scores': 1,
    'threadkey': '',
    'force_184': 1
  }
}];

axios.post('http://msg.nicovideo.jp/10/api.json/', reqData)
  .then((res) => NicoCommentParser.parse(res.data))
  .then((data) => console.log(data))
  .catch((err) => console.error(err.stack || err));
```

## Contribution

1. [Fork it]
2. Create your feature branch (``git checkout -b my-new-feature``)
3. Commit your changes (``git commit -am 'Add some feature'``)
4. Push to the branch (``git push origin my-new-feature``)
5. Create new Pull Request

[Fork it]: http://github.com/3846masa/niconico-comment-parser/fork

## LICENSE

[MIT License]

[MIT License]: https://3846masa.mit-license.org

## Author

![3846masa icon][3846masa-icon]
[3846masa](https://github.com/3846masa)

[3846masa-icon]: https://www.gravatar.com/avatar/cfeae69aae4f4fc102960f01d35d2d86?s=30
