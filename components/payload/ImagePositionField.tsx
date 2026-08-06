"use client"

import type { CSSProperties } from "react"
import { FieldLabel, useField } from "@payloadcms/ui"
import type { SelectFieldClient } from "payload"

import {
  DEFAULT_IMAGE_POSITION,
  getImagePositionLabel,
  IMAGE_POSITION_EDGE_OPTIONS,
  IMAGE_POSITION_GRID,
  toImagePositionValue,
  type ImagePositionValue,
} from "@/lib/image-position"

type ImagePositionFieldProps = {
  field: SelectFieldClient
}

function getCellStyle(isActive: boolean): CSSProperties {
  return {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: isActive ? "var(--theme-success-500)" : "var(--theme-elevation-200)",
    borderRadius: 6,
    background: isActive ? "var(--theme-success-50)" : "var(--theme-elevation-50)",
    boxShadow: isActive ? "inset 0 0 0 1px var(--theme-success-500)" : "none",
    cursor: "pointer",
    padding: 0,
  }
}

function getEdgeButtonStyle(isActive: boolean): CSSProperties {
  return {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: isActive ? "var(--theme-success-500)" : "var(--theme-elevation-200)",
    borderRadius: 6,
    background: isActive ? "var(--theme-success-50)" : "var(--theme-elevation-50)",
    boxShadow: isActive ? "inset 0 0 0 1px var(--theme-success-500)" : "none",
    color: "var(--theme-text)",
    cursor: "pointer",
    fontSize: 12,
    padding: "6px 10px",
  }
}

export function ImagePositionField({ field }: ImagePositionFieldProps) {
  const { setValue, showError, errorMessage, value } = useField<string>({ path: field.name })
  const selected = toImagePositionValue(value, DEFAULT_IMAGE_POSITION)

  function selectPosition(position: ImagePositionValue) {
    setValue(position)
  }

  return (
    <div className="field-type select">
      <FieldLabel label={field.label} required={field.required} />

      <p style={{ margin: "0 0 12px", color: "var(--theme-elevation-600)", fontSize: 13, lineHeight: 1.4 }}>
        Click a point on the grid to choose which part of the image stays visible when it is cropped on the site.
      </p>

      <div
        style={{
          display: "grid",
          gap: 6,
          gridTemplateColumns: "repeat(3, 44px)",
          width: "fit-content",
        }}
      >
        {IMAGE_POSITION_GRID.flat().map((position) => {
          const isActive = selected === position

          return (
            <button
              key={position}
              type="button"
              aria-label={getImagePositionLabel(position)}
              aria-pressed={isActive}
              onClick={() => selectPosition(position)}
              style={getCellStyle(isActive)}
            />
          )
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
        {IMAGE_POSITION_EDGE_OPTIONS.map((option) => {
          const isActive = selected === option.value

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => selectPosition(option.value)}
              style={getEdgeButtonStyle(isActive)}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <p style={{ margin: "10px 0 0", color: "var(--theme-elevation-700)", fontSize: 13 }}>
        Selected: <strong>{getImagePositionLabel(selected)}</strong>
      </p>

      {showError ? (
        <div className="field-error" style={{ color: "var(--theme-error-500)", marginTop: 8 }}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  )
}
