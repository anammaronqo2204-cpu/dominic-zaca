import { useEffect, useRef } from "react";

/** A soft editorial light that follows a fine pointer without replacing it. */
export function PointerAtmosphere() {
  const aura = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = aura.current;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !canHover || reduced) return;

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    let started = false;

    const follow = () => {
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      if (Math.abs(targetX - x) > 0.35 || Math.abs(targetY - y) > 0.35) {
        frame = window.requestAnimationFrame(follow);
      } else {
        frame = 0;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!started) {
        x = targetX;
        y = targetY;
        started = true;
      }
      el.dataset.visible = "true";
      if (!frame) frame = window.requestAnimationFrame(follow);
    };

    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !event.relatedTarget) {
        el.dataset.visible = "false";
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={aura} className="pointer-aura" aria-hidden="true" />;
}