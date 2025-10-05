"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
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
      if (e.key === "Escape") {
        setIsFiltering(false);
        setFilterText("");
        setTimeout(() => containerRef.current?.focus(), 0);
      } else if (e.key === "Enter") {
        setIsFiltering(false);
      }
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

  const filteredPosts = filterText
    ? blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(filterText.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(filterText.toLowerCase()),
          ),
      )
    : blogPosts;

  const getPreviewText = (html: string, maxLen = 160): string => {
    // SSR-safe: strip tags with regex instead of using DOM
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ");
    const clean = text.replace(/\s+/g, " ").trim();
    return clean.length > maxLen ? clean.slice(0, maxLen - 1) + "…" : clean;
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
                      <div className="truncate font-bold">{post.title}</div>
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
                          {post.tags.join(", ")}
                        </span>
                      </div>
                      <div
                        className={
                          idx === selectedIndex
                            ? "mt-2 text-sm text-accent-foreground/90"
                            : "mt-2 text-sm text-muted-foreground"
                        }
                      >
                        {getPreviewText(post.content)}
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
