import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base:'/test/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000
  },
  build:{
	index:path.resolve(_dirname,'./dist/index.html'),
	assetsRoot:path.resolve(_dirname,'./dist'),
	assetsSubDiretctory:'static',
	assetsPublicPath:'./',
  }
})
