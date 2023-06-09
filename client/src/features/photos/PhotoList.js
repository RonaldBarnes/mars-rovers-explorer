// import usePhotoContext from "./usePhotoContext";
import Photo from "./Photo";
import "./PhotoList.css";


// http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=1000&page=2
// http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?earth_date=2015-6-3
// http://mars-photos.herokuapp.com/api/v1/rovers/opportunity/photos?earth_date=2015-6-3&camera=pancam
// http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=1000


export default function PhotoList({camera_id, cameraName = "?"})
	{
	// const photos = usePhotoContext();
console.log(`PhotoList.js photos  camera_id: ${camera_id}`)

	// const displayAllPhotos = () => photos.map((photo) => (
	//   <Photo source={photo.source} key={photo.id} />
	// ));

	return (
		<div className="PhotoList">
			{/* { displayAllPhotos() } */}
PhotoList... camera_id = "{camera_id}"  cameraName = "{cameraName}"
		</div>
		);	// end return
	};	// end PhotoList
