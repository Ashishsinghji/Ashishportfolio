import "./styles/Work.css";

const projects = [
  {
    name: "SkillScan",
    category: "Resume Analyzer System",
    description:
      "A web-based resume analysis system that helps students, graduates, and job seekers understand the strengths and weaknesses of their resumes before applying for jobs.",
    tools: "MongoDB, Express.js, React.js, Node.js",
  },
  {
    name: "Hospital Management System",
    category: "Healthcare Platform",
    description:
      "An online platform developed to connect patients with doctors, built as a responsive web application using the MERN stack.",
    tools: "MongoDB, Express.js, React.js, Node.js",
  },
];

const Work = () => {
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Projects</span>
        </h2>
        <div className="work-flex">
          {projects.map(({ name, category, description, tools }, index) => (
            <article className="work-box" key={name}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{name}</h4>
                    <p>{category}</p>
                  </div>
                </div>
                <h4>Overview</h4>
                <p>{description}</p>
                <h4 className="project-tools-title">Built with</h4>
                <p>{tools}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
