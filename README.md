# [WaNDER! CORS Planner](http://cors.bicrement.com/)

CORS Planner is a simple and elegant open source NUS CORS Timetable builder.

![Version 0.3.0 Screenshot](https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-ash3/530386_522148014470753_1886317266_n.png)

<a name="build" />
## Build

You will need [Node.js](http://nodejs.org) and [npm](http://npmjs.org).

Following packages are required to build CORS Planner:

```bash
$ npm install jshint -g
$ npm install uglify-js -g
$ npm install less -g
```

Additionally, you will need [phantomjs](http://phantomjs.org/) to crawl the latest CORS module list during build. Otherwise, you have to comment the relevant lines in `makefile.bat`.

To build, run `makefile.bat` on Windows. Files will be generated in folder `/release`.

<a name="data" />
## Updating Data

Details of each Module is crawled directly from CORS website using [YQL](http://developer.yahoo.com/yql/) API.

However, the list of Module Codes and Titles served in `<input>` box needs to be updated manually:

* __Prefered__: Get [phantomjs](http://phantomjs.org/), at `base` directory, run

```bash
$ phantomjs src\js\data\crawl-phantomjs.js
```

* Or you can follow the steps written in the snippet `js/data/crawl.js`.

<a name="contribute" />
## Contributing

* You can submit bugs through [Facebook Page](https://www.facebook.com/pages/CORS-Planner/522030524482502) or [GitHub Issues](https://github.com/zhuochun/cors-planner/issues).

* Anyone and everyone is welcome to contribute.

* All specification and ideas are listed in [Trello](https://trello.com/board/cors-planner/). (Need invitation)

<a name="doc" />
## Documentation

Detailed Documentation is listed in [Wiki](https://github.com/zhuochun/cors-planner/wiki). (Working...)

<a name="test" />
## Testing

All tests are written in [Jasmine](http://pivotal.github.com/jasmine/) under folder `/test`. (Only for `models` files)

<a name="license" />
## License

Copyright (c) 2012 Wang Zhuochun. Licensed under the [MIT license](https://github.com/zhuochun/cors-planner/blob/master/LICENSE).
