#!/bin/bash

cecho(){
    RED="\033[0;31m"
    GREEN="\033[0;32m"
    YELLOW="\033[1;33m"
    # ... ADD MORE COLORS
    NC="\033[0m" # No Color

    printf "${!1}${2} ${NC}\n"
}

# create uploads folder
echo "Checando pastas!"
if [ ! -d "/usr/uploads" ] 
then    
    sudo mkdir "/usr/uploads"
    sudo chmod 777 -R "/usr/uploads"
    echo "Directory /usr/uploads created."
fi

# create tmp folder
if [ ! -d "/usr/uploads/tmp" ] 
then
    sudo mkdir "/usr/uploads/tmp"
    sudo chmod 777 -R "/usr/uploads/tmp"
    echo "Directory /usr/uploads/tmp created."
fi

# create model folder
if [ ! -d "/usr/uploads/settings" ] 
then
    sudo mkdir "/usr/uploads/settings"
    sudo chmod 777 -R "/usr/uploads/settings"
    echo "Directory /usr/uploads/settings created."
fi

# Build Web Client
cd web-client
npm install
npm run build

cd ..

cd api
npm install

cd .. 

docker-compose build

docker-compose up