FROM node:alpine
RUN apk add  --no-cache ffmpeg

WORKDIR /usr/app

COPY package*.json ./

RUN npm install 

COPY ./* ./

RUN apk --update add imagemagick

# EXPOSE 8080

# CMD ["nodemon", "app.js"]