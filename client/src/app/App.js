import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import useFetch from "../hooks/useFetch";

import MyRoutes from "../common/Routes";

import "./App.css";

export const RoverContext = React.createContext();

// Variables for API data and for photos of rovers:
const MARS_DATA_URL = "https://mars-photos.herokuapp.com";
export const API_URL = `${MARS_DATA_URL}/api/v1`;


export default function App() {
	// Fetch list of rovers' data:
	const { loading, error, value } = useFetch(`${API_URL}/rovers/`, {}, [] );

	// Extract the array from the object containing array of rovers:
	let rovers;
	// value === undefined until async fetch is resolved:
	if (value !== undefined)
		{
		rovers = value.rovers;
		// The profile photo is not included in a rover object; add it to each:
		rovers = rovers.map( r => {
			r.profile_pic=`${MARS_DATA_URL}/explore/images/${r.name}_rover.jpg`
			return r;
			})
// Also: there's a manifest for each rover at (but the info is redundant):
// https://mars-photos.herokuapp.com/api/v1/manifests/curiosity
		}

	return (
		<>
			<RoverContext.Provider value={{ loading, error, rovers }} >
				<Router>
						<div id="App">
							<MyRoutes />
						</div>
				</Router>
			</RoverContext.Provider>
		</>
		);	// end return
	};	// end App
