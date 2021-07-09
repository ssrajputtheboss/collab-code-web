function addTab(name,index){
    let parent = document.getElementById('tabs')
    let tab = document.createElement('div')
    tab.onclick = ()=>changeTab(index,true)
    tab.setAttribute('id','tab'+index)
    tab.style.width='fit-content'
    tab.className="flex flex-row justify-between items-center p-2" + index===activeIndex?' bg-blue-100':' bg-indigo-300'
    let title = document.createElement('p')
    title.className="text-blue-900 text-xl"
    title.innerHTML=name
    let button = document.createElement('button')
    button.className = 'p-2 rounded'
    let svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
    svg.setAttribute('class','h-6 w-6')
    svg.setAttribute('fill','none')
    svg.setAttribute('viewBox',"0 0 24 24")
    svg.setAttribute('stroke','blue')
    let path = document.createElementNS('http://www.w3.org/2000/svg','path')
    path.setAttribute('stroke-linecap','round')
    path.setAttribute('stroke-linejoin',"round")
    path.setAttribute('stroke-width',"2")
    path.setAttribute('d',"M6 18L18 6M6 6l12 12")
    svg.appendChild(path)
    button.appendChild(svg)
    tab.appendChild(title)
    tab.appendChild(button)
    parent.appendChild(tab)
}

function createUserList(){
    userList.forEach((e,i)=>{
        let parent = document.getElementById('user-list')
        let p = document.createElement('p')
        p.setAttribute('id','user'+i)
        p.innerHTML=e 
        p.className='p-2 text-white text-green-700 w-full'
        parent.appendChild(p)
    })
}

function clearUserList(){
    let i=0
    while(true){
        try{
            document.getElementById('user'+i).remove()
            ++i
        }catch(err){
            break
        }
    }
}

function disableTab(index){
    document.getElementById('tab'+index).className = 'flex flex-row justify-between items-center p-2 bg-indigo-300'
}

function enableTab(index){
    document.getElementById('tab'+index).className = 'flex flex-row justify-between items-center p-2 bg-blue-100'
}

function setTabs(){
    fileList.forEach(({fname},i)=>{
        addTab(fname,i)
    })
}

function changeTab(i,update){
    if(i === activeIndex)return;
    if(activeIndex>=0){
        if(update){}
            //updateFile()
        disableTab(activeIndex)
    }
    activeIndex=i
    enableTab(i)
    setLanguageEditor(fileList[i].fname)
    editor.setValue(fileList[i].content)
}

function removeAllTabs(){
    let i=0
    while(true){
        try{
            document.getElementById('tab'+i).remove()
            ++i
        }catch(err){
            break
        }
    }
}

function setLanguageEditor(fname){
	if(fname.endsWith('.c'))
		mode = 'x-c'
	else if(fname.endsWith('.cpp'))
		mode = 'x-c++src'
	else if(fname.endsWith('.java'))
		mode = 'x-java'
	else if (fname.endsWith('.py'))
		mode = 'x-python'
    else mode='text'
	editor.setOption('mode' , 'text/'+mode)
}

