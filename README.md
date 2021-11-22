# nuxt-i18n-next

⚠️ This nuxt module is PoC of `@nuxtjs/i18n` next

## Structure

```
.
├── packages
│   └── nuxt-i18n  # development package for `@nuxt/i18n`
└── playground 	# playground for `@nuxt/i18n`
    ├── bridge  # for Nuxt Bridge
    └── nuxt3 	# for Nuxt 3
```

## Requirements
- Node: ^14.16.0 || ^16.11.0 || ^17.0.0
- Package manager
  - development: yarn 3.0.3
  - playground: npm >= 7

## Setup

```sh
# initial setup project env 
yarn

# setup development & playground enviroment
yarn setup

# build next `@nuxt/i18n`
yarn build:i18n

# run the playground
yarn play:bridge # for Nuxt bridge project
yarn play:nuxt3 # for Nuxt 3 project
```

## ©️ LICENSE

MIT
