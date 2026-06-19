"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type ScrollAlign = "start" | "center" | "end";

function scrollCardIntoContainer(
  container: HTMLElement,
  card: HTMLElement,
  align: ScrollAlign,
  behavior: ScrollBehavior = "smooth",
) {
  const padding = 8;
  const containerRect = container.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  let delta = 0;

  if (align === "end") {
    delta = cardRect.right - containerRect.right + padding;
  } else if (align === "start") {
    delta = cardRect.left - containerRect.left - padding;
  } else {
    delta =
      cardRect.left -
      containerRect.left -
      containerRect.width / 2 +
      cardRect.width / 2;
  }

  container.scrollTo({
    left: container.scrollLeft + delta,
    behavior,
  });
}

export function useCarouselScroll(
  activeId: string,
  align: ScrollAlign = "end",
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const hasMounted = useRef(false);

  const registerCard = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      cardRefs.current.set(id, node);
      return;
    }
    cardRefs.current.delete(id);
  }, []);

  const scrollToActive = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = containerRef.current;
      const card = cardRefs.current.get(activeId);
      if (!container || !card) return;
      scrollCardIntoContainer(container, card, align, behavior);
    },
    [activeId, align],
  );

  useLayoutEffect(() => {
    const behavior = hasMounted.current ? "smooth" : "instant";
    hasMounted.current = true;

    requestAnimationFrame(() => {
      scrollToActive(behavior);
    });
  }, [scrollToActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => scrollToActive("instant"));
    observer.observe(container);
    return () => observer.disconnect();
  }, [scrollToActive]);

  return { containerRef, registerCard };
}
