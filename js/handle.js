function validate({ username, roomname, password }) {
  //if( /.+\..+\..+/i.exec(token) === null )
  //return 'Invalid Token'
  if (username.length < 4) return 'Username must be of length 4 atleast';
  if (roomname.length < 6) return 'Roomname must be of length 6 atleast';
  if (password.length < 8 || password.length > 20) return 'Password must be of length 8-20';
  return 'success';
}

function login() {
  const authData = {
    roomname: document.getElementById('roomname').value,
    username: document.getElementById('username').value,
    password: document.getElementById('password').value
    //token : document.getElementById('token').value
  };
  const msg = validate(authData);
  if (msg == 'success') {
    me = authData.username;
    document.getElementById('err').innerHTML = '';
    /*socket = io(HOST,{
            extraHeaders : {authorization : authData.token}
        })*/
    document.getElementById('create-load').style.display = 'block';
    socket.emit('create', {
      roomName: authData.roomname,
      userName: authData.username,
      password: authData.password
    });
    socket.on('create-res', (data) => {
      document.getElementById('create-load').style.display = 'none';
      const { message } = data;
      if (message === 'success') {
        const { jwt } = data;
        token = jwt;
        roomname = authData.roomname;
        userList.push(authData.username);
        clearUserList();
        createUserList();
        hideLogin();
        hideEditor();
        setListners();
        showOptions();
        showStatus();
        setConnectedStatus();
      } else document.getElementById('err').innerHTML = 'Server response: ' + message;
    });
  } else {
    document.getElementById('err').innerHTML = msg;
  }
}

function join() {
  const authData = {
    roomname: document.getElementById('roomname').value,
    username: document.getElementById('username').value,
    password: document.getElementById('password').value
    //token : document.getElementById('token').value
  };
  me = authData.username;
  const msg = validate(authData);
  if (msg == 'success') {
    document.getElementById('err').innerHTML = '';
    /*socket = io(HOST,{
            extraHeaders : {authorization : authData.token}
        })*/
    document.getElementById('join-load').style.display = 'block';
    socket.emit('join', {
      roomName: authData.roomname,
      userName: authData.username,
      password: authData.password
    });
    socket.on('join-res', (data) => {
      document.getElementById('join-load').style.display = 'none';
      const { message } = data;
      if (message === 'success') {
        const { jwt, files, users } = data;
        token = jwt;
        roomname = authData.roomname;
        userList = users;
        fileList = files;
        activeIndex = files.length === 0 ? -1 : 0;
        if (files.length) {
          setTabs();
          isEditorOpen = true;
          showEditor();
          editor.setValue(fileList[activeIndex].content);
        } else hideEditor();
        hideLogin();
        showOptions();
        createUserList();
        setListners();
        showStatus();
        setConnectedStatus();
      } else document.getElementById('err').innerHTML = 'Server response: ' + message;
    });
  } else {
    document.getElementById('err').innerHTML = msg;
  }
}

function leave() {
  socket.emit('leave', {
    roomName: roomname,
    token: token,
    userName: me
  });
}

function hideLogin() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('home').style.display = 'flex';
}

function showLogin() {
  document.getElementById('login').style.display = 'flex';
  document.getElementById('home').style.display = 'none';
}

function showEditor() {
  document.getElementById('editor').style.display = 'block';
  editor.refresh();
}

function hideEditor() {
  document.getElementById('editor').style.display = 'none';
}

function showModal() {
  document.getElementById('createfile').style.display = 'flex';
  document.getElementById('fname').focus();
}

function hideModal() {
  hideSnippets();
  document.getElementById('file-err').innerHTML = '';
  document.getElementById('fname').value = '';
  document.getElementById('createfile').style.display = 'none';
}

function hideCodeRunnerModal() {
  document.getElementById('runner').style.display = 'none';
}

function showCodeRunnerModal() {
  document.getElementById('file-to-run').innerHTML = fileList[activeIndex].fname;
  document.getElementById('stdout').value = lastOutput;
  document.getElementById('runner').style.display = 'flex';
}

function showOptions() {
  document.getElementById('options').style.display = 'block';
}

function showUserList() {
  document.getElementById('user-list').style.display = 'flex';
  document.getElementById('leave-confirm').style.display = 'none';
}

function hideUserList() {
  document.getElementById('user-list').style.display = 'none';
}

function showLeaveConfirm() {
  document.getElementById('user-list').style.display = 'none';
  document.getElementById('leave-confirm').style.display = 'flex';
}

function hideLeaveConfirm() {
  document.getElementById('leave-confirm').style.display = 'none';
}

function fnameChange() {
  const fname = document.getElementById('fname').value;
  const ext = getExt(fname);
  if (ext) {
    showSnippets(ext);
  } else hideSnippets();
}

function showSnippets(ext) {
  document.getElementById('s1').style.display = 'flex';
  document.getElementById('s2').style.display = 'flex';
  document.getElementById('image-1').setAttribute('src', `images/${ext}_default.png`);
  document.getElementById('image-2').setAttribute('src', `images/${ext}_testcase.png`);
}

function hideSnippets() {
  document.getElementById('r-1').checked = true;
  document.getElementById('s1').style.display = 'none';
  document.getElementById('s2').style.display = 'none';
}

function isFile(fname) {
  if (
    fname.endsWith('.c') ||
    fname.endsWith('.cpp') ||
    fname.endsWith('.java') ||
    fname.endsWith('.py') ||
    fname.endsWith('.txt')
  )
    return true;
  return false;
}

function getExt(fname) {
  if (fname.endsWith('.c')) return 'c';
  else if (fname.endsWith('.cpp')) return 'cpp';
  else if (fname.endsWith('.java')) return 'java';
  else if (fname.endsWith('.py')) return 'py';
  return '';
}

function createFile() {
  const fname = document.getElementById('fname').value;
  if (!isFile(fname)) {
    document.getElementById('file-err').innerHTML = 'Invalid file extention';
    return;
  }
  let sname = '';
  document.getElementsByName('sname').forEach((e) => {
    if (e.checked) sname = e.value;
  });
  if (sname && !fname.endsWith('.txt')) {
    sname += '.' + getExt(fname);
  }
  newFile = fname;
  socket.emit('createfile', {
    token: token,
    roomName: roomname,
    fname: fname,
    snippetName: sname === '' ? undefined : sname
  });
  hideModal();
}

function updateFile() {
  document.getElementById('save-text').innerHTML = 'Saving';
  document.getElementById('save-load').style.display = 'block';
  socket.emit('updatefile', {
    token: token,
    roomName: roomname,
    fname: fileList[activeIndex].fname,
    content: editor.getValue()
  });
}

function runCode() {
  if (document.getElementById('run-text') === 'Running')
    return alert('Already running a program try later!');
  document.getElementById('run-text').innerHTML = 'Running';
  document.getElementById('run-load').style.display = 'block';
  socket.emit('run', {
    token: token,
    roomName: roomname,
    fname: fileList[activeIndex].fname,
    input: document.getElementById('stdin').value
  });
}

function showStatus() {
  document.getElementById('status').style.display = 'flex';
}

function hideStatus() {
  document.getElementById('status').style.display = 'none';
}

function setConnectedStatus() {
  document.getElementById('status').style.backgroundColor = 'green';
  document.getElementById('status-msg').innerHTML = 'You are connected';
  const iconDiv = document.getElementById('status-icon');
  iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="lightgreen">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    </svg>`;
  iconDiv.className = 'mx-2';
}

function setConnectingStatus() {
  document.getElementById('status').style.backgroundColor = 'blue';
  document.getElementById('status-msg').innerHTML = 'Trying to reconnect';
  const iconDiv = document.getElementById('status-icon');
  iconDiv.innerHTML = '';
  iconDiv.className = 'mx-2 loader';
}

function setDisconnectedStatus() {
  document.getElementById('status').style.backgroundColor = 'red';
  document.getElementById('status-msg').innerHTML =
    'Looks like you have been disconnected, it will automattically reconnect wait for a while:)';
  const iconDiv = document.getElementById('status-icon');
  iconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>`;
  iconDiv.className = 'mx-2';
}
