

const HOST = 'https://codeio.xuitz.solutions/v1';
let authToken = null;
let runResponse = '';
var running = false;


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
  document.getElementById("testlogin").disabled = true;

  fetch(HOST + '/testlogin' , {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  }).then(res=>res.json()).then(body => {
      authToken = body.token;
      hideLogin()
      showEditor()
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    document.getElementById("testlogin").disabled = false;
  })

}

function run(code, runtime , input){
  if (runtime != "python3" && runtime != "c++"){
    console.log('runtime not supported')
  }else{
    running = true;
    fetch(HOST + '/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : "Bearer " + authToken
    },
    body: JSON.stringify({
      file: "test",
      script : code , 
      runtime ,
      input ,
      javaClassName:""
    })
  }).then(res=>res.text()).then(body => {
      runResponse = body
      document.getElementById('stdout').value = runResponse;
      console.log(runResponse)
  }).catch(e=>console.log(e)).finally(()=>{
    running = false
  })
  }
}

function throttledRunner(){
  console.log(running)
  if(running)return alert('a request is already running!')

  let code = editor.getValue(),
    runtime = document.getElementById('runtime').value,
    input = document.getElementById('stdin').value;
    console.log(code , runtime, input)
  run(code , runtime , input)
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

