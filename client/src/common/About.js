import "./About.css";

export default function About() {
  // Set title bar - nice for looking at history:
  document.title = "Mars Rovers: About";

  return (
    <div id="about">
      <p>This web application derives data from the Mars Photo API maintained by chrisccerami.</p>
      <p>Explore the <a href="https://github.com/chrisccerami/mars-photo-api">official repository</a>.</p>
      <p>
        This project was forked from Peyton's at {" "}
        <a
          href="https://github.com/pekellogg/react-app"
          target="_blank"
          rel="noreferrer"
          >
          her Github repo
        </a>.
      </p>
      <hr />
      <figure style={{textAlign:"center"}}>
        <figcaption style={{marginBottom:"1rem"}}>
          <a href="https://xkcd.com/695/"
            target="_blank"
            rel="noreferrer"
            >
            Obligatory xkcd
          </a> entitled "<b><i>Spirit</i></b>" (a Very Good Rover):
        </figcaption>
        <img src="https://imgs.xkcd.com/comics/spirit.png"
          alt="XKCD: Mars Rover Spirit: A Good Rover"
          style={{maxWidth:"75vw"}}
          />
      </figure>
    </div>
  );
};
