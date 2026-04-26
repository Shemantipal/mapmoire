import * as THREE from "three";
import type { mat4 } from "gl-matrix";
import type { CustomLayerInterface, Map as MapLibreMap } from "maplibre-gl";
import maplibregl from "maplibre-gl";

type MemoryLayerOptions = {
  id?: string;
  lng: number;
  lat: number;
  altitude?: number;
  color?: string;
};

type CustomRenderArgs = {
  defaultProjectionData: {
    mainMatrix: mat4;
  };
};

export function createThreeMemoryLayer({
  id = "mapmoire-memory-crystal",
  lng,
  lat,
  altitude = 45000,
  color = "#ec4899",
}: MemoryLayerOptions): CustomLayerInterface {
  let camera: THREE.Camera;
  let scene: THREE.Scene;
  let renderer: THREE.WebGLRenderer;
  let crystal: THREE.Mesh;
  let ring: THREE.Mesh;

  return {
    id,
    type: "custom",
    renderingMode: "3d",

    onAdd(map: MapLibreMap, gl: WebGLRenderingContext) {
      camera = new THREE.Camera();
      scene = new THREE.Scene();

      renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });

      renderer.autoClear = false;

      const crystalGeometry = new THREE.OctahedronGeometry(65000, 0);
      const crystalMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.9,
      });

      crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
      scene.add(crystal);

      const ringGeometry = new THREE.TorusGeometry(90000, 5000, 16, 80);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: "#38bdf8",
        transparent: true,
        opacity: 0.55,
      });

      ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);
    },

    render(gl: WebGLRenderingContext, args: CustomRenderArgs) {
      const mercator = maplibregl.MercatorCoordinate.fromLngLat(
        { lng, lat },
        altitude
      );

      const scale = mercator.meterInMercatorCoordinateUnits();

      const modelMatrix = new THREE.Matrix4()
        .makeTranslation(mercator.x, mercator.y, mercator.z || 0)
        .scale(new THREE.Vector3(scale, -scale, scale));

   const cameraMatrix = new THREE.Matrix4().fromArray(
  Array.from(args.defaultProjectionData.mainMatrix)
);

      camera.projectionMatrix = cameraMatrix.multiply(modelMatrix);

      crystal.rotation.x += 0.01;
      crystal.rotation.y += 0.015;
      ring.rotation.z += 0.02;

      renderer.resetState();
      renderer.render(scene, camera);
      
    },
  };
}