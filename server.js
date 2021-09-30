import http from "http";
import WebSocket from "ws";
import express from "express";

 const app = express();

 app.set("view engine", "pug");
 app.set("views", __dirname + "/views");
 app.use("/public", express.static(__dirname + "/public"));
//  public folder를 유저에게 공개해줌
 app.get("/", (_,res) => res.render("home"));
 app.get("/*", (_,res) => res.redirect("/"));
//  catchell url
 
const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function onSocketClose() {
    console.log("Disconnected from the Browser ❌");
}

const sockets = [];

wss.on("connection", (socket) => {
    // socket: 연결된 어떤 사람
    sockets.push(socket);
    console.log("Connected to Browser ✅");
    socket.on("close", onSocketClose);
    socket.on("message", (message) => {
        // JSON.parse();
        // string을 JS object로 바꿔줌
        sockets.forEach((aSocket) => aSocket.send(message));
        // 각 브라우저를 aSocket으로 표시하고 메시지를 보냄
    });
});

server.listen(3000, handleListen);

