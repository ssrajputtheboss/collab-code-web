const HOST = 'https://collab-code-api.herokuapp.com/'
let socket = io(HOST,{extraHeaders:{authorization:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOiJhcGkiLCJpYXQiOjE2MjYwNzM4MDB9.B48PU9yDI9M4TifjsTpin9A_6CE8u7n6QJn6d8O0Qf8'}})
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

function logger(){
    let i=0
    while(true){
        try{
            const ele  = document.getElementById('tab'+i)
            console.log(ele)
            if(!ele)break
            ++i
        }catch(err){
            break
        }
    }
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