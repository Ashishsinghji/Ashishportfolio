import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async (): Promise<GLTF> => {
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc",
        "Character3D#@"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

      return await new Promise<GLTF>((resolve, reject) => {
        loader.load(
          blobUrl,
          async (gltf) => {
            try {
              const character = gltf.scene;
              const skinColor = 0xc99572;
              const partColors = new Map([
                ["BODY.SHIRT", 0x123b66],
                ["Pant", 0x111111],
                ["Shoe", 0xffffff],
                ["Sole", 0xffffff],
                ["Ear", skinColor],
                ["Hand", skinColor],
                ["Neck", skinColor],
                ["Plane", 0xc99572],
              ]);
              character.traverse((child) => {
                if (!(child instanceof THREE.Mesh)) return;

                const color = partColors.get(child.name);
                if (color === undefined) return;

                const recolor = (material: THREE.Material) => {
                  const clonedMaterial = material.clone();
                  if (
                    "color" in clonedMaterial &&
                    clonedMaterial.color instanceof THREE.Color
                  ) {
                    clonedMaterial.color.setHex(color);
                  }
                  return clonedMaterial;
                };

                child.material = Array.isArray(child.material)
                  ? child.material.map(recolor)
                  : recolor(child.material);
              });
              await renderer.compileAsync(character, camera, scene);
              character.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  child.frustumCulled = true;
                }
              });
              resolve(gltf);
              setCharTimeline(character, camera);
              setAllTimeline();
              character.getObjectByName("footR")!.position.y = 3.36;
              character.getObjectByName("footL")!.position.y = 3.36;
              dracoLoader.dispose();
              URL.revokeObjectURL(blobUrl);
            } catch (error) {
              URL.revokeObjectURL(blobUrl);
              reject(error);
            }
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            URL.revokeObjectURL(blobUrl);
            reject(error);
          }
        );
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
