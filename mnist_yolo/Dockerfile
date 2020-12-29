FROM node:alpine AS builder
WORKDIR /front_end
COPY . .
RUN npm install && npm build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /front_end/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
