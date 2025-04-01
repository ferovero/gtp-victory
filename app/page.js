'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [html, setHtml] = useState('')

  useEffect(() => {
    fetch('https://cdn.builder.io/api/v1/html/page?url=/&apiKey=c68c3c02570a4745a92bbb7557b1e04c')
      .then(res => res.text())
      .then(setHtml)
  }, [])

  return (
    <main>
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p style={{ color: 'white', padding: 32 }}>Loading content from Builder...</p>
      )}
    </main>
  )
}
