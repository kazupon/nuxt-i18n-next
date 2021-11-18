// @ts-ignore
import nuxtMiddleware from '../middleware'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const i18nMiddleware = async (context: any) => {
  const { app, isHMR } = context
  console.log('middleware2', context.route)

  if (isHMR) {
    return
  }

  const [status, redirectPath, preserveQuery] = await app.$i18n.__onNavigate(
    context.route
  )
  if (status && redirectPath) {
    const query = preserveQuery ? context.route.query : undefined
    context.redirect(status, redirectPath, query)
  }
}

nuxtMiddleware.nuxti18n = i18nMiddleware
