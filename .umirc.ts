import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/fabric", component: "fabric" },
    { path: "/docs", component: "docs" },
    { path: "/", component: "index" },
  ],
  npmClient: 'yarn',
  history: {
    type: 'hash'
  }
});
