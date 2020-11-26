echo SERVER_VERSION=$(git describe --tags) > deploy/server/version.env
echo SERVER_NAME=$SERVER >> deploy/server/version.env
