import { defineConfig } from "vite";

export default defineConfig({
  base: "/My_new_website/",  // change this
  build: {
    outDir: "docs"           // output goes to /docs instead of /dist
  }
});
