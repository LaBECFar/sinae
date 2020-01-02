FROM node:alpine

# Add libvips
RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/

WORKDIR /usr/app

COPY package*.json ./

RUN npm install 

COPY ./* ./

# EXPOSE 8080

# CMD ["nodemon", "app.js"]