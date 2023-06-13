// export default function PhotoFUCKYOU({ source, photo }) {
export default function Photo({ source, photo })
	{
	console.log(`Photo.js ${source}`)

	const imageInfo = `Image Info:
	Earth Date: ${photo.earth_date}
	Sol: ${photo.sol}
	Camera: ${photo.camera.full_name}
	Rover: ${photo.rover.name}
	photo id: ${photo.id}`;

	return (
		<div className="Photo">
			<figure>
			<img
				alt={imageInfo}
				src={photo.img_src}
				title={imageInfo}
				/>
			<figcaption>{photo.earth_date} #{photo.id}</figcaption>
			</figure>
		</div>
		);
	};
