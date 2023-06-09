import "./About.css";

// Set title bar - nice for looking at history:
document.title = "Mars Rovers: About";

export default function About() {
  return (
    <div id="about">
      <p>This web application derives data from the Mars Photo API maintained by chrisccerami.</p>
      <p>Explore the <a href="https://github.com/chrisccerami/mars-photo-api">official repository</a>.</p>
    </div>
  );
};