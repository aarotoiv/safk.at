import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new GLTFLoader()
console.log(loader)

let camera, scene, renderer
let model
let geometry, material, mesh

export const initScene = (container) => {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 30)
  camera.position.z = 7
  camera.position.y = 3
  camera.rotation.x = -0.5
  
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(animation)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  container.appendChild(renderer.domElement)

  const light = new THREE.AmbientLight(0x404040, 2)
  scene.add(light)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.x = 10
  directionalLight.position.y = 9
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
  grassCube.scale.x = 2.2
  grassCube.scale.z = 2.2
  grassCube.scale.y = 0.1
  grassCube.position.y = -0.55
  grassCube.receiveShadow = true
  
  const dirtCube = new THREE.Mesh(blockGeometry, groundMaterial)
  dirtCube.scale.x = 2.2
  dirtCube.scale.z = 2.2
  dirtCube.scale.y = 1
  dirtCube.position.y = -1.65

  scene.add(grassCube)
  scene.add(dirtCube)

  const generateBlobs = () => {
    const count = Math.floor(Math.random() * 15 + 5)
    for (let i = 0; i < count; i++) {
      const dirtBlob = new THREE.Mesh(blockGeometry, groundMaterial)
      dirtBlob.scale.x = Math.random() * 0.1 + 0.1
      dirtBlob.scale.z = Math.random() * 0.1 + 0.1
      dirtBlob.scale.y = Math.random() * 0.1 + 0.1
      dirtBlob.position.y = -3.5 - Math.random() * 2 + 0.1
      dirtBlob.position.x = 0 + Math.random() * 4.0 - 2.0
      dirtBlob.position.z = 0 + Math.random() * 4.0 - 2.0
      scene.add(dirtBlob)
    } 
  }

  generateBlobs()

  loader.load(
    'http://localhost:5000/files/tamkmin.glb',
    function (gltf) {
      model = gltf.scene
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          console.log(child.material)
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
    },
    function (xhr) {
      // console.log(xhr)
    },
    function (error) {
      // console.log(error)
    }
  )
}

let lastTick = 0

const animation = (time) => {
  if (model) {
    // model.rotation.y += 1 * (time - lastTick ?? 0)
    lastTick = time
    scene.rotation.y += 0.002
  }
  renderer.render(scene, camera)
}

export const dispose = () => {
  console.log('dispose called')
  renderer && renderer.dispose()
}