# WaNDER! CORS Planner

CORS Planner helps NUS students doing timetable planning.

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

Module Details are crawled directly from CORS website using [YQL](http://developer.yahoo.com/yql/) api.

However, Module Code and Title served in Typeahead needs to update manually using the snippet written in file `js/data/crawl.js` (follow the Steps in the snippet).

<a name="more" />
## Contribute

* You can submit bugs through GitHub Issues.

* Please fork and I am welcome to accept pull requests.

* All specification and ideas are listed in [Trello](https://trello.com/board/cors-planner/).

<a name="license" />
## License

Copyright (c) 2012 Wang Zhuochun. Licensed under the MIT license.
