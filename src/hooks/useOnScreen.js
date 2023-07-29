
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
				// Keep observers to have images animate back to .offScreen:
				// observer.unobserve(ref.current);
				// observer.disconnect(ref.current);
				setIsVisible(c => true);
				}
			else
				{
				setIsVisible(c => false);
				}
			}, options
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






export function useOnScreenIntersectionRatio(
		ref,
		options = { root: null }
		)
	{
	const [visibleRatio, setVisibleRatio] = useState(0);

	useLayoutEffect( () => {
		if (ref.current == null) return;

		const observer = new IntersectionObserver( ([entry]) => {
			setVisibleRatio(c => entry.intersectionRatio);
			return entry.intersectionRatio;
			});	// end observer


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

	return visibleRatio;
	}	// end function useOnScreenIntersectionRatio
