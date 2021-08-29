import { h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import style from './style.css'

import { initScene, dispose } from './scene'
import Loader from '../../components/loader'

const Map = () => {
  const mapRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    initScene(mapRef.current, setLoaded)

    return () => {
      dispose()
    }
  }, [])

  return (
    <>
      <div ref={mapRef} class={style.container}>
  	  </div>
      {
        !loaded ? <Loader /> : null
      }
    </>
  )
}

export default Map