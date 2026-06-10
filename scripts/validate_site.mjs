

async function validateSitemap() {
  console.log('\n--- Validating Sitemap ---')
  const res = await fetch('http://localhost:3000/sitemap.xml')
  const text = await res.text()
  
  const requiredPaths = [
    'https://rallyverse.social/about',
    'https://rallyverse.social/services',
    'https://rallyverse.social/partners',
    'https://rallyverse.social/community',
    'https://rallyverse.social/events',
    'https://rallyverse.social/believers',
    'https://rallyverse.social/contact',
    'https://rallyverse.social/case-studies',
    'https://rallyverse.social/insights',
    'https://rallyverse.social/privacy-policy',
    'https://rallyverse.social/terms-and-conditions'
  ]

  let allExist = true
  for (const path of requiredPaths) {
    if (text.includes(path)) {
      console.log(`✅ Sitemap includes: ${path}`)
    } else {
      console.error(`❌ Sitemap MISSING: ${path}`)
      allExist = false
    }
  }
  return allExist
}

async function validateRobots() {
  console.log('\n--- Validating Robots.txt ---')
  const res = await fetch('http://localhost:3000/robots.txt')
  const text = await res.text()

  const requiredRules = [
    'Disallow: /admin',
    'Disallow: /admin/*',
    'Disallow: /event-admin',
    'Disallow: /event-admin/*'
  ]

  let allExist = true
  for (const rule of requiredRules) {
    if (text.includes(rule)) {
      console.log(`✅ Robots.txt includes: ${rule}`)
    } else {
      console.error(`❌ Robots.txt MISSING: ${rule}`)
      allExist = false
    }
  }
  return allExist
}

async function validateMetadata() {
  console.log('\n--- Validating Page Metadata ---')
  const pages = [
    { path: '/', name: 'Home' },
    { path: '/services', name: 'Services' },
    { path: '/partners', name: 'Partners' },
    { path: '/community', name: 'Community' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' }
  ]

  const metadataMap = new Map()

  for (const page of pages) {
    try {
      const res = await fetch(`http://localhost:3000${page.path}`)
      const text = await res.text()

      // Extract title
      const titleMatch = text.match(/<title>([^<]+)<\/title>/)
      const title = titleMatch ? titleMatch[1].trim() : 'MISSING'

      // Extract description
      const descMatch = text.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || text.match(/<meta\s+content="([^"]+)"\s+name="description"/i)
      const description = descMatch ? descMatch[1].trim() : 'MISSING'

      console.log(`Page: ${page.name} (${page.path})`)
      console.log(`  Title: "${title}"`)
      console.log(`  Description: "${description}"`)

      if (title === 'MISSING' || description === 'MISSING') {
        console.error('  ❌ Title or Description is missing')
        continue
      }

      if (metadataMap.has(title)) {
        console.error(`  ❌ DUPLICATE TITLE with ${metadataMap.get(title)}`)
      } else {
        metadataMap.set(title, page.name)
      }

      if (metadataMap.has(description)) {
        console.error(`  ❌ DUPLICATE DESCRIPTION with ${metadataMap.get(description)}`)
      } else {
        metadataMap.set(description, page.name)
      }
      
      console.log('  ✅ Unique title and description verified')

    } catch (err) {
      console.error(`  ❌ Failed to fetch ${page.name}:`, err.message)
    }
  }
}

async function run() {
  await validateSitemap()
  await validateRobots()
  await validateMetadata()
}

run()
