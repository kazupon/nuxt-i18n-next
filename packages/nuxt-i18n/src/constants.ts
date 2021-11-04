const MODULE_DEV_BASIC_ENTRIES = {
  '@intlify/shared': '@intlify/shared/dist/shared.esm-bundler.js',
  '@intlify/core-base': '@intlify/core-base/dist/core-base.esm-bundler.js',
  '@vue/devtools-api': '@vue/devtools-api/lib/esm/index.js',
  '@intlify/devtools-if': '@intlify/devtools-if/dist/devtools-if.esm-bundler.js'
}

const MODULE_PROD_BASIC_ENTRIES = {
  '@intlify/shared': '@intlify/shared/dist/shared.esm-bundler.js',
  '@intlify/core-base': '@intlify/core-base/dist/core-base.esm-bundler.js',
  '@vue/devtools-api': '@vue/devtools-api/lib/esm/index.js',
  '@intlify/devtools-if': '@intlify/devtools-if/dist/devtools-if.esm-bundler.js'
}

export const MODULE_DEV_BRIDGE_ENTRIES = Object.assign(
  {},
  MODULE_DEV_BASIC_ENTRIES,
  {
    'vue-i18n-bridge': 'vue-i18n-bridge/dist/vue-i18n-bridge.esm-bundler.js'
  }
)

export const MODULE_PROD_BRIDGE_ENTRIES = Object.assign(
  {},
  MODULE_PROD_BASIC_ENTRIES,
  {
    'vue-i18n-bridge':
      'vue-i18n-bridge/dist/vue-i18n-bridge.runtime.esm-bundler.js'
  }
)
