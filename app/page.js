'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [html, setHtml] = useState('')

  useEffect(() => {
    fetch('https://cdn.builder.io/api/v1/html/gpt-victory?url=/&apiKey=c68c3c02570a4745a92bbb7557b1e04c')
      .then(res => res.text())
      .then(setHtml)
  }, [])

  if (!html) {
    return <p style={{ color: 'white', padding: 20 }}>Loading landing page…</p>
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
