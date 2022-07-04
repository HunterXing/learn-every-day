import babel from 'rollup-plugin-babel'
// import typescript from "@rollup/plugin-typescript"
import resolve from '@rollup/plugin-node-resolve';
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/boundle.cjs.js',
    format: 'iife', // 输出格式：amd / esm / iife / umd / cjs / systemd
    name: 'boundleName', // 包的全局变量名称
    sourcemap: true  //生成bundle.map.js文件，方便调试
  },
  plugins: [
    // typescript(),
    babel({
      exclude: ['node_modules/**']
    }),
    resolve()
  ]
}
