"use client";

import React from "react";
import "./GlassSurface.css";

export interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: "R" | "G" | "B";
  yChannel?: "R" | "G" | "B";
  mixBlendMode?: any;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  width,
  height,
  borderRadius = 24,
  className = "",
  style = {},
  onClick,
}) => {
  const inlineStyle: React.CSSProperties = { ...style };
  if (width !== undefined) {
    inlineStyle.width = typeof width === "number" ? `${width}px` : width;
  }
  if (height !== undefined) {
    inlineStyle.height = typeof height === "number" ? `${height}px` : height;
  }
  if (borderRadius !== undefined) {
    inlineStyle.borderRadius = `${borderRadius}px`;
  }

  return (
    <div
      onClick={onClick}
      className={`glass-surface ${className}`}
      style={inlineStyle}
    >
      {children}
    </div>
  );
};

export default GlassSurface;
