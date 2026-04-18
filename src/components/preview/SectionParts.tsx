"use client";
import React from "react";

/**
 * SectionHeader — Section Label + h2 Heading block used by S3–S11.
 *
 * Props:
 *   label    — uppercase tag string, e.g. "FEATURES"
 *   heading  — optional h2 text (omit for S10/S11 which have no section heading)
 *   centered — whether to center-align (default: true)
 *   dark     — whether on a dark background (inverts label colors)
 */
export function SectionHeader({
  label,
  heading,
  centered = true,
  dark = false,
}: {
  label: string;
  heading?: string;
  centered?: boolean;
  dark?: boolean;
}) {
  const textAlign = centered ? ("center" as const) : ("left" as const);
  return (
    <>
      <p
        className="lp-label"
        style={{
          textAlign,
          ...(dark
            ? { color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.1)" }
            : {}),
        }}
      >
        {label}
      </p>
      {heading && (
        <h2
          className="lp-heading"
          style={{
            textAlign,
            ...(dark ? { color: "#ffffff" } : {}),
          }}
        >
          {heading}
        </h2>
      )}
    </>
  );
}

/**
 * CtaRow — Primary + Secondary CTA button pair.
 * Wraps the existing lp-cta-area CSS class.
 */
export function CtaRow({
  primary,
  secondary,
  centered = true,
}: {
  primary: string;
  secondary: string;
  centered?: boolean;
}) {
  return (
    <div
      className="lp-cta-area"
      style={centered ? {} : { justifyContent: "flex-start" }}
    >
      <a href="#" className="btn-primary">
        {primary}
      </a>
      <a href="#" className="btn-secondary">
        {secondary}
      </a>
    </div>
  );
}
