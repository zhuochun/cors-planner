# [WaNDER! CORS Planner](http://cors.bicrement.com/)

CORS Planner ([Facebook Page](https://www.facebook.com/cors.planner)) is a simple and elegant open source *timetable builder* for any university!

Now it supports:

- National University of Singapore (NUS)
- Nanyang Technological Unviersity (NTU)

You can add your university by writing some JavaScripts ([Doc](https://github.com/zhuochun/cors-planner/wiki/How-to-Add-your-University))!

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

To build, run `makefile.bat` on Windows. Files will be generated in folder `/release`.

Additionally, you will need [phantomjs](http://phantomjs.org/) to crawl the latest list of modules available in each school.

<a name="data" />
## Updating Data

Details of each module are crawled directly from the website using [YQL](http://developer.yahoo.com/yql/) API at run-time.

However, the list of Module Codes and Titles served in `<input>` box for auto-completion needs to be fetched manually:

* Get [phantomjs](http://phantomjs.org/), at `schools/.../data` directory, run

```bash
$ phantomjs crawl-phantomjs.js
```

It should generate a `list.js` in the same directory for use.

<a name="contribute" />
## Contributing

* You can submit bugs through [Facebook Page](https://www.facebook.com/pages/CORS-Planner/522030524482502) or [GitHub Issues](https://github.com/zhuochun/cors-planner/issues).

* Anyone and everyone is welcome to contribute.

<a name="doc" />
## Documentation

Detailed Documentation is listed in [Wiki](https://github.com/zhuochun/cors-planner/wiki). (Working...)

<a name="test" />
## Testing

All tests are written in [Jasmine](http://pivotal.github.com/jasmine/) under folder `/test`. (Waiting to be rewritten!)

<a name="license" />
## License

Copyright (c) 2012-2013 Wang Zhuochun. Licensed under the [MIT license](https://github.com/zhuochun/cors-planner/blob/master/LICENSE).
