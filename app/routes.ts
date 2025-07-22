import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes"

export default [
  layout("./routes/_layout.tsx", [
    index("./routes/landing/index.tsx"),
    // route("/:username", "./routes/guest/donate-by-username.tsx"),
    //
  ]),
  layout("./routes/auth/_layout.tsx", [
    route("/dashboard", "./routes/auth/dashboard/index.tsx"),
    ...prefix("/overlays", [
      index("./routes/auth/overlays/index.tsx"),
      route("/mediashare", "./routes/auth/overlays/mediashare/index.tsx"),
      route("/alerts", "./routes/auth/overlays/alerts/index.tsx"),
    ]),

    ...prefix("/profile", [
      index("./routes/auth/profile/index.tsx"),
      //
    ]),
    //
    ...prefix("/history", [
      index("./routes/auth/history/index.tsx"),
      //
    ]),
  ]),

  layout("./routes/owner/_layout.tsx", [
    ...prefix("/owner", [
      index("./routes/owner/index.tsx"),
      //
    ]),
  ]),

  route("/alerts", "./routes/guest/alert.tsx"),
  route("/mediashare", "./routes/guest/mediashare.tsx"),
  route("/qr", "./routes/guest/qr.tsx"),
  // route("/reducer", "./routes/guest/reducer.tsx"),
  route("/:username", "./routes/guest/donate-by-username/index.tsx"),

  route("/connect", "./routes/auth/connect.tsx"),
] satisfies RouteConfig
