export const SET_LIKES = 'SET_LIKES';

export function setLikes(list) {
  return {
    type: SET_LIKES,
    payload: { list },
  };
}
