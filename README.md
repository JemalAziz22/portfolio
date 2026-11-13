# Systems Engineer & Android Developer Portfolio

A static, single-page portfolio built with semantic HTML, CSS, and vanilla JavaScript. No framework, package manager, or build step is required.

## Project structure

```text
assets/
  favicon.svg
  icons.svg
  noise.svg
  profile.png
  profile-480.webp
  profile-800.webp
css/
  styles.css
  tokens.css
data/
  data.js
js/
  app.js
index.html
```

## Local preview

Open `index.html` in a browser, or serve the project directory with any static file server. Serving over HTTP is recommended so browser storage and external API behavior match deployment.

## Editing content

Edit `data/data.js`; the HTML structure and CSS do not need content changes.

- Replace profile name and location in `locales.en.status` and `locales.ar.status`.
- Put the original portrait in `assets/profile.png` (or update `profileImage.src` in `data/data.js`). The card uses a 4:5 crop and `profileImage.position` controls the crop focus. Create `profile-480.webp` (480×600) and `profile-800.webp` (800×1000), then set `profileImage.srcSet` to `assets/profile-480.webp 480w, assets/profile-800.webp 800w`. If the source cannot load, the monogram remains visible.
- Update the hero, about, skills, projects, contact copy, and footer in both locale objects.
- Edit `hero.terminal.commands`, `quickCommands`, and `text` in `data/data.js` to configure the terminal command list, quick-action chips, and their bilingual output. Commands are handled by a fixed allowlist in `js/app.js`; adding a new action requires a corresponding handler.
- The Monitor tab reads the current browser session: frame rate from `requestAnimationFrame`, JS heap when `performance.memory` is available, and connection information when `navigator.connection` is supported. Otherwise it reports `n/a` or the navigation load time; it does not invent telemetry.
- The Logcat tab records actual page, navigation, theme, terminal, project, and contact-form events. Its in-memory log is capped at 50 entries and is cleared on reload.
- Set `github.username` at the root of `data/data.js` to show recent public GitHub activity in the Now panel. Successful results are cached in `localStorage` for 30 minutes. With no username or on request failure, the panel explicitly marks its text as a sample.
- Update the hero and about `metrics` values with verified counts before publishing. Sample profile details, metrics, and projects are visibly marked as sample content.
- Add projects to each locale's `projects.items`. To load live GitHub stars and forks, set `repository` to `owner/repository`. If the request fails or the field is empty, the project's `fallbackStats` are shown.
- Project links are omitted when `codeUrl` and `liveUrl` are empty.
- To add another language, add its name to `localeNames` and a complete locale object with a `direction` (`ltr` or `rtl`) and the same content fields. The language switch cycles through the locale keys.
- Replace `settings.web3FormsAccessKey` with the access key from your Web3Forms dashboard. The contact button stays disabled while the placeholder key is present. The key is used in the browser, as required by Web3Forms; do not put private server credentials here.

## Design and preferences

Change color, typography, spacing, and responsive grid tokens in `css/tokens.css`. The theme toggle follows the operating-system preference until a visitor chooses a theme, then stores that choice in `localStorage`.

## Deployment

### GitHub Pages

1. Push the project to a GitHub repository.
2. In **Settings → Pages**, choose the desired branch and the repository root as the source.
3. Wait for the Pages deployment, then open the published URL.

### Netlify

1. Import the repository or deploy the project folder.
2. Set the publish directory to the project root.
3. Leave the build command empty.

After deployment, verify the form using a configured Web3Forms key and replace all sample portfolio details and placeholder links.
