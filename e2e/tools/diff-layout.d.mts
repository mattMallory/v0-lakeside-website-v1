/**
 * Types for diff-layout.mjs, so specs can import the comparison logic and the
 * strict type check still covers them. The implementation stays as `.mjs`
 * because it is also a CLI invoked directly with `node`.
 */
export type SnapshotElement = {
  path?: string
  selector: string
  display: string
  position: string
  x: number
  y: number
  width: number
  height: number
}

export type Snapshot = Record<string, SnapshotElement[]>

export type SnapshotChange = {
  id: string
  kind: "moved" | "added" | "removed"
  selector: string
  before: string
  after: string
}

export type SnapshotDiff = {
  comparedBy: "structural path" | "document position"
  groups: Array<{ key: string; changes: SnapshotChange[] }>
  changedElements: number
  changedGroups: number
  renamedElements: number
}

export function diffSnapshots(before: Snapshot, after: Snapshot): SnapshotDiff
