export const fetchPhotos = () => {
  return (dispatch) => {
    dispatch({type: "LOADING_PHOTOS", loading: true});
    fetch("/api/v1/photos")
    .then((response) => response.json())
    .then((photos) => dispatch({type: "FETCHED_PHOTOS", loading: false, payload: photos}));
  };
};