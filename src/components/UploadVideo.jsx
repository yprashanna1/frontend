import React, { useState } from 'react'

function UploadVideo({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e) => {
    setError('')
    const file = e.target.files[0]
    if (file && file.type !== 'video/mp4') {
      setError('Only MP4 files are allowed.')
      return
    }
    setSelectedFile(file)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Please select a file first.')
      return
    }
    setUploading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)
    try {
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      if (response.ok) {
        onUploadSuccess(data.filename)
      } else {
        setError(data.detail || 'Upload failed.')
      }
    } catch (err) {
      setError('Error uploading file.')
    }
    setUploading(false)
  }

  return (
    <div className="upload-container">
      <h2>Upload Your Video</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="video/mp4" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default UploadVideo
