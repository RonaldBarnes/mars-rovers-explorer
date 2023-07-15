
import { useLayoutEffect, useState } from "react";


export default function useOnScreen(
		ref,
		options = { rootMargin: "-100px", threshold: 1, root: null }
		)
	{
	// console.log(`%cuseOnScreen options: ${options} ref.current: ${ref.current}`, "color:lightblue");
	// console.log(options);

	const [isVisible, setIsVisible] = useState(false);

	// When visible:
	// NB: useEffect caused "errors" where .unobserve claimed entry was not an object:
	// "IntersectionObserver.unobserve: Argument 1 is not an object."
	useLayoutEffect( () => {
		if (ref.current == null) return;

		const observer = new IntersectionObserver( ([entry]) => {
			if (entry.isIntersecting)
				{
				observer.unobserve(ref.current);
				observer.disconnect(ref.current);
				setIsVisible(true);
				}}, options
			);	// end observer


		// Observe the HTML element pointed to via ref:
		observer.observe(ref.current);

		// Cleanup callback:
		return () => {
			if (ref.current == null) return;
			observer.unobserve(ref.current);
			observer.disconnect(ref.current);
			}
		//	}, [ref.current, rootMargin]
		}, [ref.current, options]
		);	// end useEffect

	return isVisible;
	}	// end function useOnScreen
