// import { useDisplayToggle } from "../../common/Toggle";
import PhotoList from "../photos/PhotoList";
import { redirect, useParams, useNavigate } from "react-router-dom";

import "./CameraButton.css";


export default function CameraButton({
		name,
		id,
		full_name,
		style,
		cameraName,
		setCameraName,
		// toggleCamera
		})
	{
// console.log(`CameraButton.js "${full_name}" "${name}"`)
	// import RoverContextWTF from "../../app/App";
	const params = useParams();
	const rover_name = params.rover_name;
	const navigate = useNavigate()

	// const [display, setDisplay] = useDisplayToggle();
// setCameraName(name);
// console.log(`CameraButton.js cameraName: ${cameraName}`)

	// const handleClick = (e) => {
	async function handleClick(e)
		{
		e.preventDefault();

		// Reset other buttons which may have been selected
		// before this one:
		document.querySelectorAll(".selected").forEach( b => {
			// Reset OTHER buttons which may have been selected
			// before this one:
			if (b.id !== e.currentTarget.id)
				{
				b.classList.remove("selected")
				b.textContent = b.name;
				}
			})
		//
		// Swap button text and styling if already selected:
		if (e.currentTarget.textContent === "Hide Photos")
			{
			e.currentTarget.textContent = full_name
			document.getElementById(e.currentTarget.id).classList.remove("selected");
			setCameraName( n => "");
			// toggleCamera("");
			navigate(`/rovers/${rover_name}`, {replace:false})
			}
		else
			{
 			e.currentTarget.textContent = "Hide Photos"
			document.getElementById(e.currentTarget.id).classList.add("selected");
			// GIVES ERROR: e not passed up to RoverCard for set state?!?
			// setCameraName(cn => e.currentTarget.value);
			// work-around: intermediate variable, "boo!"
			// maybe a form of e.[currentTarget].[value] ?!?
			const cname = e.currentTarget.value;
			setCameraName(n => cname);
			// Making everything asynchronous does NOT help:
			// await setCameraName( n => e.currentTarget.value);
			// BUT, this (async) function DOES work?!?
			// toggleCamera(e.currentTarget.value);
			//
			// Remove camera name from URL:
			navigate(`/rovers/${rover_name}/${e.currentTarget.value}`, {replace:false})
			}
		};

	return (
		<>
			<button
				type="button"
				className={ name === cameraName ? "CameraButton selected" : "CameraButton"}
				id={`CameraButton-${id}`}
				onClick={handleClick}
				style={style}
				name={full_name}
				value={name}
				>
				{ name === cameraName ? "Hide Photos" : full_name }
			</button>
			{/* The photo list needs to be outside the CameraButtonList,
				below rover & buttons, with new layout: */}
			{/* <PhotoList /> */}
		</>
		);	// end return
	};	// end CameraButton
