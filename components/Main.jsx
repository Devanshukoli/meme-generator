import { useEffect, useState } from "react"

const drawText = (ctx, text, x, y, maxWidth, fontSize, baseline) => {
  ctx.save()
  ctx.font = `900 ${fontSize}px impact, sans-serif`
  ctx.fillStyle = "white"
  ctx.strokeStyle = "black"
  ctx.lineWidth = Math.max(2, Math.floor(fontSize / 8))
  ctx.textAlign = "center"
  ctx.textBaseline = baseline

  let currentFontSize = fontSize
  while (ctx.measureText(text).width > maxWidth && currentFontSize > 12) {
    currentFontSize -= 2
    ctx.font = `900 ${currentFontSize}px impact, sans-serif`
    ctx.lineWidth = Math.max(2, Math.floor(currentFontSize / 8))
  }

  ctx.strokeText(text, x, y)
  ctx.fillText(text, x, y)
  ctx.restore()
}

const generateMemeCanvas = async (imageUrl, topText, bottomText) => {
  let imgBlobUrl = imageUrl
  try {
    const res = await fetch(imageUrl)
    const blob = await res.blob()
    imgBlobUrl = URL.createObjectURL(blob)
  } catch (e) {
    console.warn("Fetch image failed, using direct URL:", e)
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth || img.width
      canvas.height = img.naturalHeight || img.height
      const ctx = canvas.getContext("2d")

      ctx.drawImage(img, 0, 0)

      const maxTextWidth = canvas.width * 0.9
      const fontSize = Math.floor(canvas.height / 10)

      if (topText) {
        const topY = canvas.height * 0.03
        drawText(ctx, topText.toUpperCase(), canvas.width / 2, topY, maxTextWidth, fontSize, "top")
      }

      if (bottomText) {
        const bottomY = canvas.height * 0.97
        drawText(ctx, bottomText.toUpperCase(), canvas.width / 2, bottomY, maxTextWidth, fontSize, "bottom")
      }

      if (imgBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imgBlobUrl)
      }

      resolve(canvas)
    }
    img.onerror = (err) => {
      if (imgBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imgBlobUrl)
      }
      reject(err)
    }
    img.src = imgBlobUrl
  })
}

const Main = () => {

  const [memeInputs, setMemeInputs] = useState({
    topText: "One does not simply",
    bottomText: "walk into modor",
    imageUrl: "https://i.imgflip.com/1bij.jpg"
  })

  const [allMemes, setAllMemes] = useState([])
  const [statusMessage, setStatusMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.memes) {
          setAllMemes(data.data.memes)
        }
      })
      .catch(err => console.error("Failed to fetch memes:", err))
  }, [])

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [statusMessage])

  const handleImageClick = () => {
    if (!allMemes.length) return;
    const randomNumber = Math.floor(Math.random() * allMemes.length)
    const randomImage = allMemes[randomNumber].url.replace(/^http:/, 'https:')

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

  const handleCopyToClipboard = async () => {
    try {
      setIsProcessing(true)
      setStatusMessage("Generating meme...")
      const canvas = await generateMemeCanvas(
        memeInputs.imageUrl,
        memeInputs.topText,
        memeInputs.bottomText
      )

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setStatusMessage("Failed to create image.")
          setIsProcessing(false)
          return
        }
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            const item = new ClipboardItem({ "image/png": blob })
            await navigator.clipboard.write([item])
            setStatusMessage("Copied to clipboard! 📋")
          } else {
            setStatusMessage("Clipboard API not supported.")
          }
        } catch (err) {
          console.error("Clipboard copy error:", err)
          setStatusMessage("Unable to copy to clipboard.")
        } finally {
          setIsProcessing(false)
        }
      }, "image/png")
    } catch (err) {
      console.error(err)
      setStatusMessage("Failed to generate meme.")
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
    try {
      setIsProcessing(true)
      setStatusMessage("Preparing download...")
      const canvas = await generateMemeCanvas(
        memeInputs.imageUrl,
        memeInputs.topText,
        memeInputs.bottomText
      )

      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `meme-${Date.now()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setStatusMessage("Image downloaded! 📥")
    } catch (err) {
      console.error(err)
      setStatusMessage("Failed to download image.")
    } finally {
      setIsProcessing(false)
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
          <img src={memeInputs.imageUrl} alt="Meme" />
          <span className="top">{memeInputs.topText}</span>
          <span className="bottom">{memeInputs.bottomText}</span>
        </div>
        <div className="meme-actions">
          <button 
            onClick={handleCopyToClipboard} 
            className="action-btn"
            disabled={isProcessing}
          >
            📋 Copy to Clipboard
          </button>
          <button 
            onClick={handleDownload} 
            className="action-btn"
            disabled={isProcessing}
          >
            📥 Download Image
          </button>
        </div>
        {statusMessage && (
          <div className="status-message">{statusMessage}</div>
        )}
      </main>
    </>
  )
}

export default Main