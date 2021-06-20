import React, { ChangeEvent, useContext, useState } from "react";
import {
    Box ,
    Flex 
} from '@chakra-ui/layout';
import { IconButton } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";
import { Icon } from "@chakra-ui/icon";
import { CgAddR } from 'react-icons/cg';
import { Tab } from "./Tab";
import { FileData , TabsProps } from "../../models";
import { 
    useDisclosure ,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton ,
    Button ,
    Input ,
    Text
} from "@chakra-ui/react";

import { Context } from "../../socket";

export const Tabs = ( { visible } : TabsProps ) : React.ReactElement => {
    const {state,actions} = useContext(Context);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [fname,setFname] = useState<string>('');
    const [sname,setSname] = useState<string>('');
    const [err,setErr] = useState<string>('');
    const [ tabList , setTabList ] = useState<Array<string>>( state.files.map((e:FileData)=>e.fname));
    const [ activeIndex, setActiveIndex ] = useState<number>(state.activeIndex);
    const create : Function = ()=>{
        
        state.socket.emit('createfile', {
            token : state.jwt ,
            roomName : state.roomName ,
            fname : fname ,
            snippetName : (sname === '' ? undefined :sname)
        });
        state.socket.on('createfile-res' , (data)=>{
            console.log('createfile-res');
            const { message , files } = data;
            if(message === 'success'){
                onClose();
                setTabList(files.map((e:FileData)=>e.fname));
                actions({
                    type : 'setState' , 
                    payload : {...state ,
                            files : files ,
                            activeIndex : files.length-1
                        }
                });
            } else {
                setErr(message);
            }
        });
    }

    if(!visible)return <></>;

    return <Box
    h="12"
    w="full"
    >
        <Flex
        flexDir="row"
        justifyContent="start"
        alignItems="center"
        overflow="scroll"
        >
            <Tooltip label="Add File">
                <IconButton m="2" aria-label="add-button" onClick={onOpen}>
                    <Icon as={CgAddR} h="8" w="8" color="blue.400"/>
                </IconButton>
            </Tooltip>   
            {tabList.map((name : string, i:number)=>
                (<Tab 
                    key={i}
                    fname={name} 
                    isActive={activeIndex === i} 
                    onClick = {(e)=>{
                        setActiveIndex(i);
                        actions({type:'setState',payload:{...state,activeIndex:i}});
                    }}
                />) 
            )}
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter File Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input 
            type="text" 
            name="filename" 
            placeholder="FileName"
            onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                setFname(e.target.value);   
            }} 
            />
            <Input 
            type="text" 
            name="snippetname"
            placeholder="SnippetName"                       
            onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                setSname(e.target.value); 
            }} 
            />
            <Text color="red.200">{err}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={()=>create()}>
                Create
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>;
}