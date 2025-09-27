import React from 'react'
import Navbar from '../components/Navbar'

// Replace the entries in this array with your real training videos.
// Supported formats:
// - YouTube/Vimeo URLs (embed via iframe)
// - Direct .mp4/.webm links (rendered via <video>)
const trainingVideos = [
  {
    id: 'intro-sales',
    title: 'Introduction to Sales Fundamentals',
    subtitle: 'Start here to understand the basics',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with your actual YouTube link
    duration: '8:12',
  },
  {
    id: 'product-knowledge',
    title: 'Product Knowledge Deep Dive',
    subtitle: 'Learn key value props and talk tracks',
    url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', // Replace with your actual MP4 link
    duration: '12:05',
  },
  {
    id: 'objection-handling',
    title: 'Objection Handling',
    subtitle: 'Tactics to handle common concerns',
    url: 'https://vimeo.com/395474221', // Replace with your actual Vimeo link
    duration: '9:47',
  },
]

function isEmbedUrl(url) {
  const u = url.toLowerCase()
  return u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com')
}

function toEmbedSrc(url) {
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase()
    // YouTube cases
    if (host.includes('youtube.com')) {
      // https://www.youtube.com/watch?v=VIDEO_ID -> https://www.youtube.com/embed/VIDEO_ID
      const vid = u.searchParams.get('v')
      if (vid) return `https://www.youtube.com/embed/${vid}`
      // already an embed or other path
      if (u.pathname.startsWith('/embed/')) return url
    }
    if (host.includes('youtu.be')) {
      // https://youtu.be/VIDEO_ID -> https://www.youtube.com/embed/VIDEO_ID
      const vid = u.pathname.replace('/', '')
      if (vid) return `https://www.youtube.com/embed/${vid}`
    }
    // Vimeo cases
    if (host.includes('vimeo.com')) {
      // https://vimeo.com/VIDEO_ID -> https://player.vimeo.com/video/VIDEO_ID
      const parts = u.pathname.split('/').filter(Boolean)
      if (parts.length > 0) {
        const vid = parts[0]
        return `https://player.vimeo.com/video/${vid}`
      }
    }
  } catch {}
  return url
}

function VideoCard({ video }){
  return (
    <div className="glass p-4 rounded-2xl">
      <div className="mb-3">
        <div className="font-semibold text-lg">{video.title}</div>
        <div className="text-mute text-sm">{video.subtitle}</div>
      </div>
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        {isEmbedUrl(video.url) ? (
          <iframe
            className="w-full h-full"
            src={toEmbedSrc(video.url)}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video className="w-full h-full" controls>
            <source src={video.url} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-mute">
        <span>ID: {video.id}</span>
        <span>Duration: {video.duration}</span>
      </div>
    </div>
  )
}

export default function DistributorTraining(){
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">Distributor Training</div>
            <div className="text-mute">Watch and learn. Complete the modules to advance your onboarding.</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {trainingVideos.map(v => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>

        <div className="text-sm text-mute">
          Tip: Replace the URLs in <code>src/pages/DistributorTraining.jsx</code> with your actual training links.
        </div>
      </div>
    </div>
  )
}
