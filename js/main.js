const HOST = 'https://majestic-voyageurs-43922.herokuapp.com/'
let socket = io(HOST)
let fileList=[]
let activeIndex=-1
let token= ''
let userList = []
let roomname=''
let newFile=''
let isEditorOpen=false

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
