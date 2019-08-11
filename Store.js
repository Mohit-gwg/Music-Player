import { createStore, combineReducers } from 'redux';
import SongDataReducer from './Reducers/SongDataReducer';
import FavSongDataReducer from './Reducers/FavSongDataReducer';

const rootReducer = combineReducers({
  songData: SongDataReducer,
  addFavSongData: FavSongDataReducer,
});

const configureStore = () => {
  return createStore(rootReducer);
}
export default configureStore;