import { ADD_FAVSONGDATA } from '../Actions/ActionTypes';

const initialState = {
    favSongData: [],
}

const addFavSongData = (state = initialState, action) => {
    switch (action.type) {
        case ADD_FAVSONGDATA:
            return {
                ...state,
                favSongData: action.favSongData,
            };
        default:
            return state;
    }
};

export default addFavSongData;
