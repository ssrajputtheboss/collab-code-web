const HOST = 'https://collab-code-api.herokuapp.com/'
let socket = io(HOST)
let fileList=[]
let activeIndex=-1
let token= ''
let userList = []
let roomname=''
let newFile=''
let isEditorOpen=false
let lastOutput=''

function log(){
    console.log({
        fileList : fileList,
        activeIndex:activeIndex,
        token:token,
        userList:userList,
        roomname:roomname,
        newFile:newFile
    })
}

window.onbeforeunload = function(e){
    if(!roomname)return
    const lv = confirm('reloading will bring you to login page , are you sure to leave?')
    if(lv){
        leave()
    }else{
        e.preventDefault()
    }
}