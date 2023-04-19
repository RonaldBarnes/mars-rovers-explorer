export const fetchCameras = () => {
  return (dispatch) => {
    dispatch({type: "LOADING_CAMERAS", loading: true});
    fetch("/api/v1/cameras")
    .then((response) => response.json())
    .then((cameras) => dispatch({type: "FETCHED_CAMERAS", loading: false, payload: cameras}));
  };
};