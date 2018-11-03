var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

var mangUser = ['nai'];

server.listen(process.env.PORT || 3000,() =>{
	console.log("ket noi server thanh cong");
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
		}
	});
	socket.on("client-logout", () =>{
		mangUser.splice(mangUser.indexOf(socket.UserName),1);
		socket.broadcast.emit("server-send-ds-user", mangUser);
	});
	socket.on("client-send-message", data =>{
		console.log(data);
		io.sockets.emit("server-send-message", {name: socket.UserName, mess : data});
	});
	
});

app.get('/',(req, res) =>{
	res.render("demochat");
});