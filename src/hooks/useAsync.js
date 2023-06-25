
import { useState, useEffect, useCallback } from 'react';


export default function useAsync(callbackFn, dependencies = [])
	{
	console.log(`%cuseAsync`, "color:lightblue");
console.log(`useAsync() dependencies: ${dependencies} isArray: ${Array.isArray(dependencies)}`)

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const [value, setValue] = useState();

	const callbackMemoized = useCallback( () => {
		console.log(`%cuseAsync MEMOIZED`, "color:lightblue");
		setLoading(true);
		setError(undefined);
		setValue(undefined);
		callbackFn()
			.then(setValue)
			.catch(setError)
			.finally( () => setLoading(false))
			// eslint complains: dependencies is not an array literal.
			// It is, however, an array and placing inside [] causes infinite re-renders.
			//
			// eslint complains: callbackFn is not a dependency, yet adding it causes
			// looping re-renders:
			//
			// Line 27:6:  React Hook useCallback has a missing dependency: 'callbackFn'.
			// Either include it or remove the dependency array. If 'callbackFn' changes
			// too often, find the parent component that defines it and wrap that definition
			// in useCallback  react-hooks/exhaustive-deps
		}, dependencies//, callbackFn]	// , ]
		);	// end callbackMemoized


	useEffect( () => {
		callbackMemoized()
		}, [callbackMemoized]
		);

	return {loading, error, value};
	}
