import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Color, Mesh, Vector3 } from "three";

type Props = {
  position: Vector3;
};

function Box(props: Props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    const m = mesh.current as Mesh;
    m.rotation.x = m.rotation.y += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} color={new Color("red")}/>
      <pointLight position={[-10, -10, -10]} />
      <Box position={new Vector3(-1.2, 0, 0)} />
      <Box position={new Vector3(1.2, 0, 0)} />
    </Canvas>
  );
}
