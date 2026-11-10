import { useCallback, useEffect, useMemo, useRef } from "react";
import type { CategorizeQuestionProps, MatchQuestionProps } from "../../../types";

const stableHash = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return hash;
};

function useDragDrop(onDrop: (dragId: string, dropId: string) => void) {
  // স্ক্রলিং এবং মাউসের পজিশন ট্র্যাক করার জন্য Ref
  const requestRef = useRef<number | null>(null);
  const mouseY = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const activeTouchDragId = useRef<string | null>(null);
  const activeTouchElementRef = useRef<HTMLElement | null>(null);

  const getScrollableParent = useCallback((node: EventTarget | null): HTMLElement | null => {
    if (!(node instanceof HTMLElement)) return null;

    let current: HTMLElement | null = node;
    while (current) {
      const { overflowY } = window.getComputedStyle(current);
      const canScroll =
        (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
        current.scrollHeight > current.clientHeight;

      if (canScroll) return current;
      if (current === document.body || current === document.documentElement) break;
      current = current.parentElement;
    }

    const root = document.scrollingElement;
    return root instanceof HTMLElement ? root : null;
  }, []);

  // স্মুথ স্ক্রলিং লুপ
  const scrollLoop = useCallback(function loop() {
    if (!isDragging.current || mouseY.current === null) return;

    const scrollThreshold = 110;
    const scrollSpeed = 10;
    const activeContainer = scrollContainerRef.current;

    if (activeContainer && activeContainer !== document.body && activeContainer !== document.documentElement) {
      const rect = activeContainer.getBoundingClientRect();
      const distanceFromTop = mouseY.current - rect.top;
      const distanceFromBottom = rect.bottom - mouseY.current;

      if (distanceFromTop < scrollThreshold && activeContainer.scrollTop > 0) {
        activeContainer.scrollBy({ top: -scrollSpeed, behavior: "auto" });
      } else if (
        distanceFromBottom < scrollThreshold &&
        activeContainer.scrollTop + activeContainer.clientHeight < activeContainer.scrollHeight
      ) {
        activeContainer.scrollBy({ top: scrollSpeed, behavior: "auto" });
      }
    } else {
      const windowHeight = window.innerHeight;

      if (mouseY.current < scrollThreshold) {
        window.scrollBy({ top: -scrollSpeed, behavior: "auto" });
      } else if (windowHeight - mouseY.current < scrollThreshold) {
        window.scrollBy({ top: scrollSpeed, behavior: "auto" });
      }
    }

    // লুপ কন্টিনিউ রাখা
    requestRef.current = requestAnimationFrame(loop);
  }, []);

  const startAutoScroll = useCallback(() => {
    if (!isDragging.current) {
      isDragging.current = true;
      requestRef.current = requestAnimationFrame(scrollLoop);
    }
  }, [scrollLoop]);

  const stopAutoScroll = useCallback(() => {
    isDragging.current = false;
    mouseY.current = null;
    scrollContainerRef.current = null;
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);

  // ড্র্যাগ করার সময় মাউসের পজিশন ট্র্যাক করার জন্য গ্লোবাল ইভেন্ট
  useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      if (isDragging.current) {
        mouseY.current = e.clientY;
        const container = getScrollableParent(e.target);
        if (container) {
          scrollContainerRef.current = container;
        }
      }
    };

    window.addEventListener("dragover", handleGlobalDragOver);
    return () => {
      window.removeEventListener("dragover", handleGlobalDragOver);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [getScrollableParent]);

  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const touch = e.touches[0];
      if (!touch) return;

      mouseY.current = touch.clientY;
      const container = getScrollableParent(document.elementFromPoint(touch.clientX, touch.clientY));
      if (container) {
        scrollContainerRef.current = container;
      }

      // Native page swipe/scroll block করে auto-scroll loop কে control দেই
      e.preventDefault();
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const dragId = activeTouchDragId.current;

      if (activeTouchElementRef.current) {
        activeTouchElementRef.current.style.touchAction = "";
        activeTouchElementRef.current.style.opacity = "1";
      }
      activeTouchElementRef.current = null;

      activeTouchDragId.current = null;
      stopAutoScroll();

      if (!touch || !dragId) return;

      const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropZone = elementAtPoint instanceof HTMLElement
        ? elementAtPoint.closest("[data-drop-id]")
        : null;
      const dropId = dropZone instanceof HTMLElement ? dropZone.dataset.dropId : undefined;

      if (dropId) {
        onDrop(dragId, dropId);
      }
    };

    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
    window.addEventListener("touchend", handleGlobalTouchEnd);
    window.addEventListener("touchcancel", handleGlobalTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
      window.removeEventListener("touchcancel", handleGlobalTouchEnd);
    };
  }, [getScrollableParent, onDrop, stopAutoScroll]);

  const getDragProps = (id: string) => ({
    draggable: true,
    onDragStart: (event: React.DragEvent<HTMLElement>) => {
      event.dataTransfer.setData("text/plain", id);
      event.dataTransfer.effectAllowed = "move";
      scrollContainerRef.current = getScrollableParent(event.currentTarget);
      mouseY.current = event.clientY;

      // ড্র্যাগ শুরু হলে অটো-স্ক্রল লুপ চালু করা
      startAutoScroll();

      // ড্র্যাগ শুরু হলে ঘোস্ট ইমেজ বা স্টাইল ঠিক রাখার জন্য
      setTimeout(() => {
        const target = event.target as HTMLElement;
        target.style.opacity = "0.6";
      }, 0);
    },
    onDragEnd: (event: React.DragEvent<HTMLElement>) => {
      // ড্র্যাগ শেষ হলে অটো-স্ক্রল বন্ধ করা
      stopAutoScroll();
      const target = event.target as HTMLElement;
      target.style.opacity = "1";
    },
    onTouchStart: (event: React.TouchEvent<HTMLElement>) => {
      const touch = event.touches[0];
      if (!touch) return;

      activeTouchDragId.current = id;
      activeTouchElementRef.current = event.currentTarget;
      scrollContainerRef.current = getScrollableParent(event.currentTarget);
      mouseY.current = touch.clientY;
      startAutoScroll();

      const target = event.currentTarget as HTMLElement;
      target.style.touchAction = "none";
      target.style.opacity = "0.6";
    },
    onTouchMove: (event: React.TouchEvent<HTMLElement>) => {
      if (!activeTouchDragId.current) return;

      const touch = event.touches[0];
      if (!touch) return;

      event.preventDefault();
      mouseY.current = touch.clientY;

      const nodeUnderFinger = document.elementFromPoint(touch.clientX, touch.clientY);
      const container = getScrollableParent(nodeUnderFinger);
      if (container) {
        scrollContainerRef.current = container;
      }
    },
    onTouchEnd: (event: React.TouchEvent<HTMLElement>) => {
      // Global touchend listener handles drop detection and cleanup.
      event.preventDefault();
    },
    onTouchCancel: (event: React.TouchEvent<HTMLElement>) => {
      activeTouchDragId.current = null;
      activeTouchElementRef.current = null;
      stopAutoScroll();
      const target = event.currentTarget as HTMLElement;
      target.style.touchAction = "";
      target.style.opacity = "1";
    },
  });

  const getDropProps = (dropId: string) => ({
    "data-drop-id": dropId,
    onDragOver: (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      // ড্রপ জোনের ওপরে মাউসের পজিশন আপডেট করা
      mouseY.current = event.clientY;
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      stopAutoScroll();
      
      const dragId = event.dataTransfer.getData("text/plain");
      if (dragId) {
        onDrop(dragId, dropId);
      }
    },
  });

  return { getDragProps, getDropProps };
}

export function MatchQuestion({ q, answer, onChange }: MatchQuestionProps) {
  const matches: Record<string, string> = answer ?? {};

  const shuffledRightItems = useMemo(
    () =>
      [...q.rightItems].sort(
        (a, b) => stableHash(`${q.id}-${a}`) - stableHash(`${q.id}-${b}`),
      ),
    [q.id, q.rightItems],
  );

  // image আছে কিনা check
  const hasImages = q.leftItems.some((item) => item.image);

  const allMatched = q.leftItems.every((item) => matches[item.id]);
  const isMatchCorrect = (leftId: string): boolean =>
    matches[leftId] === q.correctAnswer[leftId];
  const isAllCorrect = allMatched && q.leftItems.every((item) => isMatchCorrect(item.id));

  const handleDrop = (itemId: string, rightItem: string) => {
    if (allMatched) return;
    onChange({ ...matches, [itemId]: rightItem });
  };

  const { getDragProps, getDropProps } = useDragDrop(handleDrop);

  const clearMatch = (leftId: string) => {
    if (allMatched) return;
    const updated = { ...matches };
    delete updated[leftId];
    onChange(Object.keys(updated).length ? updated : null);
  };

  if (shuffledRightItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <p
        className="font-bold text-gray-800 text-base md:text-lg border-l-4 border-blue-500 pl-3"
        style={{ fontFamily: "'Hind Siliguri',sans-serif" }}
      >
        {q.question}
      </p>

      <div className="grid grid-cols-2 gap-4 items-stretch">

        {/* Left Side */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            {q.leftItems.map((item) => {
              const matched = matches[item.id];
              const correct = allMatched ? isMatchCorrect(item.id) : null;

              const borderColor = correct === true
                ? "#22c55e"
                : correct === false
                ? "#DA291C"
                : matched ? "#4ade80" : "#e2e8f0";

              return (
                <div
                  key={item.id}
                  {...getDragProps(item.id)}
                  onClick={() => !allMatched && matched && clearMatch(item.id)}
                  className="w-full rounded-xl overflow-hidden select-none transition-all duration-200 active:scale-95 border-2"
                  style={{
                    cursor: allMatched ? "default" : "grab",
                    borderColor,
                    // image থাকলে 4:3 ratio, না থাকলে auto height
                    aspectRatio: hasImages ? "4/3" : undefined,
                    background: correct === true
                      ? "#dcfce7"
                      : correct === false
                      ? "#fee2e2"
                      : "#ffffff",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                  ) : (
                    <div
                      className="w-full flex items-center justify-center px-4 py-4 font-bold text-sm text-center"
                      style={{
                        fontFamily: "'Hind Siliguri',sans-serif",
                        color: correct === true
                          ? "#15803d"
                          : correct === false
                          ? "#9A3324"
                          : "#1e40af",
                        minHeight: "56px",
                      }}
                    >
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            {shuffledRightItems.map((ri) => {
              const matchedKey = Object.keys(matches).find((key) => matches[key] === ri);
              const matchedItem = q.leftItems.find((li) => li.id === matchedKey);
              const correct = allMatched && matchedKey ? isMatchCorrect(matchedKey) : null;

              const borderColor = correct === true
                ? "#22c55e"
                : correct === false
                ? "#DA291C"
                : matchedItem ? "#22c55e" : "#cbd5e1";

              return (
                <div
                  key={ri}
                  {...getDropProps(ri)}
                  className="w-full rounded-xl overflow-hidden border-2 transition-all duration-300"
                  style={{
                    borderColor,
                    borderStyle: matchedItem ? "solid" : "dashed",
                    // image mode হলে 4:3, text mode হলে auto
                    aspectRatio: hasImages ? "4/3" : undefined,
                    background: correct === true
                      ? "#dcfce7"
                      : correct === false
                      ? "#fee2e2"
                      : matchedItem ? "#f0fdf4" : "#f8fafc",
                  }}
                >
                  {hasImages && matchedItem?.image ? (
                    <img
                      src={matchedItem.image}
                      alt={matchedItem.label}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-bold text-sm text-center px-3 py-4"
                      style={{
                        fontFamily: "'Hind Siliguri',sans-serif",
                        color: correct === true
                          ? "#15803d"
                          : correct === false
                          ? "#9A3324"
                          : matchedItem ? "#166534" : "#64748b",
                        minHeight: "56px",
                      }}
                    >
                      {matchedItem && !hasImages
                        ? `${matchedItem.label} → ${ri}`
                        : ri}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      {allMatched ? (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${
            isAllCorrect
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
        >
          <span className="text-base">{isAllCorrect ? "✅" : "❌"}</span>
          {isAllCorrect ? "সঠিক উত্তর! চমৎকার!" : "ভুল হয়েছে!"}
        </div>
      ) : (
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
          <p className="text-[11px] text-blue-600 text-center font-medium">
            💡 {hasImages
              ? "বাম পাশের ছবি টেনে ডান পাশের সঠিক বক্সের ওপর ছেড়ে দাও।"
              : "বাম পাশের শব্দ টেনে ডান পাশের সঠিক বক্সের ওপর ছেড়ে দাও।"}
          </p>
        </div>
      )}
    </div>
  );
}

export function CategorizeQuestion({ q, answer, onChange }: CategorizeQuestionProps) {
  const grouped = answer ?? {};

  const assignedItemIds = new Set(Object.values(grouped).flat());
  const unassignedItems = q.itemsToCategorize.filter((item) => !assignedItemIds.has(item.id));

  // ── সব item place হয়েছে কিনা ──
  const allPlaced = unassignedItems.length === 0;

  // ── item টি সঠিক category তে আছে কিনা ──
  const isItemCorrect = (itemId: string, category: string): boolean => {
    const correctItems = q.correctAnswer[category] ?? [];
    return correctItems.includes(itemId);
  };

  // ── সব সঠিক কিনা ──
  const isAllCorrect = allPlaced && q.categories.every((cat) =>
    (grouped[cat] ?? []).every((id) => isItemCorrect(id, cat))
  );

  const handleDrop = (itemId: string, category: string) => {
    if (allPlaced) return; // সব place হলে আর drop নেবে না
    const next: Record<string, string[]> = {};
    q.categories.forEach((cat) => {
      const filtered = (grouped[cat] ?? []).filter((id) => id !== itemId);
      if (filtered.length) next[cat] = filtered;
    });
    next[category] = [...(next[category] ?? grouped[category] ?? []), itemId];
    onChange(next);
  };

  const { getDragProps, getDropProps } = useDragDrop(handleDrop);

  const clearPlacement = (itemId: string) => {
    if (allPlaced) return; // সব place হলে remove করা যাবে না
    const next: Record<string, string[]> = {};
    q.categories.forEach((cat) => {
      const filtered = (grouped[cat] ?? []).filter((id) => id !== itemId);
      if (filtered.length) next[cat] = filtered;
    });
    onChange(Object.keys(next).length ? next : null);
  };

  return (
    <div className="flex flex-col gap-5">
      <p
        className="text-base font-medium text-gray-800 border-l-[3px] border-blue-500 pl-3 leading-relaxed"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        {q.question}
      </p>

      <div className="grid grid-cols-2 gap-4">

        {/* বাম — Items */}
        <div className="flex flex-col gap-2">
          {unassignedItems.map((item) => (
            <button
              key={item.id}
              type="button"
              {...getDragProps(item.id)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border-[1.5px] border-blue-200 text-[13px] lg:text-[16px] font-medium text-blue-900 text-left cursor-grab active:scale-95 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              {item.text}
            </button>
          ))}
          {allPlaced && (
            <p className="text-xs text-blue-400 italic mt-1">সব আইটেম বসানো হয়েছে।</p>
          )}
        </div>

        {/* ডান — Categories */}
        <div className="flex flex-col gap-2.5">
          {q.categories.map((category) => {
            const placedItems = grouped[category] ?? [];
            const hasItems = placedItems.length > 0;

            return (
              <div
                key={category}
                {...getDropProps(category)}
                className={`rounded-2xl border-2 p-3 min-h-18 transition-colors ${hasItems
                  ? "border-green-300 bg-green-50"
                  : "border-dashed border-blue-200 bg-slate-50"
                  }`}
              >
                <p className={`text-[13px] lg:text-[16px] font-medium mb-2 flex items-center gap-1.5 ${hasItems ? "text-green-800" : "text-blue-700"
                  }`}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 7l1.5 1.5L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {category}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {placedItems.map((itemId) => {
                    const item = q.itemsToCategorize.find((i) => i.id === itemId);
                    const correct = allPlaced ? isItemCorrect(itemId, category) : null;

                    return (
                      <button
                        key={itemId}
                        type="button"
                        onClick={() => clearPlacement(itemId)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-colors ${correct === true
                          ? "bg-green-100 text-green-800 border-green-400 cursor-default"
                          : correct === false
                            ? "bg-red-100 text-red-800 border-red-400 cursor-default"
                            : "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                          }`}
                      >
                        {item?.text ?? itemId}
                        {correct === null && <span className="text-green-500 text-xs leading-none">✕</span>}
                      </button>
                    );
                  })}
                  {!hasItems && (
                    <span className="text-[12px] lg:text-[14px] text-blue-300 italic">
                      এখানে টেনে আনুন
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Feedback banner ── */}
      {allPlaced && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${isAllCorrect
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
            }`}
        >
          <span className="text-base">{isAllCorrect ? "✅" : "❌"}</span>
          {isAllCorrect ? "সঠিক উত্তর! চমৎকার!" : "ভুল হয়েছে!"}
        </div>
      )}
    </div>
  );
}