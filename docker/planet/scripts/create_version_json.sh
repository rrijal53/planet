PLANET_VERSION=$(cat package.json | jq -r .version)
LATEST_APK_VERSION="v0.2.39"
LATEST_APK_VER_CODE="239"
MIN_APK_VERSION="v0.2.34"
MIN_APK_VER_CODE="234"
APK_PATH="https://github.com/open-learning-exchange/myplanet/releases/download/v0.2.39/myPlanet.apk"

echo '{"appname":"planet","planetVersion":"'$PLANET_VERSION'","latestapk":"'$LATEST_APK_VERSION'","latestapkcode":'$LATEST_APK_VER_CODE',"minapk":"'$MIN_APK_VERSION'","minapkcode":'$MIN_APK_VER_CODE',"apkpath":"'$APK_PATH'"}' > dist/versions
