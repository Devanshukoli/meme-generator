import { useState } from "react"

const Main = () => {

  const [memeInputs, setMemeInputs] = useState({
    topText: "One does not simply",
    bottomText: "walk into modor",
    imageUrl: "http://i.imgflip.com/1bij.jpg"
  })

  const handleChange = (event) => {
    const { value, name } = event.currentTarget

    setMemeInputs(prevMeme => (
      {
        ...prevMeme,
        [name]: value
      }
    ))

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
          <button>Get a new meme image 🖼</button>
        </div>
        <div className="meme">
          <img src={memeInputs.imageUrl} />
          <span className="top">{memeInputs.topText}</span>
          <span className="bottom">{memeInputs.bottomText}</span>
        </div>
      </main>
    </>
  )
}

export default Main