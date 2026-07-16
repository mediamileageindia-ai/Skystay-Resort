import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')

  const PLACE_ID = (process.env.GOOGLE_PLACE_ID ?? '').replace(/^﻿/, '')
  const API_KEY  = (process.env.GOOGLE_MAPS_API_KEY ?? '').replace(/^﻿/, '')

  if (!PLACE_ID || !API_KEY) {
    return res.status(200).json({ reviews: [], overallRating: null, totalRatings: null })
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(PLACE_ID)}&fields=reviews,rating,user_ratings_total&language=en&key=${API_KEY}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      return res.status(200).json({ reviews: [], overallRating: null, totalRatings: null })
    }

    const place = data.result
    const reviews = (place.reviews ?? []).map((r: any) => ({
      name:         r.author_name,
      rating:       r.rating,
      comment:      r.text,
      date:         r.relative_time_description,
      profilePhoto: r.profile_photo_url ?? null,
    }))

    return res.status(200).json({
      reviews,
      overallRating: place.rating ?? null,
      totalRatings:  place.user_ratings_total ?? null,
    })
  } catch {
    return res.status(200).json({ reviews: [], overallRating: null, totalRatings: null })
  }
}
