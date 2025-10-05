export type BlogPost = {
  id: number;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Terminal Interfaces in React",
    date: "2025-01-15",
    readTime: "5 min read",
    tags: ["react", "ui", "terminal"],
    content: `<p>Terminal interfaces offer a unique way to interact with web applications. They provide a <strong>distraction-free environment</strong> focused on content and keyboard efficiency.</p>

<p>In this post, we explore how to build terminal-style interfaces using React and modern web technologies. The key is to capture keyboard events effectively and provide clear visual feedback.</p>

<h3>Key considerations:</h3>
<ul>
  <li>Keyboard event handling</li>
  <li>Command parsing and execution</li>
  <li>History management</li>
  <li>Visual feedback for user actions</li>
</ul>

<h3>Terminal UIs are particularly effective for:</h3>
<ul>
  <li>Developer tools and documentation</li>
  <li>Blog platforms focused on technical content</li>
  <li>Command-line tool demonstrations</li>
  <li>Minimalist content presentation</li>
</ul>

<p>The aesthetic appeals to developers and creates a <em>unique brand identity</em> that stands out from traditional blog layouts.</p>`,
  },
  {
    id: 2,
    title: "The Art of Keyboard Navigation",
    date: "2025-01-10",
    readTime: "4 min read",
    tags: ["accessibility", "ux", "keyboard"],
    content: `<p>Keyboard navigation is essential for <strong>accessibility</strong> and power users. Many users prefer keyboard shortcuts over mouse interactions for speed and efficiency.</p>

<h3>Best practices for keyboard navigation:</h3>
<ol>
  <li>Provide clear visual indicators for focused elements</li>
  <li>Support standard keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)</li>
  <li>Allow Escape key to cancel or go back</li>
  <li>Use arrow keys for navigation</li>
  <li>Implement Tab order logically</li>
</ol>

<h3>Accessibility benefits:</h3>
<ul>
  <li>Screen reader compatibility</li>
  <li>Motor disability accommodation</li>
  <li>Faster navigation for power users</li>
  <li>Reduced reliance on pointing devices</li>
</ul>

<p>When designing keyboard-first interfaces, always provide <strong>documentation for available shortcuts</strong> and commands. Users should never feel lost or unable to discover functionality.</p>`,
  },
  {
    id: 3,
    title: "Minimalism in Web Design",
    date: "2025-01-05",
    readTime: "6 min read",
    tags: ["design", "minimalism", "web"],
    content: `<p>Minimalist design removes unnecessary elements to focus on what matters: <strong>content and functionality</strong>. This approach has gained popularity as users become overwhelmed by cluttered interfaces.</p>

<h3>Principles of minimalist web design:</h3>
<ul>
  <li>Use whitespace effectively</li>
  <li>Limit color palette (3-5 colors maximum)</li>
  <li>Choose typography carefully</li>
  <li>Remove decorative elements</li>
  <li>Focus on content hierarchy</li>
</ul>

<h3>Benefits:</h3>
<ul>
  <li>Faster load times</li>
  <li>Better mobile experience</li>
  <li>Improved focus and readability</li>
  <li>Easier maintenance</li>
  <li>Timeless aesthetic</li>
</ul>

<p>Terminal interfaces represent an <em>extreme form of minimalism</em>, stripping away all visual chrome to present pure content. This creates a focused reading experience that many users find refreshing.</p>

<blockquote>The challenge is balancing minimalism with usability. Too minimal and users get lost; too complex and you lose the benefits.</blockquote>`,
  },
  {
    id: 4,
    title: "Command-Line Interfaces for the Web",
    date: "2024-12-28",
    readTime: "7 min read",
    tags: ["cli", "web", "development"],
    content: `<p>Command-line interfaces (CLIs) have been around since the early days of computing. They offer <strong>precision, speed, and composability</strong> that graphical interfaces often lack.</p>

<p>Bringing CLI concepts to the web creates interesting opportunities:</p>

<h3>Interactive documentation:</h3>
<ul>
  <li>Users can try commands directly</li>
  <li>Immediate feedback on syntax</li>
  <li>Progressive disclosure of features</li>
</ul>

<h3>Developer tools:</h3>
<ul>
  <li>API exploration</li>
  <li>Configuration management</li>
  <li>Deployment interfaces</li>
</ul>

<h3>Content platforms:</h3>
<ul>
  <li>Unique reading experience</li>
  <li>Keyboard-first navigation</li>
  <li>Nostalgic aesthetic</li>
</ul>

<h3>Implementation considerations:</h3>
<ul>
  <li>Command parsing and validation</li>
  <li>Auto-completion</li>
  <li>Command history</li>
  <li>Error handling</li>
  <li>Help documentation</li>
</ul>

<p>The web CLI bridges the gap between traditional terminal applications and modern web technologies, creating a <em>hybrid experience</em> that appeals to technical audiences.</p>`,
  },
  {
    id: 5,
    title: "Typography in Monospace",
    date: "2024-12-20",
    readTime: "5 min read",
    tags: ["typography", "design", "fonts"],
    content: `<p>Monospace fonts are essential for terminal interfaces and code display. Each character occupies the same width, creating <strong>perfect alignment</strong> and a distinctive aesthetic.</p>

<h3>Popular monospace fonts:</h3>
<ul>
  <li><code>Fira Code</code> (with ligatures)</li>
  <li><code>JetBrains Mono</code></li>
  <li><code>Source Code Pro</code></li>
  <li><code>IBM Plex Mono</code></li>
  <li><code>Geist Mono</code></li>
</ul>

<h3>Advantages of monospace:</h3>
<ul>
  <li>Perfect alignment for tables and ASCII art</li>
  <li>Easier to scan code</li>
  <li>Distinctive technical aesthetic</li>
  <li>Consistent character spacing</li>
</ul>

<h3>When using monospace for body text, consider:</h3>
<ul>
  <li>Slightly larger font sizes (16px minimum)</li>
  <li>Increased line height (1.6-1.8)</li>
  <li>Adequate letter spacing</li>
  <li>Sufficient contrast</li>
</ul>

<p>Monospace typography creates a <em>unique reading experience</em> that signals technical content and appeals to developer audiences. It's not suitable for all contexts, but when used appropriately, it creates a strong visual identity.</p>`,
  },
  {
    id: 6,
    title: "Optimizing React Rendering in Terminal UIs",
    date: "2024-12-15",
    readTime: "6 min read",
    tags: ["react", "performance", "terminal"],
    content: `<p>Optimizing rendering in React terminal-style UIs requires <strong>minimizing re-renders</strong> and avoiding heavy DOM operations.</p>
<ul>
  <li>Use memoization (<code>React.memo</code>, <code>useMemo</code>, <code>useCallback</code>)</li>
  <li>Defer expensive work off the main thread</li>
  <li>Batch updates and keep components small</li>
</ul>
<p>Measure, don't guess. Profile interactions regularly.</p>`,
  },
  {
    id: 7,
    title: "Designing Command Parsers",
    date: "2024-12-10",
    readTime: "8 min read",
    tags: ["cli", "parsing", "design"],
    content: `<p>Command parsers translate user input into <strong>structured intents</strong>.</p>
<ul>
  <li>Define grammar and tokens up front</li>
  <li>Provide helpful errors and suggestions</li>
  <li>Support aliases and abbreviations</li>
</ul>
<p>Robust parsers improve discoverability and trust.</p>`,
  },
  {
    id: 8,
    title: "Building a Help System",
    date: "2024-12-05",
    readTime: "4 min read",
    tags: ["docs", "ux"],
    content: `<p>A great help system surfaces <strong>contextual guidance</strong> without getting in the way.</p>
<ul>
  <li>Inline hints and cheat-sheets</li>
  <li>Searchable commands</li>
  <li>Link to deeper docs</li>
</ul>`,
  },
  {
    id: 9,
    title: "Theming with OKLCH",
    date: "2024-12-01",
    readTime: "5 min read",
    tags: ["css", "color", "oklch"],
    content: `<p>OKLCH gives perceptually uniform colors. It makes <strong>consistent theming</strong> easier.</p>
<ul>
  <li>Use <code>oklch()</code> for dynamic theming</li>
  <li>Respect contrast ratios</li>
  <li>Test in light and dark modes</li>
</ul>`,
  },
  {
    id: 10,
    title: "Accessible Color Contrast",
    date: "2024-11-28",
    readTime: "5 min read",
    tags: ["a11y", "design", "color"],
    content: `<p>Color contrast ensures content is <strong>readable for everyone</strong>.</p>
<ul>
  <li>Target WCAG AA/AAA where appropriate</li>
  <li>Use tools to evaluate contrast</li>
  <li>Don't rely on color alone</li>
</ul>`,
  },
  {
    id: 11,
    title: "Animating with Tailwind",
    date: "2024-11-25",
    readTime: "4 min read",
    tags: ["tailwind", "animation"],
    content: `<p>Subtle animations enhance <strong>feedback and delight</strong> in terminal UIs.</p>
<ul>
  <li>Leverage utility classes and keyframes</li>
  <li>Prefer motion-reduced alternatives</li>
  <li>Keep durations short</li>
</ul>`,
  },
  {
    id: 12,
    title: "State Machines for UI Flow",
    date: "2024-11-20",
    readTime: "7 min read",
    tags: ["xstate", "state", "architecture"],
    content: `<p>State machines make complex flows <strong>predictable</strong> and testable.</p>
<ul>
  <li>Enumerate states and transitions</li>
  <li>Model side-effects explicitly</li>
  <li>Visualize your machine</li>
</ul>`,
  },
  {
    id: 13,
    title: "Keyboard Testing Strategies",
    date: "2024-11-18",
    readTime: "6 min read",
    tags: ["testing", "accessibility", "jest"],
    content: `<p>Automate keyboard testing to prevent <strong>regressions</strong>.</p>
<ul>
  <li>Simulate key events in tests</li>
  <li>Assert focus management</li>
  <li>Snapshot help/shortcut overlays</li>
</ul>`,
  },
  {
    id: 14,
    title: "SSR and Hydration Gotchas",
    date: "2024-11-15",
    readTime: "7 min read",
    tags: ["nextjs", "ssr", "hydration"],
    content: `<p>Hydration mismatches cause <strong>unexpected bugs</strong>.</p>
<ul>
  <li>Guard DOM usage behind effects</li>
  <li>Keep markup deterministic</li>
  <li>Feature-flag client-only pieces</li>
</ul>`,
  },
  {
    id: 15,
    title: "Content Security in HTML",
    date: "2024-11-12",
    readTime: "6 min read",
    tags: ["security", "html", "xss"],
    content: `<p>Rendering HTML requires <strong>defense-in-depth</strong>.</p>
<ul>
  <li>Sanitize untrusted content</li>
  <li>Use CSP headers</li>
  <li>Avoid inline scripts/styles</li>
</ul>`,
  },
  {
    id: 16,
    title: "Virtualized Lists vs Simplicity",
    date: "2024-11-10",
    readTime: "5 min read",
    tags: ["performance", "lists"],
    content: `<p>Virtualization improves performance but adds <strong>complexity</strong>.</p>
<ul>
  <li>Measure list size and costs</li>
  <li>Prefer simple lists when possible</li>
  <li>Optimize rendering hot paths</li>
</ul>`,
  },
  {
    id: 17,
    title: "When to Use Web Workers",
    date: "2024-11-08",
    readTime: "6 min read",
    tags: ["workers", "performance"],
    content: `<p>Workers offload heavy tasks from the <strong>main thread</strong>.</p>
<ul>
  <li>Parse/format large data</li>
  <li>Search and indexing</li>
  <li>Image processing</li>
</ul>`,
  },
  {
    id: 18,
    title: "Command Palette UX",
    date: "2024-11-05",
    readTime: "5 min read",
    tags: ["ux", "command", "palette"],
    content: `<p>Command palettes improve <strong>discoverability</strong>.</p>
<ul>
  <li>Fuzzy search with clear ranking</li>
  <li>Keyboard-first interactions</li>
  <li>Context-aware commands</li>
</ul>`,
  },
  {
    id: 19,
    title: "Caching Strategies for Blogs",
    date: "2024-11-02",
    readTime: "6 min read",
    tags: ["caching", "cdn", "stale-while-revalidate"],
    content: `<p>Cache wisely to balance <strong>freshness and performance</strong>.</p>
<ul>
  <li>Leverage CDN edge caching</li>
  <li>Use SWR patterns</li>
  <li>Invalidate on content changes</li>
</ul>`,
  },
  {
    id: 20,
    title: "SEO for Developer Blogs",
    date: "2024-10-30",
    readTime: "5 min read",
    tags: ["seo", "content", "meta"],
    content: `<p>Developers read blogs too—make them <strong>discoverable</strong>.</p>
<ul>
  <li>Semantic HTML and headings</li>
  <li>Meta tags and open graph</li>
  <li>Fast, mobile-friendly pages</li>
</ul>`,
  },
  {
    id: 21,
    title: "Progressive Disclosure Patterns",
    date: "2024-10-28",
    readTime: "5 min read",
    tags: ["ux", "design", "patterns"],
    content: `<p>Reveal complexity <strong>as needed</strong>.</p>
<ul>
  <li>Inline expand/collapse</li>
  <li>Multi-step wizards</li>
  <li>Hover/tooltips for hints</li>
</ul>`,
  },
  {
    id: 22,
    title: "Routing in Next.js App Router",
    date: "2024-10-25",
    readTime: "7 min read",
    tags: ["nextjs", "routing", "app-router"],
    content: `<p>The App Router simplifies <strong>layout and data</strong>.</p>
<ul>
  <li>Nested layouts and parallel routes</li>
  <li>Streaming and Suspense</li>
  <li>Server actions and caching</li>
</ul>`,
  },
  {
    id: 23,
    title: "Shallow vs Deep Copy in JS",
    date: "2024-10-22",
    readTime: "4 min read",
    tags: ["javascript", "fundamentals"],
    content: `<p>Know when copies are <strong>shallow</strong> vs <strong>deep</strong>.</p>
<ul>
  <li>Spread vs structuredClone</li>
  <li>Immutability and pitfalls</li>
  <li>Performance trade-offs</li>
</ul>`,
  },
  {
    id: 24,
    title: "Form UX Without Mouse",
    date: "2024-10-20",
    readTime: "5 min read",
    tags: ["a11y", "forms", "keyboard"],
    content: `<p>Design forms for <strong>keyboard-only</strong> users.</p>
<ul>
  <li>Logical tab order</li>
  <li>Visible focus styles</li>
  <li>Clear error recovery</li>
</ul>`,
  },
  {
    id: 25,
    title: "Error Handling that Helps",
    date: "2024-10-18",
    readTime: "5 min read",
    tags: ["errors", "ux", "logging"],
    content: `<p>Good errors are <strong>actionable</strong> and friendly.</p>
<ul>
  <li>Tell users what happened</li>
  <li>Offer next steps</li>
  <li>Log details for developers</li>
</ul>`,
  },
  {
    id: 26,
    title: "Monitoring Frontend Performance",
    date: "2024-10-15",
    readTime: "6 min read",
    tags: ["performance", "metrics", "web-vitals"],
    content: `<p>Track performance with <strong>field data</strong>.</p>
<ul>
  <li>Largest Contentful Paint</li>
  <li>Interaction to Next Paint</li>
  <li>Cumulative Layout Shift</li>
</ul>`,
  },
  {
    id: 27,
    title: "Dark Mode Done Right",
    date: "2024-10-12",
    readTime: "4 min read",
    tags: ["dark-mode", "design", "css"],
    content: `<p>Dark mode should be <strong>comfortable</strong> and readable.</p>
<ul>
  <li>Choose pleasant contrast levels</li>
  <li>Handle images and charts</li>
  <li>Respect system preference</li>
</ul>`,
  },
  {
    id: 28,
    title: "Typography Scale in Mono",
    date: "2024-10-10",
    readTime: "5 min read",
    tags: ["typography", "design", "mono"],
    content: `<p>Monospace needs a thoughtful <strong>type scale</strong>.</p>
<ul>
  <li>Use modular scales</li>
  <li>Balance line-height</li>
  <li>Mind punctuation and symbols</li>
</ul>`,
  },
  {
    id: 29,
    title: "Writing Maintainable Styles",
    date: "2024-10-08",
    readTime: "5 min read",
    tags: ["css", "architecture", "stylelint"],
    content: `<p>Maintainable CSS reduces <strong>entropy</strong>.</p>
<ul>
  <li>Use utilities or BEM</li>
  <li>Modularize and lint</li>
  <li>Document design tokens</li>
</ul>`,
  },
  {
    id: 30,
    title: "Deploying to Vercel",
    date: "2024-10-05",
    readTime: "4 min read",
    tags: ["vercel", "deployment", "nextjs"],
    content: `<p>Vercel makes deployment <strong>frictionless</strong>.</p>
<ul>
  <li>Preview deployments per PR</li>
  <li>Environment variables</li>
  <li>Observability and logs</li>
</ul>`,
  },
];
