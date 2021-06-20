import React, { useState } from "react";
import { 
    LogInForm ,
    Header ,
    Tabs ,
    CodeEditor 
} from "../components";
import { FloatingButton } from "../components/FloatingButton";

export const  PageRouter = () : React.ReactElement =>{
    const [authenticated,setAuthenticated] = useState<boolean>(false);
    return <>
        <Header/>
        <FloatingButton visible={authenticated} />
        <LogInForm onLogIn={()=>setAuthenticated(true)} />
        <Tabs visible={authenticated} />
        <CodeEditor 
            visible={authenticated}
        />
    </>;
}