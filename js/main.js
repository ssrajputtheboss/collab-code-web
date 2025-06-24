

const HOST = 'https://codeio.xuitz.solutions/v1';
let authToken = null;
let runResponse = '';
let running = false;


function setLanguageEditor() {
  let runtime = document.getElementById('runtime').value;
  let mode = 'x-python';
  switch(runtime){
    case 'python3' :
      mode = 'x-python';
      break;
    case 'c++':
      mode = 'x-c++src'
      break;
    default:
      mode = 'text'
  }
  editor.setOption('mode', 'text/' + mode);

}


function login(){

  fetch(HOST + '/testlogin' , {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  }).then(res => {
    if(res.status == 200){
      let body = JSON.parse(res.body)
      authToken = body.token;
      hideLogin()
      showEditor()
    }else{
      // service likely unavailable
    }
  }).catch(err => {
    console.log(err)
  })

}

function run(code, runtime , input){
  if (runtime != "python3" || runtime != "c++"){
    console.log('runtime not supported')
  }else{
    fetch(HOST + '/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      script : code , 
      runtime ,
      input 
    })
  }).then(res => {
    if(res.status == 200){
      runResponse = res.body
    }
  })
  }
}

function throttledRunner(){
  if(running)alert('a request is already running!')
  running = true;
  let code = editor.getValue(),
    runtime = document.getElementById('runtime').value,
    input = document.getElementById('stdin').value;
  run(code , runtime , input)
  running = false;
}

// window.onbeforeunload = function (e) {
//   if (!roomname) return;
//   const lv = confirm('reloading will bring you to login page , are you sure to leave?');
//   if (lv) {
//     leave();
//   } else {
//     e.preventDefault();
//   }
// };
