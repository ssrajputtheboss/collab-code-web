const HOST = 'https://collab-code-api.herokuapp.com/';
let socket = io(HOST, {
  extraHeaders: {
    authorization:
      'eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOiJhcGkiLCJpYXQiOjE2NTY5MDk3MTcsImV4cCI6MTY1NzA4MjUxN30.7lDpIDlwkPCCpAzsx2AsWRXD22gDxMBLAGTJbc7v1fc'
  }
});
let fileList = [];
let activeIndex = -1;
let token = '';
let userList = [];
let roomname = '';
let newFile = '';
let isEditorOpen = false;
let lastOutput = '';
let me = '';
let isDisconnected = false;
const logger = new Logger();
logger.isActive = false;

function log() {
  console.log({
    fileList: fileList,
    activeIndex: activeIndex,
    token: token,
    userList: userList,
    roomname: roomname,
    newFile: newFile
  });
}

function tabLogger() {
  let i = 0;
  while (true) {
    try {
      const ele = document.getElementById('tab' + i);
      console.log(ele);
      if (!ele) break;
      ++i;
    } catch (err) {
      break;
    }
  }
}

window.onbeforeunload = function (e) {
  if (!roomname) return;
  const lv = confirm('reloading will bring you to login page , are you sure to leave?');
  if (lv) {
    leave();
  } else {
    e.preventDefault();
  }
};
