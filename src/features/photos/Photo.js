import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";


export default function Photo({ photo, rover })
	{
	// console.log(`Photo.js ${photo.img_src}`)

	const [searchParams,setSearchParams] = useSearchParams();
	// Save the selected / clicked / fullScreen photo (and if loading URL with
	// photo_id in searchParams, use that):
	const [fullScreen, setFullScreen] = useState(c =>
		searchParams.get("photo_id")
		);

	// If we're on a /photos page, indicate camera name;
	// if we're on a /rovers/rover_name/camera_name, then the camera is already known:
	const location = useLocation();
	const cameraDisplayName = location.pathname.indexOf("/photos") === 0
		? `${photo.camera.full_name}`
		: ""

	// Set title & alt text for images:
	const imageInfo = `Image Info:
	Earth Date: ${photo.earth_date}
	Sol: ${photo.sol}
	Camera: ${photo.camera.full_name}
	Rover: ${photo.rover.name}
	photo id: ${photo.id}`;


	const handleClick = (e) =>
		{
		console.log(`handleClick: e: ${e.currentTarget}`)
// console.table(e.currentTarget)
		e.currentTarget.classList.toggle("fullScreen");
		// Remove fullscreen styling from all photos:
		const all = document.querySelectorAll(".fullScreen");
		if (all.length === 0)
			{
			// Remove photo_id from search query in URL (no fullScreen photos):
			searchParams.delete("photo_id");
			// Remove ID of fullscreen / clicked photo:
			setFullScreen( c => 0);
			}
		else
			{
			// Set photo_id in search query in URL:
			searchParams.set("photo_id", e.currentTarget.id);
			// Set ID of fullscreen / clicked photo:
			// Note: e(vent) is null by time state updates, using
			// intermediate variable instead:
			const id = e.currentTarget.id;
			setFullScreen( c => id);
			// Remove fullScreen class from all images except the clicked upon one:
			// (i.e. if clicking one image, then another, this removes the other's styling)
			all.forEach(element => {
				if (element !== e.currentTarget)
					element.classList.remove("fullScreen");
				});
			}

		setSearchParams(searchParams);
		}


	return (
		<div className="Photo">
			<figure>
			<img
				alt={imageInfo}
				src={photo.img_src}
				title={imageInfo}
				onClick={handleClick}
				id={photo.id}
				className={parseInt(fullScreen) === parseInt(photo.id)
					? "fullScreen" : ""}
				/>
			<figcaption>
				{photo.earth_date} #{photo.id}<br />{cameraDisplayName}
			</figcaption>
			</figure>
		</div>
		);
	};
