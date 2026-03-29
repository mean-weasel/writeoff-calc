import type { Metadata } from 'next'
import Link from 'next/link'
import { posts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Tax Tips for W-2 Employees With a Side Business',
  description:
    'Guides on quarterly estimated taxes, self-employment tax rates, home office deductions, and write-offs for W-2 employees with an LLC.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  return (
    <main className="blog-page">
      <h1>Tax Tips & Guides</h1>
      <p className="blog-subtitle">Practical tax guides for W-2 employees with a side business or LLC.</p>
      <div className="blog-list">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
            <time dateTime={post.date}>
              {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
