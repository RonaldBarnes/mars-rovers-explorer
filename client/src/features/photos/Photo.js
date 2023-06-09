export default function Photo({ source }) {
console.log(`Photo.js ${source}`)
  return (
    <>
      <img alt="Mars" src={source} />
    </>
  );
};