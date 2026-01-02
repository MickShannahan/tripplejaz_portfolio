<template>
  <div v-html="parseMD(value)"></div>
</template>


<script>
import { marked } from 'marked';

export default {
  props: {
    value: { type: String, default: '' }
  },
  setup() {
    const renderer = new marked.Renderer()
    renderer.link = (href, title, text) => `<a target="_blank" href="${href}" title="${title}">${text}</a>`

    marked.setOptions({
      renderer,
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false,
      headerIds: false,
      mangle: false,
      langPrefix: 'hljs lang-'
    })

    return {
      parseMD(md) {
        return marked(md)
      }
    }
  }
}
</script>


<style lang="scss" scoped>
// Add styles for consistent formatting
</style>