"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Canvas } from "@react-three/fiber";

import {
  ContactShadows,
  OrbitControls,
  PerformanceMonitor,
  useGLTF,
} from "@react-three/drei";

import {
  Box3,
  FrontSide,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
} from "three";

/* ========================================================= */
/* TIPOS */
/* ========================================================= */

type Shirt3DProps = {
  color?: string;
  frontDesign?: string;
  backDesign?: string;
};

type ShirtModelProps = {
  color: string;
  frontDesign?: string;
  backDesign?: string;
};

/* ========================================================= */
/* CONFIGURACIÓN */
/* ========================================================= */

/*
 * Regresamos la playera exactamente
 * a la escala que ya funcionaba bien.
 *
 * Ya no hacemos desplazamientos
 * especiales para Android.
 *
 * El problema estaba en el layout.
 */
const MODEL_SCALE = 2.65;

/* ========================================================= */
/* ÁREA DE IMPRESIÓN */
/* ========================================================= */

const PRINT_WIDTH = 0.68;
const PRINT_HEIGHT = 0.76;

const FRONT_PRINT_POINT =
  new Vector3(
    0,
    1.37,
    0.17
  );

const BACK_PRINT_POINT =
  new Vector3(
    0,
    1.37,
    -0.17
  );

/* ========================================================= */
/* COLOR VISUAL */
/* ========================================================= */

function getDisplayColor(
  color: string
) {
  const normalized =
    color.toLowerCase();

  /*
   * Negro ligeramente levantado
   * para que se distingan los
   * detalles en pantallas oscuras.
   */
  if (
    normalized === "#111111" ||
    normalized === "#000000"
  ) {
    return "#1c1c1f";
  }

  return color;
}

/* ========================================================= */
/* TEXTURA DINÁMICA */
/* ========================================================= */

function useDynamicTexture(
  image?: string
) {
  const [
    texture,
    setTexture,
  ] =
    useState<Texture | null>(
      null
    );

  const currentTextureRef =
    useRef<Texture | null>(
      null
    );

  useEffect(() => {
    if (!image) {
      currentTextureRef.current?.dispose();

      currentTextureRef.current =
        null;

      setTexture(null);

      return;
    }

    let cancelled = false;

    const loader =
      new TextureLoader();

    loader.load(
      image,

      (
        loadedTexture
      ) => {
        if (cancelled) {
          loadedTexture.dispose();

          return;
        }

        loadedTexture.colorSpace =
          SRGBColorSpace;

        loadedTexture.needsUpdate =
          true;

        currentTextureRef.current?.dispose();

        currentTextureRef.current =
          loadedTexture;

        setTexture(
          loadedTexture
        );
      },

      undefined,

      (error) => {
        console.error(
          "No fue posible cargar el diseño en la playera 3D:",
          error
        );
      }
    );

    return () => {
      cancelled = true;
    };
  }, [image]);

  useEffect(() => {
    return () => {
      currentTextureRef.current?.dispose();
    };
  }, []);

  return texture;
}

/* ========================================================= */
/* SUPERFICIE CURVA DE IMPRESIÓN */
/* ========================================================= */

function createPrintGeometry() {
  const geometry =
    new PlaneGeometry(
      PRINT_WIDTH,
      PRINT_HEIGHT,
      24,
      24
    );

  const positions =
    geometry.attributes.position;

  const halfWidth =
    PRINT_WIDTH / 2;

  for (
    let index = 0;
    index <
    positions.count;
    index += 1
  ) {
    const x =
      positions.getX(
        index
      );

    const normalizedX =
      Math.min(
        Math.abs(x) /
          halfWidth,
        1
      );

    /*
     * Curvatura suave para seguir
     * el volumen del pecho.
     */
    const curve =
      -0.045 *
      normalizedX *
      normalizedX;

    positions.setZ(
      index,
      curve
    );
  }

  positions.needsUpdate =
    true;

  geometry.computeVertexNormals();

  return geometry;
}

/* ========================================================= */
/* PLAYERA */
/* ========================================================= */

function ShirtModel({
  color,
  frontDesign,
  backDesign,
}: ShirtModelProps) {
  const { scene } =
    useGLTF(
      "/models/playera.glb"
    );

  const frontTexture =
    useDynamicTexture(
      frontDesign
    );

  const backTexture =
    useDynamicTexture(
      backDesign
    );

  const displayColor =
    useMemo(
      () =>
        getDisplayColor(
          color
        ),
      [color]
    );

  /* ======================================================= */
  /* CLONAR MODELO */
  /* ======================================================= */

  const shirtScene =
    useMemo(() => {
      const clone =
        scene.clone(true);

      clone.traverse(
        (object) => {
          if (
            !(
              object instanceof
              Mesh
            )
          ) {
            return;
          }

          object.castShadow =
            true;

          object.receiveShadow =
            true;

          if (
            Array.isArray(
              object.material
            )
          ) {
            object.material =
              object.material.map(
                (
                  material
                ) =>
                  material.clone()
              );
          } else {
            object.material =
              object.material.clone();
          }
        }
      );

      return clone;
    }, [scene]);

  /* ======================================================= */
  /* CENTRO DEL MODELO */
  /* ======================================================= */

  const modelCenter =
    useMemo(() => {
      shirtScene.updateMatrixWorld(
        true
      );

      const box =
        new Box3().setFromObject(
          shirtScene
        );

      return box.getCenter(
        new Vector3()
      );
    }, [shirtScene]);

  /* ======================================================= */
  /* CENTRAR PLAYERA */
  /* ======================================================= */

  const centeredPosition =
    useMemo(
      () =>
        new Vector3(
          -modelCenter.x *
            MODEL_SCALE,

          -modelCenter.y *
            MODEL_SCALE,

          -modelCenter.z *
            MODEL_SCALE
        ),
      [modelCenter]
    );

  /* ======================================================= */
  /* POSICIÓN FRENTE */
  /* ======================================================= */

  const frontPrintPosition =
    useMemo(() => {
      return new Vector3(
        (
          FRONT_PRINT_POINT.x -
          modelCenter.x
        ) * MODEL_SCALE,

        (
          FRONT_PRINT_POINT.y -
          modelCenter.y
        ) * MODEL_SCALE,

        (
          FRONT_PRINT_POINT.z -
          modelCenter.z
        ) * MODEL_SCALE
      );
    }, [modelCenter]);

  /* ======================================================= */
  /* POSICIÓN ESPALDA */
  /* ======================================================= */

  const backPrintPosition =
    useMemo(() => {
      return new Vector3(
        (
          BACK_PRINT_POINT.x -
          modelCenter.x
        ) * MODEL_SCALE,

        (
          BACK_PRINT_POINT.y -
          modelCenter.y
        ) * MODEL_SCALE,

        (
          BACK_PRINT_POINT.z -
          modelCenter.z
        ) * MODEL_SCALE
      );
    }, [modelCenter]);

  /* ======================================================= */
  /* GEOMETRÍA ESTAMPADO */
  /* ======================================================= */

  const printGeometry =
    useMemo(
      () =>
        createPrintGeometry(),
      []
    );

  useEffect(() => {
    return () => {
      printGeometry.dispose();
    };
  }, [printGeometry]);

  /* ======================================================= */
  /* MATERIAL */
  /* ======================================================= */

  useEffect(() => {
    shirtScene.traverse(
      (object) => {
        if (
          !(
            object instanceof
            Mesh
          )
        ) {
          return;
        }

        const updateMaterial =
          (
            material: unknown
          ) => {
            if (
              !(
                material instanceof
                MeshStandardMaterial
              )
            ) {
              return;
            }

            material.color.set(
              displayColor
            );

            /*
             * Estos valores son los
             * que hicieron que la
             * playera negra se viera
             * correctamente en Huawei.
             */
            material.roughness =
              0.62;

            material.metalness =
              0.03;

            material.envMapIntensity =
              1.1;

            material.needsUpdate =
              true;
          };

        if (
          Array.isArray(
            object.material
          )
        ) {
          object.material.forEach(
            updateMaterial
          );
        } else {
          updateMaterial(
            object.material
          );
        }
      }
    );
  }, [
    shirtScene,
    displayColor,
  ]);

  return (
    <>
      {/* ================================================= */}
      {/* PLAYERA */}
      {/* ================================================= */}

      <primitive
        object={
          shirtScene
        }
        scale={
          MODEL_SCALE
        }
        position={
          centeredPosition
        }
      />

      {/* ================================================= */}
      {/* FRENTE */}
      {/* ================================================= */}

      {frontTexture && (
        <mesh
          position={
            frontPrintPosition
          }
          geometry={
            printGeometry
          }
          renderOrder={
            10
          }
        >
          <meshBasicMaterial
            map={
              frontTexture
            }
            transparent
            opacity={1}
            alphaTest={
              0.01
            }
            depthWrite={
              false
            }
            depthTest
            side={
              FrontSide
            }
            toneMapped={
              false
            }
            polygonOffset
            polygonOffsetFactor={
              -4
            }
          />
        </mesh>
      )}

      {/* ================================================= */}
      {/* ESPALDA */}
      {/* ================================================= */}

      {backTexture && (
        <mesh
          position={
            backPrintPosition
          }
          rotation={[
            0,
            Math.PI,
            0,
          ]}
          geometry={
            printGeometry
          }
          renderOrder={
            10
          }
        >
          <meshBasicMaterial
            map={
              backTexture
            }
            transparent
            opacity={1}
            alphaTest={
              0.01
            }
            depthWrite={
              false
            }
            depthTest
            side={
              FrontSide
            }
            toneMapped={
              false
            }
            polygonOffset
            polygonOffsetFactor={
              -4
            }
          />
        </mesh>
      )}
    </>
  );
}

/* ========================================================= */
/* LOADING */
/* ========================================================= */

function LoadingShirt() {
  return (
    <mesh>
      <sphereGeometry
        args={[
          0.08,
          20,
          20,
        ]}
      />

      <meshStandardMaterial
        color="#dc2626"
      />
    </mesh>
  );
}

/* ========================================================= */
/* VISOR */
/* ========================================================= */

export default function Shirt3D({
  color = "#111111",
  frontDesign,
  backDesign,
}: Shirt3DProps) {
  const [
    dpr,
    setDpr,
  ] =
    useState(1.25);

  const [
    lowPerformance,
    setLowPerformance,
  ] =
    useState(false);

  return (
    <div className="relative h-full min-h-[560px] w-full min-w-0 overflow-hidden bg-[radial-gradient(circle_at_center,#2a2a2a_0%,#151515_42%,#0b0b0b_100%)]">
      {/* ================================================= */}
      {/* INFORMACIÓN */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute left-5 top-5 z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
          Vista 3D
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          Arrastra para rotar
        </p>
      </div>

      <div className="pointer-events-none absolute right-5 top-5 z-10 rounded-full border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
          3D interactivo
        </p>
      </div>

      {/* ================================================= */}
      {/* THREE */}
      {/* ================================================= */}

      <Canvas
        shadows={
          !lowPerformance
        }
        dpr={dpr}
        camera={{
          position: [
            0,
            0,
            4.2,
          ],

          fov: 29,

          near: 0.1,

          far: 100,
        }}
        gl={{
          antialias:
            true,

          alpha:
            true,

          powerPreference:
            "high-performance",
        }}
      >
        {/* ================================================= */}
        {/* PERFORMANCE */}
        {/* ================================================= */}

        <PerformanceMonitor
          flipflops={3}
          onIncline={() => {
            setDpr(
              1.5
            );

            setLowPerformance(
              false
            );
          }}
          onDecline={() => {
            setDpr(
              1
            );

            setLowPerformance(
              true
            );
          }}
          onFallback={() => {
            setDpr(
              1
            );

            setLowPerformance(
              true
            );
          }}
        />

        {/* ================================================= */}
        {/* ILUMINACIÓN */}
        {/* ================================================= */}

        <ambientLight
          intensity={
            2.2
          }
        />

        <hemisphereLight
          intensity={
            1.8
          }
          color="#ffffff"
          groundColor="#1a1a1a"
        />

        <directionalLight
          position={[
            3,
            4,
            4,
          ]}
          intensity={
            4.8
          }
          castShadow={
            !lowPerformance
          }
        />

        <directionalLight
          position={[
            -4,
            2,
            -3,
          ]}
          intensity={
            3
          }
          color="#dbeafe"
        />

        <pointLight
          position={[
            -3,
            1,
            3,
          ]}
          intensity={
            22
          }
          distance={
            9
          }
          decay={
            2
          }
          color="#ffffff"
        />

        <pointLight
          position={[
            3,
            1,
            2,
          ]}
          intensity={
            12
          }
          distance={
            8
          }
          decay={
            2
          }
          color="#ffffff"
        />

        <pointLight
          position={[
            0,
            3,
            -2,
          ]}
          intensity={
            10
          }
          distance={
            8
          }
          decay={
            2
          }
          color="#f5f5f5"
        />

        <directionalLight
          position={[
            0,
            2,
            -4,
          ]}
          intensity={
            2.2
          }
          color="#ffffff"
        />

        <pointLight
          position={[
            3,
            -1,
            1,
          ]}
          intensity={
            5
          }
          distance={
            7
          }
          decay={
            2
          }
          color="#7f1d1d"
        />

        {/* ================================================= */}
        {/* PLAYERA */}
        {/* ================================================= */}

        <Suspense
          fallback={
            <LoadingShirt />
          }
        >
          <ShirtModel
            color={
              color
            }
            frontDesign={
              frontDesign
            }
            backDesign={
              backDesign
            }
          />
        </Suspense>

        {/* ================================================= */}
        {/* SOMBRA */}
        {/* ================================================= */}

        {!lowPerformance && (
          <ContactShadows
            position={[
              0,
              -1.05,
              0,
            ]}
            opacity={
              0.35
            }
            scale={5}
            blur={3}
            far={2.5}
            frames={1}
          />
        )}

        {/* ================================================= */}
        {/* CONTROLES */}
        {/* ================================================= */}

        <OrbitControls
          makeDefault
          enablePan={
            false
          }
          enableDamping
          dampingFactor={
            0.07
          }
          rotateSpeed={
            0.65
          }
          zoomSpeed={
            0.65
          }
          minDistance={
            2.8
          }
          maxDistance={
            6
          }
          minPolarAngle={
            Math.PI *
            0.27
          }
          maxPolarAngle={
            Math.PI *
            0.73
          }
          target={[
            0,
            0,
            0,
          ]}
        />
      </Canvas>

      {/* ================================================= */}
      {/* AYUDA */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 max-w-[calc(100%-32px)] -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-4 py-2 backdrop-blur-md">
        <p className="whitespace-nowrap text-center text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-400 sm:tracking-[0.16em]">
          ↔ Rotar · Scroll /
          pellizcar para zoom
        </p>
      </div>
    </div>
  );
}

useGLTF.preload(
  "/models/playera.glb"
);