#!/usr/bin/env sh
# shellcheck disable=SC1091

. ./build_planet.sh

I18N="multi"

echo "Build the angular app in production mode stage"
if [ "${I18N}" = "multi" ]; then
 build_multi
else
 build_single
fi

