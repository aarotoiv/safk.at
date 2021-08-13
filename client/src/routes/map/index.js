import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import style from './style.css'

import { initScene, dispose } from './scene'

const Map = () => {
  const mapRef = useRef(null)

  useEffect(() => {
    initScene(mapRef.current)

    return () => {
      dispose()
    }
  }, [])

  return (
    <div ref={mapRef} class={style.container}>
  	</div>
  )
}

export default Map