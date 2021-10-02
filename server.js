import http from "http";
import SocketIO from "socket.io";
import express from "express";

 const app = express();

 app.set("view engine", "pug");
 app.set("views", __dirname + "/views");
 app.use("/public", express.static(__dirname + "/public"));
//  public folder를 유저에게 공개해줌
 app.get("/", (_,res) => res.render("home"));
 app.get("/*", (_,res) => res.redirect("/"));
 
const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

io.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        // 어떤 방이 있는지 알기 위함 console.log(socket.rooms)
        socket.join(roomName);
        // 방에 들어가기 위함
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => 
        socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
        // backend에서 실행되지 않아
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname))
});

/* 
const wss = new WebSocket.server({ server });
const sockets = [];
wss.on("connection", (socket) => {
    // socket: 연결된 어떤 사람
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser ✅");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
    // (msg) ← string
        const message = JSON.parse(msg);
        // string을 JS object로 바꿔줌
        switch (message.type) {
            // type - 메세지 종류
            case "new_message":
            // if else 반복 대신, 내가 test하고 싶은 것에 switch ‼
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname}: ${message.payload}`));
                // 각 브라우저를 aSocket으로 표시하고 메시지를 보냄
                // payload - 메세지에 담겨 있는 중요한 정보
            case "nickname":
                socket["nickname"] =message.payload;
                // socket는 보통 객체여서 item으로 묶어줌
        }
    });
}); */

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);