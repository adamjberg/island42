import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "react-three-fiber";
import { Color, Euler, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function useKeyPress(targetKey: string) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function downHandler({ key }: KeyboardEvent) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

type CameraProps = {
  position: Vector3;
};

function Camera(props: CameraProps) {
  const ref = useRef<PerspectiveCamera>();
  const normal = useState(new Vector3());
  const strafeLeftPress = useKeyPress("a")
  const strafeRightPress = useKeyPress("d")
  const forwardPress = useKeyPress("w")
  const backwardPress = useKeyPress("s")

  const { setDefaultCamera } = useThree();
  // Make the camera known to the system
  useEffect(() => void setDefaultCamera(ref.current as PerspectiveCamera));
  // Update it every frame
  useFrame(({ mouse }) => {
    const camera = ref.current as PerspectiveCamera
    const cameraSpeed = 0.05

    let xDirection = 0
    if (strafeLeftPress) {
      xDirection = -1
    } else if (strafeRightPress) {
      xDirection = 1
    }

    let zDirection = 0
    if (forwardPress) {
      zDirection = -1
    } else if (backwardPress) {
      zDirection = 1
    }

    const rotationVector = new Vector3(mouse.y, -mouse.x, 0);

    camera.translateX(cameraSpeed * xDirection)
    camera.translateZ(cameraSpeed * zDirection)
    camera.quaternion.set(rotationVector.x, rotationVector.y, rotationVector.z, 1)
    
    ref.current?.updateMatrixWorld()
  });

  return <perspectiveCamera ref={ref} {...props} />;
}

function CyberTruck() {
  const { scene } = useLoader(GLTFLoader, "models/cybertruck/cybertruck.glb");

  return <primitive object={scene} rotation={new Euler(0, 0, 0)} />;
}

export default function App() {
  return (
    <Canvas>
      <Camera position={new Vector3(0, 0, 7)} />
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        color={new Color("red")}
      />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={null}>
        <CyberTruck />
      </Suspense>
    </Canvas>
  );
}
