"use client"

import { Perf } from "r3f-perf"

export default function PerfMonitor() {
  if (process.env.NODE_ENV !== "development") return null
  return <Perf position="top-left" />
}
