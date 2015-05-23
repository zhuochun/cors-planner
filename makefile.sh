#Building
echo "Start Building CORS-PLANNER"

  echo "removing release folder"
    #remove release
    rm -rf release/

  echo "calling r.js to build using build.js"
    #build javascripts
    node build/r.js -o build/build.js

  echo "modifying html script includes"
    #modify index.html to use css
    node build/clean.html.js

  echo "compiling less to css"
    #create folder in release for css files
    mkdir -p release/css
    #build less to css file
    lessc --clean-css="--s1 --advanced --compatibility=ie8" src/less/style.less > release/css/style.css
    lessc --clean-css="--s1 --advanced --compatibility=ie8" src/less/style-portrait.less > release/css/style-portrait.css

echo "Build Succeed"
