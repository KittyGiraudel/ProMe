'use client'

import { App, Button } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

// Adjust these to change the prompt behaviour.
// Visit counting starts at 1 on first mount of CharacterSheet.
export const FIRST_VISIT = 2 // first visit to show the prompt
export const VISIT_WINDOW = 3 // number of visits to keep showing it
const DELAY_MS = 5_000 // ms after mount before showing the notification
const TEST_MODE = process.env.NODE_ENV === 'development' // bypass beforeinstallprompt requirement
const STORAGE_KEY = 'prome:pwa-install:visits'

// BeforeInstallPromptEvent is not in lib.dom.d.ts yet.
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function getVisitCount(): number {
  try {
    return (
      parseInt(globalThis.localStorage?.getItem(STORAGE_KEY) ?? '0', 10) || 0
    )
  } catch {
    return 0
  }
}

function incrementVisitCount(): number {
  const next = getVisitCount() + 1
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, String(next))
  } catch {
    // ignore — storage might be unavailable
  }
  return next
}

export function isEligibleVisit(visitCount: number): boolean {
  return visitCount >= FIRST_VISIT && visitCount < FIRST_VISIT + VISIT_WINDOW
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  if ('standalone' in window.navigator && !!window.navigator.standalone)
    return true
  return window.matchMedia('(display-mode: standalone)').matches
}

function isIOS(): boolean {
  const ua = window.navigator.userAgent.toLowerCase()
  const platform = /(iphone|ipad|ipod|macintosh)/.exec(ua)?.[1]
  const isIpad = platform === 'macintosh' && window.navigator.maxTouchPoints > 1
  return isIpad || (!!platform && platform !== 'macintosh')
}

export function usePWAInstallPrompt() {
  const { notification } = App.useApp()
  const t = useTranslations()
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isStandalone()) return

    const visitCount = incrementVisitCount()
    if (!isEligibleVisit(visitCount)) return

    if (isIOS()) {
      const timeoutId = setTimeout(() => {
        notification.info({
          key: 'pwa-install',
          duration: false,
          placement: 'bottomLeft',
          title: t('pwa.install_prompt.title'),
          description: t('pwa.install_prompt.description_ios'),
        })
      }, DELAY_MS)

      return () => clearTimeout(timeoutId)
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      deferredPrompt.current = event as BeforeInstallPromptEvent
    }

    function handleAppInstalled() {
      notification.destroy('pwa-install')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    const timeoutId = setTimeout(() => {
      if (!TEST_MODE && !deferredPrompt.current) return

      notification.info({
        key: 'pwa-install',
        duration: false,
        placement: 'bottomLeft',
        title: t('pwa.install_prompt.title'),
        description: t('pwa.install_prompt.description'),
        actions: (
          <Button
            type='primary'
            disabled={!TEST_MODE && !deferredPrompt.current}
            onClick={async () => {
              if (deferredPrompt.current) {
                await deferredPrompt.current.prompt()
                const { outcome } = await deferredPrompt.current.userChoice
                deferredPrompt.current = null
              }
              notification.destroy('pwa-install')
            }}>
            {t('pwa.install_prompt.cta')}
          </Button>
        ),
      })
    }, DELAY_MS)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [notification, t])
}
