import type { CSSProperties } from "react"

import {
  HERO_DASH_MARCH_MS,
  SERVICES_HERO_DASH_COLOR,
  SERVICES_HERO_DASH_CYCLE,
  SERVICES_HERO_DASH_PATTERN,
} from "@/lib/hero-dash-pattern"
import { cn } from "@/lib/utils"

type Vec3 = { x: number; y: number; z: number }
type Node = { id: string; x: number; y: number; depth: number }
type Edge = { from: string; to: string }
type Triangle = [number, number, number]

type DataPacket = {
  path: string
  keyPoints: string
  keyTimes: string
  keySplines: string
  opacity: string
  radius: string
  size: number
  duration: number
  delay: number
}

type SphereMesh = {
  nodes: Node[]
  edges: Edge[]
}

const CENTER = 50
const CAMERA_DISTANCE = 2.65
const PHI = (1 + Math.sqrt(5)) / 2

const ICOSAHEDRON_VERTICES: Vec3[] = [
  [-1, PHI, 0],
  [1, PHI, 0],
  [-1, -PHI, 0],
  [1, -PHI, 0],
  [0, -1, PHI],
  [0, 1, PHI],
  [0, -1, -PHI],
  [0, 1, -PHI],
  [PHI, 0, -1],
  [PHI, 0, 1],
  [-PHI, 0, -1],
  [-PHI, 0, 1],
].map(([x, y, z]) => normalize({ x, y, z }))

const ICOSAHEDRON_FACES: Triangle[] = [
  [0, 11, 5],
  [0, 5, 1],
  [0, 1, 7],
  [0, 7, 10],
  [0, 10, 11],
  [1, 5, 9],
  [5, 11, 4],
  [11, 10, 2],
  [10, 7, 6],
  [7, 1, 8],
  [3, 9, 4],
  [3, 4, 2],
  [3, 2, 6],
  [3, 6, 8],
  [3, 8, 9],
  [4, 9, 5],
  [2, 4, 11],
  [6, 2, 10],
  [8, 6, 7],
  [9, 8, 1],
]

function normalize(vector: Vec3): Vec3 {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1

  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  }
}

function rotateX(vector: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: vector.x,
    y: vector.y * cos - vector.z * sin,
    z: vector.y * sin + vector.z * cos,
  }
}

function rotateY(vector: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return {
    x: vector.x * cos + vector.z * sin,
    y: vector.y,
    z: -vector.x * sin + vector.z * cos,
  }
}

function projectVertex(vector: Vec3, radius: number) {
  const tilted = rotateX(rotateY(vector, 0.18), 0.52)
  const scale = CAMERA_DISTANCE / (CAMERA_DISTANCE - tilted.z)
  const depth = Math.min(1, Math.max(0.08, (tilted.z + 1) / 2))

  return {
    x: CENTER + tilted.x * scale * radius,
    y: CENTER + tilted.y * scale * radius,
    depth,
  }
}

function subdivideIcosphere(subdivisions: number) {
  let vertices = [...ICOSAHEDRON_VERTICES]
  let faces: Triangle[] = ICOSAHEDRON_FACES.map((face) => [...face] as Triangle)

  for (let step = 0; step < subdivisions; step += 1) {
    const midpointCache = new Map<string, number>()
    const nextFaces: Triangle[] = []

    const midpoint = (a: number, b: number) => {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`
      const cached = midpointCache.get(key)
      if (cached !== undefined) return cached

      const start = vertices[a]
      const end = vertices[b]
      const middle = normalize({
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
        z: (start.z + end.z) / 2,
      })

      vertices.push(middle)
      const index = vertices.length - 1
      midpointCache.set(key, index)
      return index
    }

    for (const [a, b, c] of faces) {
      const ab = midpoint(a, b)
      const bc = midpoint(b, c)
      const ca = midpoint(c, a)

      nextFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca])
    }

    faces = nextFaces
  }

  return { vertices, faces }
}

function edgesFromFaces(faces: Triangle[]) {
  const seen = new Set<string>()
  const edges: Edge[] = []

  const addEdge = (from: number, to: number) => {
    const key = from < to ? `${from}-${to}` : `${to}-${from}`
    if (seen.has(key)) return

    seen.add(key)
    edges.push({ from: `v-${from}`, to: `v-${to}` })
  }

  for (const [a, b, c] of faces) {
    addEdge(a, b)
    addEdge(b, c)
    addEdge(c, a)
  }

  return edges
}

function buildGeodesicSphere(subdivisions: number, radius: number): SphereMesh {
  const { vertices, faces } = subdivideIcosphere(subdivisions)

  const nodes = vertices.map((vertex, index) => ({
    id: `v-${index}`,
    ...projectVertex(vertex, radius),
  }))

  return { nodes, edges: edgesFromFaces(faces) }
}

const mobileWeb = buildGeodesicSphere(1, 39)
const desktopWeb = buildGeodesicSphere(2, 41)

const packetSizes = [0.52, 0.58, 0.62, 0.66, 0.7, 0.74, 0.78, 0.82, 0.86, 0.9]

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function depthAlongRoute(route: string[], nodeMap: Record<string, Node>, position: number) {
  if (route.length < 2) return 0.5

  const segments = route.length - 1
  const scaled = Math.min(0.9999, Math.max(0, position)) * segments
  const segmentIndex = Math.min(segments - 1, Math.floor(scaled))
  const localPosition = scaled - segmentIndex
  const from = nodeMap[route[segmentIndex]]
  const to = nodeMap[route[segmentIndex + 1]]

  if (!from || !to) return 0.5

  return from.depth + (to.depth - from.depth) * localPosition
}

function packetAppearance(depth: number, baseSize: number) {
  return {
    opacity: 0.2 + depth * 0.8,
    r: baseSize * (0.58 + depth * 0.46),
  }
}

function buildCycleRoute(
  startId: string,
  adjacency: Map<string, string[]>,
  seed: number,
  minLength = 4,
  maxLength = 10,
): string[] | null {
  const targetLength = minLength + Math.floor(pseudoRandom(seed) * (maxLength - minLength + 1))
  const route = [startId]
  let current = startId

  for (let step = 0; step < targetLength; step += 1) {
    const neighbors = adjacency.get(current) ?? []
    const previous = route[route.length - 2]
    const candidates = neighbors.filter((neighbor) => neighbor !== previous)

    if (candidates.length === 0) return null

    if (step === targetLength - 1 && candidates.includes(startId) && route.length >= minLength) {
      route.push(startId)
      return route
    }

    if (route.length >= minLength && candidates.includes(startId) && pseudoRandom(seed + step + 11) > 0.62) {
      route.push(startId)
      return route
    }

    const next = candidates[Math.floor(pseudoRandom(seed + step * 5 + 3) * candidates.length)]
    route.push(next)
    current = next

    if (current === startId && route.length > minLength) return route
  }

  if ((adjacency.get(current) ?? []).includes(startId) && route.length >= minLength) {
    route.push(startId)
    return route
  }

  return null
}

function buildOpenRoute(
  startEdge: Edge,
  adjacency: Map<string, string[]>,
  seed: number,
): string[] | null {
  let current = pseudoRandom(seed + 2) > 0.5 ? startEdge.from : startEdge.to
  const route = [current]
  const legCount = 4 + Math.floor(pseudoRandom(seed + 3) * 4)

  for (let leg = 0; leg < legCount; leg += 1) {
    const neighbors = adjacency.get(current) ?? []
    const candidates = neighbors.filter((neighbor) => neighbor !== route[route.length - 2])
    if (candidates.length === 0) break

    const next = candidates[Math.floor(pseudoRandom(seed + 4 + leg * 7) * candidates.length)]
    route.push(next)
    current = next
  }

  return route.length >= 4 ? route : null
}

function routeSignature(route: string[]) {
  return route.join(">")
}

function buildOrganicMotion(
  route: string[],
  nodeMap: Record<string, Node>,
  baseSize: number,
  seed: number,
  closed: boolean,
) {
  const segmentCount = 5 + Math.floor(pseudoRandom(seed) * 5)
  const positions = [0]

  for (let index = 1; index < segmentCount; index += 1) {
    const remaining = 1 - positions[positions.length - 1]
    const step = remaining * (0.12 + pseudoRandom(seed + index) * 0.38)
    positions.push(Math.min(1, positions[positions.length - 1] + step))
  }

  if (positions[positions.length - 1] !== 1) {
    positions.push(1)
  }

  const uniquePositions = positions.filter((position, index) => index === 0 || position > positions[index - 1] + 0.02)

  if (uniquePositions[uniquePositions.length - 1] !== 1) {
    uniquePositions.push(1)
  }

  const timeWeights = uniquePositions.slice(1).map((_, index) => 0.06 + pseudoRandom(seed + 20 + index) * 0.28)
  const totalWeight = timeWeights.reduce((sum, weight) => sum + weight, 0)
  const times = [0]
  let elapsed = 0

  for (const weight of timeWeights) {
    elapsed += weight / totalWeight
    times.push(Math.min(1, elapsed))
  }

  times[times.length - 1] = 1

  const opacity = uniquePositions.map((position, index) => {
    const appearance = packetAppearance(depthAlongRoute(route, nodeMap, position), baseSize)
    const edgeFade = closed ? 1 : Math.min(position * 5, (1 - position) * 5, 1)
    const seamFade =
      closed && (index === 0 || index === uniquePositions.length - 1)
        ? 0.72 + pseudoRandom(seed + 30) * 0.18
        : 1

    return (appearance.opacity * edgeFade * seamFade).toFixed(3)
  })

  const radius = uniquePositions
    .map((position) => packetAppearance(depthAlongRoute(route, nodeMap, position), baseSize).r.toFixed(3))
    .join(";")

  return {
    keyPoints: uniquePositions.map((position) => position.toFixed(3)).join(";"),
    keyTimes: times.map((time) => time.toFixed(3)).join(";"),
    keySplines: Array(uniquePositions.length - 1)
      .fill(0)
      .map((_, index) => {
        const bias = pseudoRandom(seed + 40 + index)
        return `${(0.22 + bias * 0.32).toFixed(2)} ${(bias * 0.18).toFixed(2)} ${(0.78 - bias * 0.24).toFixed(2)} ${(0.82 + bias * 0.12).toFixed(2)}`
      })
      .join("; "),
    opacity: opacity.join(";"),
    radius,
  }
}

function buildPacketRoutes(mesh: SphereMesh, targetCount: number): DataPacket[] {
  const nodeMap = Object.fromEntries(mesh.nodes.map((node) => [node.id, node]))
  const adjacency = new Map<string, string[]>()

  for (const edge of mesh.edges) {
    const fromNeighbors = adjacency.get(edge.from) ?? []
    fromNeighbors.push(edge.to)
    adjacency.set(edge.from, fromNeighbors)

    const toNeighbors = adjacency.get(edge.to) ?? []
    toNeighbors.push(edge.from)
    adjacency.set(edge.to, toNeighbors)
  }

  const packets: DataPacket[] = []
  const usedRoutes = new Set<string>()

  for (let attempt = 0; packets.length < targetCount && attempt < targetCount * 10; attempt += 1) {
    const seed = attempt * 23 + mesh.nodes.length
    const startNode = mesh.nodes[Math.floor(pseudoRandom(seed + 1) * mesh.nodes.length)]?.id
    if (!startNode) continue

    let route =
      buildCycleRoute(startNode, adjacency, seed) ??
      (() => {
        const startEdge = mesh.edges[Math.floor(pseudoRandom(seed + 5) * mesh.edges.length)]
        return startEdge ? buildOpenRoute(startEdge, adjacency, seed + 6) : null
      })()

    if (!route || route.length < 4) continue

    const signature = routeSignature(route)
    if (usedRoutes.has(signature)) continue
    usedRoutes.add(signature)

    const closed = route[0] === route[route.length - 1]
    const path = route
      .map((nodeId, index) => {
        const node = nodeMap[nodeId]
        if (!node) return ""
        return `${index === 0 ? "M" : "L"} ${node.x} ${node.y}`
      })
      .join(" ")

    const size = packetSizes[packets.length % packetSizes.length]
    const motion = buildOrganicMotion(route, nodeMap, size, seed + 40, closed)

    packets.push({
      path,
      size,
      duration: 6.2 + pseudoRandom(seed + 8) * 7.4,
      delay: -(pseudoRandom(seed + 9) * 12),
      ...motion,
    })
  }

  return packets
}

const mobilePackets = buildPacketRoutes(mobileWeb, 12)
const desktopPackets = buildPacketRoutes(desktopWeb, 18)

type HeroBackgroundVariant = "light" | "dark"

const variantStyles = {
  light: {
    overlay:
      "radial-gradient(ellipse at center, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.42) 30%, rgba(255,255,255,0.1) 62%, transparent 100%)",
    dashColor: SERVICES_HERO_DASH_COLOR,
    packetFill: "#B8D4F5",
  },
  dark: {
    overlay: "transparent",
    dashColor: "#5B7CAA",
    packetFill: "#7CB0E8",
  },
} as const

const dashStyle = {
  "--hero-dash-cycle": SERVICES_HERO_DASH_CYCLE,
  animationDuration: `${HERO_DASH_MARCH_MS}ms`,
} as CSSProperties

function edgeDepth(nodes: Node[], edge: Edge) {
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]))
  const from = nodeMap[edge.from]
  const to = nodeMap[edge.to]
  if (!from || !to) return 0

  return (from.depth + to.depth) / 2
}

function SystemNetwork({
  nodes,
  edges,
  packets,
  variant = "light",
  className,
}: {
  nodes: Node[]
  edges: Edge[]
  packets: DataPacket[]
  variant?: HeroBackgroundVariant
  className?: string
}) {
  const styles = variantStyles[variant]
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]))
  const sortedEdges = edges
    .map((edge, index) => ({ edge, index, depth: edgeDepth(nodes, edge) }))
    .sort((a, b) => a.depth - b.depth)

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {sortedEdges.map(({ edge, index, depth }) => {
        const from = nodeMap[edge.from]
        const to = nodeMap[edge.to]
        if (!from || !to) return null

        return (
          <path
            key={`${edge.from}-${edge.to}-${index}`}
            d={(() => {
              const from = nodeMap[edge.from]
              const to = nodeMap[edge.to]
              if (!from || !to) return ""
              return `M ${from.x} ${from.y} L ${to.x} ${to.y}`
            })()}
            fill="none"
            stroke={styles.dashColor}
            strokeWidth={0.3 + depth * 0.22}
            strokeOpacity={variant === "dark" ? 0.34 + depth * 0.58 : 0.22 + depth * 0.62}
            strokeDasharray={SERVICES_HERO_DASH_PATTERN}
            strokeDashoffset={0}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className={cn(index % 2 === 0 ? "services-hero-dash-march" : "services-hero-dash-march-reverse")}
            style={dashStyle}
          />
        )
      })}

      {packets.map((packet, index) => {
        const timing = {
          dur: `${packet.duration}s`,
          begin: `${packet.delay}s`,
          repeatCount: "indefinite" as const,
          keyTimes: packet.keyTimes,
          keySplines: packet.keySplines,
          calcMode: "spline" as const,
        }

        return (
          <circle key={`packet-${index}`} fill={styles.packetFill} r={packet.size * 0.58} opacity={0}>
            <animateMotion {...timing} path={packet.path} keyPoints={packet.keyPoints} rotate="auto" />
            <animate attributeName="opacity" values={packet.opacity} {...timing} />
            <animate attributeName="r" values={packet.radius} {...timing} />
          </circle>
        )
      })}
    </svg>
  )
}

export function ServicesHeroBackground({ variant = "light" }: { variant?: HeroBackgroundVariant }) {
  const styles = variantStyles[variant]

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0" style={{ background: styles.overlay }} />

      <div className="absolute inset-[-18%] flex items-center justify-center">
        <div className="services-hero-network-spin h-full w-full md:hidden">
          <SystemNetwork
            nodes={mobileWeb.nodes}
            edges={mobileWeb.edges}
            packets={mobilePackets}
            variant={variant}
            className="h-full w-full scale-[1.65]"
          />
        </div>

        <div className="services-hero-network-spin hidden h-full w-full md:block">
          <SystemNetwork
            nodes={desktopWeb.nodes}
            edges={desktopWeb.edges}
            packets={desktopPackets}
            variant={variant}
            className="h-full w-full scale-[1.79]"
          />
        </div>
      </div>
    </div>
  )
}
