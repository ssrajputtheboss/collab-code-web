import{
    IconButton ,
    Icon ,
    Menu ,
    MenuList ,
    MenuButton ,
    MenuItem
} from '@chakra-ui/react';
import { useContext } from 'react';
import { FaUsers } from 'react-icons/fa';
import { FloatingButtonProps } from '../../models';
import { Context } from '../../socket';
import { Item } from './Item/Item';

export const FloatingButton = ({visible} : FloatingButtonProps) : React.ReactElement => {
    
    const {state,actions} = useContext(Context);
    
    if(!visible ) return <></>;

    state.socket.on('userlist',(data:any)=>{
        const {users} = data;
        actions({
            type: 'setState' ,
            payload : {
                ...state ,
                users : users
            }
        });
    });

    state.socket.on('test-res',( data)=>console.log('test response!!!!!'));
    
    return <Menu>
        <MenuButton 
        as={IconButton}
        aria-label="floating-button"
        position="fixed"
        top="52"
        right="10"
        zIndex="20"
        >
            <Icon as={ FaUsers } h="8" w="8"/>
        </MenuButton>
        <MenuList>
            <IconButton aria-label="" 
            onClick={()=>{
                state.socket.emit('test',{
                    token : state.jwt, 
                    roomName : state.roomName
                });
            }}
            ><FaUsers/></IconButton>
            {state.users.map((user:string)=><MenuItem><Item name={user} /></MenuItem>)}
        </MenuList>
    </Menu>
}