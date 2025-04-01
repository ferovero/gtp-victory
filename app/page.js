'use client'
import { BuilderComponent, builder } from '@builder.io/react'

builder.init('c68c3c02570a4745a92bbb7557b1e04c')

export default function Home() {
  return (
    <BuilderComponent
      model="gpt-victory"
      content={{ entry: '7f9f338dda63f4da79876830729b23892' }}
    />
  )
}
