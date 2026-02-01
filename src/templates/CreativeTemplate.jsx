import "./creative.css";

const CreativeTemplate = ({ data }) => {
  return (
    <main className="wrapper">
      {/* HERO */}
      <section className="hero">
        <h1>
          {data.heroTitleLine1} <br />
          {data.heroTitleLine2}
        </h1>

        <p>{String(data.heroDescription ?? "")}</p>

        <div className="meta">{data.heroMeta}</div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto">
        <h3>How I Think</h3>
        {Array.isArray(data.manifesto) &&
          data.manifesto.map((para, i) => (
            <p key={i}>{String(para ?? "")}</p>

        ))}

      </section>

      {/* PROJECTS */}
      <section>
        {Array.isArray(data.projects) &&
          data.projects.map((project, i) => (
            <div className="project-story" key={i}>
              <h4>{project.title}</h4>
              <p>{String(project.description ?? "")}</p>

              <div className="details">{project.details}</div>
            </div>
        ))}

      </section>

      {/* SKILLS */}
      <section className="skills">
        <h3>What I Work With</h3>
        <p>{String(data.skills ?? "")}</p>

      </section>

      {/* FOOTER */}
      <footer>
        <a href={`mailto:${data.contact.email}`}>Email</a>
        <a href={data.contact.github}>GitHub</a>
        <a href={data.contact.linkedin}>LinkedIn</a>
      </footer>
    </main>
  );
};

export default CreativeTemplate;
