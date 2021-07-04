function validate({username,roomname,password,token}){
    if( /.+\..+\..+/i.exec(token) === null )
        return 'Invalid Token'
    if(username.length < 4) 
        return 'Username must be of length 4 atleast'
    if(roomname.length < 6)
        return 'Roomname must be of length 6 atleast'
    if(password.length < 8 || password.length > 20)
        return 'Password must be of length 8-20'
    return 'success'
}

function login(){
    const authData = {
        roomname : document.getElementById('roomname').value,
        username : document.getElementById('username').value,
        password : document.getElementById('password').value,
        token : document.getElementById('token').value
    }
    const msg = validate(authData)
    if(msg == 'success'){
        document.getElementById('err').innerHTML = ''
        socket = io(HOST,{
            extraHeaders : {authorization : authData.token}
        })
        socket.emit('create' , {
            roomName : authData.roomname,
            userName : authData.username,
            password : authData.password
        })
        socket.on('create-res',(data)=>{
            const {message} = data
            if(message === 'success'){
                const {jwt} = data
                token = jwt
                roomname=authData.roomname
                userList.push(authData.username)
                hideLogin()
                hideEditor()
                setListners()
            }else
                document.getElementById('err').innerHTML='Server response: '+message
        })
    }else{
        document.getElementById('err').innerHTML = msg
    }
}

function join(){
    const authData = {
        roomname : document.getElementById('roomname').value,
        username : document.getElementById('username').value,
        password : document.getElementById('password').value,
        token : document.getElementById('token').value
    }
    const msg = validate(authData)
    if(msg == 'success'){
        document.getElementById('err').innerHTML = ''
        socket = io(HOST,{
            extraHeaders : {authorization : authData.token}
        })
        socket.emit('join' , {
            roomName : authData.roomname,
            userName : authData.username,
            password : authData.password
        })
        socket.on('join-res',(data)=>{
            const {message} = data
            if(message === 'success'){
                const {jwt , files , users} = data
                token = jwt
                roomname=authData.roomname
                userList = users
                fileList=files
                activeIndex=files.length===0?-1:0
                if(activeIndex>=0){
                    setTabs()
                    isEditorOpen=true
                    showEditor()
                }
                hideLogin()
                setListners()
            }else
            document.getElementById('err').innerHTML='Server response: '+message
        })
    }else{
        document.getElementById('err').innerHTML = msg
    }
}

function hideLogin(){
    document.getElementById('login').style.display = 'none'
    document.getElementById('home').style.display = 'block'
}

function showLogin(){
    document.getElementById('login').style.display = 'flex'
    document.getElementById('home').style.display = 'none'
}

function showEditor(){
    document.getElementById('editor').style.display = 'block'
}

function hideEditor(){
    document.getElementById('editor').style.display = 'none'
}

function showModal(){
    document.getElementById('createfile').style.display= 'flex'
}

function hideModal(){
    document.getElementById('createfile').style.display= 'none'
}

function createFile(){
    const sname = document.getElementById('sname').value
    const fname = document.getElementById('fname').value
    newFile=fname
    socket.emit('createfile',{
        token : token ,
        roomName : roomname ,
        fname : fname ,
        snippetName : (sname === '' ? undefined :sname)
    })
    hideModal()
}

function updateFile(){
    socket.emit('updatefile' , {
        token : token ,
        roomName : roomname ,
        fname : fileList[activeIndex].fname ,
        content : editor.getValue()
    })
}