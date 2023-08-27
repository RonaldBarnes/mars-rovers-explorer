import { Routes, Route, useNavigate } from "react-router-dom";

import NavBar from "./NavBar";
import About from "./About";
import RoverList from "../features/rovers/RoverList";
import RoverCard from "../features/rovers/RoverCard";


export default function MyRoutes() {
	return (
		<>
			<NavBar />
			<Routes>
				<Route exact path="/"
					// element={<RoverList />}
					// This will show all rovers at URL of "/rovers" instead of "/":
					element={<DefaultPage />}
					/>

				<Route path="/rovers" element={<RoverList />}>
					{ /* Nested routes: optional camera_id:. */ }
					<Route
						path=":rover_name/:camera_id?"
						element={<RoverCard pagination_buttons={true} show_buttons={true} />}
						>
					</Route>
				</Route>

				{ /* If asking for latest photos, ask which rover: */ }
				<Route path="/photos" element={<RoverList />}>
					<Route
						path=":rover_name"
						element={<RoverCard pagination_buttons={false} show_buttons={false} />}
						/>
				</Route>

				<Route path="/about" element={<About />} />

				{/* Catch any other URL paths, send to Rovers List: */}
				<Route path="/*" element={<RoverList />} />
			</Routes>
		</>
		);	// end return
	};	// end Routes



// A default page should be "/rovers", NOT <RoverList /> at "/", since
// clicking on a rover at that URL will miss the "/rovers" prefix in URL:
function DefaultPage()
	{
	const navigate = useNavigate();

	navigate("/rovers")
	}
