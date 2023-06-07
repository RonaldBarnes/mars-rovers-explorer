
import { useState, useEffect, useCallback } from 'react';


export default function useAsync(callback, dependencies = [])
	{
	console.log(`%cuseAsync`, "color:lightblue");
console.log(`useAsync() dependencies: ${dependencies}`)

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const [value, setValue] = useState();

	const callbackMemoized = useCallback( () => {
console.log(`%cuseAsync MEMOIZED`, "color:lightblue");
		setLoading(true);
		setError(undefined);
		setValue(undefined);
		callback()
			.then(setValue)
			.catch(setError)
			.finally( () => setLoading(false))
		}, dependencies
		);	// end callbackMemoized


	useEffect( () => {
		callbackMemoized()
		}, [callbackMemoized]
		);

	return {loading, error, value};
	}
