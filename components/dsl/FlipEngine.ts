import gsap from "gsap"

interface LayoutCapture {
  element: HTMLElement
  rect: DOMRect
}

let activeTweens: gsap.core.Tween[] = []

export function captureLayout(elements: HTMLElement[]): LayoutCapture[] {
  return elements.map((element) => ({
    element,
    rect: element.getBoundingClientRect(),
  }))
}

export function animateFlip(
  before: LayoutCapture[],
  duration: number = 0.8,
  easing: string = "power2.inOut"
) {
  // Kill any running FLIP tweens
  activeTweens.forEach((t) => t.kill())
  activeTweens = []

  for (const { element, rect: beforeRect } of before) {
    const afterRect = element.getBoundingClientRect()

    const dx = beforeRect.left - afterRect.left
    const dy = beforeRect.top - afterRect.top
    const sw = beforeRect.width / afterRect.width
    const sh = beforeRect.height / afterRect.height

    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sw - 1) < 0.01 && Math.abs(sh - 1) < 0.01) {
      continue // No meaningful change
    }

    const tween = gsap.fromTo(
      element,
      {
        x: dx,
        y: dy,
        scaleX: sw,
        scaleY: sh,
      },
      {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration,
        ease: easing,
        clearProps: "transform",
      }
    )

    activeTweens.push(tween)
  }
}

export function killFlipAnimations() {
  activeTweens.forEach((t) => t.kill())
  activeTweens = []
}
