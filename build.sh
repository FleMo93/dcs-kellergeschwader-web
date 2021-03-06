set -e
IMPRESSUM_NAME=$1
IMPRESSUM_ADDRESS=$2
IMPRESSUM_CITY=$3
IMPRESSUM_EMAIL=$4

if [ -z "$IMPRESSUM_NAME" ] || [ -z "$IMPRESSUM_ADDRESS" ] || [ -z "$IMPRESSUM_CITY" ] || [ -z "$IMPRESSUM_EMAIL" ]; then
  >&2 echo "Missing parameter"
  exit 1
fi

npm ci
rm -rf dist
mkdir -p dist

if [ -z "$COMPILE_STATS" ]; then
  ./node_modules/.bin/webpack --mode=production
else
  ./node_modules/.bin/webpack --mode=production --profile --json > dist/compilation-stats.json
fi

cp -r public/* dist/

sed -i "s/%impressum_name%/$IMPRESSUM_NAME/g" dist/impressum.html
sed -i "s/%impressum_address%/$IMPRESSUM_ADDRESS/g" dist/impressum.html
sed -i "s/%impressum_city%/$IMPRESSUM_CITY/g" dist/impressum.html
sed -i "s/%impressum_email%/$IMPRESSUM_EMAIL/g" dist/impressum.html