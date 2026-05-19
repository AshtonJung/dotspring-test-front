export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) return

  const publicPaths = [
    "/users/login",
    "/users/join-user",
    "/users/find-id",
    "/users/find-pwd",
  ]

  const isPublic = publicPaths.some((path) => to.path.startsWith(path))
  if (isPublic) return

  // /todo 경로만 인증 체크 (기존 w9 등 다른 페이지는 영향 없음)
  const protectedPaths = ["/todo"]
  const needsAuth = protectedPaths.some((path) => to.path.startsWith(path))
  if (!needsAuth) return

  const token = sessionStorage.getItem("DDSP_AT") || (to.query.token as string) || ""
  if (!token) {
    return navigateTo(`/users/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
