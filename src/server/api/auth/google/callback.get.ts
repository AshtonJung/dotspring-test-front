export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const error = query.error as string

  if (error) {
    return sendRedirect(event, `/users/login?error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    return sendRedirect(event, '/users/login?error=no_code')
  }

  const config = useRuntimeConfig()
  const clientId = process.env.GOOGLE_CLIENT_ID || config.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || config.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || config.GOOGLE_REDIRECT_URI
  const fastapiBase = config.fastapiBaseUrl || 'http://127.0.0.1:8000'

  try {
    // 1. 구글 인증 코드 → 액세스 토큰 교환
    const tokenResponse: any = await $fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
    })

    const googleAccessToken = tokenResponse.access_token

    // 2. 구글 사용자 프로필 조회
    const profile: any = await $fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    })

    // 3. FastAPI /auth/google 호출 → 우리 JWT 발급
    const authRes: any = await $fetch(`${fastapiBase}/auth/google`, {
      method: 'POST',
      body: {
        google_sub: profile.id,
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
      },
    })

    // 4. 우리 JWT를 쿠키에 저장
    setCookie(event, 'access_token', authRes.access_token, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,  // 24시간
    })
    setCookie(event, 'auth_header', `Bearer ${authRes.access_token}`, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    // 5. 구글 캘린더 토큰도 저장
    setCookie(event, 'GOOGLE_AT', googleAccessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenResponse.expires_in,
      path: '/',
    })
    if (tokenResponse.refresh_token) {
      setCookie(event, 'GOOGLE_RT', tokenResponse.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      })
    }

    // 6. 토큰 정보를 쿼리로 넘겨서 클라이언트 sessionStorage에도 저장
    const params = new URLSearchParams({
      token: authRes.access_token,
      username: authRes.username,
      user_id: String(authRes.user_id),
    })
    return sendRedirect(event, `/todo/todo?${params.toString()}`)
  } catch (error: any) {
    console.error('Google OAuth Error:', error.data || error.message)
    throw createError({ statusCode: 500, statusMessage: 'Google 로그인에 실패했습니다.' })
  }
})
