'use client'

import Link from 'next/link'

interface NavLinkProps {
  href: string
  children: React.ReactNode
  primaryColor: string
}

export default function NavLink({ href, children, primaryColor }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="text-gray-700 transition-colors font-medium"
      onMouseEnter={(e) => {
        e.currentTarget.style.color = primaryColor
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#374151'
      }}
    >
      {children}
    </Link>
  )
}

