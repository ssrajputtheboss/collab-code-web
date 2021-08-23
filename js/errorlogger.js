class Logger{
    isActive = false
    log(msg){
        if(this.isActive){
            console.log(msg)
        }
    }
}