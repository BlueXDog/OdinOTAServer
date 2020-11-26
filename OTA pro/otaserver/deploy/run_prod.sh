export SERVER=Production

git clean -fxd

# get env file
 s3aws cp $LC_S3_ENV_PROD . --recursive

# create version file
./deploy/create_version.sh

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --force-recreate -d device_server dev_server
