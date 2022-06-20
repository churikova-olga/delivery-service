const Chat = require('./models/Chat')

module.exports = function(io) {
    io.on('connection', (socket)=>{
        const {id} = socket;

        console.log(`Socket connected: ${id}`);

        const {myId} = socket.handshake.query; //мой айди
        console.log(`Socket id: ${myId}`);

        socket.on('get-history', async (msg) => {
            let chatHistory
            const connectChat = await Chat.findOne({$or: [{users: [msg.idReciever, myId]}, {users: [myId, msg.idReciever]}]})
            if(connectChat===null) {
                chatHistory = {data: 'Такого чата не существует', status: 'error'}
            }else{
                chatHistory = await Chat.findOne({_id: connectChat._id}, {messages:1})
            }

            socket.to(myId).emit('chat-history', chatHistory);
            socket.emit('chat-history', chatHistory);
        });

            socket.on('send-message', async (msg) => {
            const connectChat = await Chat.findOne({$or:[{users : [myId, msg.idReciever]}, {users : [msg.idReciever, myId]}]})

            if(connectChat===null) {
                const newChat = new Chat({
                    users: [myId, msg.idReciever],
                    createdAt: Date.now()
                })
                await newChat.save()
            }

            await Chat.findOneAndUpdate({$or:[{users : [myId, msg.idReciever]}, {users : [msg.idReciever, myId]}]},
                { $push:{
               messages: [{author: myId, sentAt: Date.now(), text:  msg.text}]
                }})
            msg.type = `id: ${myId}`;

            socket.to(myId).emit('new-message', msg);
            socket.emit('new-message', msg);
        });

        socket.on('read-at', async(msg)=>{
            let check
            const connectChat = await Chat.findOne({$or: [{users: [msg.idReciever, myId]}, {users: [myId, msg.idReciever]}]})
            if(connectChat===null) {
                check = {data: 'Такого чата не существует', status: 'error'}
            }else{
                console.log(msg.idMessage)
                const checkOn = await Chat.findOneAndUpdate({messages: {$elemMatch:{_id: msg.idMessage}}}, {
                $set:{"messages.$.readAt": Date.now()}
                })
                if(checkOn === null){
                    check = {data: 'Такого сообщения не существует', status: 'error'}
                }else{
                    check = await Chat.findOne({messages: {$elemMatch:{_id: msg.idMessage}}}, {messages:1})
                }
                console.log(check)
            }
            socket.to(myId).emit('read-at', check);
            socket.emit('read-at', check);
        })

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${id}`);
        });
    });

}