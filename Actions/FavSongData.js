import { ADD_FAVSONGDATA } from './ActionTypes';

export const addFavSongData = (favSongData) => {
    return {
        type: ADD_FAVSONGDATA,
        favSongData,
    }
}