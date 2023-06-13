import { Routes, Route } from "react-router-dom";

import NavBar from "./NavBar";
import About from "./About";
import RoverList from "../features/rovers/RoverList";
import RoverCard from "../features/rovers/RoverCard";
import CameraButtonList from "../features/cameras/CameraButtonList";
// import PhotoList from "../features/photos/PhotoList";


export default function MyRoutes() {
	return (
		<>
			<NavBar />
			<Routes>
				<Route exact path="/" element={<RoverList />} />
				<Route exact path="/rovers" element={<RoverList />} />
				<Route
					path="/rovers/:rover_name/:camera_id?"
					element={<RoverCard />}
					>
					{/* No need for child / nested route: optional camera_id above. */}
					{/* <Route path=":camera_id" element={<RoverCard />} /> */}
				</Route>
				<Route path="/about" element={<About />} />
				{/* <Route path="/photos" component={PhotoList} /> */}
				{/* Catch any other URL paths, send to About: */}
				<Route path="/*" element={<About />} />
			</Routes>
		</>
		);	// end return
	};	// end Routes
