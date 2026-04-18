<!-- intent-skills:start -->
# Skill mappings - when working in these areas, load the linked skill file into context.
skills:
  - task: "Building with TanStack Start (createStart, StartClient, useServerFn, React-specific imports)"
    load: "node_modules/@tanstack/react-start/skills/react-start/SKILL.md"

  - task: "Writing or editing server functions in src/lib/server-fns.ts (createServerFn, inputValidator, useServerFn)"
    # To load this skill, run: npx @tanstack/intent@latest list | grep server-functions
  - task: "Adding or modifying API endpoints under src/routes/api/ (server routes, createFileRoute server handlers)"
    # To load this skill, run: npx @tanstack/intent@latest list | grep server-routes
  - task: "TanStack Start project setup, Vite plugin config, root route shell, routeTree.gen.ts"
    # To load this skill, run: npx @tanstack/intent@latest list | grep start-core
  - task: "Cloudflare Workers deployment, SSR, prerendering, sitemap, selective SSR"
    # To load this skill, run: npx @tanstack/intent@latest list | grep deployment
  - task: "File-based routing, createRootRoute, route tree generation, layout routes like _app"
    # To load this skill, run: npx @tanstack/intent@latest list | grep router-core
  - task: "Route loaders, data fetching in routes, beforeLoad, router context, caching"
    # To load this skill, run: npx @tanstack/intent@latest list | grep data-loading
  - task: "Link, useNavigate, preloading, navigation blocking, typed routing helpers"
    # To load this skill, run: npx @tanstack/intent@latest list | grep navigation
  - task: "Router plugin config in vite.config.ts (autoCodeSplitting, routesDirectory, .lazy.tsx splits)"
    # To load this skill, run: npx @tanstack/intent@latest list | grep router-plugin
<!-- intent-skills:end -->
