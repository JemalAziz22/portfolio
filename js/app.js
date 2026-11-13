const data = window.PORTFOLIO_DATA;
const storedLocale = localStorage.getItem("portfolio-locale");
const locale = data.locales[storedLocale] ? storedLocale : data.defaultLocale;
const content = data.locales[locale];

document.documentElement.lang = locale;
document.documentElement.dir = content.direction;
document.title = content.documentTitle;
document.querySelector('meta[name="description"]').content =
  content.description;
document.querySelector('meta[property="og:title"]').content =
  content.documentTitle;
document.querySelector('meta[property="og:description"]').content =
  content.description;
document.querySelector('meta[name="twitter:title"]').content =
  content.documentTitle;
document.querySelector('meta[name="twitter:description"]').content =
  content.description;
document.querySelector(".skip-link").textContent = content.skipLink;
document.querySelector(".status-bar").setAttribute(
  "aria-label",
  content.status.regionLabel,
);

Object.entries(content.navigation).forEach(([key, value]) => {
  if (key === "label") {
    document.querySelector(".site-navigation").setAttribute("aria-label", value);
  } else {
    document.querySelector(`[data-nav="${key}"]`).textContent = value;
  }
});

document.querySelector(".scroll-progress").setAttribute(
  "aria-label",
  content.live.scrollLabel,
);

const localeToggle = document.querySelector(".locale-toggle");
const localeOrder = Object.keys(data.locales);
const nextLocale =
  localeOrder[(localeOrder.indexOf(locale) + 1) % localeOrder.length];

localeToggle.querySelector('[data-slot="locale-label"]').textContent =
  data.locales[nextLocale].controls.localeCode;
localeToggle.setAttribute("aria-label", content.controls.languageLabel);
localeToggle.setAttribute("aria-pressed", String(locale !== data.defaultLocale));
localeToggle.addEventListener("click", () => {
  localStorage.setItem("portfolio-locale", nextLocale);
  window.location.reload();
});

const themeToggle = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("portfolio-theme");
const savedTheme =
  storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches
  ? "light"
  : "dark";

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-bg")
      .trim();
  const icon = theme === "light" ? "moon" : "sun";
  themeToggle.innerHTML = `
    <svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${icon}"></use></svg>
    <span>${theme === "light" ? content.controls.darkMode : content.controls.lightMode}</span>
  `;
  themeToggle.setAttribute("aria-label", content.controls.themeLabel);
  themeToggle.setAttribute("aria-pressed", String(theme === "light"));
}

applyTheme(savedTheme || systemTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "light" ? "dark" : "light";
  const switchTheme = () => {
    localStorage.setItem("portfolio-theme", nextTheme);
    applyTheme(nextTheme);
  };
  if (
    document.startViewTransition &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.startViewTransition(switchTheme);
  } else {
    switchTheme();
  }
});

if (!savedTheme) {
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (event) => {
    applyTheme(event.matches ? "light" : "dark");
  });
}

const slots = {
  name: content.status.name,
  "location-label": content.status.locationLabel,
  location: content.status.location,
  "time-label": content.status.localTimeLabel,
  availability: content.status.available,
  "uptime-label": content.live.uptimeLabel,
};

Object.entries(slots).forEach(([name, value]) => {
  const element = document.querySelector(`[data-slot="${name}"]`);
  element.textContent = value;
});

const brand = document.querySelector(".status-name");
const nameParts = content.status.name.trim().split(/\s+/).filter(Boolean);
const monogram =
  nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[1][0]}`
    : nameParts[0].slice(0, 2);
brand.setAttribute("aria-label", content.status.name);
brand.innerHTML = `
  <svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <rect class="mark-draw-path" x="2" y="2" width="36" height="36"></rect>
    <path class="brand-guides mark-draw-path" d="M8 8h4m16 0h4m-4 24h4m-24 0h4M10 15h20M10 25h20"></path>
    <text x="20" y="23" text-anchor="middle">${monogram}</text>
    <path class="brand-cross mark-draw-path" d="M34 4v6m-3-3h6"></path>
  </svg>
  <span>${content.status.name}</span>
`;
const brandPaths = brand.querySelectorAll(".mark-draw-path");
brandPaths.forEach((path) => {
  const length = path.getTotalLength();
  path.style.setProperty("--mark-length", String(length));
});
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  brand.classList.add("mark-visible");
} else {
  window.requestAnimationFrame(() => brand.classList.add("mark-visible"));
}
const favicon = document.querySelector('link[rel="icon"]');
const faviconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    <rect x="2" y="2" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 8h4m16 0h4m-4 24h4m-24 0h4M10 15h20M10 25h20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
    <text x="20" y="23" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="8">${monogram}</text>
    <path d="M34 4v6m-3-3h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
  </svg>
`;
favicon.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

document.querySelector('[data-slot="hero-copy"]').innerHTML = `
  <p class="hero-eyebrow">${content.hero.eyebrow}</p>
  <h1 class="hero-title" id="hero-title">${content.hero.titleParts
    .map((part) => `<span${part.accent ? ' class="title-accent"' : ""}>${part.text}</span>`)
    .join("")}<span class="terminal-cursor" aria-hidden="true">_</span></h1>
  <p class="hero-description">${content.hero.description}</p>
  <div class="hero-actions">
    <a class="hero-link hero-link--primary" href="#projects">${content.hero.projectsLink}<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#arrow"></use></svg></a>
    <a class="hero-link hero-link--secondary" href="#contact">${content.hero.contactLink}<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#arrow"></use></svg></a>
  </div>
  <div class="hero-metrics" aria-label="${content.hero.eyebrow}">
    ${content.hero.metrics
      .map(
        (metric) => `
          <div class="hero-metric">
            <span class="hero-metric-value counter-value" data-count-target="${metric.value}" data-count-suffix="${metric.suffix}" aria-hidden="true">0${metric.suffix}</span>
            <span class="hero-metric-label">${metric.label}</span>
          </div>
        `,
      )
      .join("")}
  </div>
`;

const specRows = content.hero.spec
  .map(
    ([label, value, icon]) => `
      <div class="spec-row">
        <dt>
          <svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${icon}"></use></svg>
          <span>${label}</span>
        </dt>
        <dd>${value}</dd>
      </div>
    `,
  )
  .join("");

document.querySelector('[data-slot="hero-spec"]').innerHTML = `
  <p class="spec-label">${content.hero.specLabel}</p>
  <dl>${specRows}</dl>
`;
document
  .querySelector('[data-slot="hero-spec"]')
  .setAttribute("aria-label", content.hero.specLabel);

const architectureRows = content.hero.architecture;
const architectureBoxes = architectureRows
  .map((item, index) => {
    const y = 8 + index * 62;
    return `
      <rect class="draw-path diagram-box" x="16" y="${y}" width="328" height="40"></rect>
      <path class="draw-path diagram-node" d="M28 ${y + 20}h12"></path>
      <circle class="diagram-accent" cx="30" cy="${y + 20}" r="2"></circle>
      <text class="diagram-layer-no" x="54" y="${y + 25}">${String(index + 1).padStart(2, "0")}</text>
      <text class="diagram-label" x="196" y="${y + 25}" text-anchor="middle">${item.label}</text>
    `;
  })
  .join("");
const architectureLinks = architectureRows
  .slice(0, -1)
  .map((_, index) => {
    const y = 48 + index * 62;
    return `<path class="draw-path diagram-link" d="M180 ${y + 2}v14m-4-4 4 4 4-4"></path>`;
  })
  .join("");

document.querySelector('[data-slot="hero-spec"]').insertAdjacentHTML(
  "beforeend",
  `
    <figure class="architecture-figure" role="img" aria-label="${content.hero.diagramLabel}">
      <svg class="architecture-diagram" viewBox="0 0 360 318" aria-hidden="true" focusable="false">
        ${architectureLinks}${architectureBoxes}
        <circle class="flow-pulse" cx="8" cy="0" r="2.5">
          <animateMotion dur="7s" repeatCount="indefinite" path="M0 48V256"></animateMotion>
        </circle>
      </svg>
    </figure>
  `,
);

const terminal = content.hero.terminal;
const terminalAccessibleText = terminal.steps
  .map((step) => `${terminal.prompt} ${step.command}\n${step.output}`)
  .join("\n");
document.querySelector('[data-slot="hero-spec"]').insertAdjacentHTML(
  "afterbegin",
  `
    <div class="terminal-block">
      <div class="terminal-titlebar">
        <span class="window-indicators" aria-hidden="true"><i></i><i></i><i></i></span>
        <p class="terminal-heading">
          <svg class="icon" aria-hidden="true"><use href="assets/icons.svg#terminal"></use></svg>
          <span>${terminal.windowTitle}</span>
        </p>
        <span class="terminal-live-indicator" aria-hidden="true"></span>
      </div>
      <div class="terminal-tabs" aria-hidden="true">
        ${terminal.tabs.map((tab, index) => `<span${index === 0 ? ' class="is-selected"' : ""}>${tab}</span>`).join("")}
      </div>
      <div class="terminal-screen" aria-hidden="true">
        <div class="terminal-output"></div>
        <span class="terminal-cursor">_</span>
      </div>
      <p class="sr-only">${terminal.accessibleLabel}: ${terminalAccessibleText}</p>
    </div>
  `,
);

const monitor = content.hero.monitor;
const now = content.hero.now;
document.querySelector(".terminal-block").insertAdjacentHTML(
  "afterend",
  `
    <section class="system-monitor" aria-label="${monitor.title}">
      <div class="monitor-heading">
        <span>${monitor.title}</span>
        <span class="monitor-updated"><i aria-hidden="true"></i>${monitor.liveLabel}</span>
      </div>
      <div class="monitor-grid">
        ${["cpu", "memory", "network"]
          .map(
            (key) => `
              <div class="monitor-metric" data-monitor="${key}">
                <span class="monitor-label">${monitor.labels[key]}</span>
                <svg class="sparkline" viewBox="0 0 120 40" role="img" aria-label="${monitor.labels[key]}">
                  <defs>
                    <linearGradient id="area-${key}" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stop-color="var(--metric-color)" stop-opacity=".24"></stop>
                      <stop offset="100%" stop-color="var(--metric-color)" stop-opacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path class="sparkline-area" fill="url(#area-${key})"></path>
                  <path class="sparkline-line" stroke="var(--metric-color)"></path>
                </svg>
                <span class="monitor-reading"><b data-reading>--</b><small>${monitor.units[key]}</small></span>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
    <aside class="now-panel">
      <div class="now-heading">
        <span class="now-label">${now.label}</span>
        <span class="now-status"><i aria-hidden="true"></i>${now.status}</span>
      </div>
      <p class="now-title">${now.title}</p>
      <p class="now-updated">${now.updated}</p>
    </aside>
  `,
);

function completeTerminal() {
  terminalRunId += 1;
  const terminalOutput = document.querySelector(".terminal-output");
  terminalOutput.replaceChildren();

  terminal.steps.forEach((step) => {
    const command = document.createElement("p");
    command.className = "terminal-command";
    command.textContent = `${terminal.prompt} ${step.command}`;
    formatTerminalCommand(command, step.command);
    terminalOutput.append(command);

    const output = document.createElement("p");
    output.className = "terminal-result";
    output.textContent = step.output;
    terminalOutput.append(output);
  });

  terminal.logLevels.slice(0, 2).forEach((entry, index) => {
    appendLogLine(entry, index);
  });
}

let terminalRunId = 0;
let logcatTimer = 0;
let logcatIndex = 0;
let terminalTypingFinished = false;
let terminalVisible = true;

function formatTerminalCommand(line, commandText) {
  const prompt = document.createElement("span");
  prompt.className = "terminal-prompt";
  prompt.textContent = terminal.prompt;
  line.replaceChildren(prompt, document.createTextNode(" "));

  const [commandName, ...tokens] = commandText.match(/'[^']*'|"[^"]*"|\S+/g) || [];
  if (commandName) {
    const command = document.createElement("span");
    command.className = "terminal-command-name";
    command.textContent = commandName;
    line.append(command);
  }

  tokens.forEach((token) => {
    const argument = document.createElement("span");
    argument.className = token.startsWith("-")
      ? "terminal-flag"
      : token.startsWith("'") || token.startsWith('"')
        ? "terminal-string"
        : "terminal-argument";
    argument.textContent = ` ${token}`;
    line.append(argument);
  });
}

function appendLogLine(entry, index) {
  const terminalOutput = document.querySelector(".terminal-output");
  const line = document.createElement("p");
  line.className = `terminal-log log-level-${entry.level.toLowerCase()}`;
  const prefix = document.createElement("span");
  prefix.className = "log-level";
  prefix.textContent = `${entry.level} `;
  const message = document.createElement("span");
  message.textContent = entry.message;
  line.append(prefix, message);
  line.dataset.logIndex = String(index);
  terminalOutput.append(line);

  const oldLines = terminalOutput.querySelectorAll(".terminal-log");
  if (oldLines.length > 6) oldLines[0].remove();
  terminalOutput.parentElement.scrollTop =
    terminalOutput.parentElement.scrollHeight;
}

function scheduleLogcat() {
  window.clearTimeout(logcatTimer);
  if (
    document.hidden ||
    reduceMotionQuery.matches ||
    !terminalVisible ||
    !terminalTypingFinished
  ) {
    return;
  }
  const delay = 1500 + ((logcatIndex * 317) % 1501);
  logcatTimer = window.setTimeout(() => {
    const entry = terminal.logLevels[logcatIndex % terminal.logLevels.length];
    appendLogLine(entry, logcatIndex);
    logcatIndex += 1;
    scheduleLogcat();
  }, delay);
}

function animateTerminal() {
  const terminalOutput = document.querySelector(".terminal-output");
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !terminal.showAnimation
  ) {
    completeTerminal();
    return;
  }

  let stepIndex = 0;
  const runId = ++terminalRunId;
  const typeStep = () => {
    if (runId !== terminalRunId) return;
    if (stepIndex >= terminal.steps.length) return;

    const step = terminal.steps[stepIndex];
    const commandLine = document.createElement("p");
    commandLine.className = "terminal-command";
    terminalOutput.append(commandLine);
    const commandText = `${terminal.prompt} ${step.command}`;
    let characterIndex = 0;

    const typeCharacter = () => {
      if (runId !== terminalRunId) return;
      commandLine.textContent = commandText.slice(0, characterIndex);
      characterIndex += 1;
      if (characterIndex <= commandText.length) {
        window.setTimeout(typeCharacter, 30);
        return;
      }

      formatTerminalCommand(commandLine, step.command);
      window.setTimeout(() => {
        if (runId !== terminalRunId) return;
        const outputLine = document.createElement("p");
        outputLine.className = "terminal-result";
        outputLine.textContent = step.output;
        terminalOutput.append(outputLine);
        stepIndex += 1;
        window.setTimeout(() => {
          if (stepIndex < terminal.steps.length) {
            typeStep();
          } else {
            terminalTypingFinished = true;
            scheduleLogcat();
          }
        }, 160);
      }, 180);
    };

    typeCharacter();
  };

  typeStep();
}

animateTerminal();

const aboutSection = document.querySelector("#about");
aboutSection.innerHTML = `
  <div class="section-heading">
    <p class="section-index">${content.about.index}</p>
    <h2 class="section-title" id="about-title">${content.about.title}</h2>
  </div>
  <div class="about-copy">
    ${content.about.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
  </div>
  <figure class="circuit-figure" role="img" aria-label="${content.about.circuitLabel}">
    <svg class="circuit-diagram" viewBox="0 0 480 72" aria-hidden="true" focusable="false">
      <path class="draw-path circuit-track" d="M4 36h48V16h56v40h64V28h72v24h64V16h56v40h60"/>
      <path class="draw-path circuit-track" d="M132 16V4m132 48v16m120-12V36h40"/>
      <circle class="circuit-node" cx="52" cy="36" r="3"/>
      <circle class="circuit-accent" cx="108" cy="16" r="3"/>
      <circle class="circuit-node" cx="172" cy="56" r="3"/>
      <circle class="circuit-accent" cx="244" cy="28" r="3"/>
      <circle class="circuit-node" cx="308" cy="52" r="3"/>
      <circle class="circuit-accent" cx="364" cy="16" r="3"/>
      <circle class="circuit-node" cx="456" cy="56" r="3"/>
    </svg>
  </figure>
  <div class="metric-strip">
    ${content.about.metrics
      .map(
        (metric) => `
          <div class="metric-item">
            <span class="metric-value counter-value" data-count-target="${metric.value}" data-count-suffix="${metric.suffix}" aria-hidden="true">0${metric.suffix}</span>
            <span class="metric-label">${metric.label}</span>
            <span class="sr-only">${metric.label}: ${metric.value}${metric.suffix}</span>
          </div>
        `,
      )
      .join("")}
  </div>
`;

const activityHeading = content.about.activityHeading;
const activitySeed = content.about.activitySeed;
const activityCells = Array.from({ length: 52 * 7 }, (_, index) => {
  const week = Math.floor(index / 7);
  const day = index % 7;
  const hash = Math.abs(
    Math.sin((week + activitySeed) * 12.9898 + (day + 1) * 78.233) * 43758.5453,
  );
  const level = Math.floor((hash % 1) * 5);
  return `<span class="activity-cell" data-level="${level}" style="--cell-delay:${index * 4}ms"></span>`;
}).join("");
aboutSection.querySelector(".metric-strip").insertAdjacentHTML(
  "afterend",
  `
    <figure class="activity-panel" role="img" aria-label="${content.about.activityLabel}">
      <figcaption class="activity-heading">${activityHeading}</figcaption>
      <div class="activity-grid" aria-hidden="true">${activityCells}</div>
      <p class="sr-only">${content.about.activityLabel}</p>
    </figure>
  `,
);

function createRuler() {
  const ticks = Array.from({ length: 101 }, (_, index) => {
    const x = index * 10;
    const height = index % 10 === 0 ? 10 : 4;
    return `M${x} 0v${height}`;
  }).join("");

  return `
    <svg class="section-ruler" viewBox="0 0 1000 12" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path class="draw-path ruler-track" d="M0 0h1000 ${ticks}"></path>
    </svg>
  `;
}

const skillsSection = document.querySelector("#skills");
const skillRows = content.skills.groups
  .map((group, groupIndex) => {
    const category = ["language", "platform", "tool"][groupIndex] || "tool";
    return `
      <tr>
        <th scope="row">${group.name}</th>
        <td>
          <ul class="skill-list">
            ${group.items
              .map(
                (skill) => `
                  <li>
                    <button class="skill-tag skill-tag--${category}" type="button" data-skill="${skill.toLowerCase()}" aria-pressed="false">${skill}</button>
                  </li>
                `,
              )
              .join("")}
          </ul>
        </td>
      </tr>
    `;
  })
  .join("");

skillsSection.innerHTML = `
  <div class="section-heading">
    <p class="section-index">${content.skills.index}</p>
    <h2 class="section-title" id="skills-title">${content.skills.title}</h2>
  </div>
  <table class="skill-table"><tbody>${skillRows}</tbody></table>
`;

const projectsSection = content.projects;
document.querySelector('[data-slot="projects-index"]').textContent =
  projectsSection.index;
document.querySelector('[data-slot="projects-title"]').textContent =
  projectsSection.title;

const projectColumns = [
  projectsSection.columns.name,
  projectsSection.columns.type,
  projectsSection.columns.technologies,
  projectsSection.columns.year,
  projectsSection.columns.status,
];

document.querySelector('[data-slot="project-columns"]').innerHTML =
  `<span aria-hidden="true">#</span>` +
  projectColumns.map((column) => `<span>${column}</span>`).join("");

const projectList = document.querySelector('[data-slot="project-list"]');
function statValueMarkup(value, label) {
  const numericValue = Number(value);
  if (value !== "" && Number.isFinite(numericValue)) {
    return `
      <span class="counter-value" data-count-target="${numericValue}" data-count-suffix="" aria-hidden="true">0</span>
      <span class="sr-only">${label}: ${numericValue}</span>
    `;
  }

  return `
    <span class="stat-fallback" data-stat-count aria-hidden="true">${value}</span>
    <span class="sr-only">${label}: ${value}</span>
  `;
}

projectList.innerHTML = projectsSection.items
  .map((project, index) => {
    const repository = project.repository
      ? ` data-repository="${project.repository}"`
      : "";
    const technologies = project.technologies
      .map((technology) => technology.toLowerCase())
      .join("|");
    const links = [
      project.codeUrl
        ? `<a href="${project.codeUrl}" target="_blank" rel="noreferrer"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#external-link"></use></svg>${projectsSection.links.source}</a>`
        : `<span class="project-link-disabled"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#external-link"></use></svg>${projectsSection.links.sourcePending}</span>`,
      project.liveUrl
        ? `<a href="${project.liveUrl}" target="_blank" rel="noreferrer"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#external-link"></use></svg>${projectsSection.links.live}</a>`
        : `<span class="project-link-disabled"><svg class="icon" aria-hidden="true"><use href="assets/icons.svg#external-link"></use></svg>${projectsSection.links.livePending}</span>`,
    ]
      .filter(Boolean)
      .join("");

    return `
      <li class="project-entry project-category--${project.category}">
        <details class="project-details" data-category="${project.category}" data-lifecycle="${project.lifecycle}" data-technologies="${technologies}"${repository}>
          <summary class="project-row">
            <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
            <span class="project-name">${project.name}</span>
            <span class="project-type">${project.type}</span>
            <span class="project-technologies">${project.technologies.join(" / ")}</span>
            <span class="project-year">${project.year}</span>
            <span class="project-status">${project.status}</span>
          </summary>
          <div class="project-expand">
            <div class="project-expanded">
              <p class="project-description">${project.description}</p>
              <div class="project-detail-grid">
                <div class="project-preview project-preview--${project.category}" aria-hidden="true">
                  ${
                    project.category === "android"
                      ? `<div class="mock-device"><div class="mock-device-top"></div><div class="mock-app-title">${project.previewLines[0]}</div><div class="mock-app-count">${project.previewLines[1]}</div><div class="mock-task">${project.previewLines[2]}</div><div class="mock-task"></div></div>`
                      : project.category === "web"
                        ? `<div class="mock-web"><header><span>${project.name.split(" — ")[0]}</span><i></i></header><strong>${project.previewLines[0]}</strong><svg class="mock-web-chart" viewBox="0 0 140 32" aria-hidden="true"><path d="M0 25 18 20 34 22 51 9 68 16 84 11 101 17 118 5 140 10" fill="none" stroke="var(--project-color)" stroke-width="1.5"/></svg><p>${project.previewLines[1]}</p><small>${project.previewLines[2]}</small></div>`
                        : `<div class="mock-terminal">${project.previewLines.map((line) => `<p>${line}</p>`).join("")}</div>`
                  }
                </div>
                <div class="project-detail-content">
                  <div class="project-architecture">
                    <h3>${projectsSection.architectureLabel}</h3>
                    <ol>${project.architecture.map((layer) => `<li>${layer}</li>`).join("")}</ol>
                  </div>
                  <dl class="project-facts">
                    <div><dt>${projectsSection.stats.stars}</dt><dd data-stat="stars">${statValueMarkup(project.fallbackStats.stars, projectsSection.stats.stars)}</dd></div>
                    <div><dt>${projectsSection.stats.forks}</dt><dd data-stat="forks">${statValueMarkup(project.fallbackStats.forks, projectsSection.stats.forks)}</dd></div>
                    <div><dt>${projectsSection.stats.loc}</dt><dd>${project.loc}</dd></div>
                    <div><dt>${projectsSection.columns.year}</dt><dd>${project.year}</dd></div>
                  </dl>
                  <p class="project-lifecycle project-lifecycle--${project.lifecycle}"><i aria-hidden="true"></i>${projectsSection.projectStates[project.lifecycle]}</p>
                  <div class="project-links">${links}</div>
                </div>
              </div>
            </div>
          </div>
        </details>
      </li>
    `;
  })
  .join("");

let selectedSkill = "";
const skillTags = [...document.querySelectorAll(".skill-tag")];

function highlightSkillProjects(skill) {
  projectList.querySelectorAll(".project-details").forEach((project) => {
    const skillAlias =
      skill === "jetpack compose" ? "compose" : skill;
    const related = skill
      ? project.dataset.technologies.split("|").includes(skillAlias)
      : false;
    project.classList.toggle("is-related", related);
  });
}

skillTags.forEach((tag) => {
  tag.addEventListener("mouseenter", () =>
    highlightSkillProjects(tag.dataset.skill),
  );
  tag.addEventListener("mouseleave", () =>
    highlightSkillProjects(selectedSkill),
  );
  tag.addEventListener("focus", () =>
    highlightSkillProjects(tag.dataset.skill),
  );
  tag.addEventListener("blur", () => highlightSkillProjects(selectedSkill));
  tag.addEventListener("click", () => {
    selectedSkill =
      selectedSkill === tag.dataset.skill ? "" : tag.dataset.skill;
    skillTags.forEach((item) =>
      item.setAttribute(
        "aria-pressed",
        String(item.dataset.skill === selectedSkill),
      ),
    );
    highlightSkillProjects(selectedSkill);
  });
});

const reduceMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
let counterObserver;
const counterFrames = new Map();
const monitorCharts = [...document.querySelectorAll(".monitor-metric")];
const monitorSettings = content.hero.monitor;
let monitorStep = 0;
let monitorTimer = 0;
let clockTimer = 0;
let uptimeSeconds = 0;
let headerVisible = true;
let monitorVisible = true;

function getMonitorValue(key, sampleIndex, step) {
  const seed = monitorSettings.seed;
  const wave =
    Math.sin((sampleIndex + step) * 0.39 + seed) * 0.18 +
    Math.sin((sampleIndex + step) * 0.17 + seed * 0.4) * 0.08;
  const level = Math.max(0.12, Math.min(0.9, 0.53 + wave));
  if (key === "cpu") return Math.round(24 + level * 52);
  if (key === "memory") return Math.round(480 + level * 420);
  return Number((0.4 + level * 6.2).toFixed(1));
}

function renderMonitor(step) {
  monitorCharts.forEach((metric) => {
    const key = metric.dataset.monitor;
    const values = Array.from({ length: 24 }, (_, index) =>
      getMonitorValue(key, index, step),
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 120;
      const y = 33 - ((value - min) / span) * 25;
      return [x, y];
    });
    const linePath = points
      .map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ");
    const areaPath = `${linePath} L120 40 L0 40 Z`;
    metric.querySelector(".sparkline-line").setAttribute("d", linePath);
    metric.querySelector(".sparkline-area").setAttribute("d", areaPath);

    const reading = values[values.length - 1];
    metric.querySelector("[data-reading]").textContent = String(reading);
    metric.querySelector(".sparkline").setAttribute(
      "aria-label",
      `${monitorSettings.labels[key]}: ${reading} ${monitorSettings.units[key]}`,
    );
  });
}

function startMonitorUpdates() {
  window.clearInterval(monitorTimer);
  if (reduceMotionQuery.matches || document.hidden || !monitorVisible) return;
  monitorTimer = window.setInterval(() => {
    monitorStep += 1;
    renderMonitor(monitorStep);
  }, 1000);
}

function updateUptime() {
  uptimeSeconds += 1;
  const hours = String(Math.floor(uptimeSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(uptimeSeconds % 60).padStart(2, "0");
  document.querySelector('[data-slot="uptime"]').textContent =
    `${hours}:${minutes}:${seconds}`;
}

function startStatusUpdates() {
  window.clearInterval(clockTimer);
  if (reduceMotionQuery.matches || document.hidden || !headerVisible) return;
  clockTimer = window.setInterval(() => {
    updateLocalTime();
    updateUptime();
  }, 1000);
}

function stopLiveUpdates() {
  window.clearInterval(monitorTimer);
  window.clearInterval(clockTimer);
  window.clearTimeout(logcatTimer);
}

function renderCounterValue(element, value) {
  const suffix = element.dataset.countSuffix || "";
  element.textContent = `${value}${suffix}`;
}

function animateCounter(element) {
  if (element.dataset.countStarted === "true") return;
  element.dataset.countStarted = "true";
  const target = Number(element.dataset.countTarget);
  if (!Number.isFinite(target)) return;

  if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
    renderCounterValue(element, target);
    return;
  }

  const duration = 1200;
  const startTime = performance.now();
  const step = (now) => {
    counterFrames.delete(element);
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    renderCounterValue(element, Math.round(target * eased));
    if (progress < 1) {
      counterFrames.set(element, window.requestAnimationFrame(step));
    }
  };

  counterFrames.set(element, window.requestAnimationFrame(step));
}

function setStatValue(container, value, label) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return;

  container.innerHTML = `
    <span class="counter-value" data-count-target="${numericValue}" data-count-suffix="" aria-hidden="true">0</span>
    <span class="sr-only">${label}: ${numericValue}</span>
  `;
  const counter = container.querySelector(".counter-value");
  if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
    renderCounterValue(counter, numericValue);
  } else if (counterObserver) {
    counterObserver.observe(counter);
  }
}

async function loadRepositoryStats() {
  const projects = [...projectList.querySelectorAll(".project-details[data-repository]")];

  await Promise.all(
    projects.map(async (projectElement) => {
      const repository = projectElement.dataset.repository;
      const response = await fetch(`https://api.github.com/repos/${repository}`);

      if (!response.ok) {
        throw new Error(
          `GitHub returned ${response.status} for ${repository}.`,
        );
      }

      const repositoryData = await response.json();
      const stars = projectElement.querySelector('[data-stat="stars"]');
      const forks = projectElement.querySelector('[data-stat="forks"]');

      setStatValue(stars, repositoryData.stargazers_count, projectsSection.stats.stars);
      setStatValue(forks, repositoryData.forks_count, projectsSection.stats.forks);
    }),
  );
}

loadRepositoryStats().catch((error) => {
  console.error("Unable to load GitHub project statistics.", error);
});

const contact = content.contact;
document.querySelector('[data-slot="contact-index"]').textContent =
  contact.index;
document.querySelector('[data-slot="contact-title"]').textContent =
  contact.title;
document.querySelector('[data-slot="contact-description"]').textContent =
  contact.description;
document.querySelector('[data-slot="contact-response"]').innerHTML = `
  <span class="response-label">${contact.responseTime.label}</span>
  <strong>${contact.responseTime.value}</strong>
`;

const formContainer = document.querySelector('[data-slot="contact-form"]');
formContainer.innerHTML = `
  <form class="contact-form" action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="${contact.form.accessKey}">
    <label>
      <input name="name" autocomplete="name" placeholder=" " required>
      <span>${contact.form.nameLabel}</span>
    </label>
    <label>
      <input name="email" type="email" autocomplete="email" placeholder=" " required>
      <span>${contact.form.emailLabel}</span>
    </label>
    <label>
      <textarea name="message" rows="5" placeholder=" " required></textarea>
      <span>${contact.form.messageLabel}</span>
    </label>
    <button class="contact-submit" type="submit">${contact.form.submit}</button>
    <p class="form-setup" data-form-setup></p>
    <p class="form-status" role="status" aria-live="polite"></p>
  </form>
`;

const socialLinks = contact.links;
const socialMarkup = [
  ["email", "email"],
  ["github", "github"],
  ["linkedin", "linkedin"],
]
  .filter(([key]) => socialLinks[key].href)
  .map(([key, icon]) => {
    const link = socialLinks[key];
    return `
      <a class="social-link" href="${link.href}" aria-label="${link.label}">
        <svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${icon}"></use></svg>
        <span>${link.label}</span>
      </a>
    `;
  })
  .join("");

if (socialMarkup) {
  formContainer.insertAdjacentHTML(
    "afterend",
    `<nav class="social-links" aria-label="${contact.socialLabel}">${socialMarkup}</nav>`,
  );
}

const contactForm = formContainer.querySelector("form");
const formSubmit = contactForm.querySelector('button[type="submit"]');
const formSetup = contactForm.querySelector("[data-form-setup]");
const formStatus = contactForm.querySelector(".form-status");
const web3FormsAccessKey = data.settings.web3FormsAccessKey;
contactForm.querySelector('[name="access_key"]').value = web3FormsAccessKey;
const hasWeb3FormsKey =
  web3FormsAccessKey !== "YOUR_WEB3FORMS_ACCESS_KEY";

formSubmit.disabled = !hasWeb3FormsKey;
formSetup.textContent = hasWeb3FormsKey ? "" : contact.form.setup;

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  contactForm.dataset.state = "";
  formStatus.textContent = "";

  if (!contactForm.reportValidity()) {
    contactForm.dataset.state = "error";
    formStatus.textContent = contact.form.validationError;
    return;
  }

  if (!hasWeb3FormsKey) {
    return;
  }

  formSubmit.disabled = true;
  formSubmit.textContent = contact.form.sending;

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
    });

    contactForm.addEventListener(
      "invalid",
      (event) => event.target.setAttribute("aria-invalid", "true"),
      true,
    );
    contactForm.addEventListener("input", (event) => {
      if (event.target.validity.valid) {
        event.target.removeAttribute("aria-invalid");
      }
    });

    if (!response.ok) {
      throw new Error(`Web3Forms returned ${response.status}.`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error("Web3Forms did not accept the message.");
    }

    contactForm.reset();
    contactForm.dataset.state = "success";
    formStatus.textContent = contact.form.success;
  } catch (error) {
    console.error("Unable to submit the contact form.", error);
    contactForm.dataset.state = "error";
    formStatus.textContent = contact.form.error;
  } finally {
    formSubmit.disabled = false;
    formSubmit.textContent = contact.form.submit;
  }
});

document.querySelector('[data-slot="copyright"]').textContent =
  content.footer.copyright;
document.querySelector('[data-slot="version"]').textContent =
  content.footer.version;
document.querySelector('[data-slot="footer-build"]').textContent =
  content.live.footerBuild;
document.querySelector('[data-slot="back-to-top"]').textContent =
  content.live.backToTop;
document
  .querySelector(".site-footer")
  .insertAdjacentHTML("afterbegin", createRuler());

document.querySelectorAll(".site-main > section").forEach((section) => {
  section.insertAdjacentHTML("beforeend", createRuler());
});

const clock = document.querySelector('[data-slot="time"]');

function updateLocalTime() {
  const now = new Date();
  clock.dateTime = now.toISOString();
  clock.textContent = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
}

updateLocalTime();
renderMonitor(0);

const revealElements = document.querySelectorAll(
  ".hero-copy, .profile-spec, .section-heading, .about-copy, .skill-table, .project-list, .contact-layout, .activity-panel",
);
const sectionIndexLabels = document.querySelectorAll(".section-index");

function pauseArchitectureFlow() {
  document.querySelector(".architecture-diagram")?.pauseAnimations?.();
}

function resumeArchitectureFlow() {
  if (reduceMotionQuery.matches || document.hidden) return;
  const diagram = document.querySelector(".architecture-diagram");
  if (!diagram) return;
  const bounds = diagram.getBoundingClientRect();
  if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
  diagram.unpauseAnimations?.();
}

function setFinalMotionState() {
  stopLiveUpdates();
  terminalTypingFinished = true;
  counterFrames.forEach((frame) => window.cancelAnimationFrame(frame));
  counterFrames.clear();
  document
    .querySelectorAll(".draw-path")
    .forEach((path) => path.classList.add("is-drawn"));
  document
    .querySelectorAll(".architecture-figure, .circuit-figure")
    .forEach((figure) => figure.classList.add("labels-visible"));
  document
    .querySelectorAll(".activity-panel")
    .forEach((panel) => panel.classList.add("is-visible"));
  revealElements.forEach((element) => element.classList.add("is-visible"));
  sectionIndexLabels.forEach((element) => element.classList.add("is-visible"));
  document.querySelectorAll("[data-count-target]").forEach((element) => {
    renderCounterValue(element, Number(element.dataset.countTarget));
  });
  completeTerminal();
  pauseArchitectureFlow();
}

function initializeDrawingsAndCounters() {
  const paths = [...document.querySelectorAll(".draw-path")];
  paths.forEach((path) => {
    if (typeof path.getTotalLength !== "function") {
      path.classList.add("is-drawn");
      return;
    }

    const length = path.getTotalLength();
    path.style.setProperty("--path-length", String(length));
  });

  if ("IntersectionObserver" in window) {
    const flowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) resumeArchitectureFlow();
          else pauseArchitectureFlow();
        });
      },
      { threshold: 0.1 },
    );
    const architectureFigure = document.querySelector(".architecture-figure");
    if (architectureFigure) flowObserver.observe(architectureFigure);

    const liveObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.matches(".system-monitor")) {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
            monitorVisible = entry.isIntersecting;
            if (monitorVisible) {
              renderMonitor(monitorStep);
              startMonitorUpdates();
            } else {
              window.clearInterval(monitorTimer);
            }
          } else if (entry.target.matches(".status-bar")) {
            headerVisible = entry.isIntersecting;
            document
              .querySelector(".site-header")
              .classList.toggle("is-visible", headerVisible);
            startStatusUpdates();
          } else if (entry.target.matches(".terminal-block")) {
            terminalVisible = entry.isIntersecting;
            entry.target.classList.toggle("is-visible", terminalVisible);
            if (terminalVisible) {
              scheduleLogcat();
            } else {
              window.clearTimeout(logcatTimer);
              if (!terminalTypingFinished) {
                terminalTypingFinished = true;
                completeTerminal();
              }
            }
          } else if (entry.target.matches(".now-panel")) {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
          }
        });
      },
      { threshold: 0.05 },
    );
    document
      .querySelectorAll(
        ".system-monitor, .status-bar, .terminal-block, .now-panel",
      )
      .forEach((target) => liveObserver.observe(target));
  }

  if (
    reduceMotionQuery.matches ||
    !("IntersectionObserver" in window)
  ) {
    setFinalMotionState();
    return;
  }

  const drawingTargets = document.querySelectorAll(
    ".architecture-figure, .circuit-figure, .section-ruler, .activity-panel",
  );
  const drawingObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll(".draw-path").forEach((path) => {
          path.classList.add("is-drawn");
        });
        entry.target.classList.add(
          entry.target.classList.contains("activity-panel")
            ? "is-visible"
            : "labels-visible",
        );
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );
  drawingTargets.forEach((target) => drawingObserver.observe(target));

  const counterTargets = document.querySelectorAll("[data-count-target]");
  counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 },
  );
  counterTargets.forEach((target) => counterObserver.observe(target));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.querySelectorAll(".section-index").forEach((label) => {
            label.classList.add("is-visible");
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 6) * 60}ms`);
    revealObserver.observe(element);
  });

  sectionIndexLabels.forEach((label) => {
    label.classList.add("reveal", "section-index-reveal");
  });
}

reduceMotionQuery.addEventListener("change", (event) => {
  if (event.matches) {
    setFinalMotionState();
  } else {
    startStatusUpdates();
    startMonitorUpdates();
    if (terminalTypingFinished) scheduleLogcat();
    resumeArchitectureFlow();
  }
});

initializeDrawingsAndCounters();
startStatusUpdates();
startMonitorUpdates();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.body.classList.add("page-hidden");
    if (!reduceMotionQuery.matches) {
      terminalTypingFinished = true;
      completeTerminal();
    }
    stopLiveUpdates();
    pauseArchitectureFlow();
    return;
  }

  document.body.classList.remove("page-hidden");
  startStatusUpdates();
  startMonitorUpdates();
  if (terminalTypingFinished) scheduleLogcat();
  resumeArchitectureFlow();
});

const progressBar = document.querySelector(".scroll-progress");
const progressFill = progressBar.querySelector("span");
let progressFrame = 0;

function updateScrollProgress() {
  progressFrame = 0;
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0
      ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
      : 0;
  progressFill.style.transform = `scaleX(${progress})`;
  progressBar.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
}

window.addEventListener(
  "scroll",
  () => {
    if (!progressFrame) {
      progressFrame = window.requestAnimationFrame(updateScrollProgress);
    }
  },
  { passive: true },
);
window.addEventListener("resize", updateScrollProgress, { passive: true });
updateScrollProgress();

const navigation = document.querySelector(".site-navigation");
const navIndicator = navigation.querySelector(".nav-indicator");
const navigationLinks = [...navigation.querySelectorAll("a[href^='#']")];

function setActiveNavigation(link) {
  navigationLinks.forEach((item) => {
    if (item === link) item.setAttribute("aria-current", "location");
    else item.removeAttribute("aria-current");
  });
  const navBounds = navigation.getBoundingClientRect();
  const linkBounds = link.getBoundingClientRect();
  navIndicator.style.left = `${linkBounds.left - navBounds.left}px`;
  navIndicator.style.width = `${linkBounds.width}px`;
}

if ("IntersectionObserver" in window) {
  const navigationObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!activeEntry) return;
      const link = navigation.querySelector(
        `a[href="#${activeEntry.target.id}"]`,
      );
      if (link) setActiveNavigation(link);
    },
    { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.1, 0.5] },
  );
  document
    .querySelectorAll(".site-main > section[id]")
    .forEach((section) => navigationObserver.observe(section));
}

window.addEventListener("resize", () => {
  const activeLink = navigation.querySelector('[aria-current="location"]');
  if (activeLink) setActiveNavigation(activeLink);
});
