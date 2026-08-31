FROM golang:1.23-alpine AS build
WORKDIR /src
COPY . .
RUN go mod download && CGO_ENABLED=0 go build -o processor .
FROM gcr.io/distroless/static-debian12
COPY --from=build /src/processor /processor
EXPOSE 8090
ENTRYPOINT ["/processor"]
