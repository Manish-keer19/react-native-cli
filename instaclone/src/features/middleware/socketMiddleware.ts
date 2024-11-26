import {io} from 'socket.io-client';
import {setUser} from '../user/userSlice'; // Redux action to update user
import {BASE_URL} from '../../services/apiClient';

const socket = io(BASE_URL);

export const socketMiddleware =
  (store: any) => (next: any) => (action: any) => {
    if (action.type === 'SOCKET_INIT') {
      console.log("socket middleware called");
      socket.on('deletedStory', userdata => {
        console.log('Story deleted event received', userdata);
        store.dispatch(setUser(userdata)); // Update the user globally in Redux
      });
    }

    return next(action);
  };
