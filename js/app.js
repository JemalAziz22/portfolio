const data = window.PORTFOLIO_DATA;
const storedLocale = localStorage.getItem("portfolio-locale");
const locale = data.locales[storedLocale] ? storedLocale : data.defaultLocale;
const content = data.locales[locale];
const activityLog = [];
const maxLogEntries = 50;
let logcatOutput = null;
let logLevelFilter = "ALL";

function localizeMessage(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function recordActivity(level, key, values = {}) {
  const template = content.hero.terminal.text[key];
  if (!template) return;

  activityLog.push({
    level,
    message: localizeMessage(template, values),
    timestamp: new Date(),
  });
  if (activityLog.length > maxLogEntries) activityLog.shift();
  renderLogcat();
}

function renderLogcat() {
  if (!logcatOutput) return;
  const entries = activityLog.filter(
    (entry) => logLevelFilter === "ALL" || entry.level === logLevelFilter,
  );
  logcatOutput.replaceChildren();

  entries.forEach((entry) => {
    const line = document.createElement("p");
    line.className = `terminal-log log-level-${entry.level.toLowerCase()}`;
    const time = document.createElement("time");
    time.dateTime = entry.timestamp.toISOString();
    time.textContent = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: data.timeZone,
    }).format(entry.timestamp);
    const level = document.createElement("span");
    level.className = "log-level";
    level.textContent = entry.level;
    const message = document.createElement("span");
    message.textContent = entry.message;
    line.append(time, level, message);
    logcatOutput.append(line);
  });
}

const pendingLanguage = sessionStorage.getItem("portfolio-pending-language");
if (pendingLanguage) {
  sessionStorage.removeItem("portfolio-pending-language");
  recordActivity("I", "languageEvent", {
    language: data.localeNames[locale] || locale,
  });
}
recordActivity("I", "pageLoaded");

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
  sessionStorage.setItem("portfolio-pending-language", nextLocale);
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

function changeTheme(nextTheme) {
  if (!["dark", "light"].includes(nextTheme)) return false;
  if (document.documentElement.dataset.theme === nextTheme) return true;

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
  recordActivity("I", "themeEvent", { theme: nextTheme });
  return true;
}

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "light" ? "dark" : "light";
  changeTheme(nextTheme);
});

if (!savedTheme) {
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (event) => {
    applyTheme(event.matches ? "light" : "dark");
    recordActivity("I", "themeEvent", {
      theme: event.matches ? "light" : "dark",
    });
  });
}

const slots = {
  name: content.status.name,
  "location-label": content.status.locationLabel,
  location: content.status.location,
  "time-label": content.status.localTimeLabel,
  availability: content.status.available,
  "availability-sample": content.status.availabilitySampleLabel,
  "uptime-label": content.live.uptimeLabel,
};

Object.entries(slots).forEach(([name, value]) => {
  const element = document.querySelector(`[data-slot="${name}"]`);
  element.textContent = value;
});

const brand = document.querySelector(".status-name");
const nameParts = content.status.name.trim().split(/\s+/).filter(Boolean);
const monogram = data.monogram ||
  (nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[1][0]}`
    : nameParts[0].slice(0, 2));
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
  ${content.hero.sampleLabel ? `<span class="hero-sample-label">${content.hero.sampleLabel}</span>` : ""}
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
            <span class="hero-metric-label">${content.hero.metricSampleLabel ? `${content.hero.metricSampleLabel} · ` : ""}${metric.label}</span>
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

const profileImage = data.profileImage;
const profileImageMarkup = profileImage.enabled
  ? `<img
        src="${profileImage.src}"
        srcset="${profileImage.srcSet}"
        sizes="(max-width: 767px) 88px, 144px"
        width="${profileImage.width}"
        height="${profileImage.height}"
        fetchpriority="high"
        alt="${content.hero.identity.imageAlt}"
        style="--profile-image-position:${profileImage.position}"
      >`
  : "";
const profilePhoto = document.createElement("figure");
profilePhoto.className = "profile-photo";
profilePhoto.tabIndex = 0;
profilePhoto.setAttribute("aria-label", content.hero.identity.imageAlt);
profilePhoto.innerHTML = `
  ${profileImageMarkup}
  <span class="profile-monogram" aria-hidden="true">${monogram}</span>
  <span class="profile-photo-mark profile-photo-mark--top-start" aria-hidden="true">+</span>
  <span class="profile-photo-mark profile-photo-mark--top-end" aria-hidden="true">+</span>
  <span class="profile-photo-mark profile-photo-mark--bottom-start" aria-hidden="true">+</span>
  <span class="profile-photo-mark profile-photo-mark--bottom-end" aria-hidden="true">+</span>
`;
const profileImageElement = profilePhoto.querySelector("img");
if (profileImageElement) {
  profileImageElement.addEventListener("load", () => {
    profilePhoto.classList.add("has-image");
  });
  profileImageElement.addEventListener("error", () => {
    profileImageElement.remove();
  });
}
document.querySelector('[data-slot="hero-spec"]').insertAdjacentHTML(
  "afterbegin",
  `
    <section class="profile-identity" aria-label="${content.hero.specLabel}">
      <div class="profile-portrait"></div>
      <div class="profile-identity-copy">
        <p class="profile-name">${content.status.name}</p>
        <p class="profile-role">${content.hero.identity.role}</p>
        <p class="profile-location">${content.status.location}</p>
        <p class="profile-availability">
          <span class="availability-indicator" aria-hidden="true"></span>
          <span>${content.status.available}</span>
        </p>
        <div class="profile-metadata">
          ${content.hero.identity.sampleLabel ? `<span class="profile-sample-label">${content.hero.identity.sampleLabel}</span>` : ""}
          ${content.hero.identity.id ? `<span class="profile-id">ID ${content.hero.identity.id}</span>` : ""}
        </div>
      </div>
    </section>
  `,
);
document.querySelector(".profile-portrait").append(profilePhoto);

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
const monitor = content.hero.monitor;
const now = content.hero.now;
const reduceMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const terminalHistory = [];
let historyCursor = 0;
let monitorActive = false;
let monitorViewportVisible = false;
let monitorFrame = 0;
let monitorSampleTimestamp = 0;
let monitorSampleCount = 0;
let monitorValues = { fps: [], memory: [], network: [] };

const monitorPanelMarkup = `
  <section class="system-monitor" id="monitor-panel" role="tabpanel" tabindex="0" aria-labelledby="tab-monitor" aria-label="${monitor.title}" hidden>
    <div class="monitor-heading">
      <span>${monitor.title}</span>
      <span class="monitor-updated">${monitor.liveLabel}</span>
    </div>
    <div class="monitor-grid">
      ${["fps", "memory", "network"]
        .map(
          (key) => `
            <div class="monitor-metric" data-monitor="${key}">
              <span class="monitor-label">${monitor.labels[key]}</span>
              <svg class="sparkline" viewBox="0 0 120 40" role="img" aria-label="${monitor.labels[key]}">
                <path class="sparkline-line" fill="none"></path>
              </svg>
              <span class="monitor-reading"><b data-reading>n/a</b><small data-unit>${monitor.units[key]}</small></span>
              <span class="monitor-detail" data-monitor-detail></span>
            </div>
          `,
        )
        .join("")}
    </div>
  </section>
`;

const logcatFilters = ["ALL", "I", "D", "W", "E"];
const terminalMarkup = `
  <div class="terminal-block">
    <div class="terminal-titlebar">
      <span class="window-indicators" aria-hidden="true"><i></i><i></i><i></i></span>
      <p class="terminal-heading">
        <svg class="icon" aria-hidden="true"><use href="assets/icons.svg#terminal"></use></svg>
        <span>${terminal.windowTitle}</span>
      </p>
      <span class="terminal-live-indicator" aria-hidden="true"></span>
    </div>
    <div class="terminal-tabs" role="tablist" aria-label="${terminal.label}">
      ${Object.entries(terminal.tabs)
        .map(
          ([key, label], index) => `
            <button
              id="tab-${key}"
              type="button"
              role="tab"
              aria-selected="${index === 0}"
              aria-controls="${key}-panel"
              tabindex="${index === 0 ? "0" : "-1"}"
              data-terminal-tab="${key}"
            >${label}</button>
          `,
        )
        .join("")}
    </div>
    <section class="terminal-panel" id="console-panel" role="tabpanel" tabindex="0" aria-labelledby="tab-console">
      <div class="terminal-screen">
        <div class="terminal-output" role="log" aria-live="off" aria-relevant="additions text"></div>
      </div>
      <form class="terminal-input-form">
        <label class="sr-only" for="terminal-command">${terminal.inputLabel}</label>
        <span class="terminal-prompt" aria-hidden="true">${terminal.prompt}</span>
        <input id="terminal-command" name="command" type="text" autocomplete="off" spellcheck="false" aria-label="${terminal.inputLabel}" placeholder="${terminal.inputPlaceholder}">
        <button type="submit">${terminal.runLabel}</button>
      </form>
      <div class="terminal-quick-commands" role="group" aria-label="${terminal.quickCommandsLabel}">
        ${terminal.quickCommands
          .map(
            (command) =>
              `<button type="button" class="terminal-chip" data-command="${command}">${command}</button>`,
          )
          .join("")}
      </div>
      <p class="terminal-command-live sr-only" aria-live="polite" aria-atomic="true"></p>
    </section>
    ${monitorPanelMarkup}
    <section class="logcat-panel" id="logcat-panel" role="tabpanel" tabindex="0" aria-labelledby="tab-logcat" hidden>
      <div class="logcat-controls">
        <div class="logcat-filters" role="group" aria-label="${terminal.text.logFilter}">
          ${logcatFilters
            .map(
              (level) => `
                <button type="button" data-log-filter="${level}" aria-pressed="${level === "ALL"}" aria-label="${terminal.text.logLevels[level]}">${level === "ALL" ? terminal.text.allLevels : level}</button>
              `,
            )
            .join("")}
        </div>
        <button type="button" class="logcat-clear">${terminal.text.logClear}</button>
      </div>
      <div class="logcat-screen" role="log" aria-live="off" aria-relevant="additions text"></div>
    </section>
  </div>
`;

document.querySelector(".profile-identity").insertAdjacentHTML(
  "afterend",
  terminalMarkup,
);
document.querySelector(".terminal-block").insertAdjacentHTML(
  "afterend",
  `
    <aside class="now-panel" aria-label="${now.label}">
      <div class="now-heading">
        <span class="now-label">${now.label}</span>
        <span class="now-status"><i aria-hidden="true"></i><span data-now-status>${now.status}</span></span>
      </div>
      <p class="now-title" data-now-title>${now.loading}</p>
      <p class="now-message" data-now-message></p>
      <p class="now-updated" data-now-updated></p>
    </aside>
  `,
);

const terminalOutput = document.querySelector(".terminal-output");
const terminalScreen = document.querySelector(".terminal-screen");
const terminalInput = document.querySelector("#terminal-command");
const terminalLive = document.querySelector(".terminal-command-live");
const monitorCharts = [...document.querySelectorAll(".monitor-metric")];
logcatOutput = document.querySelector(".logcat-screen");
renderLogcat();

function scrollConsoleToEnd() {
  window.requestAnimationFrame(() => {
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  });
}

function appendConsoleLine(text, className = "terminal-result") {
  const line = document.createElement("p");
  line.className = className;
  line.textContent = text;
  terminalOutput.append(line);
  while (terminalOutput.children.length > 200) {
    terminalOutput.firstElementChild.remove();
  }
  scrollConsoleToEnd();
}

function appendCommandEcho(commandText) {
  const line = document.createElement("p");
  line.className = "terminal-command";
  const prompt = document.createElement("span");
  prompt.className = "terminal-prompt";
  prompt.textContent = terminal.prompt;
  const commandName = document.createElement("span");
  commandName.className = "terminal-command-name";
  commandName.textContent = commandText.split(/\s+/)[0] || "";
  line.append(prompt, document.createTextNode(" "), commandName);

  const tokens = commandText.match(/"[^"]*"|'[^']*'|\S+/g) || [];
  tokens.slice(1).forEach((token) => {
    const argument = document.createElement("span");
    argument.className =
      token.startsWith("'") || token.startsWith('"')
        ? "terminal-string"
        : "terminal-argument";
    argument.textContent = ` ${token}`;
    line.append(argument);
  });
  terminalOutput.append(line);
  scrollConsoleToEnd();
}

function publishCommandResult(message, className = "terminal-result") {
  appendConsoleLine(message, className);
  terminalLive.textContent = message;
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: reduceMotionQuery.matches ? "auto" : "smooth",
    block: "start",
  });
}

function runTerminalCommand(rawCommand) {
  const commandText = rawCommand.trim();
  if (!commandText) return;
  const [name, ...args] = commandText.split(/\s+/);
  const command = terminal.commands.find((entry) => entry.name === name);
  terminalInput.value = "";
  historyCursor = terminalHistory.length;
  terminalHistory.push(commandText);
  if (terminalHistory.length > 50) terminalHistory.shift();
  appendCommandEcho(commandText);
  recordActivity("D", "commandRun", { command: name });

  if (!command) {
    publishCommandResult(
      localizeMessage(terminal.text.unknownCommand, { command: name }),
      "terminal-error",
    );
    return;
  }

  const output = [];
  const usageError = () =>
    localizeMessage(terminal.text.missingArgument, {
      usage: command.usage || command.name,
    });

  switch (command.action) {
    case "help":
      output.push(terminal.text.helpHeading);
      terminal.commands.forEach((entry) => {
        output.push(
          `${entry.usage || entry.name} — ${entry.description}`,
        );
      });
      break;
    case "about":
      output.push(terminal.text.profileHeading);
      output.push(content.hero.description);
      content.about.paragraphs.forEach((paragraph) => output.push(paragraph));
      break;
    case "skills":
      output.push(terminal.text.skillsHeading);
      content.skills.groups.forEach((group) => {
        output.push(`${group.name}: ${group.items.join(", ")}`);
      });
      break;
    case "projects":
      output.push(terminal.text.projectsHeading);
      content.projects.items.forEach((project, index) => {
        output.push(`${project.id || index + 1} — ${project.name}`);
      });
      scrollToSection("projects");
      break;
    case "open": {
      const requestedId = args[0];
      if (!requestedId) {
        publishCommandResult(usageError(), "terminal-error");
        return;
      }
      const projectElement = [...projectList.querySelectorAll(".project-details")]
        .find((element) => element.dataset.projectId === requestedId);
      if (!projectElement) {
        publishCommandResult(
          localizeMessage(terminal.text.projectMissing, { id: requestedId }),
          "terminal-error",
        );
        return;
      }
      projectElement.open = true;
      projectElement.querySelector("summary").scrollIntoView({
        behavior: reduceMotionQuery.matches ? "auto" : "smooth",
        block: "center",
      });
      output.push(
        localizeMessage(terminal.text.projectOpened, {
          name: projectElement.dataset.projectName,
        }),
      );
      break;
    }
    case "contact":
      scrollToSection("contact");
      output.push(terminal.text.contactOpened);
      break;
    case "theme": {
      const theme = args[0]?.toLowerCase();
      if (!["dark", "light"].includes(theme)) {
        publishCommandResult(usageError(), "terminal-error");
        return;
      }
      changeTheme(theme);
      output.push(localizeMessage(terminal.text.themeChanged, { theme }));
      break;
    }
    case "lang": {
      const targetLocale = args[0]?.toLowerCase();
      if (!data.locales[targetLocale]) {
        publishCommandResult(usageError(), "terminal-error");
        return;
      }
      if (targetLocale === locale) {
        output.push(
          localizeMessage(terminal.text.languageChanged, {
            language: data.localeNames[locale] || locale,
          }),
        );
        break;
      }
      sessionStorage.setItem("portfolio-pending-language", targetLocale);
      localStorage.setItem("portfolio-locale", targetLocale);
      location.reload();
      return;
    }
    case "clear":
      terminalOutput.replaceChildren();
      terminalLive.textContent = terminal.text.consoleCleared;
      return;
    case "neofetch": {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      const memory = navigator.deviceMemory
        ? `${navigator.deviceMemory} GB`
        : terminal.text.notAvailable;
      const connectionType = connection
        ? [
            connection.effectiveType,
            Number.isFinite(connection.downlink)
              ? `${connection.downlink} Mb/s`
              : "",
            Number.isFinite(connection.rtt) ? `RTT ${connection.rtt} ms` : "",
          ]
            .filter(Boolean)
            .join(" · ")
        : terminal.text.notAvailable;
      output.push(terminal.text.neofetchHeading);
      output.push(`${terminal.text.userAgent}: ${navigator.userAgent.slice(0, 120)}`);
      output.push(`${terminal.text.language}: ${navigator.language}`);
      output.push(`${terminal.text.screen}: ${screen.width} × ${screen.height}`);
      output.push(
        `${terminal.text.cores}: ${navigator.hardwareConcurrency || terminal.text.notAvailable}`,
      );
      output.push(`${terminal.text.memory}: ${memory}`);
      output.push(`${terminal.text.connection}: ${connectionType}`);
      break;
    }
    case "history":
      if (terminalHistory.length === 0) output.push(terminal.text.historyEmpty);
      else terminalHistory.forEach((entry, index) => output.push(`${index + 1}  ${entry}`));
      break;
    default:
      publishCommandResult(
        localizeMessage(terminal.text.unknownCommand, { command: name }),
        "terminal-error",
      );
      return;
  }

  output.forEach((line, index) =>
    publishCommandResult(line, index === 0 ? "terminal-result" : "terminal-result"),
  );
}

function setTerminalTab(tabName, focusTab = false) {
  const tabs = [...document.querySelectorAll("[data-terminal-tab]")];
  tabs.forEach((tab) => {
    const selected = tab.dataset.terminalTab === tabName;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(`${tabName}-panel`);
    if (selected) panel?.removeAttribute("hidden");
    else document.getElementById(`${tab.dataset.terminalTab}-panel`)?.setAttribute("hidden", "");
    if (selected && focusTab) tab.focus();
  });

  monitorActive = tabName === "monitor";
  if (monitorActive) startMonitorUpdates();
  else stopMonitorUpdates();
  if (tabName === "logcat") renderLogcat();
}

const terminalTabs = [...document.querySelectorAll("[data-terminal-tab]")];
terminalTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => setTerminalTab(tab.dataset.terminalTab));
  tab.addEventListener("keydown", (event) => {
    const rtl = document.documentElement.dir === "rtl";
    const step = event.key === "ArrowRight" ? (rtl ? -1 : 1) :
      event.key === "ArrowLeft" ? (rtl ? 1 : -1) : 0;
    const targetIndex =
      event.key === "Home" ? 0 :
      event.key === "End" ? terminalTabs.length - 1 :
      (index + step + terminalTabs.length) % terminalTabs.length;
    if (step || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setTerminalTab(terminalTabs[targetIndex].dataset.terminalTab, true);
    }
  });
});

document.querySelector(".terminal-input-form").addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    runTerminalCommand(terminalInput.value);
  },
);
terminalInput.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    if (event.key === "ArrowUp") historyCursor = Math.max(0, historyCursor - 1);
    else historyCursor = Math.min(terminalHistory.length, historyCursor + 1);
    terminalInput.value = terminalHistory[historyCursor] || "";
    return;
  }
  if (event.key !== "Tab") return;
  event.preventDefault();
  const [first, second] = terminalInput.value.split(/\s+/);
  let candidates = terminal.commands.map((entry) => entry.name);
  if (first === "theme") candidates = ["dark", "light"];
  if (first === "lang") candidates = Object.keys(data.locales);
  if (first === "open") {
    candidates = content.projects.items.map(
      (project, index) => project.id || String(index + 1),
    );
  }
  const current = second === undefined ? first : second;
  const match = candidates.find((candidate) => candidate.startsWith(current || ""));
  if (!match) return;
  terminalInput.value =
    second === undefined ? match : `${first} ${match}`;
});

document.querySelectorAll(".terminal-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    setTerminalTab("console");
    runTerminalCommand(chip.dataset.command);
  });
});

document.querySelectorAll("[data-log-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    logLevelFilter = button.dataset.logFilter;
    document.querySelectorAll("[data-log-filter]").forEach((filter) => {
      filter.setAttribute(
        "aria-pressed",
        String(filter === button),
      );
    });
    renderLogcat();
  });
});
document.querySelector(".logcat-clear").addEventListener("click", () => {
  activityLog.length = 0;
  renderLogcat();
});

const nowPanel = document.querySelector(".now-panel");
appendConsoleLine(terminal.text.ready);

function renderNow(status, title, message = "", updated = "") {
  nowPanel.querySelector("[data-now-status]").textContent = status;
  nowPanel.querySelector("[data-now-title]").textContent = title;
  nowPanel.querySelector("[data-now-message]").textContent = message;
  nowPanel.querySelector("[data-now-updated]").textContent = updated;
}

function renderSampleNow(extraMessage = "") {
  const message = [now.sampleMessage, extraMessage].filter(Boolean).join(" ");
  renderNow(
    now.sampleStatus,
    now.sampleTitle,
    message,
    `${now.updated} · ${now.sampleStatus}`,
  );
}

function formatRelativeTime(date) {
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );
  if (elapsedMinutes < 1) return terminal.text.relativeNow;
  if (elapsedMinutes < 60) {
    return localizeMessage(terminal.text.relativeMinutes, {
      count: new Intl.NumberFormat(locale).format(elapsedMinutes),
    });
  }
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return localizeMessage(terminal.text.relativeHours, {
      count: new Intl.NumberFormat(locale).format(elapsedHours),
    });
  }
  return localizeMessage(terminal.text.relativeDays, {
    count: new Intl.NumberFormat(locale).format(
      Math.floor(elapsedHours / 24),
    ),
  });
}

function renderGitHubActivity(activity) {
  const date = new Date(activity.date);
  if (Number.isNaN(date.getTime())) {
    throw new Error("GitHub activity returned an invalid timestamp.");
  }
  renderNow(
    now.status,
    activity.message,
    activity.repository,
    `${now.updated} · ${formatRelativeTime(date)}`,
  );
}

function isValidGitHubActivity(activity) {
  return (
    activity &&
    typeof activity.message === "string" &&
    typeof activity.repository === "string" &&
    typeof activity.date === "string"
  );
}

async function fetchLatestGitHubActivity(username) {
  const encodedUsername = encodeURIComponent(username);
  const eventsResponse = await fetch(
    `https://api.github.com/users/${encodedUsername}/events/public?per_page=30`,
    { headers: { Accept: "application/vnd.github+json" } },
  );
  if (!eventsResponse.ok) {
    throw new Error(`GitHub events returned ${eventsResponse.status}.`);
  }
  const events = await eventsResponse.json();
  const latestPush = events.find(
    (event) =>
      event.type === "PushEvent" &&
      Array.isArray(event.payload?.commits) &&
      event.payload.commits.length > 0,
  );
  if (latestPush) {
    const commit = latestPush.payload.commits.at(-1);
    return {
      message: commit.message,
      repository: latestPush.repo.name,
      date: latestPush.created_at,
    };
  }

  const reposResponse = await fetch(
    `https://api.github.com/users/${encodedUsername}/repos?sort=updated&per_page=1`,
    { headers: { Accept: "application/vnd.github+json" } },
  );
  if (!reposResponse.ok) {
    throw new Error(`GitHub repositories returned ${reposResponse.status}.`);
  }
  const repositories = await reposResponse.json();
  const repository = repositories[0];
  if (!repository?.full_name) return null;

  const commitResponse = await fetch(
    `https://api.github.com/repos/${repository.full_name}/commits?per_page=1`,
    { headers: { Accept: "application/vnd.github+json" } },
  );
  if (!commitResponse.ok) {
    throw new Error(`GitHub commits returned ${commitResponse.status}.`);
  }
  const commits = await commitResponse.json();
  const latestCommit = commits[0];
  if (!latestCommit?.commit?.message || !latestCommit.commit.author?.date) {
    return null;
  }
  return {
    message: latestCommit.commit.message,
    repository: repository.full_name,
    date: latestCommit.commit.author.date,
  };
}

async function loadGitHubActivity() {
  const username = data.github?.username?.trim();
  if (!username) {
    renderSampleNow(now.missingUsername);
    return;
  }

  const cacheKey = `portfolio-github-activity:${username.toLowerCase()}`;
  const cachedText = localStorage.getItem(cacheKey);
  if (cachedText) {
    try {
      const cached = JSON.parse(cachedText);
      if (
        isValidGitHubActivity(cached?.activity) &&
        Number.isFinite(cached?.fetchedAt) &&
        Date.now() - cached.fetchedAt < 30 * 60 * 1000
      ) {
        renderGitHubActivity(cached.activity);
        return;
      }
      localStorage.removeItem(cacheKey);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      localStorage.removeItem(cacheKey);
    }
  }

  try {
    const activity = await fetchLatestGitHubActivity(username);
    if (!activity) {
      renderNow(now.status, terminal.text.noPublicActivity);
      return;
    }
    if (!isValidGitHubActivity(activity)) {
      throw new Error("GitHub returned an incomplete activity record.");
    }
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ activity, fetchedAt: Date.now() }),
    );
    renderGitHubActivity(activity);
  } catch (error) {
    console.warn("GitHub activity unavailable; showing the sample snapshot.", error);
    recordActivity("W", "githubUnavailable");
    renderSampleNow(now.unavailable);
  }
}

loadGitHubActivity();

const aboutSection = document.querySelector("#about");
aboutSection.innerHTML = `
  <div class="section-heading">
    <p class="section-index">${content.about.index}</p>
    <div class="section-heading-main">
      <h2 class="section-title" id="about-title"><svg class="icon section-icon" aria-hidden="true"><use href="assets/icons.svg#layers"></use></svg>${content.about.title}</h2>
      <p class="section-description">${content.about.description}</p>
    </div>
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
            <span class="metric-label">${content.about.metricSampleLabel ? `${content.about.metricSampleLabel} · ` : ""}${metric.label}</span>
            <span class="sr-only">${metric.label}: ${metric.value}${metric.suffix}</span>
          </div>
        `,
      )
      .join("")}
  </div>
`;

function createRuler() {
  const ticks = Array.from({ length: 101 }, (_, index) => {
    const x = index * 10;
    const height = index % 10 === 0 ? 10 : 4;
    return `M${x} ${6 - height / 2}v${height}`;
  }).join("");

  return `
    <svg class="section-ruler" viewBox="0 0 1000 12" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path class="draw-path ruler-track" d="M0 6H1000${ticks}M0 2v8m-4-4h8m992 0h8m-4-4v8"></path>
    </svg>
  `;
}

const skillsSection = document.querySelector("#skills");
const skillGroups = content.skills.groups
  .map((group, groupIndex) => {
    const category = group.category || "systems";
    return `
      <section class="skill-group skill-group--${category}" aria-labelledby="skill-group-${groupIndex}">
        <h3 class="skill-group-title" id="skill-group-${groupIndex}">
          <svg class="icon skill-group-icon" aria-hidden="true"><use href="assets/icons.svg#${group.icon}"></use></svg>
          <span>${group.name}</span>
        </h3>
        <ul class="skill-list">
          ${group.items
            .map((skill) => {
              const skillName = typeof skill === "string" ? skill : skill.name;
              const skillIcon = typeof skill === "string" ? "code" : skill.icon;
              const skillKey = skillName.toLowerCase();
              const placeholder = typeof skill === "object" && skill.placeholder;
              return `
                <li>
                  <button class="skill-tag skill-tag--${category}" type="button" data-skill="${skillKey}" aria-pressed="false"${placeholder ? ` aria-label="${skillName} — ${content.skills.placeholderLabel}"` : ""}>
                    <svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${skillIcon}"></use></svg>
                    <span>${skillName}</span>
                    ${placeholder ? `<small class="skill-placeholder">${content.skills.placeholderLabel}</small>` : ""}
                  </button>
                </li>
              `;
            })
            .join("")}
        </ul>
      </section>
    `;
  })
  .join("");

skillsSection.innerHTML = `
  <div class="section-heading">
    <p class="section-index">${content.skills.index}</p>
    <div class="section-heading-main">
      <h2 class="section-title" id="skills-title"><svg class="icon section-icon" aria-hidden="true"><use href="assets/icons.svg#chip"></use></svg>${content.skills.title}</h2>
      <p class="section-description">${content.skills.description}</p>
    </div>
  </div>
  <div class="skill-matrix">${skillGroups}</div>
  <div class="credentials-block">
    <div class="credentials-heading">
      <h3 class="skill-group-title">
        <svg class="icon skill-group-icon" aria-hidden="true"><use href="assets/icons.svg#${content.credentials.icon}"></use></svg>
        <span>${content.credentials.title}</span>
      </h3>
      <p class="section-description">${content.credentials.description}</p>
    </div>
    <table class="skill-table credential-table">
      <tbody>
        ${content.credentials.rows
          .map(
            (row) => `
              <tr>
                <th scope="row">${row.name}</th>
                <td>${row.level}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
    <article class="trainer-card skill-group--training">
      <div class="trainer-heading">
        <svg class="icon skill-group-icon" aria-hidden="true"><use href="assets/icons.svg#${content.credentials.trainer.icon}"></use></svg>
        <div>
          <h4>${content.credentials.trainer.title}</h4>
          <p>${content.credentials.trainer.description}</p>
        </div>
      </div>
      <dl class="trainer-stats">
        <div><dt>${content.credentials.trainer.yearsLabel}</dt><dd>${content.credentials.trainer.years || content.credentials.trainer.placeholderLabel}</dd></div>
        <div><dt>${content.credentials.trainer.coursesLabel}</dt><dd>${content.credentials.trainer.courses || content.credentials.trainer.placeholderLabel}</dd></div>
      </dl>
    </article>
  </div>
`;

const projectsSection = content.projects;
document.querySelector('[data-slot="projects-index"]').textContent =
  projectsSection.index;
document
  .querySelector('[data-slot="projects-title"]')
  .insertAdjacentText("beforeend", projectsSection.title);
document.querySelector('[data-slot="projects-description"]').textContent =
  projectsSection.description;

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
        <details class="project-details" data-project-id="${project.id || index + 1}" data-project-name="${project.name}" data-category="${project.category}" data-lifecycle="${project.lifecycle}" data-technologies="${technologies}"${repository}>
          <summary class="project-row">
            <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
            <span class="project-name">${project.name}${project.sample === false ? "" : `<span class="project-sample-tag">${projectsSection.sampleLabel}</span>`}</span>
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

projectList.querySelectorAll(".project-details").forEach((project) => {
  project.addEventListener("toggle", () => {
    if (project.open) {
      recordActivity("D", "projectEvent", {
        name: project.dataset.projectName,
      });
    }
  });
});

let selectedSkill = "";
const skillTags = [...document.querySelectorAll(".skill-tag")];
skillTags.forEach((tag, index) => {
  tag.style.setProperty("--skill-delay", `${index * 30}ms`);
});

function highlightSkillProjects(skill) {
  projectList.querySelectorAll(".project-details").forEach((project) => {
    const skillAliases = {
      "jetpack compose": "compose",
      "c/c++": "c++",
    };
    const skillAlias = skillAliases[skill] || skill;
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

let counterObserver;
const counterFrames = new Map();
let clockTimer = 0;
let uptimeSeconds = 0;
let headerVisible = true;
let monitorStaticSampleTaken = false;

function getNavigationLoadTime() {
  const navigationTiming = performance.getEntriesByType("navigation")[0];
  if (!navigationTiming) return null;
  const loadTime = navigationTiming.loadEventEnd || navigationTiming.duration;
  return Number.isFinite(loadTime) && loadTime > 0
    ? Math.round(loadTime)
    : null;
}

function getMonitorSnapshot(fps) {
  const memoryBytes = performance.memory?.usedJSHeapSize;
  const memoryValue = Number.isFinite(memoryBytes)
    ? Number((memoryBytes / 1024 / 1024).toFixed(1))
    : null;
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (connection) {
    const downlink = Number.isFinite(connection.downlink)
      ? Number(connection.downlink.toFixed(1))
      : null;
    const details = [
      Number.isFinite(connection.rtt)
        ? `${monitor.latencyLabel} ${connection.rtt} ms`
        : "",
      connection.effectiveType || "",
    ].filter(Boolean);
    return {
      fps,
      memory: memoryValue,
      network: downlink,
      networkUnit: monitor.units.network,
      networkDetail: details.join(" · "),
    };
  }

  const loadTime = getNavigationLoadTime();
  return {
    fps,
    memory: memoryValue,
    network: loadTime,
    networkUnit: loadTime === null ? "" : "ms",
    networkDetail:
      loadTime === null
        ? ""
        : `${monitor.pageLoadLabel} ${loadTime} ms`,
  };
}

function pushMonitorValue(key, value) {
  if (!Number.isFinite(value)) return;
  const values = monitorValues[key];
  values.push(value);
  if (values.length > 24) values.shift();
}

function renderSparkline(metric, values) {
  const line = metric.querySelector(".sparkline-line");
  if (values.length < 2) {
    line.removeAttribute("d");
    return;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const path = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 120;
      const y = 34 - ((value - min) / span) * 28;
      return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  line.setAttribute("d", path);
}

function renderMonitorSnapshot(snapshot) {
  monitorCharts.forEach((metric) => {
    const key = metric.dataset.monitor;
    const value = snapshot[key];
    const unit = key === "network" ? snapshot.networkUnit : monitor.units[key];
    metric.querySelector("[data-reading]").textContent =
      value === null ? "n/a" : String(value);
    metric.querySelector("[data-unit]").textContent = value === null ? "" : unit;
    metric.querySelector("[data-monitor-detail]").textContent =
      key === "network" ? snapshot.networkDetail : "";
    metric.querySelector(".sparkline").setAttribute(
      "aria-label",
      `${monitor.labels[key]}: ${value === null ? "n/a" : `${value} ${unit}`}`,
    );
    if (Number.isFinite(value)) pushMonitorValue(key, value);
    renderSparkline(metric, monitorValues[key]);
  });
}

function sampleMonitorOnce() {
  const snapshot = getMonitorSnapshot(null);
  ["memory", "network"].forEach((key) => {
    const value = snapshot[key];
    if (Number.isFinite(value)) {
      monitorValues[key] = Array.from({ length: 24 }, () => value);
    }
  });
  renderMonitorSnapshot(snapshot);
  monitorStaticSampleTaken = true;
}

function stopMonitorUpdates() {
  if (monitorFrame) window.cancelAnimationFrame(monitorFrame);
  monitorFrame = 0;
  monitorSampleTimestamp = 0;
  monitorSampleCount = 0;
}

function startMonitorUpdates() {
  if (!monitorActive || !monitorViewportVisible || document.hidden) {
    stopMonitorUpdates();
    return;
  }
  if (reduceMotionQuery.matches) {
    stopMonitorUpdates();
    if (!monitorStaticSampleTaken) sampleMonitorOnce();
    return;
  }
  if (monitorFrame) return;

  monitorStaticSampleTaken = false;
  const tick = (timestamp) => {
    monitorFrame = 0;
    if (!monitorActive || !monitorViewportVisible || document.hidden) return;
    if (!monitorSampleTimestamp) {
      monitorSampleTimestamp = timestamp;
    }
    monitorSampleCount += 1;

    if (timestamp - monitorSampleTimestamp >= 500) {
      const elapsed = timestamp - monitorSampleTimestamp;
      const fps = Math.round((monitorSampleCount * 1000) / elapsed);
      renderMonitorSnapshot(getMonitorSnapshot(fps));
      monitorSampleTimestamp = timestamp;
      monitorSampleCount = 0;
    }
    monitorFrame = window.requestAnimationFrame(tick);
  };
  monitorFrame = window.requestAnimationFrame(tick);
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
  stopMonitorUpdates();
  window.clearInterval(clockTimer);
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
document
  .querySelector('[data-slot="contact-title"]')
  .insertAdjacentText("beforeend", contact.title);
document.querySelector(
  '[data-slot="contact-heading-description"]',
).textContent = contact.headingDescription;
document.querySelector('[data-slot="contact-description"]').textContent =
  contact.description;
document.querySelector('[data-slot="contact-description"]').insertAdjacentHTML(
  "afterend",
  `<p class="contact-description">${contact.locationLabel}: ${contact.location}</p>`,
);
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

  recordActivity("I", "formSubmitted");
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
    recordActivity("I", "formSucceeded");
  } catch (error) {
    console.error("Unable to submit the contact form.", error);
    contactForm.dataset.state = "error";
    formStatus.textContent = contact.form.error;
    recordActivity("E", "formFailed");
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
    timeZone: data.timeZone,
  }).format(now);
}

updateLocalTime();

const revealElements = document.querySelectorAll(
  ".hero-copy, .profile-spec, .section-heading, .about-copy, .skill-matrix, .skill-table, .trainer-card, .project-list, .contact-layout",
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
  counterFrames.forEach((frame) => window.cancelAnimationFrame(frame));
  counterFrames.clear();
  document
    .querySelectorAll(".draw-path")
    .forEach((path) => path.classList.add("is-drawn"));
  document
    .querySelectorAll(".architecture-figure, .circuit-figure")
    .forEach((figure) => figure.classList.add("labels-visible"));
  revealElements.forEach((element) => element.classList.add("is-visible"));
  sectionIndexLabels.forEach((element) => element.classList.add("is-visible"));
  document.querySelectorAll("[data-count-target]").forEach((element) => {
    renderCounterValue(element, Number(element.dataset.countTarget));
  });
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
          if (entry.target.matches(".status-bar")) {
            headerVisible = entry.isIntersecting;
            document
              .querySelector(".site-header")
              .classList.toggle("is-visible", headerVisible);
            startStatusUpdates();
          } else if (entry.target.matches(".terminal-block")) {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
            monitorViewportVisible = entry.isIntersecting;
            startMonitorUpdates();
          } else if (entry.target.matches(".now-panel")) {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
          }
        });
      },
      { threshold: 0.05 },
    );
    document
    .querySelectorAll(".status-bar, .terminal-block, .now-panel")
    .forEach((target) => liveObserver.observe(target));
  }

  if (!("IntersectionObserver" in window)) {
    monitorViewportVisible = true;
  }

  if (
    reduceMotionQuery.matches ||
    !("IntersectionObserver" in window)
  ) {
    setFinalMotionState();
    return;
  }

  const drawingTargets = document.querySelectorAll(
    ".architecture-figure, .circuit-figure, .section-ruler",
  );
  const drawingObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll(".draw-path").forEach((path) => {
          path.classList.add("is-drawn");
        });
        entry.target.classList.add("labels-visible");
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
    startMonitorUpdates();
  } else {
    startStatusUpdates();
    startMonitorUpdates();
    resumeArchitectureFlow();
  }
});

initializeDrawingsAndCounters();
startStatusUpdates();
startMonitorUpdates();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.body.classList.add("page-hidden");
    stopLiveUpdates();
    pauseArchitectureFlow();
    return;
  }

  document.body.classList.remove("page-hidden");
  startStatusUpdates();
  startMonitorUpdates();
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
let lastLoggedSection = "";

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
      if (link) {
        setActiveNavigation(link);
        const section = link.textContent.trim();
        if (section !== lastLoggedSection) {
          lastLoggedSection = section;
          recordActivity("I", "sectionEvent", { section });
        }
      }
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
