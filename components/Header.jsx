import trollFace from "../public/troll-face-png.png"

const Header = () => {
  return (
    <>
      <header className="header">
        <img
          src={trollFace}
        />
        <h1>Meme Generator</h1>
      </header>
    </>
  )
}

export default Header;