'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [html, setHtml] = useState('')

  useEffect(() => {
    fetch('https://cdn.builder.io/api/v1/html/page?entry=79f338dda63f4da79876830729b23892&apiKey=c68c3c02570a4745a92bbb7557b1e04c')
      .then(res => res.text())
      .then(setHtml)
  }, [])

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}
