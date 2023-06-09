import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import CameraButton from "./CameraButton";

import "./CameraButton.css";


export default function CameraButtonList({
	cameras=[],
	rover_name,
	display = "block",
	id,
	cameraName,
	setCameraName,
	// toggleCamera
	})
	{
// console.log(`CameraButtonList.js`)


	// If we're on an URL for a camera, and that camera's button is clicked again,
	// remove camera_id from URL:
	let params = useParams();
	let camera_id = params.camera_id;

	return (
		<div className="CameraButtonList">
			{
				cameras.map( (c,idx) => {
					return (
						<Link to={`/rovers/${rover_name.toLowerCase()}/${c.name}`} key={idx} >
							<CameraButton
								{...c}
								key={c.id}
								cameraName={cameraName}
								setCameraName={setCameraName}
								// toggleCamera={toggleCamera}
								/>
						</Link>
						)
					})
			}
		</div>
		);	// end return
	};	// end CameraButtonList
