import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    let hoveringIcons = false;
    let frameId = 0;
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    const animate = () => {
      cursorX += (targetX - cursorX) / 6;
      cursorY += (targetY - cursorY) / 6;
      setX(cursorX);
      setY(cursorY);

      if (Math.abs(targetX - cursorX) > 0.1 || Math.abs(targetY - cursorY) > 0.1) {
        frameId = requestAnimationFrame(animate);
      } else {
        cursorX = targetX;
        cursorY = targetY;
        setX(cursorX);
        setY(cursorY);
        frameId = 0;
      }
    };

    const requestAnimation = () => {
      if (!frameId) frameId = requestAnimationFrame(animate);
    };

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!hoveringIcons) {
        targetX = mouseX;
        targetY = mouseY;
        requestAnimation();
      }
    };

    const cursorTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cursor]")
    );
    const onTargetEnter = (event: MouseEvent) => {
      const element = event.currentTarget as HTMLElement;
      if (element.dataset.cursor === "icons") {
        const rect = element.getBoundingClientRect();
        cursor.classList.add("cursor-icons");
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        targetX = rect.left;
        targetY = rect.top;
        hoveringIcons = true;
        requestAnimation();
      } else if (element.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };
    const onTargetLeave = () => {
      cursor.classList.remove("cursor-disable", "cursor-icons");
      hoveringIcons = false;
      targetX = mouseX;
      targetY = mouseY;
      requestAnimation();
    };

    document.addEventListener("mousemove", onMouseMove);
    cursorTargets.forEach((element) => {
      element.addEventListener("mouseover", onTargetEnter);
      element.addEventListener("mouseout", onTargetLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cursorTargets.forEach((element) => {
        element.removeEventListener("mouseover", onTargetEnter);
        element.removeEventListener("mouseout", onTargetLeave);
      });
      cancelAnimationFrame(frameId);
      gsap.set(cursor, { clearProps: "transform" });
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
