
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Photo({ photo, rover })
	{
	// console.log(`Photo.js ${photo.img_src}`)

	const [fullScreen, setFullScreen] = useState(false);

	// If we're on a /photos page, indicate camera name;
	// if we're on a /rovers/rover_name/camera_name, then the camera is already known:
	const location = useLocation();
	const cameraDisplayName = location.pathname.indexOf("/photos") === 0
		? `${photo.camera.full_name}`
		: ""

	const imageInfo = `Image Info:
	Earth Date: ${photo.earth_date}
	Sol: ${photo.sol}
	Camera: ${photo.camera.full_name}
	Rover: ${photo.rover.name}
	photo id: ${photo.id}`;

	const handleClick = (e) =>
		{
		console.log(`handleClick: e: ${e.currentTarget}  fullScreen: ${fullScreen.toString()}`)
// console.table(e.currentTarget)
		setFullScreen( c => !c);
		e.currentTarget.classList.toggle("fullScreen");
		// Remove fullscreen styling from all photos:
		const all = document.querySelectorAll(".fullScreen");
		if (all !== null)
			{
			all.forEach(element => {
				if (element !== e.currentTarget)
					element.classList.remove("fullScreen");
				});
			}
		}


	return (
		<div className="Photo">
			<figure>
			<img
				alt={imageInfo}
				src={photo.img_src}
				title={imageInfo}
				onClick={handleClick}
				/>
			<figcaption>
				{photo.earth_date} #{photo.id}<br />{cameraDisplayName}
			</figcaption>
			</figure>
		</div>
		);
	};
