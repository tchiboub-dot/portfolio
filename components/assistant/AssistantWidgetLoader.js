'use client'

import dynamic from 'next/dynamic'

const AssistantWidget = dynamic(() => import('@/components/assistant/AssistantWidget'), {
  ssr: false,
})

export default function AssistantWidgetLoader() {
  return <AssistantWidget />
}
