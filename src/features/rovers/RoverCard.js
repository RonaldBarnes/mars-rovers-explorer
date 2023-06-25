// import displayDate from "../../common/displayDate";
import { useParams, useLocation } from "react-router-dom";
// import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import PhotoList from "../photos/PhotoList";

// Supply a list of all rovers and the associated data, fetched once in App.js:
import { RoverContext } from "../../app/App";
import CameraButtonList from "../cameras/CameraButtonList";

import "./RoverCard.css";


export default function RoverCard({
		rover = [],
		show_buttons = true,
		pagination_buttons = true
		})
	{
	// Asynchronous fetch results of all rovers, only updates when App.js re-renders:
	const {loading, error, rovers} = useContext(RoverContext);

	const params = useParams()
	// Check for URL like /rovers/curiosity/MAST:
	const rover_name = params.rover_name;
	let camera_id = params.camera_id;

	// State lifted from CameraButtonList, passed to CameraButtonList and PhotoList as props:
	const [cameraName, setCameraName] = useState(camera_id || "");

	// When camera button DE-selected, navigate back to /rovers/$name:
	// const navigate = useNavigate();
	const location = useLocation();

	// Add a grid class IF this is a single rover, not part of a list:
	// The buttons will be in second grid area:
	let class_name = "";

	// Handle situation where accessed via URL params, i.e. NOT part of
	// list of all rovers, AND fetch has returned a list of rovers:
	if ( rover_name !== undefined && rovers !== undefined )
		{
		console.log(`RoverCard.js rover_name via useParams(): "${rover_name}" camera_id="${camera_id}"`)
		// Our URL is for one rover: extract all its data from original fetch'd data:
		rover = rovers.find( r => r.name.toLowerCase() === rover_name.toLowerCase())

		// Set the title bar to this rover's name and camera name (abbreviated):
		document.title = `Mars Rovers: ${rover.name}`
		document.title += ` ${camera_id === undefined ? "" : camera_id}`
		document.title += ` ${location.pathname.indexOf("/photos") === 0 ? " Latest Photos" : ""}`

		// Set a CSS class so buttons are beside rover,
		// leaving room for photos below (film strip previews perhaps):
		class_name = "rover_and_buttons";
		}

	// If arriving via URL link, state hasn't been set; set it:
	// if (camera_id !== undefined && cameraName === "")
	// 	{
	// 	console.log(`RoverCard.js camera_id:"${camera_id}" and cameraName="": setCameraName() next`)
	// 	setCameraName(c => camera_id);
	// 	}

	// if (location.pathname.indexOf("/photos") === 0)
	// 	{
	// 	// No navigating through photos via camera name at /photos:
	// 	console.log(`RoverCard.js show_buttons:"${show_buttons}" (switching to false next)`)
	// 	show_buttons = false;
	// 	}

	// Attempt to lift state when changing URL when DE-selecting camera:
	// (async function because setState(e.currentTarget.value) says e is undefined)
	// when used in CameraButton's onClick:
	// function toggleCamera(c)
	// 	{
	// 	setCameraName( n => c);
	// 	}

	// Deconstruct rover into elements:
	const {
		id,
		name,
		landing_date,
		launch_date,
		max_date,
		status,
		cameras,
		profile_pic
		} = rover;


	// If no rover data (i.e. loading), or if error fetching data:
	if (loading === true)
		return (<div className="loading">Loading...</div>);
	else if (error !== undefined)
		return (<div className="loading" style={{color:"red"}}>{error.message}</div>);

	return (
		<>
			<div className={class_name}>
				{/* <Link to={`/rovers/${name.toLowerCase()}`}> */}
				<div className="RoverCard" id={`RoverCard-${id}`} roverid={id}>
					<h1 className="RoverCard" roverid={id}>{ name }</h1>
					<img alt={`Mars rover, ${name}`} className="RoverCard" roverid={id} src={profile_pic} />
					<p className="RoverCard">Mission: <span style={{fontWeight:"bold"}}>{ status }</span> {status === "complete" ? max_date : ""}</p>
					<p className="RoverCard">Launched: { launch_date }</p>
					<p className="RoverCard">Landed: { landing_date }</p>
					<p className="RoverCard">Total photos: { Intl.NumberFormat().format(rover.total_photos) }</p>
				</div>
			</div>
			{show_buttons &&
				<>
					<CameraButtonList
						className="scroll_able"
						cameras={cameras}
						rover_name={name}
						id={id}
						cameraName={cameraName}
						setCameraName={setCameraName}
						/>
				</>
				}

				{ /* If a rover selected AND (a camera selected or URL at /photos),
					show photo list: */ }
				{ rover_name !== undefined
					&& (cameraName !== "" || location.pathname.indexOf("/photos") === 0) &&
				<>
					<PhotoList
						cameraName={cameraName}
						rover={rover}
						pagination_buttons={pagination_buttons}
						/>
				</>
				}
		</>
		);	// end return
	};	// end RoverCard
