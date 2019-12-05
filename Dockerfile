# note that order matters in terms of docker build layers. Least changed near start to most changed...
# This image will be based on the official nodejs docker image
FROM node:13.2.0

EXPOSE 80
ENV PORT 80
ARG NPM_TOKEN

# Commands will run in this directory
RUN mkdir /srv/app
RUN mkdir /srv/dashboard

# Handle NPM Token Management
COPY .npmrc-deploy /srv/app/.npmrc
COPY .npmrc-deploy /srv/dashboard/.npmrc

#############################
## WE DO DASHBOARD STUFF.
WORKDIR /srv/dashboard
COPY ./dashboard/package.json package.json
RUN npm install
RUN rm -f .npmrc
COPY ./dashboard .
RUN npm run build

############################
## THEN NORMAL API STUFF
WORKDIR /srv/app
COPY ./package.json package.json

# Install dependencies and generate production dist
RUN npm install
RUN rm -f /srv/app/.npmrc /srv/dashboard/.npmrc

# Copy in the rest of the code.
COPY ./app app
COPY ./config config

CMD ["npm", "run", "prod"]
