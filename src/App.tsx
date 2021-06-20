import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { PageRouter } from './pages';
import { useGlobalStore , Context } from './socket'

function App() {
  const store = useGlobalStore();
  return (
    <div className="App">
      <ChakraProvider>
        <Context.Provider value={store}>
          <PageRouter />
        </Context.Provider>
      </ChakraProvider>
    </div>
  );
}

export default App;
