# Naveen Kumar Vunnam: Portfolio

Personal portfolio of **Naveen Kumar Vunnam**, Senior Software Engineer at Wells Fargo, working where finance meets technology.

**Live:** https://naveen219.github.io/naveen-portfolio/

## Stack

Plain HTML, CSS and a little vanilla JavaScript. No framework and no build step, so GitHub Pages serves it as-is.

- Sticky navbar, hero with photo, card-based sections (About, Experience, Publications, Certifications, Education, Achievements, Skills, Contact)
- Light theme by default with a dark-mode toggle
- Typed tagline, scroll reveals and hover effects, all disabled for `prefers-reduced-motion`
- Contact form that opens the visitor's email app (no backend needed)
- Responsive down to small phones; keyboard accessible
- SEO + Open Graph meta tags, JSON-LD `Person` data, cookie-free GoatCounter analytics

## Structure

```
index.html      # all content
css/style.css   # styles (colour tokens at the top)
js/main.js      # theme toggle, mobile menu, contact form, tagline typing, scroll reveals
favicon.svg
img/            # photos; img/logos/ holds employer and university logos
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Repository **Settings → Pages → Build and deployment → Deploy from a branch → `master` / root**.
Pushing to `master` redeploys automatically.
