import { useContext } from "react";
import { Link, useParams, Outlet } from "react-router-dom";

import RoverCard from "./RoverCard";

// Supply a list of all rovers and the associated data, fetched once in App.js:
import { RoverContext } from "../../app/App";

import "./RoverList.css";

// Set title bar - nice for looking at history:
document.title = "Mars Rovers: All Rovers";


export default function RoverList()
	{
	// Asynchronous fetch results of all rovers, only updates when App.js re-renders:
	const {loading, error, rovers} = useContext(RoverContext);


	// If no rover data (i.e. loading), or if error fetching data:
	if (loading === true)
		return (<div className="loading">Loading...</div>);
	else if (error !== undefined)
		{
		console.log(`%cRoverList.js ERROR:`, "color:red");
		console.table(error);
		return (<div className="loading" style={{color:"red"}}>{error.message}</div>);
		}


	return (
		<div id="RoverList">
			{ rovers.map( (rover,idx) => (
				<Link to={`/rovers/${rover.name.toLowerCase()}`} className="RoverCard" key={idx}>
					<RoverCard rover={rover}
						key={idx}
						show_buttons={false}
						/>
				</Link>
				))
			}
			<Outlet />
		</div>
		);	// end return
	};	// end RoverList
