import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrthographicCamera } from "@react-three/drei";


// https://codesandbox.io/s/r3f-camera-transition-with-effects-green-flash-zonbb?file=/src/Camera.jsx

export default function Camera() {
    const perspectiveCam = useRef();
    const orthoCam = useRef();
    const { get, set } = useThree(({ get, set }) => ({ get, set }));

    useEffect(() => {
        const changeView = () => {
            if (get().camera.name === "2d") {
                set({ camera: perspectiveCam.current });
            } else {
                set({ camera: orthoCam.current });
                orthoCam.current.lookAt(0, 0, 0);
            }
        };
        changeView();

        window.addEventListener("keyup", changeView);
        return () => window.removeEventListener("keyup", changeView);
    }, [get, set]);

    return (
        <>
            <PerspectiveCamera
                name="3d"
                ref={perspectiveCam}
                position={[-80, 60, 100]}
                fov={80}
            />
            <OrthographicCamera
                name="2d"
                ref={orthoCam}
                position={[-60,12, 0]}
                rotation={[0,-90,0]}
                fov={0}
                scale={[0.15,0.15,0.15]}
                near={-1000}
                far={1000}
            />
        </>
    );
}