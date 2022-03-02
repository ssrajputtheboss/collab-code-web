import React from 'react';
import { Box, Heading } from '@chakra-ui/layout';

export const Header = (): React.ReactElement => {
  return (
    <>
      <Box w='full' h='fit-content' borderColor='teal.400' borderWidth='medium' p='2'>
        <Heading textAlign='center'> {'Collab<Code/>'} </Heading>
      </Box>
    </>
  );
};
