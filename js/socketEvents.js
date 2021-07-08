function setListners(){
    socket.on('userlist',(data)=>{
        const {users} = data
        userList = users
        clearUserList()
        createUserList()
    })
    socket.on('updatefile-res',(data)=>{
        const {message} = data
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
        const { message , files } = data
        if(message === 'success'){
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
        }
    })
    socket.on('forward-res',(data)=>{
        const {message} = data
        if(message === 'success'){
            const {fname,change} = data
            if(fileList.findIndex(f=>f.fname===fname) === activeIndex){
                if(change.origin.includes("undo") ||change.origin.includes("delete") || change.origin.includes("paste")){
                    editor.setValue(change.replaced)
                }
                editor.replaceRange(change.text.join('\n'),change.from,change.to,'replaceRange')
            }
        }
    })
    socket.on('run-res',(data)=>{
        const {message} = data 
        if(message === 'success'){
            const {result} = data 
            const code = result.exitCode
            if(code!==null){
                const output=result.stdout+result.stderr
                lastOutput = output
                document.getElementById('stdout').value = output
                document.getElementById('exit-code').innerHTML = `process exited with exit code ${code}`
            }else{
                const output=result.stdout
                lastOutput = output
                document.getElementById('stdout').value = output
                document.getElementById('exit-code').innerHTML = `process exited with error or timeout ${result.stderr}`
            }
        }else{
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

    socket.on('delete-res',(data)=>{
        console.log(data)
    })
}