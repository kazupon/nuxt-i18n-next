import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  emitCJS: false,
  entries: ['src/module']
})
