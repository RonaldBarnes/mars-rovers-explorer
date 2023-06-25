
import useAsync from "./useAsync";


export default function useFetch(url, options = {}, dependencies = [])
	{
	console.log(`%cuseFetch URL: ${url}`, "color:lightblue");
console.log(`useFetch(): dependencies: ${dependencies}`)

	const DEFAULT_OPTIONS = "Header: text/json";

	return useAsync( () => {
		return fetch(url, { ...DEFAULT_OPTIONS, ...options})
			.then(res => {
				if (res.ok) return res.json();
				return res.json().then(json => Promise.reject(json))
				})	// end .then
		}, dependencies);	// end useAsync
	}	// end useFetch
