export SERVER=Staging

git clean -fxd

# get env file
aws s3 cp $LC_S3_ENV_STAGE . --recursive

# create version file
./deploy/create_version.sh

docker-compose down
docker-compose up -d
