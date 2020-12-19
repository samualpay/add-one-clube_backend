rm -rf ./dist
tsc -p .
cp -R ./src/views ./dist/views
mkdir ./dist/public
cp -R ./src/public/hello.html ./dist/public/hello.html