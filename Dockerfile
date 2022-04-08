FROM nginx:alpine
COPY /dist/Angular10Crud /usr/share/nginx/html
EXPOSE 80
