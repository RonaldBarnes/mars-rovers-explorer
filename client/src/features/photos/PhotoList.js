import React, { useState, useEffect, useCallback, useMemo } from "react";
// import usePhotoContext from "./usePhotoContext";
import Photo from "./Photo";
import useFetch from "../../hooks/useFetch";

import { API_URL } from "../../app/App";

import "./PhotoList.css";

// http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=1000&page=2
// http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?earth_date=2015-6-3
// http://mars-photos.herokuapp.com/api/v1/rovers/opportunity/photos?earth_date=2015-6-3&camera=pancam
// http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=1000


export default function PhotoList({
		cameraName = "?",
		rover
		})
	{
	// const photos = usePhotoContext();
console.log(`PhotoList.js rover.name: "${rover.name}" cameraName: "${cameraName}"`)
	const [page, setPage] = useState(1);
	const [earthDate, setEarthDate] = useState(rover.max_date);
	const [photos, setPhotos] = useState([]);
	const [dateNextButtonDisabled, setDateNextButtonDisabled] = useState(true);
	const [datePrevButtonDisabled, setDatePrevButtonDisabled] = useState(false);
	const [pagePrevButtonDisabled, setPagePrevButtonDisabled] = useState(true);
	const [pageNextButtonDisabled, setPageNextButtonDisabled] = useState(false);


	// One function to increment or decrement earthDate by one day:
	const incrementEarthDate = (d) => {
		// Date() uses LOCAL TIME interpretation for params: we need UTC
		let tmpEarthDate = yyyymmddToUtcDate(earthDate);
		// Increment by +1/-1 depending on button clicked:
		tmpEarthDate.setUTCDate( tmpEarthDate.getUTCDate() + d );

		let tmpMaxRoverDate = yyyymmddToUtcDate(rover.max_date);
		// No future dates allowed:
		if (tmpEarthDate >= tmpMaxRoverDate)
			{
			tmpEarthDate = tmpMaxRoverDate;
			setDateNextButtonDisabled( c => true);
			}
		else
			setDateNextButtonDisabled( c => false);

		// Create date string as yyyy-mm-dd from UTC elements:
		const newDate = `${tmpEarthDate.getUTCFullYear()}-`
			+ `${"0".concat(tmpEarthDate.getUTCMonth() + 1).slice(-2)}-`
			+ `${"0".concat(tmpEarthDate.getUTCDate()).slice(-2)}`
// console.log(`PhotoList.js newDate:"${newDate}" new earthDate:"${tmpEarthDate}"`)
		setEarthDate( old => newDate)

		// Reset page so no Page 3 on date with 1 page of photos:
		setPage( c => 1);
		setPagePrevButtonDisabled(c => true);
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
		if (page + p === 1)
			setPagePrevButtonDisabled(c => true);
		else
			setPagePrevButtonDisabled(c => false);
		setPage( c => c + p);
		}


	useEffect( () => {
		console.log(`PhotoList.js useEffect() cameraName:"${cameraName}"`)

		// No camera selected, no paging through dates
		if (cameraName === "?" || cameraName === "")
			{
			setDatePrevButtonDisabled(c => true);
			setDateNextButtonDisabled(c => true);
			}
		else
			{
			setDatePrevButtonDisabled(c => false);
			// setDateNextButtonDisabled(c => false);
			}


		// setEarthDate( d => `${tmpDate.getFullYear() - 1}-${tmpDate.getMonth()}-${tmpDate.getDate()}` );
		setDataURL( u =>
			`${API_URL}/rovers/${rover.name.toLowerCase()}/photos?earth_date=${earthDate}&camera=${cameraName.toLowerCase()}&page=${page}`);

// console.log(`dataURL="${dataURL}"`)

			// fetch(dataURL, {"Access-Control-Allow-Origin": "*"}, [earthDate, cameraName])
			fetch(`${API_URL}/rovers/${rover.name.toLowerCase()}/photos?earth_date=${earthDate}&camera=${cameraName.toLowerCase()}&page=${page}`,
					{"Access-Control-Allow-Origin": "*"}, [earthDate, cameraName])
				.then( res => {
					if (res.ok)
						{
						const json = res.json()
						return json;
						}
					// return res.ok === true ? res.json() : res.json().then(x => Promise.reject(x) )
					})
				.then( res2 => {
					console.log(`res2: #photos: ${res2.photos.length}`);
					// console.table(res2.photos);
					setPhotos( p => res2.photos);
					if (res2.photos.length === 0)
						// No photos, so disable Next Page button:
						setPageNextButtonDisabled( c => true);
					else
						// Re-enable Next Page button:
						setPageNextButtonDisabled( c => false);

console.log(`EARTHdate: "${earthDate}" rover.max_date: ${rover.max_date}`)
		if (earthDate === rover.max_date)
			{
console.log(`EARTHdate EQUALS: "${earthDate}" rover.max_date: ${rover.max_date}`)
			setDateNextButtonDisabled(c => true);
			}


					return res2
					})
				.catch( e => {console.log(`%cE R R O R: ${e.message}`, "color:red"); return e; })

			}, [earthDate, page, cameraName]);


	// let {loading, error, value} = useFetch(dataURL, {"Access-Control-Allow-Origin": "*"});
	let {loading, error, value} = {loading: true, error: undefined, value:undefined};


	const [dataURL, setDataURL] =
		useState( u => {
			if (earthDate !== "" && cameraName !== "" && loading === false)
				return `${API_URL}/rovers/${rover.name.toLowerCase()}/photos?earth_date=${earthDate}&camera=${cameraName.toLowerCase()}&page=${page}`;
			else
				return `${API_URL}/rovers/${rover.name.toLowerCase()}/photos?earth_date=${rover.max_date}&camera=${cameraName.toLowerCase()}&page=${page}`;
			})


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

	return (
		<div className="PhotoList">
			{/* { displayAllPhotos() } */}
			<h2>PhotoList...</h2>
			<p>
				rover.name="{rover.name}"
				cameraName="{cameraName}"
				earthDate (UTC) = "{earthDate}"
				photos?.length (# photos): {photos?.length}
			</p>
			{/* <p>API_URL: {API_URL}</p> */}
			<p>dataURL: "{dataURL}"</p>
			<div>
				<form id="earth_date" style={{width:"fit-content", display:"inline-block"}}>
					<fieldset><legend>Earth Date {earthDate}</legend>
						<button
							type="button"
							value={earthDate}
							onClick={() => incrementEarthDate(-1)}
							disabled={datePrevButtonDisabled}
							>
							Previous Day
						</button>
						<button
							type="button"
							value={earthDate}
							onClick={() => incrementEarthDate(+1)}
							disabled={dateNextButtonDisabled}
							>
							Next Day
						</button>
					</fieldset>
				</form>

				<form id="page" style={{width:"fit-content", display:"inline-block"}}>
					<fieldset>
						<legend>Page {page}</legend>
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
			</div>

			{/* <p>loading: "{loading.toString()}"</p>
			<p>error: "{error?.message}"</p>
			<p>value?.photos.length: {value?.photos.length}</p> */}
			{
				photos.map( (p,idx) => (
					<Photo photo={p} rover={rover} />
					))
			}
		</div>
		);	// end return
	};	// end PhotoList
