import { MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:kumarashishsingh2004@gmail.com">
                kumarashishsingh2004@gmail.com
              </a>
            </p>
            <h4>LinkedIn</h4>
            <p>
              <a
                href="https://www.linkedin.com/in/ashish-16b75a407?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ashish&apos;s LinkedIn profile
              </a>
            </p>
            <h4>Location</h4>
            <p>Bokaro, Jharkhand</p>
            <h4>Opportunity</h4>
            <p>Seeking an entry-level opportunity in IT</p>
          </div>
          <div className="contact-box">
            <h4>Languages</h4>
            <p>English, Hindi</p>
            <h4>Strengths</h4>
            <p>Quick learner, hardworking, positive attitude, team player</p>
          </div>
          <div className="contact-box">
            <h2>
              Portfolio of <span>Ashish</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
