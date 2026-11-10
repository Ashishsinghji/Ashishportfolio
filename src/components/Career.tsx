import "./styles/Career.css";

const Career = () => {
  const experience = [
    {
      role: "Bachelor of Computer Applications",
      organization: "Graduation",
      period: "2023 - 2026",
      description: "BCA graduate with a foundation in computer applications and IT.",
    },
    {
      role: "Full Stack Web Development",
      organization: "Ardent Pvt. Ltd. | Kolkata, West Bengal",
      period: "Internships",
      description: "Completed internship in full stack web development using the MERN stack.",
    },
    {
      role: "12th (Intermediate)",
      organization: "Education",
      period: "2023",
      description: "Scored 65.6%.",
    },
    {
      role: "10th (Matriculate)",
      organization: "Education",
      period: "2021",
      description: "Scored 80.83%.",
    },
  ];

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Education <span>&</span>
          <br /> Internships
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {experience.map(({ role, organization, period, description }) => (
            <div className="career-info-box" key={role}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{role}</h4>
                  <h5>{organization}</h5>
                </div>
                <h3>{period}</h3>
              </div>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
