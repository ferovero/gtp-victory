'use client'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [html, setHtml] = useState('')

  useEffect(() => {
    fetch('https://cdn.builder.io/api/v1/html/page?entry=927e74aae4d74ab6a506f8f04d8847e2&apiKey=c68c3c02570a4745a92bbb7557b1e04c')
      .then(res => res.text())
      .then(setHtml)
  }, [])

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}
