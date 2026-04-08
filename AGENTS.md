<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Ant Design

- Default to using Ant Design components instead of creating them.
- Do not override the Ant Design styles unless deemed necessary or requested.
  - Do not use inline styles, use a separate stylesheet.
  - Use PascalCase BEM style convention for CSS class names.
- Prefer using the `Space` component for layout and spacing purposes.
  - Remember the `direction` prop is outdated for `Space`: use `orientation`.
- Use `rgb(r g b / a)` format, not `rgba(r, g, b, a)`.
- Use `em` unit over `px` and `rem` where it makes sense.
- Ensure WCAG 2.2 requirements are respected.
