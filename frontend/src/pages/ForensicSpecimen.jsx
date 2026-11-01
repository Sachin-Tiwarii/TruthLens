import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * A faceted "specimen" under examination: a glass-like polyhedron with
 * amber anomaly markers that light up as a scan ring sweeps through it.
 * Requires:  npm i three
 */
export default function ForensicSpecimen() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return // WebGL unavailable – the CSS backdrop remains as a fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(0, 0.35, 8)

    // ── Lighting ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x8aa0d6, 0.7))
    const key = new THREE.DirectionalLight(0xbcd0ff, 1.6)
    key.position.set(4, 5, 5)
    scene.add(key)
    const rim = new THREE.PointLight(0xf2a93b, 14, 14)
    rim.position.set(-4, -2.5, 2.5)
    scene.add(rim)

    // ── Structure ───────────────────────────────────────────
    const R = 1.7
    const root = new THREE.Group() // tilt / parallax
    const spin = new THREE.Group() // y-rotation only (keeps world-Y for the scan)
    root.add(spin)
    scene.add(root)

    const geo = new THREE.IcosahedronGeometry(R, 2)

    const body = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: 0x16264a,
        metalness: 0.55,
        roughness: 0.32,
        flatShading: true,
        transparent: true,
        opacity: 0.9,
      })
    )
    spin.add(body)

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 1),
      new THREE.LineBasicMaterial({ color: 0x7b97ff, transparent: true, opacity: 0.5 })
    )
    spin.add(edges)

    // inner lattice core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(R * 0.52, 1),
      new THREE.MeshBasicMaterial({ color: 0x9db4ff, wireframe: true, transparent: true, opacity: 0.35 })
    )
    spin.add(core)

    // ── Anomaly markers (deterministic picks from the mesh vertices) ──
    const pos = geo.attributes.position
    const seen = new Set()
    const markers = []
    let seed = 7
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    while (markers.length < 8) {
      const i = Math.floor(rand() * pos.count)
      const v = new THREE.Vector3().fromBufferAttribute(pos, i)
      const k = `${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)}`
      if (seen.has(k)) continue
      seen.add(k)

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xf2a93b })
      )
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xf2a93b, transparent: true, opacity: 0 })
      )
      dot.position.copy(v.multiplyScalar(1.015))
      halo.position.copy(dot.position)
      spin.add(dot, halo)
      markers.push({ dot, halo, y: dot.position.y })
    }

    // ── Scan ring (lives in `root`, so it does not spin) ─────
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xcfdcff, transparent: true, opacity: 0.95 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.011, 8, 160), ringMat)
    ring.rotation.x = Math.PI / 2
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x7b97ff, transparent: true, opacity: 0.18 })
    const glow = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 8, 160), glowMat)
    glow.rotation.x = Math.PI / 2
    root.add(ring, glow)

    // ── Orbit rings ─────────────────────────────────────────
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0x5f78c9, transparent: true, opacity: 0.35 })
    const orbitA = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.006, 6, 200), orbitMat)
    orbitA.rotation.set(Math.PI / 2.4, 0.3, 0)
    const orbitB = new THREE.Mesh(new THREE.TorusGeometry(3.05, 0.005, 6, 200), orbitMat)
    orbitB.rotation.set(Math.PI / 1.9, -0.5, 0.4)
    root.add(orbitA, orbitB)

    // small satellite on orbit A (a "sample" being cross-checked)
    const sat = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.09),
      new THREE.MeshBasicMaterial({ color: 0xcfdcff })
    )
    orbitA.add(sat)

    // ── Particle field ──────────────────────────────────────
    const N = 180
    const arr = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const r = 3.4 + rand() * 1.8
      const th = rand() * Math.PI * 2
      const ph = Math.acos(2 * rand() - 1)
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th)
      arr[i * 3 + 1] = r * Math.cos(ph) * 0.75
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x9db4ff, size: 0.028, transparent: true, opacity: 0.6, depthWrite: false })
    )
    root.add(points)

    // ── Sizing ──────────────────────────────────────────────
    const resize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      if (reduceMotion) renderer.render(scene, camera)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(mount)
    resize()

    // ── Pointer parallax ────────────────────────────────────
    const target = { x: 0, y: 0 }
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect()
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    if (!reduceMotion) window.addEventListener('pointermove', onMove, { passive: true })

    // ── Loop ────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let raf = 0
    const tick = () => {
      const t = clock.getElapsedTime()

      spin.rotation.y = t * 0.22
      core.rotation.y = -t * 0.4
      core.rotation.x = t * 0.18

      root.rotation.y += (target.x * 0.35 - root.rotation.y) * 0.04
      root.rotation.x += (target.y * 0.18 + 0.12 - root.rotation.x) * 0.04
      root.position.y = Math.sin(t * 0.9) * 0.06

      orbitA.rotation.z = t * 0.12
      orbitB.rotation.z = -t * 0.09
      sat.position.set(2.55 * Math.cos(t * 0.6), 2.55 * Math.sin(t * 0.6), 0)
      points.rotation.y = t * 0.02

      // scan sweep
      const y = Math.sin(t * 0.75) * R * 0.94
      const radius = Math.sqrt(Math.max(R * R - y * y, 0.02)) * 1.03
      ring.position.y = glow.position.y = y
      ring.scale.set(radius, radius, 1)
      glow.scale.set(radius, radius, 1)

      markers.forEach((m) => {
        const d = (m.y - y) / 0.38
        const g = Math.exp(-d * d)
        m.halo.material.opacity = g * 0.55
        m.halo.scale.setScalar(1 + g * 0.8)
        m.dot.scale.setScalar(1 + g * 0.6)
      })

      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    if (reduceMotion) renderer.render(scene, camera)
    else tick()

    // ── Cleanup ─────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          Array.isArray(o.material) ? o.material.forEach((m) => m.dispose()) : o.material.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="hp-specimen" role="img" aria-label="Rotating 3D model of a media sample being scanned for anomalies" />
}