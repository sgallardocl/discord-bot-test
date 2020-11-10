FROM node:12.4-alpine
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 80
CMD npm start
