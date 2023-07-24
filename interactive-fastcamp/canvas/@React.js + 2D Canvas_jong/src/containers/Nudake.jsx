import { useEffect, useRef } from 'react'
import throttle from 'lodash/throttle'
import gsap from 'gsap'
import '../style/containers/Nudake.css'

import image1 from '../assets/nudake-1.jpg'
import image2 from '../assets/nudake-2.jpg'
import image3 from '../assets/nudake-3.jpg'
import { drawImageCenter, getAngle, getDistance, getScrupedPercent } from './../utils/utils';

const Nudake = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const canvasParent = canvas.parentNode
    const ctx = canvas.getContext('2d')


    function resize() {

    }

    function preloadImages() {

    }

    function drawImage() {

    }

    function onMousedown(e) {

    }

    function onMouseUp() {

    }

    function onMouseMove(e) {

    }

    function drawCircles(e) {

    }

    const checkPercent = throttle(() => {

    }, 500)

    canvas.addEventListener('mousedown', onMousedown)
    window.addEventListener('resize', resize)
    resize()

    return () => {
      canvas.removeEventListener('mousedown', onMousedown)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className='nudake'>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Nudake
