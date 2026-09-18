/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
import { useCallback, useEffect, useReducer, useState } from "react";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCloud,
  FiCode,
  FiCpu,
  FiDownload,
  FiChevronDown,
  FiFileText,
  FiGlobe,
  FiMenu,
  FiMoon,
  FiSun,
  FiX,
  FiGitBranch,
  FiActivity,
  FiAward,
  FiCopy,
  FiCheck,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiMapPin,
  FiBox,
} from "react-icons/fi";
import portrait from "./assets/My_portfolio_image.png";
import {
  profile,
  platforms,
  responsibilities,
  skills,
  certifications,
  journey,
} from "./content";
import { initialSimulation, simulationReducer } from "./simulation";
import { Section, Tag, Modal, go } from "./ui";
import { Architecture, Engineering } from "./components/Engineering";
import Research from "./components/Research";
import Companion from "./components/Companion";
import { Localization, languages, offlineLanguages } from "./localization";
const nav = [
  ["overview", "Overview"],
  ["experience", "Experience"],
  ["systems", "Systems"],
  ["research", "Research"],
  ["platforms", "Projects"],
];
const routes = {
  recruiter: [
    ["experience", "Explore experience"],
    ["platforms", "View platform work"],
    ["certifications", "View certifications"],
    ["resume-center", "Open résumé"],
  ],
  engineer: [
    ["systems", "Explore architecture"],
    ["labs", "Operate the labs"],
    ["skills", "Inspect skill evidence"],
  ],
  researcher: [
    ["research", "Explore research"],
    ["research", "Try the generation sandbox"],
    ["journey", "Academic journey"],
  ],
};
const readPreference = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};
export default function Portfolio() {
  const [theme, setTheme] = useState(() =>
      readPreference("tasin-theme-v2", "dark"),
    ),
    [mode, setMode] = useState(() =>
      readPreference("tasin-mode-v2", "recruiter"),
    ),
    [flat, setFlat] = useState(
      () => readPreference("tasin-flat-v2", "false") === "true",
    ),
    [menu, setMenu] = useState(false),
    [selectedPlatform, setSelectedPlatform] = useState(null),
    [selectedSkill, setSelectedSkill] = useState(null),
    [journeyIndex, setJourneyIndex] = useState(0),
    [category, setCategory] = useState("All"),
    [skillQuery, setSkillQuery] = useState(""),
    [languageOpen, setLanguageOpen] = useState(false),
    [languageQuery, setLanguageQuery] = useState(""),
    [language, setLanguage] = useState("en"),
    [translationStatus, setTranslationStatus] = useState(""),
    [capabilities, setCapabilities] = useState({
      ai: false,
      translation: false,
    }),
    [copied, setCopied] = useState(false),
    [tour, setTour] = useState(-1),
    [contactState, setContactState] = useState(""),
    [state, dispatch] = useReducer(simulationReducer, initialSimulation);
  useEffect(() => {
    fetch("/api/capabilities")
      .then((r) => r.json())
      .then((c) => {
        setCapabilities(c);
        const primary = (navigator.languages?.[0] || "en").split("-")[0];
        const requested = readPreference("tasin-language-v2", primary);
        if (
          (offlineLanguages.has(requested) || c.translation) &&
          languages.some((x) => x[0] === requested)
        )
          setLanguage(requested);
      })
      .catch(() => {
        const requested = readPreference("tasin-language-v2", "en");
        if (offlineLanguages.has(requested)) setLanguage(requested);
      });
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("tasin-theme-v2", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);
  useEffect(() => {
    try {
      localStorage.setItem("tasin-mode-v2", mode);
      localStorage.setItem("tasin-flat-v2", String(flat));
    } catch {}
  }, [mode, flat]);
  const navigate = useCallback((id) => {
    go(id);
    setMenu(false);
  }, []);
  const toggleTheme = useCallback(
    () => setTheme((x) => (x === "dark" ? "light" : "dark")),
    [],
  );
  const openLanguages = useCallback(() => setLanguageOpen(true), []);
  useEffect(() => {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash.startsWith("platform-"))
      setSelectedPlatform(
        platforms.find(
          (p) => p.name.toLowerCase().replaceAll(" ", "-") === hash.slice(9),
        ) || null,
      );
  }, []);
  const openPlatform = useCallback((p) => {
    if (!p) return;
    setSelectedPlatform(p);
    history.replaceState(
      null,
      "",
      "#platform-" + p.name.toLowerCase().replaceAll(" ", "-"),
    );
  }, []);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setContactState("Copy unavailable. Email: " + profile.email);
    }
  };
  const downloadContact = () => {
    const text =
      "BEGIN:VCARD\nVERSION:3.0\nFN:Alam Md Tasin\nTITLE:DevOps Engineer\nEMAIL:" +
      profile.email +
      "\nURL:https://github.com/Tasin007\nEND:VCARD";
    const url = URL.createObjectURL(new Blob([text], { type: "text/vcard" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "Tasin.vcf";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const tourStops = [
    [
      "overview",
      "Meet Tasin",
      "A DevOps engineer connecting reliable infrastructure with intelligent automation.",
    ],
    [
      "experience",
      "Read the experience",
      "Dates, responsibilities and supporting platforms—not unexplained numbers.",
    ],
    [
      "labs",
      "Operate the system",
      "Inject a database defect, inspect the evidence, then roll back.",
    ],
    [
      "research",
      "Explore the research",
      "Understand the current prototype and the wider generation research direction.",
    ],
    [
      "resume-center",
      "Take the next step",
      "Download the résumé or get in touch.",
    ],
  ];
  const beginTour = () => {
    setTour(0);
    navigate("overview");
  };
  const chooseLanguage = (code) => {
    if (!offlineLanguages.has(code) && !capabilities.translation) {
      setTranslationStatus(
        "This language needs an optional translation provider. English and Japanese remain available offline.",
      );
      return;
    }
    setLanguage(code);
    try {
      localStorage.setItem("tasin-language-v2", code);
    } catch {}
    setTranslationStatus(
      code === "ja"
        ? "Japanese recruiter essentials are available offline; technical product terms remain in English."
        : code === "en"
          ? ""
          : "Machine translation · Loading visible content.",
    );
    setLanguageOpen(false);
  };
  return (
    <Localization
      language={language}
      enabled={capabilities.translation}
      onStatus={setTranslationStatus}
    >
      <div className={"portfolio " + (flat ? "flat-mode" : "")}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <a className="brand" href="#overview" aria-label="Tasin home">
            <img src="/tasin-icon.svg" alt="" />
            Tasin<span className="brand-dot">.</span>
          </a>
          <nav className={menu ? "open" : ""} aria-label="Main navigation">
            {nav.map(([id, title]) => (
              <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
                {title}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <div className="mode-switch" aria-label="Visitor mode">
              {["recruiter", "engineer", "researcher"].map((m) => (
                <button
                  key={m}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                >
                  {m[0].toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            <button
              className="icon-button"
              aria-label="Choose language"
              onClick={openLanguages}
            >
              <FiGlobe />
            </button>
            <button
              className="icon-button"
              aria-label={
                theme === "dark" ? "Enable light mode" : "Enable dark mode"
              }
              onClick={toggleTheme}
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
            <a className="button primary header-talk" href="#contact">
              Let’s talk
              <FiArrowUpRight />
            </a>
            <button
              className="icon-button menu-button"
              aria-label="Toggle navigation"
              aria-expanded={menu}
              onClick={() => setMenu((x) => !x)}
            >
              {menu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </header>
        {translationStatus && (
          <div className="translation-banner" role="status">
            {translationStatus}
            <button
              className="text-button"
              onClick={() => setTranslationStatus("")}
            >
              Dismiss
            </button>
          </div>
        )}
        <main id="main">
          <section className="hero shell" id="overview">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="status-dot" />
                DEVOPS ENGINEER · RESEARCH STUDENT
              </div>
              <h1>
                ALAM MD
                <br />
                <span>TASIN</span>
              </h1>
              <h2>
                Reliable systems.
                <br />
                Intelligent possibilities.
              </h2>
              <p className="hero-description">{profile.introduction}</p>
              <div className="button-row">
                <button
                  className="button primary"
                  onClick={() => navigate(routes[mode][0][0])}
                >
                  {routes[mode][0][1]}
                  <FiArrowUpRight />
                </button>
                <a
                  className="button"
                  href="/Alam_Md_Tasin_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiDownload />
                  Résumé
                </a>
                <button className="text-button" onClick={beginTour}>
                  Take the tour
                  <FiArrowRight />
                </button>
              </div>
              <div className="hero-facts">
                <span>
                  <FiMapPin />
                  Higashi-Hiroshima, Japan
                </span>
                <span>
                  <span className="status-dot" />
                  Open to conversations
                </span>
              </div>
            </div>
            <div className="hero-art">
              <div className="orbital-ring ring-one" />
              <div className="orbital-ring ring-two" />
              <div className="orbital-ring ring-three" />
              <div className="hero-grid" />
              <div className="portrait-frame">
                <img src={portrait} alt="Alam Md Tasin wearing a dark jacket" />
                <div className="portrait-caption">
                  <span>THE PERSON BEHIND THE SYSTEMS</span>
                  <strong>Engineer. Researcher. Builder.</strong>
                </div>
              </div>
              <button
                className="orbit-card orbit-cloud"
                onClick={() => navigate("systems")}
              >
                <FiCloud />
                <span>
                  CLOUD INFRASTRUCTURE<small>AWS · Linux · Delivery</small>
                </span>
                <FiArrowUpRight />
              </button>
              <button
                className="orbit-card orbit-ai"
                onClick={() => navigate("research")}
              >
                <FiCpu />
                <span>
                  INTELLIGENT AUTOMATION
                  <small>Local LLMs · Browser agents</small>
                </span>
                <FiArrowUpRight />
              </button>
              <div className="coordinate">
                34.4° N / 132.7° E<span>BANGLADESH → JAPAN</span>
              </div>
            </div>
          </section>
          <div className="shell visitor-route">
            <span className="eyebrow">YOUR ROUTE · {mode.toUpperCase()}</span>
            <div>
              {routes[mode].map(([id, label]) => (
                <button key={label} onClick={() => navigate(id)}>
                  {label}
                  <FiArrowRight />
                </button>
              ))}
            </div>
          </div>
          <div className="shell quick-launch">
            {[
              [
                FiCloud,
                "Production platforms",
                "Six contexts. Real responsibilities.",
                "platforms",
              ],
              [
                FiGitBranch,
                "Delivery pipeline",
                "Run a release. Test a failure.",
                "labs",
              ],
              [
                FiActivity,
                "Observability",
                "Connect metrics with the evidence.",
                "observability",
              ],
              [
                FiCpu,
                "Research studio",
                "Explore navigation and generation.",
                "research",
              ],
            ].map(([Icon, title, desc, id], i) => (
              <button key={title} onClick={() => navigate(id)}>
                <div>
                  <Icon />
                  <span>0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="launch-link">
                  Explore
                  <FiArrowUpRight />
                </span>
              </button>
            ))}
          </div>
          <Section
            id="experience"
            number="01"
            label="PROFESSIONAL SNAPSHOT"
            title={
              <>
                From production infrastructure
                <br />
                to intelligent automation.
              </>
            }
            description="My work connects the systems that ship software, the signals that keep it reliable, and the automation that makes operations repeatable."
          >
            <div className="fact-grid">
              {[
                [
                  "1.5+ years",
                  "Production DevOps experience",
                  "Rez Corporation · Feb 2024–Aug 2025",
                ],
                [
                  "200+ services",
                  "Containerized production estate",
                  "Peak environments exceeded 300 services",
                ],
                [
                  "1M+ users",
                  "Platforms supported",
                  "FinTech, banking, telecom and digital services",
                ],
                [
                  "6–7 platforms",
                  "Production environments supported",
                  "Dev · UAT · Production · DR",
                ],
              ].map(([value, label, detail]) => (
                <article key={label}>
                  <strong>{value}</strong>
                  <h3>{label}</h3>
                  <p>{detail}</p>
                </article>
              ))}
            </div>
            <article className="experience-panel panel">
              <div className="experience-heading">
                <div className="employer-mark">
                  REZ<span>CORPORATION</span>
                </div>
                <div>
                  <span className="eyebrow">FEBRUARY 2024 — AUGUST 2025</span>
                  <h3>DevOps Engineer</h3>
                  <p>
                    Rez Corporation Limited · Production infrastructure &
                    operations
                  </p>
                </div>
                <Tag>1.5+ years</Tag>
              </div>
              <p className="experience-summary">
                Supported 200+ containerized services—exceeding 300 at
                peak—across Dev, UAT, Production and DR environments serving
                more than one million users. I worked across the delivery
                lifecycle as part of the Rez Corporation team: preparing
                releases, operating infrastructure, making failures visible and
                collaborating with developers on stability and performance.
              </p>
              <div className="responsibility-grid">
                {responsibilities.map(([title, text, tools], i) => (
                  <article key={title}>
                    <span className="number">0{i + 1}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <span className="mono">{tools}</span>
                  </article>
                ))}
              </div>
            </article>
          </Section>
          <Section
            id="platforms"
            number="02"
            label="PRODUCTION IMPACT"
            title={
              <>
                Behind the platforms.
                <br />
                Inside the work.
              </>
            }
            description="Selected platforms supported through Rez Corporation. Open a case study to see my responsibilities, tools and operational perspective."
          >
            <div className="platform-grid">
              {platforms.map((p) => (
                <button
                  className="platform-card"
                  key={p.name}
                  onClick={() => openPlatform(p)}
                  style={{ "--brand-accent": p.color }}
                >
                  <div className="platform-card-head">
                    <span className="platform-monogram">{p.mark}</span>
                    <FiArrowUpRight />
                  </div>
                  <span className="eyebrow">{p.domain}</span>
                  <h3>{p.name}</h3>
                  <p>{p.summary}</p>
                  <div className="tags">
                    {p.tools.slice(0, 3).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <span className="launch-link">
                    Read responsibility case study
                    <FiArrowRight />
                  </span>
                </button>
              ))}
            </div>
            <p className="footnote">
              Platform marks are typographic identifiers, not official company
              logos. Official assets and public client-naming approval are still
              needed. No private client diagrams or performance figures are
              reproduced.
            </p>
          </Section>
          <Section
            id="systems"
            number="03"
            label="ARCHITECTURE LAB"
            title={
              <>
                See the connections.
                <br />
                Understand the system.
              </>
            }
            description="A spatial model of delivery and request flow. Select a layer, trace traffic and see why one database bottleneck can affect the whole application."
          >
            <div className="section-tools">
              <button
                className="button"
                aria-pressed={flat}
                onClick={() => setFlat((x) => !x)}
              >
                <FiBox />
                {flat
                  ? "Enable spatial view"
                  : "Use flat / reduced-effects view"}
              </button>
              <span className="muted">
                CSS 3D model · accessible buttons · no client systems
              </span>
            </div>
            <Architecture state={state} flat={flat} />
          </Section>
          <Section
            id="labs"
            number="04"
            label="LIVE ENGINEERING LABS"
            title={
              <>
                Don’t just read the skills.
                <br />
                Operate the system.
              </>
            }
          >
            <Engineering state={state} dispatch={dispatch} />
          </Section>
          <Section
            id="research"
            number="05"
            label="RESEARCH LAB · HIROSHIMA UNIVERSITY"
            title={
              <>
                Teaching agents to navigate.
                <br />
                Exploring how they create.
              </>
            }
            description="Research Student · Informatics and Data Science · Graduate School of Advanced Science and Engineering. Local LLMs, browser automation and the wider question of multimodal webpage understanding and generation."
          >
            <Research />
          </Section>
          <Section
            id="skills"
            number="06"
            label="CAPABILITIES WITH CONTEXT"
            title={
              <>
                Not just a stack.
                <br />A connected skill set.
              </>
            }
            description="Each technology connects to a responsibility or research component. Select one to understand what it does, where I used it and what evidence supports it."
          >
            <div className="skills-controls">
              <input
                aria-label="Search technologies"
                placeholder="Search a technology or platform…"
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
              />
              <div className="filter-tabs">
                {[
                  "All",
                  "Cloud & infrastructure",
                  "Delivery & automation",
                  "Observability",
                  "Data & APIs",
                  "AI & development",
                ].map((c) => (
                  <button
                    aria-pressed={category === c}
                    key={c}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="skills-grid">
              {skills
                .filter(
                  (s) =>
                    (category === "All" || s[2] === category) &&
                    s
                      .join(" ")
                      .toLowerCase()
                      .includes(skillQuery.toLowerCase()),
                )
                .map((s) => (
                  <button
                    className="skill-card"
                    key={s[0]}
                    onClick={() => setSelectedSkill(s)}
                  >
                    <div>
                      <FiCode />
                      <Tag>{s[1]}</Tag>
                    </div>
                    <h3>{s[0]}</h3>
                    <p>{s[3]}</p>
                    <span className="launch-link">
                      {s[4]}
                      <FiArrowUpRight />
                    </span>
                  </button>
                ))}
            </div>
            {!skills.some(
              (s) =>
                (category === "All" || s[2] === category) &&
                s.join(" ").toLowerCase().includes(skillQuery.toLowerCase()),
            ) && (
              <p className="empty-state">
                No matching technology. Try another category or search.
              </p>
            )}
          </Section>
          <Section
            id="certifications"
            number="07"
            label="PROFESSIONAL CREDENTIALS"
            title={
              <>
                Credentials that back the skills.
                <br />
                Learning verified by trusted foundations.
              </>
            }
            description="Linux Foundation and OpenSSF coursework covering secure software development, Kubernetes, DevOps and Site Reliability Engineering. Completion dates and credential IDs are intentionally kept private."
          >
            <div className="skills-grid">
              {certifications.map((certificate) => (
                <article className="skill-card" key={certificate.code}>
                  <div>
                    <FiAward />
                    <Tag>{certificate.code}</Tag>
                  </div>
                  <h3>{certificate.title}</h3>
                  <p>{certificate.focus}</p>
                  <span className="launch-link">{certificate.issuer}</span>
                </article>
              ))}
            </div>
          </Section>
          <Section
            id="journey"
            number="08"
            label="THE JOURNEY"
            title={
              <>
                Built across borders.
                <br />
                Still moving forward.
              </>
            }
            description="From computer-science foundations in Bangladesh to production infrastructure and research in Japan."
          >
            <div className="journey-panel panel">
              <div className="journey-globe" aria-hidden="true">
                <div className="globe-sphere">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <span className="globe-route" />
                <span className="globe-label bangladesh">BANGLADESH</span>
                <span className="globe-label japan">JAPAN</span>
              </div>
              <div className="journey-content">
                <div className="journey-tabs">
                  {journey.map(([date], i) => (
                    <button
                      key={date}
                      aria-pressed={journeyIndex === i}
                      onClick={() => setJourneyIndex(i)}
                    >
                      <span>0{i + 1}</span>
                      {i === 3 ? "Next" : date.split(" — ")[0]}
                    </button>
                  ))}
                </div>
                <span className="eyebrow">
                  {journey[journeyIndex][0]} · {journey[journeyIndex][1]}
                </span>
                <h3>{journey[journeyIndex][2]}</h3>
                <p>{journey[journeyIndex][3]}</p>
                <button
                  className="text-button"
                  onClick={() =>
                    setJourneyIndex((i) => (i + 1) % journey.length)
                  }
                >
                  Next chapter
                  <FiArrowRight />
                </button>
              </div>
            </div>
          </Section>
          <Section
            id="resume-center"
            number="09"
            label="RECRUITER CENTER"
            title={
              <>
                The essentials.
                <br />
                Ready for your next conversation.
              </>
            }
            description="A concise overview, the source résumé and straightforward ways to connect."
          >
            <div className="recruiter-panel panel">
              <div>
                <h3>Alam Md Tasin</h3>
                <p>
                  DevOps engineer with production experience in AWS, delivery
                  automation, observability, databases and middleware. Research
                  Student at Hiroshima University developing LLM-driven browser
                  automation.
                </p>
                <div className="recruiter-details">
                  <span>
                    <strong>Experience</strong>Rez Corporation · Feb 2024–Aug
                    2025
                  </span>
                  <span>
                    <strong>English</strong>TOEIC L&R · 795/990
                  </span>
                  <span>
                    <strong>Japanese</strong>Beginner · studying toward JLPT N4
                  </span>
                  <span>
                    <strong>Education</strong>B.Sc. CSE · Daffodil International
                    University · 2024
                  </span>
                  <span>
                    <strong>Credentials</strong>Linux Foundation / OpenSSF · 3
                    completed courses
                  </span>
                </div>
                <div className="button-row">
                  <details className="document-menu">
                    <summary className="button primary">
                      <FiDownload />
                      Open documents
                      <FiChevronDown className="document-menu-chevron" />
                    </summary>
                    <div className="document-menu-popover">
                      <a
                        href="/Alam_Md_Tasin_Resume.pdf"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FiFileText />
                        <span>
                          <strong>Résumé</strong>
                          <small>Concise English profile</small>
                        </span>
                      </a>
                      <a
                        href="/Alam_Md_Tasin_DevOps_Engineer_CV.pdf"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FiFileText />
                        <span>
                          <strong>Detailed CV</strong>
                          <small>Extended English experience</small>
                        </span>
                      </a>
                      <a
                        href="/Alam_Md_Tasin_Rirekisho.pdf"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FiFileText />
                        <span>
                          <strong>履歴書 · Rirekisho</strong>
                          <small>Japanese application résumé</small>
                        </span>
                      </a>
                      <a
                        href="/Alam_Md_Tasin_Shokumu_Keirekisho.pdf"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FiFileText />
                        <span>
                          <strong>職務経歴書 · Shokumu Keirekisho</strong>
                          <small>Japanese professional history</small>
                        </span>
                      </a>
                    </div>
                  </details>
                  <button className="button" onClick={downloadContact}>
                    Contact card
                  </button>
                  <button className="button" onClick={() => window.print()}>
                    Print profile
                  </button>
                  <a
                    className="button"
                    href="/api/profile.json"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Profile JSON
                  </a>
                </div>
                <p className="footnote">
                  Choose the document that best matches your hiring process.
                  Each PDF opens in a new tab.
                </p>
              </div>
              <a
                className="document-scene"
                href="/Alam_Md_Tasin_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Tasin résumé PDF"
              >
                <div className="document-shadow" />
                <div className="document-sheet">
                  <img src="/tasin-icon.svg" alt="" />
                  <span>ALAM MD TASIN</span>
                  <strong>
                    DEVOPS
                    <br />
                    ENGINEER
                  </strong>
                  <i />
                  <p>
                    Cloud infrastructure
                    <br />
                    Delivery automation
                    <br />
                    Observability
                    <br />
                    AI research
                  </p>
                  <small>OPEN SOURCE RÉSUMÉ ↗</small>
                </div>
              </a>
            </div>
          </Section>
          <section className="contact-section shell" id="contact">
            <div className="contact-orbit">
              <img src="/tasin-icon.svg" alt="" />
            </div>
            <span className="eyebrow">NEXT CHAPTER · LET’S CONNECT</span>
            <h2>
              Reliable systems start
              <br />
              with a conversation.
            </h2>
            <p>
              I’m interested in DevOps, cloud infrastructure, platform
              engineering and research-driven opportunities in Japan and
              internationally. Tell me about the team, the problem and what
              you’re building.
            </p>
            <div className="button-row">
              <a className="button primary" href={"mailto:" + profile.email}>
                <FiMail />
                Email Tasin
                <FiArrowUpRight />
              </a>
              <button className="button" onClick={copyEmail}>
                {copied ? <FiCheck /> : <FiCopy />}
                {copied ? "Email copied" : "Copy email"}
              </button>
              <a
                className="button"
                href="https://www.linkedin.com/in/mdtasinalam/"
                target="_blank"
                rel="noreferrer"
              >
                <FiLinkedin />
                LinkedIn
              </a>
              <a
                className="button"
                href="https://github.com/Tasin007"
                target="_blank"
                rel="noreferrer"
              >
                <FiGithub />
                GitHub
              </a>
            </div>
            <details className="contact-compose">
              <summary>Compose an introduction</summary>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const d = new FormData(e.currentTarget);
                  location.href =
                    "mailto:" +
                    profile.email +
                    "?subject=" +
                    encodeURIComponent(
                      "Portfolio enquiry from " + d.get("name"),
                    ) +
                    "&body=" +
                    encodeURIComponent(
                      d.get("message") + "\n\nReply to: " + d.get("email"),
                    );
                  setContactState(
                    "Your email application was requested. Review and send the draft there; this website has not sent a message.",
                  );
                }}
              >
                <label className="field">
                  Name
                  <input name="name" required maxLength={100} />
                </label>
                <label className="field">
                  Email
                  <input name="email" type="email" required maxLength={200} />
                </label>
                <label className="field">
                  Your message
                  <textarea name="message" required maxLength={3000} />
                </label>
                <button className="button primary">
                  Open email draft
                  <FiArrowRight />
                </button>
                <p className="footnote">
                  Opens your email application. No message is sent or stored by
                  this website.
                </p>
              </form>
            </details>
            <p role="status">{contactState}</p>
          </section>
        </main>
        <footer className="site-footer shell">
          <a href="#overview" className="brand">
            <img src="/tasin-icon.svg" alt="" />
            Tasin<span className="brand-dot">.</span>
          </a>
          <span>© {new Date().getFullYear()} Alam Md Tasin</span>
          <button className="text-button" onClick={() => setFlat((x) => !x)}>
            {flat ? "Spatial effects off" : "Spatial effects on"}
          </button>
          <a href="#overview">Back to top ↑</a>
        </footer>
        <Companion
          navigate={navigate}
          onPlatform={openPlatform}
          onTheme={toggleTheme}
          onMode={setMode}
          onLanguage={openLanguages}
          dispatch={dispatch}
          capabilities={capabilities}
        />
        {selectedPlatform && (
          <Modal
            title="Production responsibility case study"
            onClose={() => {
              setSelectedPlatform(null);
              history.replaceState(null, "", "#platforms");
            }}
          >
            <div className="case-study">
              <div className="case-title">
                <span
                  className="platform-monogram"
                  style={{ "--brand-accent": selectedPlatform.color }}
                >
                  {selectedPlatform.mark}
                </span>
                <div>
                  <span className="eyebrow">{selectedPlatform.domain}</span>
                  <h2>{selectedPlatform.name}</h2>
                </div>
              </div>
              <p className="lead">{selectedPlatform.summary}</p>
              <h3>Context & role</h3>
              <p>{selectedPlatform.scope}</p>
              <h3>My responsibilities</h3>
              <ul>
                {selectedPlatform.work.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <h3>Tools in context</h3>
              <div className="tags">
                {selectedPlatform.tools.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <h3>Operational perspective</h3>
              <p>{selectedPlatform.lesson}</p>
              <div className="callout">
                The perspective above explains the work; it is not a fabricated
                incident report or measured business outcome. Source: supplied
                professional résumé. Private architectures and client data are
                excluded.
              </div>
              <div className="button-row">
                <button
                  className="button primary"
                  onClick={() => {
                    setSelectedPlatform(null);
                    navigate("labs");
                  }}
                >
                  Explore a representative lab
                  <FiArrowRight />
                </button>
                <button
                  className="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(location.href);
                    } catch {}
                  }}
                >
                  Copy case-study link
                </button>
              </div>
            </div>
          </Modal>
        )}
        {selectedSkill && (
          <Modal
            title="Technology evidence"
            onClose={() => setSelectedSkill(null)}
          >
            <div className="case-study">
              <Tag>{selectedSkill[1]}</Tag>
              <h2>{selectedSkill[0]}</h2>
              <p className="lead">{selectedSkill[3]}</p>
              <h3>Where it connects</h3>
              <p>{selectedSkill[4]}</p>
              <p>
                Evidence category: {selectedSkill[1]}. No proficiency percentage
                or unverified certification is implied.
              </p>
              <button
                className="button primary"
                onClick={() => {
                  navigate(selectedSkill[5]);
                  setSelectedSkill(null);
                }}
              >
                Open related evidence
                <FiArrowRight />
              </button>
            </div>
          </Modal>
        )}
        {languageOpen && (
          <Modal
            title="Language preference"
            onClose={() => setLanguageOpen(false)}
          >
            <div className="language-panel">
              <h2>Understand it your way.</h2>
              <p>
                {capabilities.translation
                  ? "English and curated Japanese essentials work offline. Additional translations are generated on demand and cached for this session. Names and code remain authentic; machine output may need review."
                  : "English and curated Japanese recruiter essentials are available offline. Other languages require the optional server-side translation service."}
              </p>
              <input
                aria-label="Search languages"
                placeholder="Search languages…"
                value={languageQuery}
                onChange={(e) => setLanguageQuery(e.target.value)}
              />
              <div className="language-grid">
                {languages
                  .filter((x) =>
                    x
                      .join(" ")
                      .toLowerCase()
                      .includes(languageQuery.toLowerCase()),
                  )
                  .map(([code, name]) => (
                    <button
                      key={code}
                      aria-pressed={language === code}
                      onClick={() => chooseLanguage(code)}
                    >
                      <span>{name}</span>
                      <small>
                        {code === "ja"
                          ? "Curated Japanese"
                          : offlineLanguages.has(code)
                            ? "Available offline"
                            : capabilities.translation
                              ? "Machine translation"
                              : "Needs provider"}
                      </small>
                    </button>
                  ))}
              </div>
              {translationStatus && <p role="status">{translationStatus}</p>}
            </div>
          </Modal>
        )}
        {tour >= 0 && (
          <aside className="tour-panel" aria-label="Guided tour">
            <div>
              <span className="eyebrow">GUIDED TOUR · {tour + 1} / 5</span>
              <button
                className="icon-button"
                aria-label="Close tour"
                onClick={() => setTour(-1)}
              >
                <FiX />
              </button>
            </div>
            <h3>{tourStops[tour][1]}</h3>
            <p>{tourStops[tour][2]}</p>
            <div className="button-row">
              <button
                className="button"
                disabled={tour === 0}
                onClick={() => {
                  setTour((t) => t - 1);
                  navigate(tourStops[tour - 1][0]);
                }}
              >
                Back
              </button>
              <button
                className="button primary"
                onClick={() => {
                  if (tour === 4) setTour(-1);
                  else {
                    setTour((t) => t + 1);
                    navigate(tourStops[tour + 1][0]);
                  }
                }}
              >
                {tour === 4 ? "Finish" : "Continue"}
                <FiArrowRight />
              </button>
            </div>
          </aside>
        )}
      </div>
    </Localization>
  );
}
