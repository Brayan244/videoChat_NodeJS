var express =  require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io', { rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] }).listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.use("/js", express.static(__dirname + "/js"));
app.use("/css", express.static(__dirname + "/css"));
app.use("/imagenes", express.static(__dirname + "/imagenes"));
app.use("/", express.static(__dirname + "/"))


app.get('/', function(req, res){
    res.sendFile(__dirname + '/paginaprincipal.html');
});


//Manejado el evendo de conexion
io.sockets.on('connection', function(socket){
    
    //Conectados
    connections.push(socket);
    console.log('Conexion: %s sockets conectados', connections.length);

    //Desconectados
    socket.on('disconnect', function(data){
        if(!socket.username)
            return;

        users.splice(users.indexOf(socket.username, 1));
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Desconexion: %s sockets conectados', connections.length);

    });

    //Agregando usuarios
    socket.on('log-In', function(data, callback){
        //callback(true);
        //Aqui ira una pequeña logica de BD

        socket.username = data.user;
        console.log("El usuario " + data.user + " se ha logueado");
        users.push({user: socket.username,Estado: data.Estado ,socketId: data.socketId});

        updateUserNames();
    })

    socket.on('update state', data =>{

        for(var i = 0; i < users.length; i++)
        {
            if(users[i].user == data.user)
                users[i].Estado = data.Estado;
        }

        updateUserNames();
    });

    socket.on('send message', data =>{

        var dstSocket = searchSocketByName(data.dst);

        if(dstSocket.length < 1)
            return;

        io.to(dstSocket).emit('receive message', {orig: data.orig, message: data.msg});
    });

    socket.on('set session', data =>{

       
        console.log("Sesion iniciada correctamente");

    })

    function updateUserNames()
    {
        io.sockets.emit('get users', users);
    }

    function searchSocketByName(userName)
    {
        for(var i = 0; i < users.length; i++)
        {
            if(users[i].user == userName)
                return users[i].socketId;
        }

        return "";
    }
});