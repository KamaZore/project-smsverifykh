import { build } from "esbuild";
import { rmSync, mkdirSync, cpSync } from "node:fs";
import { join } from "node:path";

const OUTDIR = "dist";

rmSync(OUTDIR, { recursive: true, force: true });
mkdirSync(OUTDIR, { recursive: true });

cpSync("src/log", join(OUTDIR, "src/log"), { recursive: true });

await build({
  entryPoints: ["src/server.js"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outdir: OUTDIR,
  sourcemap: false,
  minify: true,
  treeShaking: true,
  packages: "external",
});

console.log("Build complete: dist/");
