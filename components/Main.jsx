import { useEffect, useState } from "react"

const Main = () => {

  const [memeInputs, setMemeInputs] = useState({
    topText: "One does not simply",
    bottomText: "walk into modor",
    imageUrl: "http://i.imgflip.com/1bij.jpg"
  })

  const [allMemes, setAllMemes] = useState([])
  const [copyStatus, setCopyStatus] = useState("")

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(res => res.json())
      .then(data => {
        setAllMemes(data.data.memes)
      })
  }, [])

  const handleImageClick = () => {
    const randomNumber = Math.floor(Math.random() * allMemes.length)
    const randomImage = allMemes[randomNumber].url

    setMemeInputs(prevMeme => ({
      ...prevMeme,
      imageUrl: randomImage
    }))
  }

  const handleChange = (event) => {
    const { value, name } = event.currentTarget

    setMemeInputs(prevMeme => (
      {
        ...prevMeme,
        [name]: value
      }
    ))

  }

  const handleCopyImageClick = async () => {
    // Attempt to render the meme (image + top/bottom text) onto a canvas
    setCopyStatus('Copying meme...')
    const loadImage = (src) => new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = (e) => reject(e)
      img.src = src
    })

    try {
      if (!window.ClipboardItem || !navigator.clipboard) throw new Error('Clipboard image write not supported')

      // load image with crossOrigin; this will fail if server disallows CORS
      const img = await loadImage(memeInputs.imageUrl)

      // create canvas sized to image
      const canvas = document.createElement('canvas')
      const maxWidth = 1200
      let scale = 1
      if (img.naturalWidth > maxWidth) scale = maxWidth / img.naturalWidth
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      const ctx = canvas.getContext('2d')

      // draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // draw top and bottom text with impact-like styling
      const drawText = (text, yPos) => {
        // font size relative to canvas
        const fontSize = Math.round(canvas.width / 10)
        ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = Math.max(2, Math.round(fontSize / 10))

        // split into multiple lines if too long
        const maxWidth = canvas.width - 20
        const words = text.split(' ')
        const lines = []
        let line = ''
        for (let i = 0; i < words.length; i++) {
          const testLine = line ? line + ' ' + words[i] : words[i]
          const metrics = ctx.measureText(testLine)
          if (metrics.width > maxWidth && line) {
            lines.push(line)
            line = words[i]
          } else {
            line = testLine
          }
        }
        if (line) lines.push(line)

        // draw each line
        const lineHeight = fontSize + 6
        const startY = yPos - ((lines.length - 1) * lineHeight) / 2
        for (let i = 0; i < lines.length; i++) {
          const textLine = lines[i]
          const y = startY + i * lineHeight
          ctx.strokeText(textLine.toUpperCase(), canvas.width / 2, y)
          ctx.fillText(textLine.toUpperCase(), canvas.width / 2, y)
        }
      }

      // top text at ~10% down
      drawText(memeInputs.topText || '', canvas.height * 0.12)
      // bottom text at ~88% down
      drawText(memeInputs.bottomText || '', canvas.height * 0.88)

      // convert canvas to blob and write to clipboard
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('Canvas toBlob failed')
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopyStatus('Meme copied!')
      setTimeout(() => setCopyStatus(''), 3000)
      return
    } catch (err) {
      console.warn('Canvas meme copy failed:', err)
      // fallback: try copying raw image blob (may also fail due to CORS)
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          const res = await fetch(memeInputs.imageUrl, { mode: 'cors' })
          if (res.ok) {
            const blob = await res.blob()
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
            setCopyStatus('Image copied (without text)')
            setTimeout(() => setCopyStatus(''), 3000)
            return
          }
        }
      } catch (e) {
        console.warn('Fallback image copy failed:', e)
      }

      // last fallback: copy image URL text
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(memeInputs.imageUrl)
        setCopyStatus('Could not copy combined meme (CORS). Image URL copied instead.')
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = memeInputs.imageUrl
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopyStatus('Could not copy combined meme. Image URL copied (fallback).')
      }
      setTimeout(() => setCopyStatus(''), 5000)
    }
  }

  return (
    <>
      <main>
        <div className="form">
          <label>Top Text
            <input
              type="text"
              placeholder="One does not simply"
              name="topText"
              onChange={handleChange}
              value={memeInputs.topText}
            />
          </label>

          <label>Bottom Text
            <input
              type="text"
              placeholder="walk into modor"
              name="bottomText"
              onChange={handleChange}
              value={memeInputs.bottomText}
            />
          </label>
          <button onClick={handleImageClick}>Get a new meme image 🖼</button>
        </div>
        <div className="meme">
          <img src={memeInputs.imageUrl} />
          <span className="top">{memeInputs.topText}</span>
          <span className="bottom">{memeInputs.bottomText}</span>
        </div>
        <div className="copy-controls">
          <button className="copy-button" onClick={handleCopyImageClick} disabled={copyStatus === 'Copying...'}>Copy image to clipboard</button>
          {copyStatus && <div className="copy-status">{copyStatus}</div>}
        </div>
      </main>
    </>
  )
}

export default Main