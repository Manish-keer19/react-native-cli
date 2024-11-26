import React from 'react';
import {Provider} from 'react-redux'; // Import Provider
import {store} from './src/app/store';
import Entryroute from './Entryroute'; // Assuming you have this file


store.dispatch({type: 'SOCKET_INIT'});

export default function App() {
  return (
    <>
      <Provider store={store}>
        <Entryroute />
      </Provider>
    </>
  );
}
