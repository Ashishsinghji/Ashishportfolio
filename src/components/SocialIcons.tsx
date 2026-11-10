import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span onMouseMove={handleSocialIconMove}>
          <a href="https://github.com" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span onMouseMove={handleSocialIconMove}>
          <a href="https://www.linkedin.com" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span onMouseMove={handleSocialIconMove}>
          <a href="https://x.com" target="_blank">
            <FaXTwitter />
          </a>
        </span>
        <span onMouseMove={handleSocialIconMove}>
          <a href="https://www.instagram.com" target="_blank">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a className="resume-button" href="#">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

function handleSocialIconMove(event: React.MouseEvent<HTMLSpanElement>) {
  const icon = event.currentTarget;
  const link = icon.querySelector("a");
  if (!link) return;

  const rect = icon.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const withinMagnetArea = x < 40 && x > 10 && y < 40 && y > 5;

  link.style.setProperty(
    "--siOffsetX",
    `${(withinMagnetArea ? x : rect.width / 2) - rect.width / 2}px`
  );
  link.style.setProperty(
    "--siOffsetY",
    `${(withinMagnetArea ? y : rect.height / 2) - rect.height / 2}px`
  );
}

export default SocialIcons;
