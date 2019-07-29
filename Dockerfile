FROM node:12

WORKDIR /opt/zhangzisu/createschool

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn --production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
