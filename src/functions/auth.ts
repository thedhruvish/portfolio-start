import { createIsomorphicFn, createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { redirect } from '@tanstack/react-router'
import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'

const LoginInput = z.object({
  email: z.email(),
  password: z.string(),
  turnstileToken: z.string(),
})

const COOKIE_NAME = 'Auth'

const isValidTurnstileToken = createIsomorphicFn().server(
  async (turnstileToken: string) => {
    const formData = new FormData()
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY!)
    formData.append('response', turnstileToken)
    const turnstileResult = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      },
    )

    const turnstileOutcome = await turnstileResult.json()
    if (!turnstileOutcome.success) {
      throw new Error('Invalid Turnstile Token')
    }
    return true
  },
)

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => LoginInput.parse(data))
  .handler(async ({ data }) => {
    // 1. Verify Turnstile
    await isValidTurnstileToken(data.turnstileToken)

    // 2. Verify Credentials
    if (
      data.email !== process.env.ADMIN_EMAIL ||
      data.password !== process.env.ADMIN_PASSWORD
    ) {
      throw new Error('Invalid credentials')
    }
    setCookie(COOKIE_NAME, data.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 2,
    })
    redirect({
      to: '/admin',
    })
  })

export const logoutFn = createServerFn().handler(() => {
  deleteCookie(COOKIE_NAME)
  throw redirect({ to: '/' })
})

export const checkAuthFn = createServerFn().handler(() => {
  const cookie = getCookie(COOKIE_NAME)
  console.log(cookie)
  if (!cookie) {
    return false
  }
  return true
})
