
let socket = io('http://localhost:3000'); // 监听的服务器地址

let uname = ''; // 保存用户名
let img = ''; // 保存头像路径
let pop = '';  // 所有人的信息

socket.on('add' , (date) => { // 用户进入房间提
  let name = Object.keys(date.user)[0];
  pop = date.users;
  let top = document.getElementById('d2');
  top.innerHTML =`聊天室(${Object.keys(pop).length})`;
  m();
  my();
  popuname();
  let li = document.createElement('li');
  li.innerHTML = `欢迎 ${name} 进入房间 `;
  li.style.textAlign = 'center';
  document.getElementById('fontul').appendChild(li);
})

// 登录
function loginss(e){
  if ( !e || e.keyCode == 13) {
    let uname = document.getElementById('uname').value;
    let upwd = document.getElementById('upwd').value;
    if (uname == '' || upwd == '') {
      alert('填写有误！');
      return;
    }
    let span = document.getElementsByClassName('border')[0];
    let bg = span.style.backgroundImage.split('"')[1];
    socket.emit('login', { [uname]: upwd , img:bg }); // 向服务器发送
  }
}

socket.on('loginSend', (date) => { // 接收服务器的 登录验证结果
  if ( date.id == 0 ) {
    alert('登录失败');
    return;
  }
  uname = date.name;
  img = date.img;
  m();
  my();
  document.getElementsByClassName('d1')[0].style.display = 'none';
  document.getElementsByClassName('index')[0].style.display = 'block';
})

// 发送消息
function reqs(e) {
  let input = document.getElementById('inputtext').value;
  if ( !e || e.keyCode == 13) {
    socket.emit('req',{ uname , img , text: input }); // 向服务器发送
    input = '';
  }
}

socket.on('restext',(date) => { // 广播信息
  let uname = date.uname;
  let img = date.img;
  let text = date.text;
  youtexts( uname , img , text);
})

socket.on('res',(date) => {
  let uname = date.uname;
  let img = date.img;
  let text = date.text;
  document.getElementById('inputtext').innerHTML = '';
  mytext( uname , img , text);
})

socket.on('connect_error', (timeout) => {
  socket.emit('duankai',uname);
});

function mytext(uname, img , text) {
  let ul = document.getElementById('fontul');
  let li = document.createElement('li');
  li.className = 'limy';
  li.style.display = 'flex !important';
  li.style.justifyContent = 'center'; 
  let s = `
  <p>
    <div style="margin-right: 2vmin;position: relative;">
      <span class="neir" style="margin-right: 2vmin;border-radius: 1vmin;">${text}</span>
      <span class="img" style="background:url('${img}');background-size:100% 100%;border-radius: 1vmin;"></span>
    </div>
  </p>`;
  li.innerHTML = s;
  ul.appendChild(li);
}

function youtexts(uname, img , text) { // 别人打的信息
  let ul = document.getElementById('fontul');
  let li = document.createElement('li');
  li.className = 'liyou';
  let s = `
  <div style="margin-left: 2vmin;position: relative;">
    <div class="name" style="font-size: 1vmin;padding:0;">${uname}</div>
    <span class="img" style="background:url('${img}');background-size:100% 100%;border-radius: 1vmin;"></span>
    <span class="neir" style="margin-left: 2vmin;border-radius: 1vmin;">${text}</span>
  </div>`;
  li.innerHTML = s;
  ul.appendChild(li);
}


function m() { // 创建自己
  let parent = document.getElementsByClassName('ullist')[0];
  parent.innerHTML = '';
  let li = document.createElement('li');
  let span1 = document.createElement('span');
  span1.style.background = `url('${img}')`;
  span1.className = 'popImg';
  span1.style.backgroundSize = '100% 100%';
  li.appendChild(span1);
  let span2 = document.createElement('span');
  span2.innerHTML = uname;
  span2.className = 'popuname';
  li.appendChild(span2);
  parent.appendChild(li);
}

function my() { // 渲染自己的用户名
  let pimg =  document.getElementsByClassName('popImg')[0];
  let puname = document.getElementsByClassName('popuname')[0];
  pimg.style.background = `url('${img}')`;
  pimg.style.backgroundSize = '100% 100%';
  puname.innerHTML = uname;
}

function popuname() { // 渲染用户列表
  let parent = document.getElementsByClassName('ullist')[0];
  let _pop = Object.values(pop);
  for (let i = 0;i < _pop.length;i++ ) {
    if ( Object.keys(_pop[i])[0] == uname ) {
      continue;
    }
    let li = document.createElement('li');
    let span1 = document.createElement('span');
    span1.style.background = `url('${_pop[i].img}')`;
    span1.style.backgroundSize = '100% 100%';
    li.appendChild(span1);
    let span2 = document.createElement('span');
    span2.innerHTML = Object.keys(_pop[i])[0];
    li.appendChild(span2);
    parent.appendChild(li);
  }
  
}




