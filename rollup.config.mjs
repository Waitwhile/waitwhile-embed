import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dotenv from 'rollup-plugin-dotenv'

const esbuildConfig = {
  target: 'es2017',
  minify: false, // let jsDelivr do the minification
};

export default {
  input: 'src/waitwhile-embed.ts',
  output: {
    format: 'cjs',
    dir: 'dist',
  },
  plugins: [dotenv(), nodeResolve(), esbuild(esbuildConfig)],
};
