# NEXORA – Discover. Connect. Experience.

A responsive event discovery and registration website built with HTML5, CSS3 and vanilla JavaScript.

## Features
- Dark and light mode (remembered between visits)
- Responsive navigation menu with mobile hamburger
- Featured events carousel and event cards
- Search, category, date filter and sort (popularity or upcoming date)
- Event details with seat availability and countdown timers
- Registration form with JavaScript validation and a confirmation message
- Registrations stored in Local Storage
- Newsletter subscription with validation
- Animated statistics counters, scroll reveal animations, loading screen
- Hover effects, glassmorphism cards and smooth scrolling

## Project Structure
```
nexora-website/
├── index.html
├── style.css
├── script.js
├── README.md
└── images/
    ├── hero.svg, about.svg
    └── tech.svg, music.svg, sports.svg, business.svg, education.svg, art.svg
```

## Technologies
HTML5, CSS3, JavaScript (ES6), Google Fonts (Inter).

## Installation
1. Download and unzip the project.
2. Open `index.html` in any modern browser. No build step or server is needed.

Or run a local server:
```
cd nexora-website
python -m http.server 8000
```
Then visit http://localhost:8000

## Deployment
Push the folder to GitHub and enable GitHub Pages, drag it into Netlify Drop, or deploy with Vercel.

## Customization
- Edit the `EVENTS` array in `script.js` to add or change events.
- Replace the SVG files in `images/` with real event photos (keep the names, or update the paths).
- Change colors in the `:root` block of `style.css`.
