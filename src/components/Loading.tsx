import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import Marquee from "react-fast-marquee";

const Loading = ({ percent }: { percent: number }) => {
  const { isSceneReady, setIsLoading, setLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => setProgress(setLoading), [setLoading]);

  useEffect(() => {
    if (percent < 100 || !isSceneReady) return;

    setLoaded(true);
    const completionTimeout = window.setTimeout(() => {
      setIsLoaded(true);
    }, 250);
    return () => clearTimeout(completionTimeout);
  }, [isSceneReady, percent]);

  useEffect(() => {
    let loadingTimeout: number | undefined;
    import("./utils/initialFX").then((module) => {
      if (isLoaded) {
        setClicked(true);
        loadingTimeout = window.setTimeout(() => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        }, 900);
      }
    });
    return () => clearTimeout(loadingTimeout);
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          ASHISH
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <Marquee>
            <span>ASHISH</span> <span>FULL STACK WEB DEVELOPER</span>
            <span>ASHISH</span> <span>FULL STACK WEB DEVELOPER</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  const duration = 3000;
  const startedAt = performance.now();
  let percent = 0;
  let frameId = 0;

  const updateProgress = (now: number) => {
    const elapsed = Math.max(0, now - startedAt);
    const nextPercent = Math.min(100, Math.floor((elapsed / duration) * 20) * 5);

    if (nextPercent !== percent) {
      percent = nextPercent;
      setLoading(percent);
    }

    if (percent === 100) return;
    frameId = requestAnimationFrame(updateProgress);
  };
  frameId = requestAnimationFrame(updateProgress);

  return () => cancelAnimationFrame(frameId);
};
