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
    res.sendFile(__dirname + '/iniciosesion.html');
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

    })

    //Enviando mensajes
    socket.on('send message', function(data){
        
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username });
    });

    //Agregando usuarios
    socket.on('logIn', function(data, callback){
        //callback(true);
        socket.username = data.user;
        users.push({user: socket.username, socketId: data.socketId});
        console.log("El usuario " + data.user + " se ha logueado");
        

        io.to(data.socketId).emit('redirect',{page:'/paginaprincipal.html', user: data.user, socketId: data.socketId});
       // updateUserNames();
    })

    socket.on('changeId', data =>{

        
        for(var i = 0; i < users.length; i++)
        {
            if(users[i].user == data.user)
            {
                users[i].socketId = data.id;
                console.log("El usuario " + data.user + " ha cambiado su Id");
            }
        }

    })

    function updateUserNames()
    {
        io.sockets.emit('get users', users);
    }
});