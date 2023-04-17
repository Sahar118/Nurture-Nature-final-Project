const express = require('express')
const app = express();
const router = express.Router();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");

// define a middleware function
const myMiddleware = (req, res, next) => {
    console.log('Middleware executed');
    next();
};

// apply the middleware function to the router
router.use(myMiddleware);

// define a route that uses the router
app.use('/api', router);
const usersRoute = require("./routes/usersRoute");
const eventsRoute = require("./routes/eventsRoute")
const reportsRoute = require("./routes/reportsRoute");
const chatsRoute = require("./routes/chatRoutes")
const messagesRoute = require('./routes/messagesRoute')
app.use(express.json());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

app.use("/api/users", usersRoute)
app.use("/api/events", eventsRoute)
app.use("/api/reports", reportsRoute);
app.use("/api/chats", chatsRoute);
app.use('/api/messages', messagesRoute);

const port = process.env.PORT || 5000;
const path = require("path");
const { socket } = require('socket.io');
const { log } = require('console');
__dirname = path.resolve();

//  check the connection of socket  from client
io.on("connection", (socket) => {
    // socket events (new messages) will be here
    socket.on("join-room", (userId) => {
        socket.join(userId)
    })


    // send message to recipient
    socket.on("send-message", ({ text, sender, recipient }) => {
        io.to(recipient).emit("receive-message", {
            text,
            sender,
        })
    });
});
// render deployment
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}
server.listen(port, () => console.log(`node JS Server is running on port ${port}`));
