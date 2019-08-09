import { ADD_SONGDATA } from '../Actions/ActionTypes';

const initialState = {
    item: []
}

const songData = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SONGDATA:
            return {
                ...state,
                item: action.item,
            };
        default:
            return state;
    }
};

export default songData;
