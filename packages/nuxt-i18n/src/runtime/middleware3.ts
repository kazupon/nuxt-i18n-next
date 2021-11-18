// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (context: any) => {
  const { app, isHMR } = context
  console.log('middleware3', context, '----', context.route)

  if (isHMR) {
    return
  }

  if (app.$i18n) {
    const [status, redirectPath, preserveQuery] = await app.$i18n.__onNavigate(
      context.route
    )
    if (status && redirectPath) {
      const query = preserveQuery ? context.route.query : undefined
      context.redirect(status, redirectPath, query)
    }
  }
}
