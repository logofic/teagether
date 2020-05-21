import express, { Application } from "express";
import socketIO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as https } from "https";
import path from "path";

import * as fs from 'fs';
import * as util from 'util'


export class Server {
  private httpsServer: https = require('express');
  private app: Application;
  private io: SocketIOServer;

  private activeSockets: string[] = [];
  
  private PORT_NUMBER = 5000;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    var express = require('express')
    var fs = require('fs')

    this.app = express();
    this.httpsServer = createServer({
      key: fs.readFileSync('src/key.pem'),
      cert: fs.readFileSync('src/cert.pem')
    }, this.app);
    this.io = socketIO(this.httpsServer);

    this.configureApp();
    this.configureRoutes();
    this.handleSocketConnection();
  }

  private configureApp(): void {
    this.app.use(express.static(path.join(__dirname, "../client")));
  }

  private configureRoutes(): void {

    this.app.get("/", (req, res) => {
      res.sendFile("index.html");
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpsServer.listen(this.PORT_NUMBER, () => {
      callback(this.PORT_NUMBER);
    });
  }

  /**
   * Handles socket and user logic
   */
  private handleSocketConnection(): void {
    console.log("sending index.html");
    this.io.sockets.on("connection", socket => {
      const existingSocket = this.activeSockets.find(
        existingSocket => existingSocket === socket.id
      );

      if (!existingSocket) {
        this.activeSockets.push(socket.id);

        socket.emit("update-user-list", {
          users: this.activeSockets.filter(
            existingSocket => existingSocket !== socket.id
          )
        });

        socket.broadcast.emit("update-user-list", {
          users: [socket.id]
        });
      }

      socket.on("call-user", (data: any) => {
        socket.to(data.to).emit("call-made", {
          offer: data.offer,
          socket: socket.id
        });
      });

      socket.on("make-answer", data => {
        socket.to(data.to).emit("answer-made", {
          socket: socket.id,
          answer: data.answer
        });
      });

      socket.on("reject-call", data => {
        socket.to(data.from).emit("call-rejected", {
          socket: socket.id
        });
      });

      socket.on("disconnect", () => {
        this.activeSockets = this.activeSockets.filter(
          existingSocket => existingSocket !== socket.id
        );
        socket.broadcast.emit("remove-user", {
          socketId: socket.id
        });
      });
    });
  }


}
