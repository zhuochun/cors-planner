# [WaNDER! CORS Planner](http://cors.bicrement.com/)

CORS Planner ([Facebook Page](https://www.facebook.com/cors.planner)) is a powerful and elegant open source **timetable builder** for any university!

Now it supports:

- National University of Singapore (NUS)
- Nanyang Technological Unviersity (NTU)

You can add your university by writing some JavaScripts ([Doc](https://github.com/zhuochun/cors-planner/wiki/How-to-Add-your-University))!

![Version 0.3.0 Screenshot](https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-ash3/530386_522148014470753_1886317266_n.png)

## Build

You will need [Node.js](http://nodejs.org).

Following packages are required to build CORS Planner:

```bash
$ npm install -g jshint uglify-js less less-plugin-clean-css
```

To build, run `makefile.bat` (Windows) or `makefile.sh` (UNIX). Files will be generated in folder `/release`.

Additionally, you will need [phantomjs](http://phantomjs.org/) to crawl the latest list of modules available in each school.

## Updating Data

Details of each module are crawled directly from the school's website using [YQL](http://developer.yahoo.com/yql/) API at run-time.

However, the list of Module Codes and Titles served in `<input>` box for auto-completion needs to be fetched manually:

* Get [phantomjs](http://phantomjs.org/), at `schools/.../data` directory, run

```bash
$ phantomjs crawl-phantomjs.js
```

It should generate a `list.js` in the same directory for use.

## Contributing

* You can submit bugs through [GitHub Issues](https://github.com/zhuochun/cors-planner/issues) or [Facebook Page](https://www.facebook.com/cors.planner).

* Anyone and everyone is welcome to contribute.

## Documentation

Detailed Documentation is listed in [Wiki](https://github.com/zhuochun/cors-planner/wiki). (Working...)

## Testing

All tests are written in [Jasmine](https://jasmine.github.io/) under folder `/test`. (Waiting to be rewritten!)

## License

Copyright (c) 2012-2013 Wang Zhuochun. Licensed under the [MIT license](https://github.com/zhuochun/cors-planner/blob/master/LICENSE).
