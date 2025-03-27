import React, { useEffect, useRef, useState } from 'react'

function VideoPlayer({ videoFile }) {
  const [status, setStatus] = useState('Connecting...')
  const [frameSrc, setFrameSrc] = useState(null)
  const wsRef = useRef(null)

  useEffect(() => {
    // Connect to the WebSocket endpoint
    const ws = new WebSocket(`wss://eagleeye-vision.onrender.com/ws/annotated?video=${encodeURIComponent(videoFile)}`)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('Connected. Receiving frames...')
    }

    ws.onmessage = (event) => {
      // Determine if we received text (like "Video ended") or binary (frame data)
      if (typeof event.data === 'string') {
        const data = JSON.parse(event.data)
        if (data.status) {
          setStatus(data.status)
        } else if (data.error) {
          setStatus(`Error: ${data.error}`)
        }
      } else {
        // Convert binary data to a blob URL for the <img>
        const blob = new Blob([event.data], { type: 'image/jpeg' })
        const url = URL.createObjectURL(blob)
        setFrameSrc(url)
      }
    }

    ws.onerror = (error) => {
      setStatus('WebSocket error')
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      setStatus('Disconnected')
    }

    // Clean up on unmount
    return () => {
      ws.close()
    }
  }, [videoFile])

  return (
    <div className="video-player">
      <h2>Analyzed Video Output</h2>
      <p>{status}</p>
      {frameSrc && <img src={frameSrc} alt="Video frame" />}
    </div>
  )
}

export default VideoPlayer
