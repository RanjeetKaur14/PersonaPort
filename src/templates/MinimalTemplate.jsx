function MinimalTemplate({ data }) {
  if (!data) return null;

  return (
    <main className="template">

      {/* HERO */}
      <section className="hero">
        <h1>{data.name}</h1>
        <p className="role">{data.role}</p>
        <p className="summary">{data.summary}</p>
        <a href="#projects" className="cta">View Projects</a>
      </section>

      {/* ABOUT */}
      <section className="about">
        <h2>About</h2>
        {data.about?.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </section>

      {/* SKILLS */}
      <section className="skills">
        <h2>Skills</h2>
        <div className="skills-grid">
          {data.skills?.map((group, i) => (
            <div key={i} className="skill-group">
              <h4>{group.title}</h4>
              <ul>
                {group.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects" id="projects">
        <h2>Projects</h2>
        {data.projects?.map((proj, i) => (
          <div key={i} className="project-card">
            <h4>{proj.title}</h4>
            <p>{proj.description}</p>
            <span>{proj.tech}</span>
          </div>
        ))}
      </section>

      {/* EDUCATION */}
      <section className="education">
        <h2>Education</h2>
        {data.education?.map((edu, i) => (
          <p key={i}>
            <b>{edu.degree}</b> — {edu.institute}
          </p>
        ))}
      </section>

    </main>
  );
}

export default MinimalTemplate;
