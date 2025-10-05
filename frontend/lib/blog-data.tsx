export type BlogPost = {
  id: number
  title: string
  date: string
  readTime: string
  tags: string[]
  content: string
}

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
]
