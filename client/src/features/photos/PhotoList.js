import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";

import Photo from "./Photo";
import useFetch from "../../hooks/useFetch";

import { API_URL } from "../../app/App";

import "./PhotoList.css";

// Notable URLs:
// http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=1000&page=2
// http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?earth_date=2015-6-3
// http://mars-photos.herokuapp.com/api/v1/rovers/opportunity/photos?earth_date=2015-6-3&camera=pancam
// http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=1000


export default function PhotoList({
		cameraName = "?",
		rover,
		pagination_buttons = true,
		})
	{
	// console.log(`PhotoList.js rover.name: "${rover.name}" cameraName: "${cameraName}"`)
	const [searchParams,setSearchParams] = useSearchParams();

	// Query string may have earth_date=2023-06-13&page=2:
	const [earthDate, setEarthDate] = useState(() =>
		(searchParams.get("earth_date") || rover.landing_date));

	// Same, but different elements split out:
	// NO ERROR CHECKING DONE, i.e. page=0 or page=k
	const [page, setPage] = useState( () =>
		(searchParams.get("page") || 1));

	const [photos, setPhotos] = useState([]);

	// Date pagination buttons:
	const [dateFirstButtonDisabled, setDateFirstButtonDisabled] = useState(true);
	const [datePrevButtonDisabled, setDatePrevButtonDisabled] = useState(true);
	const [dateNextButtonDisabled, setDateNextButtonDisabled] = useState(true);
	const [dateLastButtonDisabled, setDateLastButtonDisabled] = useState(true);
	// Page forward & backward:
	const [pagePrevButtonDisabled, setPagePrevButtonDisabled] = useState(true);
	const [pageNextButtonDisabled, setPageNextButtonDisabled] = useState(true);

	let dataURL = (earthDate !== "" && cameraName !== "")	// && loading === false)
		? `${API_URL}/rovers/${rover.name.toLowerCase()}/photos?earth_date=${earthDate}&camera=${cameraName.toLowerCase()}&page=${page}`
		: `${API_URL}/rovers/${rover.name.toLowerCase()}/photos?earth_date=${rover.max_date}&camera=${cameraName.toLowerCase()}&page=${page}`

	const params = useParams();
	const rover_name = params.rover_name;

	const location = useLocation();

	if (location.pathname.indexOf("/photos") === 0)
		{
		dataURL = `${API_URL}/rovers/${rover_name.toLowerCase()}/latest_photos`
		}

	let {loading, error, value} = useFetch(
		dataURL,
		// `${API_URL}/rovers/${rover.name.toLowerCase()}/photos?earth_date=${earthDate}&camera=${cameraName.toLowerCase()}&page=${page}`,
		{"Access-Control-Allow-Origin": "*"},
		[earthDate, cameraName, page]
		);



	// One function to increment or decrement earthDate by one day:
	const changeEarthDate = (d) => {
		// Date() uses LOCAL TIME interpretation for params: we need UTC
		let tmpEarthDate = yyyymmddToUtcDate(earthDate);
		let tmpMaxRoverDate = yyyymmddToUtcDate(rover.max_date);

		if (d === "first")
			{
			tmpEarthDate = yyyymmddToUtcDate(rover.landing_date);
			}
		else if (d === "last")
			{
			tmpEarthDate = yyyymmddToUtcDate(rover.max_date);
			}
		else
			{
			// Increment by +1/-1 depending on button clicked:
			tmpEarthDate.setUTCDate( tmpEarthDate.getUTCDate() + d );
			}

		// No future dates allowed:
		if (tmpEarthDate >= tmpMaxRoverDate)
			{
			tmpEarthDate = tmpMaxRoverDate;
			// No paging after max_date:
			setDateFirstButtonDisabled( c => false);
			setDatePrevButtonDisabled( c => false);
			// Paging backward OK:
			setDateNextButtonDisabled( c => true);
			setDateLastButtonDisabled( c => true);
			}
		else if (tmpEarthDate <= yyyymmddToUtcDate(rover.landing_date) )
			{
			// No paging beyond landing date:
			setDateFirstButtonDisabled( c => true);
			setDatePrevButtonDisabled( c => true);
			// Paging forward OK:
			setDateNextButtonDisabled( c => false);
			setDateLastButtonDisabled( c => false);
			}
		else
			{
			// Paging backward OK:
			setDateFirstButtonDisabled( c => false);
			setDatePrevButtonDisabled( c => false);
			// Paging forward OK:
			setDateNextButtonDisabled( c => false);
			setDateLastButtonDisabled( c => false);
			}

		// Create date string as yyyy-mm-dd from UTC elements:
		const newDate = `${tmpEarthDate.getUTCFullYear()}-`
			+ `${"0".concat(tmpEarthDate.getUTCMonth() + 1).slice(-2)}-`
			+ `${"0".concat(tmpEarthDate.getUTCDate()).slice(-2)}`

		setEarthDate( old => newDate)

		// Reset page so no Page 3 on date with 1 page of photos:
		// Only if CHANGING the date, not if 0 passed in (which is done to
		// handle disabling buttons, etc.)
		if (d === 0)
			{
			setSearchParams({ earth_date: newDate, page: page })
			}
		else
			{
			setPage( c => 1);
			// No previous when on page 1:
			setPagePrevButtonDisabled(c => true);
			setSearchParams({ earth_date: newDate, page: 1 })
			}

		return newDate;
		}




	// API serves dates as yyyy-mm-dd (UTC), and new Date() takes params as LOCAL TIME.
	// This will return a new Date from UTC params:
	// !mm is expected to be month NUMBER and will be converted to INDEX!
	const yyyymmddToUtcDate = (yyyy_mm_dd) => {
		let dateParts = yyyy_mm_dd.split("-");

		// Convert date to UTC: Date() uses LOCAL TIME for params by default:
		let tmpDate = new Date();
		tmpDate.setUTCFullYear( dateParts[0]);
		tmpDate.setUTCMonth( dateParts[1] - 1);	// -1 because index vs number
		tmpDate.setUTCDate( dateParts[2]);			// d can be +1 or -1

		return tmpDate;
		}




	// Change page number and disable button so page never equals zero:
	const incrementPage = (p) =>
		{
		// Firefox does string concat, despite parseInt on setState():
		const intPage = parseInt(page);

		if (page + p === 1)
			setPagePrevButtonDisabled(c => true);
		else
			setPagePrevButtonDisabled(c => false);

		setPage( c => intPage + p);
		setSearchParams({ earth_date: earthDate, page: intPage + p })
		}




	// Handle useFetch results:
	useEffect( () => {
console.log(`%cPhotoList.js value: (length=${value?.photos?.length || value?.latest_photos?.length})`, "color:red")
console.table(value);
		setPhotos( c => value?.photos || value?.latest_photos || []);

		// No camera selected, no paging through dates
		if (cameraName === "?" || cameraName === "" || cameraName === undefined)
			{
			// console.log(`PhotoList.js useEffect no camera, disabling all pagination buttons:`)
			setDateFirstButtonDisabled(c => true);
			setDatePrevButtonDisabled(c => true);
			setDateNextButtonDisabled(c => true);
			setDateLastButtonDisabled(c => true);
			// Pages:
			setPagePrevButtonDisabled(c => true);
			setPageNextButtonDisabled(c => true);
			}
		else
			{
			// Let existing code handle disabling buttons if required, by paging
			// zero days forward (then it calculates which buttons are valid):
			changeEarthDate(0);
			}

		// If there are fewer than a full page of photos, disable Next Page:
		if (value?.photos?.length < 25)
			{
			// No (more) photos, so disable Next Page button:
			setPageNextButtonDisabled( c => true);
			}
		else
			{
			// Re-enable Next Page button:
			setPageNextButtonDisabled( c => false);
			}

		// If disabling & re-enabling a camera's button, AND the page
		// is > 1, the previous button needs to be enabled.
		// Best solution would be to lift the state to, say, RoverCard...
		if (page > 1 && cameraName !== "")
			{
			console.log(`%cPhotoList.js page > 1 and cameraName !== "" (${page} and ${cameraName})`)
			setPagePrevButtonDisabled( c => false);
			}



		if (error !== undefined)
			console.log(`%cE R R O R: ${error.message}`, "color:red");

		return () => setPhotos([])
		},[loading, error, value, cameraName, earthDate, changeEarthDate, page])


// console.log(`loading: ${loading.toString()}`);
if (error !== undefined)
	{
	console.log(`error: ${error}`)
	console.table(error?.message);
	}

console.log(`photos.length: ${photos.length}`)
// console.table(photos);
console.table(photos?.camera);

	// const displayAllPhotos = () => photos.map((photo) => (
	//   <Photo source={photo.source} key={photo.id} />
	// ));

	// These quick returns cause flickering since the buttons don't render...
	// Better to show "Loading" below buttons:
	// if (loading)
	// 	return( <div className="PhotoList">Loading...</div>);
	// if (error)
	// 	return( <div className="PhotoList loading">{error.message}</div>);

	return (
		<div className="PhotoList">
			{/* <h2>PhotoList...</h2>
			<p>
				rover.name="{rover.name}"
				cameraName="{cameraName}"
				earthDate (UTC) = "{earthDate}"
				photos?.length (# photos): {photos?.length}
			</p> */}
			<>
				{/* {loading ? <p className="loading" style={{color:"black"}}>Loading...</p> : ""} */}
				{/* {error ? <p className="loading" style={{color:"red"}}>{error.message}</p> : ""} */}
				<p>Number of images found: {photos.length}</p>
			</>
			{/* <p>dataURL: "{dataURL}"</p> */}
			<div>
				{ /* Don't show navigation buttons if on latest photos: */ }
				{/* location.pathname.indexOf("/photos") === -1 && */}
				{ pagination_buttons &&
				<>
					<DateFormButtons
						earthDate={earthDate}
						changeEarthDate={changeEarthDate}
						dateFirstButtonDisabled={dateFirstButtonDisabled}
						datePrevButtonDisabled={datePrevButtonDisabled}
						dateNextButtonDisabled={dateNextButtonDisabled}
						dateLastButtonDisabled={dateLastButtonDisabled}
						/>

					<PageFormButtons
						page={page}
						incrementPage={incrementPage}
						pagePrevButtonDisabled={pagePrevButtonDisabled}
						pageNextButtonDisabled={pageNextButtonDisabled}
						photosCount={photos?.length || 0}
						/>
				</>
				}
			</div>

			{ (loading === true)
					? <p className="loading" style={{color:"black"}}>Loading...</p>
					: (error !== undefined)
						? <p className="loading" style={{color:"red"}}>{error.message}<br />{dataURL}</p>
						: (photos.length === 0 && cameraName !== "")
							? <p className="loading" style={{color:"black"}}>No photos</p>
							: photos.map( (p,idx) => <Photo key={idx} photo={p} rover={rover} />)
			}
		</div>
		);	// end return
	};	// end PhotoList







function DateFormButtons({
		earthDate,
		changeEarthDate,
		dateFirstButtonDisabled,
		datePrevButtonDisabled,
		dateNextButtonDisabled,
		dateLastButtonDisabled,
		})
	{

	return (
		<form id="earth_date" style={{width:"fit-content", display:"inline-block"}}>
			<fieldset><legend>Earth Date {earthDate}</legend>
				<button
					type="button"
					value={earthDate}
					onClick={() => changeEarthDate("first")}
					disabled={dateFirstButtonDisabled}
					>
					First Day
				</button>
				<button
					type="button"
					value={earthDate}
					onClick={() => changeEarthDate(-1)}
					disabled={datePrevButtonDisabled}
					>
					Previous Day
				</button>
				<button
					type="button"
					value={earthDate}
					onClick={() => changeEarthDate(+1)}
					disabled={dateNextButtonDisabled}
					>
					Next Day
				</button>
				<button
					type="button"
					value={earthDate}
					onClick={() => changeEarthDate("last")}
					disabled={dateLastButtonDisabled}
					>
					Last Day
				</button>
			</fieldset>
		</form>
		);
	}	// end DateFormButtons






function PageFormButtons({
		page,
		incrementPage,
		pagePrevButtonDisabled,
		pageNextButtonDisabled,
		photosCount
		})
	{

	return (
		<form id="page" style={{width:"fit-content", display:"inline-block"}}>
			<fieldset>
				<legend>Page {page} ({photosCount} image{photosCount !== 1 ? "s" : ""})</legend>
				<button
					type="button"
					value={page}
					disabled={pagePrevButtonDisabled}
					onClick={() => incrementPage(-1)}
					>
					Previous Page
				</button>
				<button
					type="button"
					value={page}
					onClick={() => incrementPage(+1)}
					disabled={pageNextButtonDisabled}
					>
					Next Page
				</button>
			</fieldset>
		</form>
		)
	}	// end PageFormButtons
