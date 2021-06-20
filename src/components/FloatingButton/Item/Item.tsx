import {
    Box ,
    Flex ,
    Text ,
    Icon
} from '@chakra-ui/react';
import { ItemProps } from '../../../models';
import { GoPrimitiveDot } from 'react-icons/go';

export const Item = ({name} : ItemProps) : React.ReactElement => {
    return <Box
    as={Flex}
    flexDir="row"
    justifyContent="space-around"
    alignItems="center"
    h="8"
    >
        <Text fontWeight="bold" > {name} </Text>
        <Icon as={GoPrimitiveDot} h="6" w="6"color="green.600"/>
    </Box>
}