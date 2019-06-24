var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/web/login.html' , (err, date) => {
    if ( err ) {
      res.writeHead(500);
      return res.end('err loading login.html');
    }
  });
});

app.use(express.static('./web'))  //静态页面托管

let arr = {}; // 存储所有用户
// 监听了用户连接的事件
io.on('connection', function(socket){
  console.log('用户连接了');

  // 接收用户发送的消息 on监听浏览器触发的子对事件 即可
  // 用户登录
  socket.on('login' , (date) => {
     let name = Object.keys(date);
    //  console.log(name);
    //  console.log(Object.keys(arr));
     if ( Object.keys(arr).indexOf(name[0]) === -1 ) {
      arr[name[0]] = date;
      socket.emit('loginSend', {
        id: 1 , 
        name: name[0], 
        img:date.img , 
        pop: arr,
      }); // 想浏览器发送信息  判断登录成功
      io.emit('add', {user:date , users: arr}); // 广播事件  告诉所有用户
     }else{
      socket.emit('loginSend', {id: 0}); // 想浏览器发送信息  判断登录成功
     }
    // 给浏览器发送数据 值发给当前用户；
  })

  // 接收浏览器发送来的消息
  socket.on('req',(date) => {
    console.log(date);
    socket.broadcast.emit('restext' , date); // 发给除自己外的所有人
    socket.emit('res', date ); // 回发给自己  测试网路
  })

 

  
});

