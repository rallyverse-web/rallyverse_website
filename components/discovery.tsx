'use client'

import { useState } from 'react'
import { CategoryStrip } from './category-strip'
import { EventGrid } from './event-grid'

export function Discovery() {
  const [active, setActive] = useState('all')

  return (
    <div id="categories">
      <CategoryStrip active={active} onSelect={setActive} />
      <EventGrid active={active} />
    </div>
  )
}
