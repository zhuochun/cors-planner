@echo off

::
:: JSHint
::
echo == Running JSHint on JavaScript files

    echo -- on src\app files
    call jshint src\app\

echo == End Running JSHint

::
:: Update the module code list
::

echo == Crawling the latest module code

	call phantomjs src\schools\sg.nus\data\crawl-phantomjs.js
	
echo == End Crawling data

::
:: Building
::
echo == Start Building CORS-PLANNER

    echo - removing release folder
        ::remove release
        rmdir release /S /Q

    echo - calling r.j to build using build.js
        ::build javascripts
        call node build\r.js -o build\build.js

    echo - modifying html script includes
        ::modify index.html to use css
        call node build\clean.html.js

    echo - compiling less to css
        ::create folder in release for css files
        mkdir release\css
        ::build less to css file
        call lessc --yui-compress src\less\style.less > release\css\style.css

echo == Build Succeed
