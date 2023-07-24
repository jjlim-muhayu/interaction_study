import {useEffect, useRef, useState} from 'react'
import {Engine, Render, Runner, Mouse, MouseConstraint, Composite, Bodies, Events} from 'matter-js'

import '../style/containers/RotateCanvas.css'

import IconAFRAME from '../assets/icon_AFRAME.png'
import IconCSS from '../assets/icon_CSS.png'
import IconHTML from '../assets/icon_HTML.png'
import IconJS from '../assets/icon_JS.png'
import IconREACT from '../assets/icon_REACT.png'
import IconTHREE from '../assets/icon_THREE.png'

const data = {
    'JS': {title: 'Javascript', level: 4, desc: '자바스크립트에 대한 설명이라고 할 수 있습니다. 자바스크립트에 대한 설명. 자바스크립트에 대한 설명.'},
    'REACT': {title: 'React.js', level: 5, desc: 'React에 대한 설명이라고 할 수 있습니다. React에 대한 설명. React에 대한 설명.'},
    'CSS': {title: 'CSS/SASS', level: 3, desc: 'CSS에 대한 설명이라고 할 수 있습니다. CSS에 대한 설명. CSS에 대한 설명.'},
    'AFRAME': {title: 'Aframe.js', level: 4, desc: 'AFRAME에 대한 설명이라고 할 수 있습니다. AFRAME에 대한 설명. AFRAME에 대한 설명.'},
    'THREE': {title: 'Three.js', level: 2, desc: 'THREE에 대한 설명이라고 할 수 있습니다. THREE에 대한 설명. THREE에 대한 설명.'},
    'HTML': {title: 'HTML', level: 5, desc: 'HTML에 대한 설명이라고 할 수 있습니다. HTML에 대한 설명. HTML에 대한 설명.'},
}

const RotateCanvas = () => {
    const [selected, setSelected] = useState(data['JS'])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const cw = 1000
        const ch = 1000

        const garvityPower = 0.5
        let gravityDeg = 0

        let engine, render, runner, mouse, mouseConstraint

        let observer

        initScene()
        initMouse()
        initIntersectionObserver()
        initGround()
        initImageBoxes()

        function initScene() {

        }

        function initMouse() {

        }

        function initIntersectionObserver() {
            const options = {
                threshold: 0.1
            }
            observer = new IntersectionObserver(entries => {
                const canvasEntry = entries[0]
                if (canvasEntry.isIntersecting) {

                } else {

                }
            }, options)

            observer.observe(canvas)
        }

        function initGround() {

        }

        function initImageBoxes() {

        }

        function addRect(x, y, w, h, options = {}) {

        }

        return () => {
            observer.unobserve(canvas)

            // Composite.clear(engine.world)
            // Mouse.clearSourceEvents(mouse)
            // Runner.stop(runner)
            // Render.stop(render)
            // Engine.clear(engine)
        }
    }, [])

    return (
        <div className="rotate-canvas-wrapper">
            <canvas ref={canvasRef}></canvas>
            <aside>
                <h1>{selected.title}</h1>
                <h2>{Array(5).fill(null).map((_, i) => (
                    <span key={i} style={{filter: `grayscale(${selected.level <= i ? 1 : 0})`}}>&#11088;</span>
                ))}</h2>
                <p>{selected.desc}</p>
            </aside>
        </div>
    )
}

export default RotateCanvas
