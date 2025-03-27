import React, { useState } from 'react'
import UploadVideo from './components/UploadVideo'
import VideoPlayer from './components/VideoPlayer'

function App() {
  const [uploadedFile, setUploadedFile] = useState(null)

  return (
    <div className="app-container">
      <header>
        <h1>Scalable CCTV Video Detection</h1>
      </header>
      <main>
        {!uploadedFile ? (
          <UploadVideo onUploadSuccess={setUploadedFile} />
        ) : (
          <VideoPlayer videoFile={uploadedFile} />
        )}
      </main>
      <footer>
        <p>&copy; 2024 EagleEye Vision</p>
      </footer>
    </div>
  )
}

export default App
