import { Server } from "socket.io";

const io = new Server ({
    cors :{
        origin : "http://localhost:3000",
    },
});


let onlineUSers = [];

const addNewUser = (username,socketId)=>{
    !onlineUSers.some((user)=> user.username === username ) &&
    onlineUSers.push({username,socketId});
 };

const removeUser = (socketId)=>{
    onlineUSers = onlineUSers.filter((user)=>user.socketId !== socketId);
};

const getUser = (username) =>{
    return onlineUSers.find((user)=>user.username === username);
}

io.on("connection", (socket)=>{

    socket.on("newUser",(username)=>{
        addNewUser(username,socket.id);
    })

    socket.on("sendNotification", ({senderName , receiverName, type})=>{
        const receiver= getUser(receiverName);
        io.to(receiver.socketId).emit("getNotification",{
            senderName,
            type,
        });
    });

    socket.on("sendText",({senderName,receiverName,text})=>{
        const receiver = getUser(receiverName);
        io.to(receiver.socketId).emit("getText",{
            senderName,
            type,
        });
    });

    socket.on("disconnect",()=>{
        removeUser(socket.id);
    });
});


io.listen(5000)