# [WaNDER! CORS Planner](http://zhuochun.github.com/cors-planner/)

CORS Planner is a NUS CORS Timetable builder tool aims to help students doing course timetable planning.

<a name="build" />
## Build

You will need [Node.js](http://nodejs.org) and [npm](http://npmjs.org).

Following packages are required to build CORS Planner:

```bash
$ npm install jshint -g
$ npm install uglify-js -g
$ npm install less -g
```

To build, run `makefile.bat` on Windows. Files will be generated under folder `/release`.

<a name="data" />
## Updating Data

Details of each Module is crawled directly from CORS website using [YQL](http://developer.yahoo.com/yql/) API.

However, all Module Code and Title served in `$typeahead` needs to be updated manually:

* __Prefered__: Get [phantomjs](http://phantomjs.org/), go to folder `js/data`, run

```bash
$ phantomjs crawl-phantomjs.js
```

* Or you can follow the steps written in the snippet `js/data/crawl.js`.

<a name="contribute" />
## Contributing

* You can submit bugs through [GitHub Issues](https://github.com/zhuochun/cors-planner/issues).

* Anyone and everyone is welcome to contribute.

* All specification and ideas are listed in [Trello](https://trello.com/board/cors-planner/). (Need invitation)

<a name="doc" />
## Documentation

Detailed Documentation is listed in [Wiki](https://github.com/zhuochun/cors-planner/wiki). (Working...)

<a name="test" />
## Testing

All tests are written in [Jasmine](http://pivotal.github.com/jasmine/) under folder `/test`.

<a name="license" />
## License

Copyright (c) 2012 Wang Zhuochun. Licensed under the MIT license.
