import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("track-one", "routes/track-one/index.tsx"),
  route("track-one/about", "routes/track-one/about/index.tsx"),
] satisfies RouteConfig;
