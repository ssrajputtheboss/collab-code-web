function setListners(){

    socket.on('disconnect',()=>{
        isDisconnected = true
    })

    socket.on('connection',()=>{
        if(isDisconnected){
            isDisconnected=false
            socket.emit('rejoin',{
                token : token ,
                roomName : roomname ,
                userName: me
            })
        }
    })

    socket.on('rejoin-res',(data)=>{
    })

    socket.on('userlist',(data)=>{
        const {users} = data
        userList = users
        clearUserList()
        createUserList()
    })

    socket.on('updatefile-res',(data)=>{
        const {message} = data
        const p = document.getElementById('save-text')
        if(p.innerHTML === 'Saving'){
            p.innerHTML = 'Save'
            document.getElementById('save-load').style.display = 'none'
            return
            //no need to change editor if user is a sender
        }
        if(message === 'success'){
            const {fname,content} = data
            if(fileList.findIndex(f=>f.fname===fname) === activeIndex)
                editor.setValue(content)
            fileList = fileList.map((f)=>{
                return f.fname === fname ? {fname : fname , content : content} : f
            })
        }
    })

    socket.on('createfile-res',(data)=>{
        const { message } = data
        if(message === 'success'){
            const {files} = data
            if(activeIndex>=0)
                updateFile()
            fileList = files
            if(!isEditorOpen){
                isEditorOpen=true
                showEditor()
            }
            removeAllTabs()
            setTabs()
            changeTab(files.length-1,false)
        }else
            document.getElementById('file-err').innerHTML = 'Server response:'+message
    })

    socket.on('forward-res',(data)=>{
        const {message} = data
        if(message === 'success'){
            const {fname,change} = data
            if(fileList.findIndex(f=>f.fname===fname) === activeIndex){
                editor.setValue(change)
                /*if(change.origin.includes("undo") ||change.origin.includes("delete") || change.origin.includes("paste")){
                    editor.setValue(change.replaced)
                }
                editor.replaceRange(change.text.join('\n'),change.from,change.to,'replaceRange')*/
            }
        }
    })

    socket.on('run-res',(data)=>{
        const {message} = data 
        document.getElementById('run-text').innerHTML = 'Run'
        document.getElementById('run-load').style.display = 'none'
        if(message === 'success'){
            const {result} = data 
            const code = result.exitCode
            if(code!==null){
                const output=result.stdout+result.stderr
                lastOutput = output
                document.getElementById('cpu-usage').innerHTML = `CPU Usage: ${result.cpuUsage}`
                document.getElementById('memory-usage').innerHTML = `Memory Usage: ${result.memoryUsage}`
                document.getElementById('stdout').value = output
                document.getElementById('exit-code').innerHTML = `process exited with exit code ${code}`
            }else{
                const output=result.stdout
                lastOutput = output
                document.getElementById('cpu-usage').innerHTML = `CPU Usage: ${result.cpuUsage}`
                document.getElementById('memory-usage').innerHTML = `Memory Usage: ${result.memoryUsage}`
                document.getElementById('stdout').value = output
                document.getElementById('exit-code').innerHTML = `process exited with error or timeout ${result.stderr}`
            }
        }else{
            lastOutput=''
            document.getElementById('cpu-usage').innerHTML = ''
                document.getElementById('memory-usage').innerHTML = ''
            document.getElementById('exit-code').innerHTML = message
            document.getElementById('stdout').value =''
        }
    })

    socket.on('leave-res',async(data)=>{
        const {message}=data
        if(message === 'success'){
            window.open('/collab-code-web','_self')
        }
    })
}