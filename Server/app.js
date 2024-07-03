const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;

const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: "localhost",
  port: 50000,
  user: "Pratik",
  password: "Pratik@MySQL2DBMS",
  database: "mydatabase",
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("query", async (query) => {
    try {
      // how to improve this ?
      console.log(query);
      const data = await pool.query(query);
      socket.emit("result", data);
    } catch (err) {
      socket.emit("result", {
        error: "An error occurred while fetching the results.",
        details:err
      });
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`server running on: \n
  localhost:${port}/`);
});


// how to properly use this API ?