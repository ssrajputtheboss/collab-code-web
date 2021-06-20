/*export default class SocketHandler{
    private static SERVER_URL : string = 'localhost:4000/'; 
    public static roomName : string = '';
    public static activeIndex :  number = -1;
    public static files : Array<FileData> = []; 
    public static users : Array<string> = [];
    private static jwt : string = '';
    private static socket : Socket = io(SocketHandler.SERVER_URL);
    public static set( token : string){
        SocketHandler.socket = io( SocketHandler.SERVER_URL ,{ extraHeaders : { authorization : token } })
    }
    public static get() : Socket { return SocketHandler.socket; };
    
    public static generate( event : string , data : any ) : void {
        SocketHandler.socket.emit( event , data);
    }

    public static setJwt(token : string){
        SocketHandler.jwt = token;
    }
    
    public static getJwt():string{return SocketHandler.jwt;}

}*/

/*export default class SocketHandler{
    private SERVER_URL : string = 'localhost:4000/'; 
    public roomName : string = '';
    public activeIndex :  number = -1;
    public files : Array<FileData> = []; 
    public users : Array<string> = [];
    private jwt : string = '';
    private socket : Socket = io(this.SERVER_URL);
    public set( token : string){
        this.socket = io( this.SERVER_URL ,{ extraHeaders : { authorization : token } })
    }
    public get() : Socket { return this.socket; };
    
    public generate( event : string , data : any ) : void {
        this.socket.emit( event , data);
    }

    public setJwt(token : string){
        this.jwt = token;
    }
    
    public getJwt():string{return this.jwt;}

}*/

export * from './context';
export * from './store';

//export const handler = new SocketHandler();
