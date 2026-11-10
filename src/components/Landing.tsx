import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>HELLO, I&apos;m</h2>
            <h1>ASHISH</h1>
          </div>
          <div className="landing-info">
            <h3>Aspiring</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Full Stack</div>
              <div className="landing-h2-2">Web Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Web Developer</div>
              <div className="landing-h2-info-1">Full Stack</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
