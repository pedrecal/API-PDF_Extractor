FROM node:12-alpine

WORKDIR /usr/pdf-extractor-api

COPY package*.json ./
RUN ["yarn"]

COPY . .

EXPOSE 7777

ENTRYPOINT ["yarn"]

CMD ["dev"]