FROM golang:1.9

RUN mkdir /pms
COPY main.go /pms

CMD ["go", "run", "/pms/main.go"]