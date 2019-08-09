import { ADD_SONGDATA } from './ActionTypes';

export const addSongData = (item) => {
    return {
        type: ADD_SONGDATA,
        item,
    };
};