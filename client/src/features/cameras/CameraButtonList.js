import { Link } from "react-router-dom";

import CameraButton from "./CameraButton";

import "./CameraButton.css";


export default function CameraButtonList({
		cameras=[],
		rover_name,
		id,
		cameraName,
		setCameraName,
		})
	{
// console.log(`CameraButtonList.js`)


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
								/>
						</Link>
						)
					})
			}
		</div>
		);	// end return
	};	// end CameraButtonList
