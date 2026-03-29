"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Point = { x: number; y: number };

function distancePath(points: Point[]): number {
  let d = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    d += Math.hypot(dx, dy);
  }
  return d;
}

/**
 * Lenient validation: enough ink + most points near center (works with mouse or touch).
 */
function validateTrace(
  points: Point[],
  width: number,
  height: number,
): { ok: boolean; reason: string } {
  if (points.length < 8) {
    return { ok: false, reason: "Trace a bit more of the letter." };
  }
  const len = distancePath(points);
  if (len < 120) {
    return { ok: false, reason: "Stroke is too short — follow the guide." };
  }
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.38;
  const inside = points.filter((p) => Math.hypot(p.x - cx, p.y - cy) < r).length;
  if (inside / points.length < 0.45) {
    return {
      ok: false,
      reason: "Draw closer to the dotted letter shape.",
    };
  }
  return { ok: true, reason: "" };
}

type Props = {
  letter: string;
  /** Called when trace validation passes (can fire multiple times until reset). */
  onPass?: () => void;
  disabled?: boolean;
  className?: string;
};

export function AlphabetTracePad({
  letter,
  onPass,
  disabled,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const drawingRef = useRef(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);

  const width = 320;
  const height = 320;

  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(250, 243, 230, 0.95)";
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const fontSize = Math.floor(height * 0.42);
    ctx.font = `600 ${fontSize}px "Segoe UI", "Noto Sans Hebrew", "David Libre", serif`;
    ctx.strokeStyle = "rgba(92, 79, 61, 0.45)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeText(letter, width / 2, height / 2);
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(44, 36, 22, 0.06)";
    ctx.fillText(letter, width / 2, height / 2);

    const stroke = pointsRef.current;
    if (stroke.length > 1) {
      ctx.strokeStyle = "rgba(74, 104, 48, 0.85)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  }, [letter, height, width]);

  useEffect(() => {
    pointsRef.current = [];
    setPassed(false);
    setFeedback(null);
    drawGuide();
  }, [letter, drawGuide]);

  const pushPoint = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || disabled || passed) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    pointsRef.current.push({ x, y });
    drawGuide();
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (disabled || passed) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    pointsRef.current = [];
    pushPoint(e);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || disabled || passed) return;
    pushPoint(e);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const checkTrace = () => {
    const pts = pointsRef.current;
    const v = validateTrace(pts, width, height);
    if (!v.ok) {
      setFeedback(v.reason);
      return;
    }
    setFeedback("Nice — that matches the shape.");
    setPassed(true);
    onPass?.();
  };

  const clearPad = () => {
    pointsRef.current = [];
    setPassed(false);
    setFeedback(null);
    drawGuide();
  };

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="touch-none cursor-crosshair rounded-xl border border-ink/15 bg-parchment-card"
        width={width}
        height={height}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        aria-label={`Trace the letter ${letter}`}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled || passed}
          onClick={checkTrace}
          className="rounded-lg bg-sage px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Check trace
        </button>
        <button
          type="button"
          disabled={disabled || passed}
          onClick={clearPad}
          className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
        >
          Clear
        </button>
      </div>
      {feedback ? (
        <p
          className={`mt-2 text-xs ${passed ? "text-sage" : "text-ink-muted"}`}
        >
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
