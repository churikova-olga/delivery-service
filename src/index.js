const express = require('express')
const mongoose = require('mongoose');
const passport = require('passport')
const flash = require('connect-flash');
const http = require('http');
const socketIO = require('socket.io');



const advertisementRoutes = require('./routes/api/advertisement')
const authRoutes = require('./routes/api/auth')



const app = express();
const server = http.Server(app);
const io = socketIO(server);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('express-session')({
    secret: process.env.COOKIE_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

require('./passport-config')(passport);
require('./socket-config')(io);
app.use('/public', express.static(__dirname+"/public"));
app.use('/api/advertisements', advertisementRoutes)
app.use('/api', authRoutes)


const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || 'root'
const PasswordDB = process.env.DB_PASSWORD || '12345'
const NameDB = process.env.DB_NAME || 'delivery'
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/'

async function start(){
    try{
        await mongoose.connect(HostDb, {
            user: UserDB,
            pass: PasswordDB,
            dbName: NameDB,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB connect')
        server.listen(PORT, ()=>console.log(`Server has been started... ${PORT}`))
    }
    catch(e){
        console.log(e)
    }
}
start();
