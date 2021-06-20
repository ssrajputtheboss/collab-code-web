import React from "react";
import { 
    Box ,
    Flex ,
    Text 
} from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import { IconButton } from "@chakra-ui/button";
import { TabData } from "../../../models";
import { 
    MdContentCopy ,
    MdClose
} from 'react-icons/md';

export const Tab = ({ fname , isActive , onClick } : TabData ) : React.ReactElement => {
    return <>
        <Box
        p="2"
        h="10"
        w="fit-content"
        maxW="48"
        onClick={onClick}
        bgColor={isActive ? "twitter.500" : "twitter.900"}
        borderRightColor="blue.500"
        borderRightWidth="thin"
        >
            <Flex
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
            >
                <Text >{fname}</Text>
                <Flex
                display={isActive ? 'block':'none'}
                ml="5"
                flexDir="row"
                justifyContent="end"
                alignItems="center"
                >
                    <IconButton
                    aria-label="copy-button"
                    h="5"
                    bgColor={isActive ? "twitter.500" : "twitter.900"}
                    >
                    <Icon 
                        as={ MdContentCopy }
                        />
                    </IconButton>
                    <IconButton
                    aria-label="close-button"
                    h="5"
                    bgColor={isActive ? "twitter.500" : "twitter.900"}
                    >
                        <Icon 
                        as={ MdClose }
                        />
                    </IconButton>
                </Flex>
            </Flex>    
        </Box>
    </>;
}