"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

function hexToHsv(hex: string) {
  const normalized = hex.replace("#", "");
  const red = parseInt(normalized.slice(0, 2), 16) / 255;
  const green = parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = parseInt(normalized.slice(4, 6), 16) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const difference = maximum - minimum;
  let hue = 0;

  if (difference !== 0) {
    if (maximum === red) hue = ((green - blue) / difference) % 6;
    else if (maximum === green) hue = (blue - red) / difference + 2;
    else hue = (red - green) / difference + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return {
    hue,
    saturation: maximum === 0 ? 0 : (difference / maximum) * 100,
    value: maximum * 100,
  };
}

function hsvToHex(hue: number, saturation: number, value: number) {
  const chroma = (value / 100) * (saturation / 100);
  const section = hue / 60;
  const secondary = chroma * (1 - Math.abs((section % 2) - 1));
  const offset = value / 100 - chroma;
  const channels =
    section < 1
      ? [chroma, secondary, 0]
      : section < 2
        ? [secondary, chroma, 0]
        : section < 3
          ? [0, chroma, secondary]
          : section < 4
            ? [0, secondary, chroma]
            : section < 5
              ? [secondary, 0, chroma]
              : [chroma, 0, secondary];
  const toHex = (channel: number) =>
    Math.round((channel + offset) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${channels.map(toHex).join("")}`.toUpperCase();
}

function isHexColor(value: string) {
  return /^#[\da-f]{6}$/i.test(value);
}

export default function AdminHexColorPicker({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value: string;
  fallback: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hsv, setHsv] = useState(() =>
    hexToHsv(isHexColor(value) ? value : fallback),
  );
  const [popupPosition, setPopupPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const activeColor = isHexColor(value) ? value : fallback;

  useEffect(() => {
    if (!isOpen) return;

    function positionPopup() {
      const trigger = triggerRef.current;
      const popup = popupRef.current;
      if (!trigger || !popup) return;

      const triggerBounds = trigger.getBoundingClientRect();
      const popupBounds = popup.getBoundingClientRect();
      const edgeGap = 8;
      const openAbove =
        window.innerHeight - triggerBounds.bottom <
          popupBounds.height + edgeGap &&
        triggerBounds.top > window.innerHeight - triggerBounds.bottom;
      const requestedTop = openAbove
        ? triggerBounds.top - popupBounds.height - edgeGap
        : triggerBounds.bottom + edgeGap;

      setPopupPosition({
        left: Math.max(
          edgeGap,
          Math.min(
            triggerBounds.right - popupBounds.width,
            window.innerWidth - popupBounds.width - edgeGap,
          ),
        ),
        top: Math.max(
          edgeGap,
          Math.min(
            requestedTop,
            window.innerHeight - popupBounds.height - edgeGap,
          ),
        ),
      });
    }

    function closeOnOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !pickerRef.current?.contains(event.target) &&
        !popupRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    const frame = window.requestAnimationFrame(positionPopup);
    window.addEventListener("resize", positionPopup);
    window.addEventListener("scroll", positionPopup, true);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", positionPopup);
      window.removeEventListener("scroll", positionPopup, true);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isHexColor(value)) {
      setHsv((current) => {
        const next = hexToHsv(value);
        if (next.saturation < 0.5) next.hue = current.hue;
        return next;
      });
    }
  }, [value]);

  function updatePalette(clientX: number, clientY: number) {
    const bounds = paletteRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const saturation = Math.max(
      0,
      Math.min(100, ((clientX - bounds.left) / bounds.width) * 100),
    );
    const brightness = Math.max(
      0,
      Math.min(100, (1 - (clientY - bounds.top) / bounds.height) * 100),
    );
    setHsv((current) => ({
      ...current,
      saturation,
      value: brightness,
    }));
    onChange(hsvToHex(hsv.hue, saturation, brightness));
  }

  function updateHue(hue: number) {
    setHsv((current) => ({ ...current, hue }));
    onChange(hsvToHex(hue, hsv.saturation, hsv.value));
  }

  return (
    <div ref={pickerRef} className="relative flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value.toUpperCase())}
        aria-label={`${label} HEX code`}
        aria-invalid={!isHexColor(value)}
        placeholder="#000000"
        spellCheck={false}
        className={`w-[92px] rounded border px-2 py-1 font-mono text-xs uppercase outline-none ${
          isHexColor(value) ? "border-[#dfe2df]" : "border-red-500"
        }`}
      />
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setPopupPosition(null);
          setIsOpen((open) => !open);
        }}
        aria-label={`Choose ${label.toLowerCase()} color`}
        aria-expanded={isOpen}
        className="h-8 w-10 rounded border border-[#dfe2df]"
        style={{ backgroundColor: activeColor }}
      />
      {isOpen &&
        createPortal(
          <div
            ref={popupRef}
            className="fixed z-[1000] max-h-[calc(100vh-16px)] w-64 overflow-y-auto rounded-lg border border-[#dfe2df] bg-white p-3 shadow-xl"
            style={{
              left: popupPosition?.left ?? 0,
              top: popupPosition?.top ?? 0,
              visibility: popupPosition ? "visible" : "hidden",
            }}
          >
          <div
            ref={paletteRef}
            role="group"
            aria-label={`${label} saturation and brightness`}
            tabIndex={0}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              updatePalette(event.clientX, event.clientY);
            }}
            onPointerMove={(event) => {
              if (event.buttons === 1)
                updatePalette(event.clientX, event.clientY);
            }}
            onKeyDown={(event) => {
              const step = event.shiftKey ? 10 : 1;
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                const saturation = Math.max(
                  0,
                  Math.min(
                    100,
                    hsv.saturation +
                      (event.key === "ArrowRight" ? step : -step),
                  ),
                );
                setHsv((current) => ({ ...current, saturation }));
                onChange(hsvToHex(hsv.hue, saturation, hsv.value));
              }
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
                const brightness = Math.max(
                  0,
                  Math.min(
                    100,
                    hsv.value + (event.key === "ArrowUp" ? step : -step),
                  ),
                );
                setHsv((current) => ({ ...current, value: brightness }));
                onChange(hsvToHex(hsv.hue, hsv.saturation, brightness));
              }
            }}
            className="relative h-36 cursor-crosshair touch-none rounded"
            style={{
              backgroundColor: `hsl(${hsv.hue} 100% 50%)`,
              backgroundImage:
                "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_#222]"
              style={{
                left: `${hsv.saturation}%`,
                top: `${100 - hsv.value}%`,
              }}
            />
          </div>
          <label className="mt-3 block text-xs font-medium text-[#4b5860]">
            Hue
            <input
              type="range"
              min="0"
              max="359"
              value={Math.round(hsv.hue) % 360}
              onChange={(event) => updateHue(Number(event.target.value))}
              aria-label={`${label} hue`}
              className="mt-1 block h-3 w-full cursor-pointer rounded-full accent-[#1b3b34]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
              }}
            />
          </label>
          <label className="mt-2 block text-xs font-medium text-[#4b5860]">
            HEX
            <input
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value.toUpperCase())}
              aria-label={`${label} popup HEX code`}
              aria-invalid={!isHexColor(value)}
              placeholder="#000000"
              spellCheck={false}
              className={`mt-1 w-full rounded border px-2 py-1.5 font-mono text-sm uppercase outline-none ${
                isHexColor(value) ? "border-[#dfe2df]" : "border-red-500"
              }`}
            />
          </label>
          </div>,
          document.body,
        )}
    </div>
  );
}
