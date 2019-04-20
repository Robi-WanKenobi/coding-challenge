FROM node:alpine

# Create app directory
RUN mkdir /codechallenge
WORKDIR /codechallenge

# Install app dependencies
COPY package.json /codechallenge
RUN cd /codechallenge
RUN npm install -g @angular/cli
RUN npm install

# Bundle app source
COPY . /codechallenge
RUN ng build --prod

EXPOSE 4200
#CMD [ "npm", "start" ]
