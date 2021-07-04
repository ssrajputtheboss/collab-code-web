function setListners(){
    socket.on('userlist',(data)=>{
        const {users} = data
        userList = users
    })
    socket.on('updatefile-res',(data)=>{
        const {message} = data
        if(message === 'success'){
            const {fname,content} = data;
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
            fileList = files
            if(!isEditorOpen){
                isEditorOpen=true
                showEditor()
            }
            removeAllTabs()
            setTabs()
            changeTab(files.length-1)
        }
    })
    socket.on('forward-res',(data)=>{
        const {message} = data
        if(message === 'success'){
            console.log('recieved')
            const {fname,change} = data
            if(fileList.findIndex(f=>f.fname===fname) === activeIndex){
                if(change.origin.includes("undo") ||change.origin.includes("delete") || change.origin.includes("paste")){
                    editor.setValue(change.replaced)
                }
                editor.replaceRange(change.text.join('\n'),change.from,change.to,'replaceRange')
            }
        }
    })
}