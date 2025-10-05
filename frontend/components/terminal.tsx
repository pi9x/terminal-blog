"use client";

import type React from "react";

import { useState, useEffect, useRef, useMemo } from "react";
import { blogPosts } from "@/lib/blog-data";

type View = "list" | "post" | "help";

export default function Terminal() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [commandMode, setCommandMode] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [filterText, setFilterText] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRowsRef = useRef<HTMLDivElement>(null);
  const selectedRowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commandMode || isFiltering) {
      commandInputRef.current?.focus();
    }
  }, [commandMode, isFiltering]);

  useEffect(() => {
    if (
      currentView === "list" &&
      selectedRowRef.current &&
      tableRowsRef.current
    ) {
      const rowElement = selectedRowRef.current;
      const containerElement = tableRowsRef.current;

      const rowTop = rowElement.offsetTop;
      const rowBottom = rowTop + rowElement.offsetHeight;
      const containerTop = containerElement.scrollTop;
      const containerBottom = containerTop + containerElement.clientHeight;

      if (rowTop < containerTop) {
        containerElement.scrollTop = rowTop;
      } else if (rowBottom > containerBottom) {
        containerElement.scrollTop = rowBottom - containerElement.clientHeight;
      }
    }
  }, [selectedIndex, currentView]);

  // Keep Terminal focused for keyboard navigation without stealing focus from inputs
  useEffect(() => {
    const focusContainer = () => {
      // Defer to end of event loop to avoid interfering with other focus flows
      setTimeout(() => {
        containerRef.current?.focus();
      }, 0);
    };

    const isEditableTarget = (el: EventTarget | null) => {
      const node = el as HTMLElement | null;
      if (!node) return false;
      if (node.isContentEditable) return true;
      return !!node.closest(
        'input, textarea, select, [contenteditable], [contenteditable=""], [contenteditable="true"]',
      );
    };

    const onKeyDownCapture = (e: KeyboardEvent) => {
      if (commandMode || isFiltering) return;
      if (isEditableTarget(e.target)) return;
      if (document.activeElement !== containerRef.current) {
        focusContainer();
      }
    };

    document.addEventListener("keydown", onKeyDownCapture, true);
    return () => {
      document.removeEventListener("keydown", onKeyDownCapture, true);
    };
  }, [commandMode, isFiltering]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (commandMode) {
      if (e.key === "Escape") {
        setCommandMode(false);
        setCommandInput("");
        setTimeout(() => containerRef.current?.focus(), 0);
      } else if (e.key === "Enter") {
        executeCommand(commandInput);
        setCommandMode(false);
        setCommandInput("");
      }
      return;
    }

    if (isFiltering) {
      // Allow exiting filter mode
      if (e.key === "Escape") {
        setIsFiltering(false);
        setFilterText("");
        setTimeout(() => containerRef.current?.focus(), 0);
        return;
      }
      // Confirm filter input (do not open post on Enter while filtering)
      if (e.key === "Enter") {
        setIsFiltering(false);
        return;
      }
      // While filtering, allow navigation without stealing typing
      if (currentView === "list") {
        if (e.key === "j") {
          // Do not prevent default so 'j' is still typed into the filter
          setSelectedIndex((prev) =>
            Math.min(filteredPosts.length - 1, prev + 1),
          );
          return;
        }
        if (e.key === "k") {
          // Do not prevent default so 'k' is still typed into the filter
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          return;
        }
        if (e.key === "ArrowDown") {
          // Prevent caret movement in the input
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(filteredPosts.length - 1, prev + 1),
          );
          return;
        }
        if (e.key === "ArrowUp") {
          // Prevent caret movement in the input
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          return;
        }
        if (e.key === "d" && e.ctrlKey) {
          e.preventDefault();
          const jump = getPageJumpCount(1);
          setSelectedIndex((prev) =>
            Math.min(filteredPosts.length - 1, prev + jump),
          );
          return;
        }
        if (e.key === "u" && e.ctrlKey) {
          e.preventDefault();
          const jump = getPageJumpCount(-1);
          setSelectedIndex((prev) => Math.max(0, prev - jump));
          return;
        }
        if (e.key === "g") {
          setSelectedIndex(0);
          return;
        }
        if (e.key === "G") {
          setSelectedIndex(filteredPosts.length - 1);
          return;
        }
      }
      // Let all other keys type into the filter input
      return;
    }

    if (e.key === ":" && currentView !== "post") {
      e.preventDefault();
      setCommandMode(true);
      return;
    }

    if (e.key === "/" && currentView === "list") {
      e.preventDefault();
      setIsFiltering(true);
      return;
    }

    if (e.key === "?" || e.key === "h") {
      e.preventDefault();
      setCurrentView("help");
      return;
    }

    if (e.key === "q" && currentView !== "list") {
      setCurrentView("list");
      setSelectedPost(null);
      return;
    }

    if (currentView === "list") {
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(filteredPosts.length - 1, prev + 1),
        );
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "g") {
        e.preventDefault();
        setSelectedIndex(0);
      } else if (e.key === "G") {
        e.preventDefault();
        setSelectedIndex(filteredPosts.length - 1);
      } else if (e.key === "d" && e.ctrlKey) {
        e.preventDefault();
        const jump = getPageJumpCount(1);
        setSelectedIndex((prev) =>
          Math.min(filteredPosts.length - 1, prev + jump),
        );
      } else if (e.key === "u" && e.ctrlKey) {
        e.preventDefault();
        const jump = getPageJumpCount(-1);
        setSelectedIndex((prev) => Math.max(0, prev - jump));
      } else if (e.key === "Enter" || e.key === "l" || e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedPost(filteredPosts[selectedIndex].id - 1);
        setCurrentView("post");
      }
    } else if (currentView === "post" || currentView === "help") {
      if (e.key === "Escape" || e.key === "h" || e.key === "ArrowLeft") {
        setCurrentView("list");
        setSelectedPost(null);
        setTimeout(() => containerRef.current?.focus(), 0);
      } else if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        contentRef.current?.scrollBy({ top: 60, behavior: "auto" });
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        contentRef.current?.scrollBy({ top: -60, behavior: "auto" });
      }
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (trimmedCmd === "posts" || trimmedCmd === "p") {
      setCurrentView("list");
      setSelectedIndex(0);
    } else if (trimmedCmd === "help" || trimmedCmd === "h") {
      setCurrentView("help");
    } else if (trimmedCmd === "quit" || trimmedCmd === "q") {
      setCurrentView("list");
    }
  };

  const matchById = new Map<
    number,
    { title: number[]; tags: number[]; content: number[] }
  >();
  const contentTextMap = useMemo(() => {
    const m = new Map<number, string>();
    for (const p of blogPosts) {
      m.set(p.id, htmlToText(p.content));
    }
    return m;
  }, []);

  const filteredPosts = filterText.trim()
    ? [...blogPosts]
        .map((post) => {
          const titleMatch = fuzzyMatch(filterText, post.title);
          const tagsText = post.tags.join(", ");
          const tagsMatch = fuzzyMatch(filterText, tagsText);
          const dateMatch = fuzzyMatch(filterText, post.date);
          const readMatch = fuzzyMatch(filterText, post.readTime);
          const contentText = contentTextMap.get(post.id) || "";
          const contentMatch = fuzzyMatch(filterText, contentText);

          const score =
            (titleMatch?.score || 0) * 3 +
            (tagsMatch?.score || 0) * 2 +
            (contentMatch?.score || 0) * 1 +
            (dateMatch?.score || 0) * 0.5 +
            (readMatch?.score || 0) * 0.5;

          if (score <= 0) return null;

          return {
            post,
            score,
            titleIdx: titleMatch?.indices || [],
            tagsIdx: tagsMatch?.indices || [],
            contentIdx: contentMatch?.indices || [],
          };
        })
        .filter(
          (
            r,
          ): r is {
            post: (typeof blogPosts)[number];
            score: number;
            titleIdx: number[];
            tagsIdx: number[];
            contentIdx: number[];
          } => !!r,
        )
        .sort((a, b) => b.score - a.score)
        .map((r) => {
          matchById.set(r.post.id, {
            title: r.titleIdx,
            tags: r.tagsIdx,
            content: r.contentIdx,
          });
          return r.post;
        })
    : blogPosts;

  function htmlToText(html: string): string {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  const getPreviewText = (html: string, maxLen = 160): string => {
    const clean = htmlToText(html);
    return clean.length > maxLen ? clean.slice(0, maxLen - 1) + "…" : clean;
  };

  // Fuzzy match: returns null if query doesn't match text in order
  function fuzzyMatch(
    query: string,
    text: string,
  ): { score: number; indices: number[] } | null {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const t = text.toLowerCase();

    // Prefer whole-word and contiguous substring matches first
    const len = q.length;
    let pos = -1;
    if (len > 0) {
      let from = 0;
      let firstContiguous = -1;
      while (true) {
        const found = t.indexOf(q, from);
        if (found === -1) break;
        const leftOK = found === 0 || /\W/.test(t[found - 1] || " ");
        const rightOK =
          found + len === t.length || /\W/.test(t[found + len] || " ");
        // Whole word match: both sides are boundaries
        if (leftOK && rightOK) {
          pos = found;
          break;
        }
        if (firstContiguous === -1) firstContiguous = found;
        from = found + 1;
      }
      // If no whole word match found, use any contiguous substring match
      if (pos === -1 && firstContiguous !== -1) pos = firstContiguous;
    }

    if (pos !== -1) {
      const indices = Array.from({ length: len }, (_, i) => pos + i);
      // High base score for contiguous matches; extra for whole-word boundaries
      let score = 50;
      const leftOK = pos === 0 || /\W/.test(t[pos - 1] || " ");
      const rightOK = pos + len === t.length || /\W/.test(t[pos + len] || " ");
      if (leftOK) score += 10;
      if (rightOK) score += 10;
      // Perfect compactness bonus
      score += 10;
      return { score, indices };
    }

    // Fallback: subsequence match with bonuses for consecutive characters and word-starts
    let qi = 0;
    const idx: number[] = [];
    let last = -2;
    let streak = 0;
    let score = 0;

    for (let i = 0; i < t.length && qi < q.length; i++) {
      if (t[i] === q[qi]) {
        idx.push(i);
        if (i === last + 1) {
          streak += 1;
        } else {
          streak = 1;
        }
        last = i;
        score += 1 + streak * 1.5; // reward consecutive chars
        qi++;
      }
    }

    if (qi < q.length) return null;

    // compactness bonus
    const spread = idx.length ? idx[idx.length - 1] - idx[0] + 1 : 0;
    score += Math.max(0, 5 - spread * 0.05);

    // word-start bonus
    idx.forEach((i) => {
      if (i === 0 || /\W/.test(t[i - 1] || " ")) score += 0.5;
    });

    return { score, indices: idx };
  }

  const renderHighlighted = (
    text: string,
    indices: number[] | undefined,
    selected: boolean,
  ) => {
    if (!indices || indices.length === 0) return text;
    const parts: React.ReactNode[] = [];
    let last = 0;
    let i = 0;

    while (i < indices.length) {
      const start = indices[i];
      let end = start + 1;
      while (i + 1 < indices.length && indices[i + 1] === end) {
        i++;
        end++;
      }

      if (last < start) {
        parts.push(text.slice(last, start));
      }

      parts.push(
        <span
          key={start}
          className={
            selected
              ? "bg-accent-foreground/20 text-accent-foreground"
              : "bg-info/20 text-info"
          }
        >
          {text.slice(start, end)}
        </span>,
      );

      last = end;
      i++;
    }

    if (last < text.length) {
      parts.push(text.slice(last));
    }

    return <>{parts}</>;
  };

  const getPageJumpCount = (direction: 1 | -1) => {
    const container = tableRowsRef.current;
    if (!container) return 5;
    const viewport = container.clientHeight;
    const children = Array.from(container.children) as HTMLElement[];
    let sum = 0;
    let count = 0;
    let i = selectedIndex;
    while (true) {
      i += direction;
      if (i < 0 || i >= children.length) break;
      const h = children[i].getBoundingClientRect().height || 0;
      sum += h;
      count += 1;
      if (sum >= viewport - 24) break;
    }
    return Math.max(1, count);
  };

  return (
    <div
      ref={containerRef}
      className="h-full max-w-5xl mx-auto bg-background text-foreground flex flex-col outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-primary text-primary-foreground px-4 py-1 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <span className="font-bold">TUI BLOG</span>
          <span className="text-primary-foreground/70">›</span>
          <span>
            {currentView === "list" && "Posts"}
            {currentView === "post" && `Post ${(selectedPost ?? 0) + 1}`}
            {currentView === "help" && "Help"}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-primary-foreground/70">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "post" : "posts"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {currentView === "list" && (
          <div className="h-full flex flex-col">
            <div ref={tableRowsRef} className="flex-1 overflow-y-auto">
              {filteredPosts.map((post, idx) => (
                <div
                  key={post.id}
                  ref={idx === selectedIndex ? selectedRowRef : null}
                  className={`px-4 py-3 border-b border-border/50 ${
                    idx === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={
                        idx === selectedIndex
                          ? "w-12 shrink-0 text-accent-foreground"
                          : "w-12 shrink-0 text-muted-foreground"
                      }
                    >
                      {post.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-bold">
                        {renderHighlighted(
                          post.title,
                          matchById.get(post.id)?.title,
                          idx === selectedIndex,
                        )}
                      </div>
                      <div
                        className={
                          idx === selectedIndex
                            ? "text-accent-foreground/80 text-xs mt-1"
                            : "text-muted-foreground text-xs mt-1"
                        }
                      >
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime}</span>
                        <span className="mx-2">•</span>
                        <span
                          className={
                            idx === selectedIndex
                              ? "text-accent-foreground"
                              : "text-info"
                          }
                        >
                          {renderHighlighted(
                            post.tags.join(", "),
                            matchById.get(post.id)?.tags,
                            idx === selectedIndex,
                          )}
                        </span>
                      </div>
                      <div
                        className={
                          idx === selectedIndex
                            ? "mt-2 text-sm text-accent-foreground/90"
                            : "mt-2 text-sm text-muted-foreground"
                        }
                      >
                        {(() => {
                          const full = htmlToText(post.content);
                          const indices = matchById.get(post.id)?.content || [];
                          if (!filterText.trim() || indices.length === 0) {
                            return full.length > 160
                              ? full.slice(0, 159) + "…"
                              : full;
                          }
                          const maxLen = 160;
                          const first = indices[0];
                          let start = Math.max(
                            0,
                            first - Math.floor(maxLen / 2),
                          );
                          let end = Math.min(full.length, start + maxLen);
                          if (end - start < maxLen && start > 0) {
                            start = Math.max(0, end - maxLen);
                          }
                          const slice = full.slice(start, end);
                          const inRange = indices
                            .filter((i) => i >= start && i < end)
                            .map((i) => i - start);
                          const leading = start > 0;
                          const trailing = end < full.length;
                          const finalText = `${leading ? "…" : ""}${slice}${trailing ? "…" : ""}`;
                          const adjusted = inRange.map(
                            (i) => i + (leading ? 1 : 0),
                          );
                          return renderHighlighted(
                            finalText,
                            adjusted,
                            idx === selectedIndex,
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === "post" && selectedPost !== null && (
          <div ref={contentRef} className="h-full overflow-y-auto px-6 py-4">
            <div className="max-w-5xl">
              <h1 className="text-2xl font-bold text-accent mb-2">
                {blogPosts[selectedPost].title}
              </h1>
              <div className="flex gap-4 text-sm text-muted-foreground mb-6">
                <span>{blogPosts[selectedPost].date}</span>
                <span>•</span>
                <span>{blogPosts[selectedPost].readTime}</span>
                <span>•</span>
                <span className="text-info">
                  {blogPosts[selectedPost].tags.join(", ")}
                </span>
              </div>
              <div
                className="border-t border-border pt-6 leading-relaxed prose prose-invert prose-sm max-w-none text-sm"
                dangerouslySetInnerHTML={{
                  __html: blogPosts[selectedPost].content,
                }}
              />
            </div>
          </div>
        )}

        {currentView === "help" && (
          <div ref={contentRef} className="h-full overflow-y-auto px-6 py-4">
            <div className="max-w-5xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-accent mb-4">
                  KEYBOARD SHORTCUTS
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">j / ↓</span>
                    <span>Move down</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">k / ↑</span>
                    <span>Move up</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">g</span>
                    <span>Go to top</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">G</span>
                    <span>Go to bottom</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">Enter / l / →</span>
                    <span>Read selected post</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">Esc / h / ←</span>
                    <span>Go back to list</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">/</span>
                    <span>Filter posts</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">:</span>
                    <span>Command mode</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">? / h</span>
                    <span>Show this help</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">q</span>
                    <span>Return to list</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-accent mb-4">COMMANDS</h2>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">:posts / :p</span>
                    <span>Show posts list</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">:help / :h</span>
                    <span>Show help</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-info">:quit / :q</span>
                    <span>Return to list</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-secondary border-t border-border px-4 py-1 flex justify-between items-center text-xs">
        <div className="flex gap-6">
          <span>
            <span className="text-info">?</span> Help
          </span>
          {currentView === "list" && (
            <span>
              <span className="text-info">/</span> Filter
            </span>
          )}
          {(currentView === "list" || currentView === "help") && (
            <span>
              <span className="text-info">:</span> Command
            </span>
          )}
          {currentView === "list" && (
            <>
              <span>
                <span className="text-info">j/k</span> Navigate
              </span>
              <span>
                <span className="text-info">Ctrl+d/u</span> Page
              </span>
              <span>
                <span className="text-info">Enter</span> Read
              </span>
            </>
          )}
          {currentView === "post" && (
            <>
              <span>
                <span className="text-info">j/k</span> Scroll
              </span>
              <span>
                <span className="text-info">Esc</span> Back
              </span>
            </>
          )}
        </div>
        <div className="text-muted-foreground">
          {currentView === "list" &&
            `${selectedIndex + 1}/${filteredPosts.length}`}
        </div>
      </div>

      {commandMode && currentView !== "post" && (
        <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2 max-w-5xl mx-auto">
          <span>:</span>
          <input
            ref={commandInputRef}
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="flex-1 bg-transparent outline-none border-none"
            autoFocus
          />
        </div>
      )}

      {isFiltering && currentView === "list" && (
        <div className="absolute bottom-0 left-0 right-0 bg-accent text-accent-foreground px-4 py-2 flex items-center gap-2 max-w-5xl mx-auto">
          <span>/</span>
          <input
            ref={commandInputRef}
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="flex-1 bg-transparent outline-none border-none"
            placeholder="Filter posts..."
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
