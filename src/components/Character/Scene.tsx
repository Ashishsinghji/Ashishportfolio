import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setSceneReady } = useLoading();

  useEffect(() => {
    const canvasElement = canvasDiv.current;
    if (canvasElement) {
      const rect = canvasElement.getBoundingClientRect();
      const container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      const getPixelRatio = () =>
        Math.min(
          window.devicePixelRatio || 1,
          window.innerWidth < 768 ? 1 : 1.25
        );
      renderer.setPixelRatio(getPixelRatio());
      renderer.setSize(container.width, container.height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasElement.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight:
        | THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
        | null = null;
      let mixer: THREE.AnimationMixer;
      let character: THREE.Object3D | null = null;
      let animationFrameId: number | null = null;
      let frameInterval = window.innerWidth < 768 ? 1000 / 30 : 1000 / 45;
      let lastFrameTime = 0;
      let introTimeout: number | undefined;
      let touchMoveListener: ((event: TouchEvent) => void) | undefined;
      let disposed = false;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf && !disposed) {
          const animations = setAnimations(gltf);
          if (hoverDivRef.current) {
            animations.hover(gltf, hoverDivRef.current);
          }
          mixer = animations.mixer;
          character = gltf.scene;
          scene.add(character);
          setSceneReady();
          headBone = character.getObjectByName("spine006") || null;
          const screenLightObject = character.getObjectByName("screenlight");
          screenLight =
            screenLightObject instanceof THREE.Mesh &&
            screenLightObject.material instanceof THREE.MeshStandardMaterial
              ? screenLightObject
              : null;
          introTimeout = window.setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
          window.addEventListener("resize", onResize);
          if (!document.hidden) {
            clock.start();
            animate(performance.now());
          }
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const landingDiv = document.getElementById("landingDiv");
      const onTouchStart = () => {
        if (!landingDiv) return;
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          touchMoveListener = (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }));
          landingDiv.addEventListener("touchmove", touchMoveListener);
        }, 200);
      };

      const onTouchEnd = () => {
        clearTimeout(debounce);
        if (touchMoveListener) {
          landingDiv?.removeEventListener("touchmove", touchMoveListener);
          touchMoveListener = undefined;
        }
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      const onDocumentMouseMove = (event: MouseEvent) => onMouseMove(event);
      const onResize = () => {
        frameInterval = window.innerWidth < 768 ? 1000 / 30 : 1000 / 45;
        renderer.setPixelRatio(getPixelRatio());
        if (character) {
          handleResize(renderer, camera, canvasDiv, character);
        }
      };
      document.addEventListener("mousemove", onDocumentMouseMove);
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = (time: number) => {
        if (document.hidden) {
          animationFrameId = null;
          return;
        }
        animationFrameId = requestAnimationFrame(animate);
        if (time - lastFrameTime < frameInterval) return;
        lastFrameTime = time;
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          if (screenLight) {
            light.setPointLight(screenLight);
          }
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      const onVisibilityChange = () => {
        if (document.hidden) {
          if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        } else if (animationFrameId === null) {
          if (character) {
            clock.start();
            animate(performance.now());
          }
        }
      };
      document.addEventListener("visibilitychange", onVisibilityChange);
      return () => {
        disposed = true;
        clearTimeout(debounce);
        clearTimeout(introTimeout);
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
        document.removeEventListener("visibilitychange", onVisibilityChange);
        document.removeEventListener("mousemove", onDocumentMouseMove);
        window.removeEventListener("resize", onResize);
        if (touchMoveListener) {
          landingDiv?.removeEventListener("touchmove", touchMoveListener);
        }
        scene.clear();
        renderer.dispose();
        if (canvasElement.contains(renderer.domElement)) {
          canvasElement.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, [setSceneReady]);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
