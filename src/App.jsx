import { useEffect, useMemo, useState } from "react";
import { profile, skills, projects } from "./data.js";

const tech = Object.values(skills).flat();
const NAV = ["about", "skills", "projects", "contact"];
const CMDS = {
  whoami: ["Ashish Tiwari", "B.Tech CSE, class of 2028"],
  "cat goal.txt": ["Software engineering internship", "then campus placements"],
  "ls skills/": Object.keys(skills).map((k) => k.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") + "/"),
};

const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function Terminal() {
  const [cmd, setCmd] = useState("whoami");
  const full = CMDS[cmd].join("\n");
  const [n, setN] = useState(0);
  useEffect(() => {
    if (still()) return setN(full.length);
    setN(0);
    const id = setInterval(() => setN((v) => (v >= full.length ? (clearInterval(id), v) : v + 1)), 28);
    return () => clearInterval(id);
  }, [full]);
  return (
    <div className="term" role="region" aria-label="Terminal profile panel">
      <div className="term-bar">
        {Object.keys(CMDS).map((c) => (
          <button key={c} className={c === cmd ? "on" : ""} onClick={() => setCmd(c)} aria-pressed={c === cmd}>{c}</button>
        ))}
      </div>
      <pre><span className="sr">{full}</span><span aria-hidden="true"><span className="prompt">$ </span>{cmd}{"\n"}{full.slice(0, n)}<span className="caret" /></span></pre>
    </div>
  );
}

function Contact() {
  return (
    <form action="https://formsubmit.co/ashishtiwari00003@gmail.com" method="POST">
      <input type="hidden" name="_subject" value="New portfolio message — Ashish Tiwari" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={window.location.href.split("#")[0] + "#contact?sent=1"} />
      <input type="text" name="_honey" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label>Name<input name="name" required maxLength={80} autoComplete="name" /></label>
      <label>Email<input type="email" name="email" required autoComplete="email" /></label>
      <label>Subject<input name="subject" required maxLength={120} /></label>
      <label>Message<textarea name="message" rows={5} required maxLength={2000} /></label>
      <button className="btn primary" type="submit">Send message</button>
      <p role="note" className="note">Messages are sent to my inbox using a form service. The first time, I may need to activate the form from an email.</p>
    </form>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("theme", theme); }, [theme]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach((id) => io.observe(document.getElementById(id)));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: 0.2 });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filter]);

  const filters = useMemo(() => ["All", ...new Set(projects.flatMap((p) => [p.category, ...p.tags]))], []);
  const shown = projects.filter((p) => filter === "All" || p.category === filter || p.tags.includes(filter));

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <a href="#top" className="logo" aria-label="Ashish Tiwari, home">AT</a>
        <button className="menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="links">{open ? "Close" : "Menu"}</button>
        <nav id="links" className={open ? "open" : ""} aria-label="Primary">
          {NAV.map((id) => <a key={id} href={"#" + id} onClick={() => setOpen(false)} aria-current={active === id ? "true" : undefined}>{id}</a>)}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? "Light" : "Dark"}</button>
        </nav>
      </header>

      <main id="main">
        <section id="top" className="hero">
          <p className="status"><span className="dot" />CS student, class of 2028</p>
          <h1 aria-label="Ashish Tiwari"><span className="line" aria-hidden="true"><span>Ashish Tiwari</span></span></h1>
          <p className="hero-tagline">I build things for the web.</p>
          <p className="lead">Computer Science student, problem solver, and aspiring software engineer. Learning deeply, building consistently, and turning ideas into useful products.</p>
          <div className="row">
            <a className="btn primary" href="#projects">Explore my work</a>
            <a className="btn" href={profile.resume} download>Download resume</a>
            <a className="link" href={profile.github} target="_blank" rel="noreferrer noopener">GitHub</a>
            <a className="link" href={profile.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>
          </div>
          <div className="heroside"><img className="portrait" src="/profile.png" alt="Ashish Tiwari profile photo" width="220" height="220" /><Terminal /></div>
        </section>

        <div className="marquee" aria-hidden="true"><div>{[...tech, ...tech].map((t, i) => <span key={i}>{t}</span>)}</div></div>
        <section id="about" className="split">
          <h2>A little about how I think.</h2>
          <div>
            <p>I'm a B.Tech Computer Science student building strong foundations in data structures, algorithms, programming and full-stack development. I like breaking a problem into small parts and choosing the right tool for each.</p>
            <p>I learn by building and practising regularly, and I'm looking for an internship where I can contribute and grow. I don't have professional experience yet, and this site says only what's true.</p>
            <dl className="facts">
              <dt>Degree</dt><dd>B.Tech CSE, 2028</dd>
              <dt>College</dt><dd>{profile.college}</dd>
              <dt>DSA language</dt><dd>C++</dd>
            </dl>
          </div>
        </section>

        <section id="skills">
          <h2>What I work with.</h2>
          {Object.entries(skills).map(([group, items]) => (
            <div className="skillrow" key={group}><h3>{group}</h3><ul>{items.map((s) => <li key={s}>{s}</li>)}</ul></div>
          ))}
        </section>

        <section id="projects">
          <h2>Projects.</h2>
          <p className="muted">Ideas and work in progress. Links appear once a repository or demo exists.</p>
          <div className="filters" role="group" aria-label="Filter projects">
            {filters.map((f) => <button key={f} className={f === filter ? "on" : ""} aria-pressed={f === filter} onClick={() => setFilter(f)}>{f}</button>)}
          </div>
          {shown.length === 0 && <p className="muted">No projects match this filter.</p>}
          {shown.map((p, i) => (
            <article className={"project v" + (i % 4)} key={p.id} data-reveal>
              <div className="preview"><img src={p.img} alt={`Illustration for ${p.title}`} width="800" height="600" loading="lazy" /></div>
              <div>
                <h3>{p.title} <small className="badge">{p.status}</small></h3>
                <p>{p.problem}</p>
                <ul className="feat">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                <p className="tags">{p.tags.join(", ")}</p>
                <p className="row">
                  {p.repo ? <a className="link" href={p.repo} rel="noopener">Repository</a> : <span className="muted">Repository: not yet published</span>}
                  {p.demo ? <a className="link" href={p.demo} rel="noopener">Live demo</a> : <span className="muted">Demo: not yet available</span>}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section id="contact" className="split">
          <div>
            <h2>Have an interesting opportunity?</h2>
            <p>I'm open to software engineering internships. Write to me here or directly.</p>
            <p><a className="link" href={"mailto:" + profile.email}>{profile.email}</a></p>
            <p className="row"><a className="link" href={profile.github} target="_blank" rel="noreferrer noopener">GitHub</a><a className="link" href={profile.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a></p>
          </div>
          <Contact />
        </section>
      </main>
      <footer>© {new Date().getFullYear()} Ashish Tiwari</footer>
    </>
  );
}
