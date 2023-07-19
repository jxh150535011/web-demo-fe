import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/fabric", component: "fabric" },
    { path: "/docs", component: "docs" },
    { path: "/", component: "index" },
  ],
  npmClient: 'yarn',
  runtimePublicPath: {},
  headScripts: process.env.NODE_ENV === 'production' ? [
    'window.publicPath = "./";'
  ]: [],
  publicPath:  process.env.NODE_ENV === 'production' ? './' : '/',
  history: {
    type: 'hash'
  }
});
