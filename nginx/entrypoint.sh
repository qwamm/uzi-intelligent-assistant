#!/bin/sh

export DJ_STATIC_FILES=/usr/src/web/static_files/front/
cp ./manifest.json $DJ_STATIC_FILES
cp -r ./openseadragon-images/ $DJ_STATIC_FILES
cd static/
cp -r ./css/ $DJ_STATIC_FILES
cp -r ./js/ $DJ_STATIC_FILES
exec "$@"