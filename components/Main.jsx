import { useState } from "react"

const Main = () => {

  const [memeInputs, setMemeInputs] = useState({
    topText: "One does not simply",
    bottomText: "walk into modor",
    imageUrl: "http://i.imgflip.com/1bij.jpg"
  })

  return (
    <>
      <main>
        <div className="form">
          <label>Top Text
            <input
              type="text"
              placeholder={memeInputs.topText}
              name="topText"
            />
          </label>

          <label>Bottom Text
            <input
              type="text"
              placeholder={memeInputs.bottomText}
              name="bottomText"
            />
          </label>
          <button>Get a new meme image 🖼</button>
        </div>
        <div className="meme">
          <img src={memeInputs.imageUrl} />
          <span className="top">One does not simply</span>
          <span className="bottom">Walk into Mordor</span>
        </div>
      </main>
    </>
  )
}

export default Main