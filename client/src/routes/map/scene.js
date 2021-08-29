// lol

import * as THREE from 'three'
import { Text } from 'troika-three-text'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const loader = new GLTFLoader()

let camera, scene, renderer, controls, labels
let model
let geometry, material, mesh
const desiredScale = 0.85
let curScale = 0
let loaded = false

export const initScene = (container, setLoaded) => {
  curScale = 0
  loaded = false
  
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 30)
  camera.position.z = 7
  camera.position.y = 4
  camera.rotation.x = -0.5
  
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(animation)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setClearColor( 0xffffff, 0);

  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5
  controls.maxPolarAngle = Math.PI / 3
  controls.minPolarAngle = Math.PI / 3
  controls.minDistance = 2
  controls.maxDistance = 10

  const light = new THREE.AmbientLight(0x404040, 2)
  scene.add(light)

  const directionalLight = new THREE.DirectionalLight(0xFFE08D, 1.5)
  directionalLight.position.x = 10
  directionalLight.position.y = 7
  directionalLight.castShadow = true

  scene.add(directionalLight)

  directionalLight.shadow.bias = 0.0001
  directionalLight.shadow.mapSize.width = 512
  directionalLight.shadow.mapSize.height = 512
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500

  const blockGeometry = new THREE.BoxBufferGeometry(2, 2, 2)
  const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x7CFC00 })
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x957251 })

  const grassCube = new THREE.Mesh(blockGeometry, grassMaterial)
  grassCube.scale.x = 2.1
  grassCube.scale.z = 2.1
  grassCube.scale.y = 0.1
  grassCube.position.y = -0.55
  grassCube.receiveShadow = true
  
  const dirtCube = new THREE.Mesh(blockGeometry, groundMaterial)
  dirtCube.scale.x = 2.1
  dirtCube.scale.z = 2.1
  dirtCube.scale.y = 0.7
  dirtCube.position.y = -1.35

  scene.add(grassCube)
  scene.add(dirtCube)

  loader.load(
    process.env.NODE_ENV === "production" ? "/files/tamkmin.glb" : "http://localhost:5000/files/tamkmin.glb",
    function (gltf) {
      model = gltf.scene
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.shininess = 0
          child.material.roughness = 0.8
          child.castShadow = true
          child.receiveShadow = true
          child.geometry.center()
        } 
      })
      gltf.scene.receiveShadow = true
      gltf.scene.castShadow = true
      gltf.scene.scale.set(0.1, 0.1, 0.1)
      scene.add(gltf.scene)
      loaded = true
      setLoaded(true)
    },
    function (xhr) {
      // console.log(xhr)
    },
    function (error) {
      // console.log(error)
    }
  )

  scene.scale.set(0, 0, 0)

  // LABELS
  const aLabel = createLabel('A', 0.52, 1.2, 1.5)
  scene.add(aLabel.group)

  const bLabel = createLabel('B', -0.05, 1.6, 0)
  scene.add(bLabel.group)

  const cLabel = createLabel('C', -0.64, 1.2, 1.5)
  scene.add(cLabel.group)

  const dLabel = createLabel('D', -1.15, 0.7, 0.92)
  scene.add(dLabel.group)

  const eLabel = createLabel('E', 1.0, 1.0, 0.73)
  scene.add(eLabel.group)

  const fLabel = createLabel('F', 1.36, 1.1, 0)
  scene.add(fLabel.group)

  const iLabel = createLabel('I', -1.3, 1.0, -0.9)
  scene.add(iLabel.group)

  const gLabel = createLabel('G', 0.4, 1.2, -0.78)
  scene.add(gLabel.group)

  const hLabel = createLabel('H', -0.27, 1.2, -1.3)
  scene.add(hLabel.group)  

  labels = [aLabel.label, bLabel.label, cLabel.label, dLabel.label, eLabel.label, fLabel.label, gLabel.label, hLabel.label, iLabel.label]

  window.addEventListener( 'resize', onWindowResize, false );
}

const createLabel = (text, x, y, z) => {
  const label = new Text()
  label.text = text
  label.position.set(0, 0, 0)
  label.fontSize = 0.4
  label.textAlign = 'justify'
  label.anchorX = 'center'
  label.color = 0xffffff
  label.sync()
  
  const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  cube.scale.set(0.02, 1, 0.02)
  cube.position.set(0, -1, 0)
  cube.geometry.center()

  const group = new THREE.Group()
  group.translateX(x)
  group.translateY(y)
  group.translateZ(z)

  group.add(label)
  group.add(cube)
  return { label, group}
}

const animation = (time) => {
  labels.forEach(label => {
    label.lookAt(camera.position.x, 0, camera.position.z)
  })
  if (loaded && desiredScale >= curScale) {
    curScale += 0.03
    scene.scale.set(curScale, curScale, curScale)
  }
  controls.update()
  renderer.render(scene, camera)
}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

export const dispose = () => {
  window.removeEventListener('resize', onWindowResize, false)
  renderer && renderer.dispose()
}