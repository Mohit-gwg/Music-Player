import { createStore, combineReducers } from 'redux';
import SongDataReducer from './Reducers/SongDataReducer';

const rootReducer = combineReducers({
  songData: SongDataReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}
export default configureStore;