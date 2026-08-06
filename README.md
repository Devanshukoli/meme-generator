# Meme Generator 🖼️

A fast, interactive React web application for creating custom memes. Browse popular meme templates, add custom top and bottom text overlays, copy generated memes directly to your clipboard, or download them to your device.

---

## 🚀 Features

- **Random Meme Templates**: Fetch popular trending meme templates from the Imgflip API with a single click.
- **Real-Time Preview**: Dynamically update top and bottom text on the live meme preview.
- **Impact Typography**: Classic meme text rendering with Impact font, uppercase transform, and high-contrast text outlines for optimal readability.
- **📋 Copy to Clipboard**: Render and copy PNG meme images directly to your system clipboard using HTML5 Canvas & Web Clipboard API.
- **📥 Download Meme**: Export and save your custom meme image locally as a `.png` file.
- **Responsive Layout**: Designed for seamless use on both desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Pure CSS3 with flexbox/grid and purple gradients
- **Meme API**: [Imgflip API](https://imgflip.com/api)
- **Image Generation**: HTML5 Canvas API
- **Code Quality**: ESLint 10

---

## 📁 Project Structure

```text
.
├── components/
│   ├── Header.jsx       # Header navigation bar with logo
│   └── Main.jsx         # Core meme generator, canvas renderer, and controls
├── public/
│   └── troll-face-png.png # App icon / header visual
├── src/
│   ├── App.jsx          # Main App wrapper component
│   ├── index.css        # Global CSS styles and layout rules
│   └── index.jsx        # Application DOM entry point
├── index.html           # HTML template
├── package.json         # Scripts and project dependencies
└── vite.config.js       # Vite configuration
```

---

## ⚡ Quick Start

### Prerequisites

Ensure you have **Node.js** (v18 or higher recommended) and **npm** installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Devanshukoli/meme-generator.git
   cd meme-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:3000` (or the port specified in terminal output).

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with local server. |
| `npm run build` | Builds the app for production to the `dist` folder. |
| `npm run lint` | Runs ESLint to check for syntax and style issues. |
| `npm run preview` | Locally preview the built production output. |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the app or add new features:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git commit -m 'Add some amazing feature'`).
5. Open a Pull Request.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
