var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

var mangUser = ['Quan ly'];
var mangMessage = [];

server.listen(3000,() =>{
	console.log("ket noi thanh cong");
});

io.on("connection",socket =>{
	console.log(" co nguoi ket noi : " + socket.id);

	socket.on("client-send-username", data =>{
		let user = data.toLowerCase();
		if(mangUser.indexOf(user) !== -1){
			socket.emit("server-send-dk-thatbai"," UserName đã tồn tại! ");
		}else{
			socket.emit("server-send-dk-thanhcong", data);
			mangUser.push(user);
			console.log(mangUser);
			socket.UserName = data;

			io.sockets.emit("server-send-ds-user", mangUser);

			io.sockets.emit("server-send-message-dagui", mangMessage);
		}
	});
	socket.on("client-logout", () =>{
		mangUser.splice(mangUser.indexOf(socket.UserName),1);
		socket.broadcast.emit("server-send-ds-user", mangUser);
	});
	socket.on("client-send-message", data =>{
		console.log(data);
		var message = {
				name: socket.UserName,
				mess: data
			}
			mangMessage.push(message);
			console.log(mangMessage);
		io.sockets.emit("server-send-message", message);
	});
	socket.on("disconnect",() =>{
		console.log(socket.UserName + " da ngat ket noi");
		mangUser.splice(mangUser.indexOf(socket.UserName),1);
		socket.broadcast.emit("server-send-ds-user", mangUser);
	});
	
});

app.get('/',(req, res) =>{
	res.render("demochat");
});