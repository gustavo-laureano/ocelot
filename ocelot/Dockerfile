FROM node:20-slim 
WORKDIR /app
COPY package*.json ./

RUN npm install 


EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081

CMD [ "npx", "expo", "start", "-c" ]

