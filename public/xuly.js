
var socket = io("http://localhost:3000/");
socket.on("server-send-dk-thatbai", (data) =>{
	alert(data);
});

socket.on("server-send-dk-thanhcong", (data) =>{
	alert("Đăng ký thành công");
		$("#show-name").html(data);
		$("#form-dk").hide(1000);
		$("#form-chat").show(1000);
});
socket.on("server-send-ds-user", data =>{
	let ds = data.map(item =>{
		return '<tr>' +'<td> <span> ' + item + '</span> <i>'+ '</i>' + '</td>'   +  '</tr>';
	});	
	let htmlds = ds.join('');
	$("#ds-user").html(htmlds);
});

socket.on("server-send-message", (data, index) =>{
	let i=0;
	$("#form-message").append("<div class="+index + ">" + data.name +" : " + data.mess + "</div>");
	i++;
});

socket.on("server-send-message-dagui", data =>{
let mess = data.map((message, index) =>{
		return '<div class='+index + '>' + message.name +" : " + message.mess + '</div>';
	});	
	let listMess = mess.join('');
	$("#form-message").html(listMess);
	
	
});


$(document).ready(() =>{

	$("#form-dk").show();
	$("#form-chat").hide();
	$("#register").click(() =>{
		var username = $("#username").val();
		socket.emit("client-send-username", username);
	});

	$("#logout").click(() =>{
		socket.emit("client-logout");
		$("#form-dk").show(1000);
		$("#form-chat").hide(1000);
	});

	$("#send-message").click(() =>{
		let mess = $("#message").val();
		socket.emit("client-send-message",mess);
		 $("#form-message").scrollTo('.9');
	
	});
	
});