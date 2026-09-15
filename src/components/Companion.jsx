/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiCommand,
  FiSearch,
  FiCpu,
  FiArrowRight,
  FiSend,
  FiTrash2,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { Modal } from "../ui";
import { searchEvidence, platforms, skills, profile } from "../content";
export default function Companion({
  navigate,
  onPlatform,
  onTheme,
  onMode,
  onLanguage,
  dispatch,
  capabilities,
}) {
  const [open, setOpen] = useState(null),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState(0),
    [messages, setMessages] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [copied, setCopied] = useState(false),
    [recent, setRecent] = useState([]);
  const messagesEnd = useRef(null),
    controller = useRef(null);
  const commands = useMemo(
    () => [
      ...[
        ["overview", "Overview"],
        ["experience", "Professional experience"],
        ["platforms", "Platform case studies"],
        ["systems", "3D architecture"],
        ["labs", "Engineering labs"],
        ["research", "Research & webpage generation"],
        ["skills", "Technology evidence"],
        ["journey", "Professional journey"],
        ["resume-center", "Résumé & recruiter center"],
        ["contact", "Contact Tasin"],
      ].map(([id, label]) => ({
        id,
        label,
        group: "Navigate",
        hint: id,
        run: () => navigate(id),
      })),
      ...platforms.map((p) => ({
        id: p.name,
        label: "Open " + p.name,
        group: "Platforms",
        hint: p.tools.join(" "),
        run: () => onPlatform(p),
      })),
      ...skills.map((s) => ({
        id: s[0],
        label: "Find " + s[0] + " evidence",
        group: "Skills",
        hint: s[2],
        run: () => navigate("skills"),
      })),
      {
        id: "run",
        label: "Run healthy pipeline",
        group: "Labs",
        hint: "/deploy production",
        run: () => {
          dispatch({ type: "fault", value: "none" });
          dispatch({ type: "start" });
          navigate("labs");
        },
      },
      {
        id: "fault",
        label: "Start database incident",
        group: "Labs",
        hint: "/incident database",
        run: () => {
          dispatch({ type: "fault", value: "database" });
          dispatch({ type: "start" });
          navigate("labs");
        },
      },
      {
        id: "reset",
        label: "Reset engineering labs",
        group: "Labs",
        hint: "clear simulation",
        run: () => dispatch({ type: "reset" }),
      },
      ...["recruiter", "engineer", "researcher"].map((m) => ({
        id: m,
        label: "Use " + m + " view",
        group: "Preferences",
        hint: "/profile " + m,
        run: () => onMode(m),
      })),
      {
        id: "theme",
        label: "Toggle light / dark theme",
        group: "Preferences",
        hint: "/theme",
        run: onTheme,
      },
      {
        id: "language",
        label: "Choose language",
        group: "Preferences",
        hint: "/language ja en bn",
        run: onLanguage,
      },
      {
        id: "resume",
        label: "Open résumé PDF",
        group: "Documents",
        hint: "download resume",
        run: () =>
          window.open(
            "/Alam_Md_Tasin_Resume.pdf",
            "_blank",
            "noopener,noreferrer",
          ),
      },
      {
        id: "email",
        label: "Copy email address",
        group: "Contact",
        hint: profile.email,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
          } catch {
            setError("Copy unavailable. Email: " + profile.email);
          }
        },
      },
    ],
    [navigate, onPlatform, onTheme, onMode, onLanguage, dispatch],
  );
  const terms = query
    .toLowerCase()
    .replace(/^\//, "")
    .split(/\s+/)
    .filter((w) => w && !["show", "go", "to", "please", "me"].includes(w));
  const results = commands
    .filter((c) => {
      const text = (c.label + " " + c.hint + " " + c.group).toLowerCase();
      return terms.every((term) => {
        if (text.includes(term)) return true;
        let pos = 0;
        for (const letter of text) if (letter === term[pos]) pos++;
        return pos === term.length;
      });
    })
    .sort((a, b) => recent.indexOf(b.id) - recent.indexOf(a.id));
  useEffect(() => {
    document
      .querySelector(".command-results .selected")
      ?.scrollIntoView({ block: "nearest" });
  }, [selected, query]);
  useEffect(() => {
    const listener = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((x) => (x === "command" ? null : "command"));
        setQuery("");
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ block: "nearest" });
  }, [messages, busy]);
  useEffect(() => () => controller.current?.abort(), []);
  const execute = (command) => {
    command.run();
    setRecent((r) =>
      [...r.filter((x) => x !== command.id), command.id].slice(-6),
    );
    setOpen(null);
    setQuery("");
  };
  const ask = async (question) => {
    if (!question.trim() || busy) return;
    setQuery("");
    setError("");
    const sources = searchEvidence(question);
    setMessages((m) => [...m, { role: "user", text: question }]);
    if (!capabilities.ai) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: sources.length
            ? "I found these relevant passages in Tasin’s portfolio. This is local evidence search, not generative AI."
            : "I could not find supporting evidence. Try AWS, experience, research, TOEIC, Kafka or contact. I won’t invent an answer.",
          sources,
        },
      ]);
      return;
    }
    setBusy(true);
    controller.current = new AbortController();
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history: messages
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.text })),
        }),
        signal: controller.current.signal,
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Assistant unavailable");
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer, sources: data.sources },
      ]);
    } catch (e) {
      setError(e.name === "AbortError" ? "Request stopped." : e.message);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "The AI service did not complete this request. Local evidence is available below.",
          sources,
        },
      ]);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="floating-tools">
        <button
          className="companion-trigger"
          onClick={() => {
            setOpen("assistant");
            setQuery("");
          }}
        >
          <FiCpu />
          <span>
            <strong>{capabilities.ai ? "Tasin AI" : "Tasin guide"}</strong>
            <small>
              {capabilities.ai
                ? "Grounded portfolio assistant"
                : "Evidence search · local mode"}
            </small>
          </span>
        </button>
        <button
          className="command-button"
          onClick={() => {
            setOpen("command");
            setQuery("");
          }}
        >
          <FiCommand />
          <span>Command</span>
          <kbd>⌘ / Ctrl K</kbd>
        </button>
      </div>
      {open === "command" && (
        <Modal
          title="Command center"
          onClose={() => setOpen(null)}
          className="command-dialog"
        >
          <div className="command-search">
            <FiSearch />
            <input
              autoFocus
              aria-label="Search portfolio commands"
              placeholder="Search work, skills, labs or actions…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelected((s) => Math.min(results.length - 1, s + 1));
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelected((s) => Math.max(0, s - 1));
                }
                if (e.key === "Enter" && results[selected])
                  execute(results[selected]);
              }}
            />
          </div>
          <div className="command-results">
            {results.map((c, i) => (
              <button
                className={selected === i ? "selected" : ""}
                key={c.id}
                onClick={() => execute(c)}
                onMouseEnter={() => setSelected(i)}
              >
                <span>
                  <small>
                    {c.group}
                    {recent.includes(c.id) ? " · Recent" : ""}
                  </small>
                  <strong>{c.label}</strong>
                </span>
                <FiArrowRight />
              </button>
            ))}
            {!results.length && (
              <p className="empty-state">
                No commands found. Try “pipeline”, “AWS” or a platform name.
              </p>
            )}
          </div>
          <footer className="command-footer">
            ↑ ↓ to select · Enter to run · Escape to close
          </footer>
        </Modal>
      )}
      {open === "assistant" && (
        <Modal
          title={
            capabilities.ai
              ? "Tasin AI · portfolio assistant"
              : "Tasin guide · evidence search"
          }
          onClose={() => setOpen(null)}
          className="assistant-dialog"
        >
          <div className="assistant-intro">
            <FiCpu />
            <h2>
              Ask about the work.
              <br />
              <span>Explore the evidence.</span>
            </h2>
            <p>
              {capabilities.ai
                ? "Answers are generated from the approved public portfolio. Follow the sources and verify important details. Questions are sent to the configured AI provider."
                : "No AI provider is configured. Search the portfolio locally and open the evidence, or use Command to operate the site. Nothing is sent to an AI service."}
            </p>
          </div>
          <div className="suggestions">
            {[
              "AWS experience",
              "Current research",
              "TOEIC and education",
              "Kafka and MinIO",
            ].map((q) => (
              <button key={q} disabled={busy} onClick={() => ask(q)}>
                {q}
                <FiArrowRight />
              </button>
            ))}
          </div>
          <div className="chat-messages" aria-live="polite">
            {messages.map((m, i) => (
              <article key={i} className={m.role}>
                <small>
                  {m.role === "user"
                    ? "You"
                    : capabilities.ai
                      ? "Tasin AI"
                      : "Evidence guide"}
                </small>
                <p>{m.text}</p>
                {m.sources?.map((s, j) => (
                  <button
                    className="source-card"
                    key={j}
                    onClick={() => {
                      if (s.platform)
                        onPlatform(
                          platforms.find((p) => p.name === s.platform),
                        );
                      else navigate(s.id);
                      setOpen(null);
                    }}
                  >
                    <strong>
                      {s.title}
                      <FiArrowRight />
                    </strong>
                    {!capabilities.ai && <span>{s.text}</span>}
                  </button>
                ))}
              </article>
            ))}
            {busy && (
              <p className="thinking">
                Finding a grounded answer…{" "}
                <button
                  className="text-button"
                  onClick={() => controller.current?.abort()}
                >
                  Stop
                </button>
              </p>
            )}
            <div ref={messagesEnd} />
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              ask(query);
            }}
          >
            <input
              autoFocus
              aria-label="Ask about Tasin"
              maxLength={1200}
              placeholder="Ask about Tasin’s work…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="icon-button primary"
              aria-label="Send question"
              disabled={busy || !query.trim()}
            >
              <FiSend />
            </button>
          </form>
          <div className="chat-footer">
            <span>Session-only history · No application chat storage</span>
            <button
              className="icon-button"
              aria-label="Copy conversation"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    messages.map((m) => m.role + ": " + m.text).join("\n\n"),
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {
                  setError(
                    "Clipboard unavailable. Select and copy the text manually.",
                  );
                }
              }}
            >
              {copied ? <FiCheck /> : <FiCopy />}
            </button>
            <button
              className="icon-button"
              aria-label="Clear conversation"
              disabled={busy}
              onClick={() => {
                setMessages([]);
                setError("");
              }}
            >
              <FiTrash2 />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
