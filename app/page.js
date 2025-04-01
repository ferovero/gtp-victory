'use client'
import { BuilderComponent, builder } from '@builder.io/react'
builder.init('c68c3c02570a4745a92bbb7557b1e04c')

export default function Home() {
  return (
    <div>
      <BuilderComponent model="page" content={{ url: '/' }} />
    </div>
  )
}
