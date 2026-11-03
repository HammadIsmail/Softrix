"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeTokens {
  mark: string;
  word: string;
  lock: string;
  bg: string;
  band: string;
  card: string;
  tile: string;
  mock: string;
  bar: string;
  line: string;
  bd: string;
  bd2: string;
  tx: string;
  tx2: string;
  mu: string;
  fa: string;
  ac: string;
  on: string;
  sh: string;
  ov: string;
  nav: string;
}

const lightTheme: ThemeTokens = {
  mark: "/assets/80aeff5d16653dc1a764169b7e3492b8.png",
  word: "/assets/f04a941bc30e8b5d44a18e45d7855b4d.png",
  lock: "/assets/77eb4ab4cd9a94139b21390987a4e0e1.png",
  bg: "#FFFFFF",
  band: "#F5F7FA",
  card: "#FFFFFF",
  tile: "#E8F0FE",
  mock: "#F1F5F9",
  bar: "#DCE3EC",
  line: "#C8D1DD",
  bd: "#E2E8F0",
  bd2: "#CBD5E1",
  tx: "#0F172A",
  tx2: "#334155",
  mu: "#475569",
  fa: "#5B6778",
  ac: "#2563EB",
  on: "#FFFFFF",
  sh: "0 1px 2px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.06)",
  ov: "rgba(15,23,42,0.55)",
  nav: "rgba(255,255,255,0.92)",
};

const darkTheme: ThemeTokens = {
  mark: "/assets/aa3cf1251ad7d8296cbf47c24f0e8e75.png",
  word: "/assets/3f6c5f789fd3384edc8d4d27655abe2c.png",
  lock: "/assets/cfe6747035d2e980a1a60f4471cebf7a.png",
  bg: "#0B0D12",
  band: "#0E1117",
  card: "#12151C",
  tile: "#14213A",
  mock: "#171B26",
  bar: "#222838",
  line: "#2A3042",
  bd: "#232836",
  bd2: "#2A3042",
  tx: "#E8EAF0",
  tx2: "#C9CFDB",
  mu: "#A0A8B8",
  fa: "#8891A4",
  ac: "#38A9FF",
  on: "#0B0D12",
  sh: "none",
  ov: "rgba(5,7,10,0.8)",
  nav: "rgba(11,13,18,0.92)",
};

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal form states
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalType, setModalType] = useState("Mobile app");
  const [modalBudget, setModalBudget] = useState("Not sure yet");
  const [modalDetails, setModalDetails] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSent, setModalSent] = useState(false);
  const [modalError, setModalError] = useState("");

  // Contact section form states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactType, setContactType] = useState("Mobile app");
  const [contactDetails, setContactDetails] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState("");

  const t = theme === "dark" ? darkTheme : lightTheme;

  // Close mobile menu on hash change
  useEffect(() => {
    const handleHashChange = () => setMobileMenuOpen(false);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const openForm = () => {
    setShowModal(true);
    setModalSent(false);
    setModalError("");
    setMobileMenuOpen(false);
  };

  const closeForm = () => {
    setShowModal(false);
  };

  // Submit Book A Call Modal Form
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!modalName.trim() || !modalEmail.trim() || !modalDetails.trim()) {
      setModalError("Please complete all required fields.");
      return;
    }

    setModalLoading(true);

    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: modalName,
          email: modalEmail,
          projectType: modalType,
          budget: modalBudget,
          details: modalDetails,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to book call.");
      }

      setModalSent(true);
      setModalName("");
      setModalEmail("");
      setModalDetails("");
    } catch (err: unknown) {
      setModalError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Submit Contact Section Form
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");

    if (!contactName.trim() || !contactEmail.trim() || !contactDetails.trim()) {
      setContactError(
        "Please fill in your name, work email, and project details.",
      );
      return;
    }

    setContactLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          projectType: contactType,
          details: contactDetails,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setContactSent(true);
      setContactName("");
      setContactEmail("");
      setContactDetails("");
    } catch (err: unknown) {
      setContactError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div
      id="top"
      style={{
        position: "relative",
        background: t.bg,
        color: t.tx,
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        width: "100%",
        minHeight: "100vh",
        lineHeight: 1.55,
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* NAVBAR */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: t.nav,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${t.bd}`,
        }}
      >
        <div className="nav-container">
          {/* Logo */}
          <a
            href="#top"
            aria-label="Softrix home"
            className="logo-link"
            style={{ color: t.tx }}
          >
            <Image
              src={t.mark}
              alt="Softrix Logo"
              width={272}
              height={214}
              className="logo-mark"
              priority
            />
            <Image
              src={t.word}
              alt="Softrix"
              width={453}
              height={52}
              className="logo-word"
              priority
            />
          </a>

          {/* Desktop Nav Links */}
          <nav
            className="navlinks"
            aria-label="Primary"
            style={{
              fontSize: "15px",
              fontWeight: 500,
              gap: "28px",
              alignItems: "center",
            }}
          >
            <a
              href="#services"
              style={{ color: t.mu, transition: "color 0.15s" }}
            >
              Services
            </a>
            <a href="#work" style={{ color: t.mu, transition: "color 0.15s" }}>
              Work
            </a>
            <a
              href="#process"
              style={{ color: t.mu, transition: "color 0.15s" }}
            >
              Process
            </a>
            <a
              href="#engage"
              style={{ color: t.mu, transition: "color 0.15s" }}
            >
              Engagement
            </a>
            <a href="#faq" style={{ color: t.mu, transition: "color 0.15s" }}>
              FAQ
            </a>
            <a
              href="#contact"
              style={{ color: t.mu, transition: "color 0.15s" }}
            >
              Contact
            </a>
          </nav>

          {/* Actions: Theme Toggle + Book A Call + Mobile Menu Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="desktop-theme-toggle"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                border: `1px solid ${t.bd2}`,
                background: "transparent",
                color: t.tx,
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.15s",
              }}
            >
              {theme === "dark" ? (
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={openForm}
              className="book-btn"
              style={{
                background: t.ac,
                color: t.on,
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                transition: "opacity 0.15s, transform 0.1s",
              }}
            >
              <svg
                aria-hidden="true"
                className="book-btn-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Book a call
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="mobile-menu-btn"
              style={{
                width: "40px",
                height: "40px",
                border: `1px solid ${t.bd2}`,
                background: t.card,
                borderRadius: "10px",
                alignItems: "center",
                justifyContent: "center",
                color: t.tx,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {mobileMenuOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu-drawer"
            style={{
              background: t.card,
              borderBottom: `1px solid ${t.bd}`,
              padding: "16px 20px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <a
              href="#services"
              style={{ color: t.tx, fontSize: "16px", fontWeight: 500 }}
            >
              Services
            </a>
            <a
              href="#work"
              style={{ color: t.tx, fontSize: "16px", fontWeight: 500 }}
            >
              Work
            </a>
            <a
              href="#process"
              style={{ color: t.tx, fontSize: "16px", fontWeight: 500 }}
            >
              Process
            </a>
            <a
              href="#engage"
              style={{ color: t.tx, fontSize: "16px", fontWeight: 500 }}
            >
              Engagement
            </a>
            <a
              href="#faq"
              style={{ color: t.tx, fontSize: "16px", fontWeight: 500 }}
            >
              FAQ
            </a>
            <a
              href="#contact"
              style={{ color: t.tx, fontSize: "16px", fontWeight: 500 }}
            >
              Contact
            </a>

            <div
              style={{
                marginTop: "6px",
                paddingTop: "14px",
                borderTop: `1px solid ${t.bd}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "14px", color: t.mu, fontWeight: 500 }}>
                Theme
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "36px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  border: `1px solid ${t.bd2}`,
                  background: "transparent",
                  color: t.tx,
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {theme === "dark" ? (
                  <>
                    <svg
                      aria-hidden="true"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                    </svg>
                    Light mode
                  </>
                ) : (
                  <>
                    <svg
                      aria-hidden="true"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    Dark mode
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="main">
        {/* HERO SECTION */}
        <section
          className="col-responsive"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "88px 24px 72px",
            boxSizing: "border-box",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "56px",
          }}
        >
          {/* Left Column */}
          <div style={{ flex: "1 1 520px", minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(38px, 5.6vw, 68px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: 0,
                color: t.tx,
              }}
            >
              We build AI-powered software that actually ships.
            </h1>
            <p
              style={{
                fontSize: "clamp(17px, 2vw, 20px)",
                color: t.mu,
                maxWidth: "620px",
                margin: "24px 0 0",
              }}
            >
              Mobile apps, web platforms, AI automation, agentic systems and RAG
              assistants, designed, built and deployed end to end for startups
              and growing businesses.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginTop: "36px",
              }}
            >
              <button
                type="button"
                onClick={openForm}
                style={{
                  background: t.ac,
                  color: t.on,
                  fontWeight: 600,
                  fontSize: "16px",
                  padding: "0 28px",
                  height: "54px",
                  border: 0,
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                Book a call
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>

              <a
                href="#work"
                style={{
                  border: `1px solid ${t.bd2}`,
                  color: t.tx,
                  fontWeight: 600,
                  fontSize: "16px",
                  padding: "0 28px",
                  height: "54px",
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                See our work
              </a>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px 28px",
                marginTop: "36px",
                fontSize: "15px",
                color: t.mu,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ color: t.ac, display: "flex" }}>
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </span>
                Reply within one working day
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ color: t.ac, display: "flex" }}>
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                NDA on request
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ color: t.ac, display: "flex" }}>
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
                  </svg>
                </span>
                Regular progress demos
              </div>
            </div>
          </div>

          {/* Right Column: Support Agent Interactive Preview */}
          <div style={{ flex: "1 1 380px", minWidth: 0, maxWidth: "520px" }}>
            <div
              style={{
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 18px",
                  borderBottom: `1px solid ${t.bd}`,
                  background: t.band,
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: t.bar,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: t.bar,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: t.bar,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{ marginLeft: "8px", fontSize: "13px", color: t.fa }}
                >
                  Support agent run
                </span>
              </div>

              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px",
                    border: `1px solid ${t.bd}`,
                    borderRadius: "12px",
                  }}
                >
                  <span style={{ color: t.ac, display: "flex" }}>
                    <svg
                      aria-hidden="true"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <span style={{ flex: 1, fontSize: "15px", color: t.tx }}>
                    Retrieve relevant documents
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      background: t.tile,
                      color: t.tx2,
                      fontWeight: 500,
                    }}
                  >
                    Done
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px",
                    border: `1px solid ${t.bd}`,
                    borderRadius: "12px",
                  }}
                >
                  <span style={{ color: t.ac, display: "flex" }}>
                    <svg
                      aria-hidden="true"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <span style={{ flex: 1, fontSize: "15px", color: t.tx }}>
                    Draft answer with citations
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      background: t.tile,
                      color: t.tx2,
                      fontWeight: 500,
                    }}
                  >
                    Done
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px",
                    border: `1px solid ${t.ac}`,
                    borderRadius: "12px",
                  }}
                >
                  <span style={{ color: t.ac, display: "flex" }}>
                    <svg
                      aria-hidden="true"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                    </svg>
                  </span>
                  <span style={{ flex: 1, fontSize: "15px", color: t.tx }}>
                    Human review before sending
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      background: t.ac,
                      color: t.on,
                      fontWeight: 600,
                    }}
                  >
                    Pending
                  </span>
                </div>

                <div
                  style={{
                    height: "8px",
                    borderRadius: "4px",
                    background: t.bar,
                    width: "80%",
                    marginTop: "6px",
                  }}
                />
                <div
                  style={{
                    height: "8px",
                    borderRadius: "4px",
                    background: t.bar,
                    width: "55%",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* STACK STRIP */}
        <div
          style={{
            borderTop: `1px solid ${t.bd}`,
            borderBottom: `1px solid ${t.bd}`,
            background: t.band,
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "28px 24px",
              boxSizing: "border-box",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px 32px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: t.fa,
                fontWeight: 600,
              }}
            >
              Built with
            </span>
            <span style={{ fontSize: "16px", color: t.tx2, fontWeight: 500 }}>
              Flutter
            </span>
            <span style={{ fontSize: "16px", color: t.tx2, fontWeight: 500 }}>
              React Native
            </span>
            <span style={{ fontSize: "16px", color: t.tx2, fontWeight: 500 }}>
              Next.js
            </span>
            <span style={{ fontSize: "16px", color: t.tx2, fontWeight: 500 }}>
              Node.js
            </span>
            <span style={{ fontSize: "16px", color: t.tx2, fontWeight: 500 }}>
              Python
            </span>
            <span style={{ fontSize: "16px", color: t.tx2, fontWeight: 500 }}>
              LangGraph
            </span>
            <span style={{ fontSize: "16px", color: t.tx2, fontWeight: 500 }}>
              PostgreSQL
            </span>
            <span style={{ fontSize: "16px", color: t.tx2, fontWeight: 500 }}>
              Vector databases
            </span>
          </div>
        </div>

        {/* SERVICES SECTION */}
        <section
          id="services"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "96px 24px 40px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: t.ac,
              fontWeight: 600,
            }}
          >
            What we do
          </div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.2vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              margin: "14px 0 0",
              maxWidth: "760px",
            }}
          >
            One team for product, engineering and AI.
          </h2>

          <div
            className="col-responsive"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "48px",
            }}
          >
            {/* Service 1 */}
            <div
              style={{
                flex: "1 1 340px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "18px",
                padding: "28px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: t.tile,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.ac,
                }}
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: "20px 0 8px",
                }}
              >
                Mobile App Development
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                iOS and Android apps in Flutter or React Native, from MVP to
                store release and beyond.
              </p>
            </div>

            {/* Service 2 */}
            <div
              style={{
                flex: "1 1 340px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "18px",
                padding: "28px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: t.tile,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.ac,
                }}
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: "20px 0 8px",
                }}
              >
                Web &amp; SaaS Development
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                Full-stack web apps, dashboards and APIs built to handle real
                traffic and real growth.
              </p>
            </div>

            {/* Service 3 */}
            <div
              style={{
                flex: "1 1 340px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "18px",
                padding: "28px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: t.tile,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.ac,
                }}
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="8" height="8" rx="2" />
                  <path d="M7 11v4a2 2 0 0 0 2 2h4" />
                  <rect x="13" y="13" width="8" height="8" rx="2" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: "20px 0 8px",
                }}
              >
                AI Automation
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                Replace repetitive manual work with automations across your CRM,
                inbox, sheets and internal tools.
              </p>
            </div>

            {/* Service 4 */}
            <div
              style={{
                flex: "1 1 340px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "18px",
                padding: "28px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: t.tile,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.ac,
                }}
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8V4H8" />
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: "20px 0 8px",
                }}
              >
                Agentic AI Systems
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                Multi-step agents that plan, use tools and finish tasks, with
                human-in-the-loop controls and audit trails.
              </p>
            </div>

            {/* Service 5 */}
            <div
              style={{
                flex: "1 1 340px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "18px",
                padding: "28px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: t.tile,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.ac,
                }}
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v14a9 3 0 0 0 18 0V5" />
                  <path d="M3 12a9 3 0 0 0 18 0" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: "20px 0 8px",
                }}
              >
                RAG Agents &amp; Chatbots
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                Assistants grounded in your documents and data, with source
                citations and role-based access.
              </p>
            </div>

            {/* Service 6 */}
            <div
              style={{
                flex: "1 1 340px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "18px",
                padding: "28px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: t.tile,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.ac,
                }}
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="7" rx="1" />
                  <rect x="3" y="14" width="9" height="7" rx="1" />
                  <rect x="16" y="14" width="5" height="7" rx="1" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: "20px 0 8px",
                }}
              >
                UI/UX Design
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                Research-led interfaces and design systems, prototyped and
                tested before engineering starts.
              </p>
            </div>
          </div>
        </section>

        {/* SELECTED WORK */}
        <section
          id="work"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "96px 24px 40px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: t.ac,
              fontWeight: 600,
            }}
          >
            Selected work
          </div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.2vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              margin: "14px 0 0",
              maxWidth: "760px",
            }}
          >
            Products we have designed, built and shipped.
          </h2>

          <div
            className="col-responsive"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              marginTop: "48px",
            }}
          >
            {/* Work 1 */}
            <a
              href="#contact"
              aria-label="Agricultural Market Intelligence Platform case study"
              style={{
                flex: "1 1 480px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "20px",
                overflow: "hidden",
                display: "block",
                color: t.tx,
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
            >
              <div
                style={{
                  height: "240px",
                  background: t.mock,
                  padding: "28px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    height: "14px",
                    width: "40%",
                    borderRadius: "7px",
                    background: t.line,
                  }}
                />
                <div style={{ display: "flex", gap: "12px" }}>
                  <div
                    style={{
                      flex: 1,
                      height: "84px",
                      borderRadius: "12px",
                      background: t.bar,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: "84px",
                      borderRadius: "12px",
                      background: t.bar,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: "84px",
                      borderRadius: "12px",
                      background: t.ac,
                      opacity: 0.85,
                    }}
                  />
                </div>
                <div
                  style={{
                    height: "10px",
                    width: "75%",
                    borderRadius: "5px",
                    background: t.line,
                  }}
                />
                <div
                  style={{
                    height: "10px",
                    width: "55%",
                    borderRadius: "5px",
                    background: t.line,
                  }}
                />
              </div>
              <div style={{ padding: "28px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      border: `1px solid ${t.bd2}`,
                      color: t.tx2,
                    }}
                  >
                    Agentic AI
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      border: `1px solid ${t.bd2}`,
                      color: t.tx2,
                    }}
                  >
                    Web platform
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "24px",
                    margin: "16px 0 8px",
                  }}
                >
                  Agricultural Market Intelligence Platform
                </h3>
                <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                  <strong style={{ color: t.tx, fontWeight: 600 }}>
                    Challenge:
                  </strong>{" "}
                  farmers lacked timely price information.{" "}
                  <strong style={{ color: t.tx, fontWeight: 600 }}>
                    Solution:
                  </strong>{" "}
                  agents that track crop prices and turn market signals into
                  clear advice.
                </p>
                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: `1px solid ${t.bd}`,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "8px",
                    fontSize: "14px",
                    color: t.mu,
                  }}
                >
                  <span>
                    Client: AgriTech Co. &bull; Result: 3.4x Faster Decisions
                  </span>
                  <span
                    style={{
                      color: t.ac,
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Discuss similar project
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Work 2 */}
            <a
              href="#contact"
              aria-label="Farm Machinery Hire App case study"
              style={{
                flex: "1 1 480px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "20px",
                overflow: "hidden",
                display: "block",
                color: t.tx,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: "240px",
                  background: t.mock,
                  padding: "28px",
                  boxSizing: "border-box",
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "196px",
                    borderRadius: "20px",
                    border: `2px solid ${t.line}`,
                    background: t.card,
                    padding: "14px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      height: "60px",
                      borderRadius: "10px",
                      background: t.ac,
                      opacity: 0.85,
                    }}
                  />
                  <div
                    style={{
                      height: "8px",
                      borderRadius: "4px",
                      background: t.line,
                    }}
                  />
                  <div
                    style={{
                      height: "8px",
                      width: "70%",
                      borderRadius: "4px",
                      background: t.line,
                    }}
                  />
                  <div
                    style={{
                      height: "28px",
                      borderRadius: "8px",
                      background: t.bar,
                      marginTop: "auto",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "120px",
                    height: "196px",
                    borderRadius: "20px",
                    border: `2px solid ${t.line}`,
                    background: t.card,
                    padding: "14px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      height: "8px",
                      width: "60%",
                      borderRadius: "4px",
                      background: t.line,
                    }}
                  />
                  <div
                    style={{
                      height: "44px",
                      borderRadius: "10px",
                      background: t.bar,
                    }}
                  />
                  <div
                    style={{
                      height: "44px",
                      borderRadius: "10px",
                      background: t.bar,
                    }}
                  />
                  <div
                    style={{
                      height: "28px",
                      borderRadius: "8px",
                      background: t.ac,
                      opacity: 0.85,
                      marginTop: "auto",
                    }}
                  />
                </div>
              </div>
              <div style={{ padding: "28px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      border: `1px solid ${t.bd2}`,
                      color: t.tx2,
                    }}
                  >
                    Mobile app
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      border: `1px solid ${t.bd2}`,
                      color: t.tx2,
                    }}
                  >
                    Marketplace
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "24px",
                    margin: "16px 0 8px",
                  }}
                >
                  Farm Machinery Hire App
                </h3>
                <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                  <strong style={{ color: t.tx, fontWeight: 600 }}>
                    Challenge:
                  </strong>{" "}
                  hiring machinery meant phone calls and guesswork.{" "}
                  <strong style={{ color: t.tx, fontWeight: 600 }}>
                    Solution:
                  </strong>{" "}
                  a booking app connecting farmers with nearby owners, with
                  scheduling and payments.
                </p>
                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: `1px solid ${t.bd}`,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "8px",
                    fontSize: "14px",
                    color: t.mu,
                  }}
                >
                  <span>
                    Client: AgHire Marketplace &bull; Result: 10,000+ Bookings
                  </span>
                  <span
                    style={{
                      color: t.ac,
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Discuss similar project
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Work 3 */}
            <a
              href="#contact"
              aria-label="AI Developer Hiring Platform case study"
              style={{
                flex: "1 1 480px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "20px",
                overflow: "hidden",
                display: "block",
                color: t.tx,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: "240px",
                  background: t.mock,
                  padding: "28px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-end",
                    height: "110px",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "50%",
                      borderRadius: "8px",
                      background: t.bar,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: "80%",
                      borderRadius: "8px",
                      background: t.bar,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: "100%",
                      borderRadius: "8px",
                      background: t.ac,
                      opacity: 0.85,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: "65%",
                      borderRadius: "8px",
                      background: t.bar,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: "40%",
                      borderRadius: "8px",
                      background: t.bar,
                    }}
                  />
                </div>
                <div
                  style={{
                    height: "10px",
                    width: "65%",
                    borderRadius: "5px",
                    background: t.line,
                  }}
                />
                <div
                  style={{
                    height: "10px",
                    width: "45%",
                    borderRadius: "5px",
                    background: t.line,
                  }}
                />
              </div>
              <div style={{ padding: "28px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      border: `1px solid ${t.bd2}`,
                      color: t.tx2,
                    }}
                  >
                    AI
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      border: `1px solid ${t.bd2}`,
                      color: t.tx2,
                    }}
                  >
                    SaaS
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "24px",
                    margin: "16px 0 8px",
                  }}
                >
                  AI Developer Hiring Platform
                </h3>
                <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                  <strong style={{ color: t.tx, fontWeight: 600 }}>
                    Challenge:
                  </strong>{" "}
                  slow, inconsistent technical interviews.{" "}
                  <strong style={{ color: t.tx, fontWeight: 600 }}>
                    Solution:
                  </strong>{" "}
                  automated scoring and integrity checks so teams hire faster
                  with less guesswork.
                </p>
                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: `1px solid ${t.bd}`,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "8px",
                    fontSize: "14px",
                    color: t.mu,
                  }}
                >
                  <span>
                    Client: DevHire Global &bull; Result: 68% Hiring Time Cut
                  </span>
                  <span
                    style={{
                      color: t.ac,
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Discuss similar project
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>

            {/* Work 4 */}
            <a
              href="#contact"
              aria-label="Document-Grounded Support Assistant case study"
              style={{
                flex: "1 1 480px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "20px",
                overflow: "hidden",
                display: "block",
                color: t.tx,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: "240px",
                  background: t.mock,
                  padding: "28px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    alignSelf: "flex-start",
                    maxWidth: "70%",
                    padding: "12px 16px",
                    borderRadius: "14px 14px 14px 4px",
                    background: t.bar,
                  }}
                >
                  <div
                    style={{
                      height: "8px",
                      width: "160px",
                      borderRadius: "4px",
                      background: t.line,
                    }}
                  />
                </div>
                <div
                  style={{
                    alignSelf: "flex-end",
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: "14px 14px 4px 14px",
                    background: t.ac,
                  }}
                >
                  <div
                    style={{
                      height: "8px",
                      width: "200px",
                      borderRadius: "4px",
                      background: t.on,
                      opacity: 0.5,
                    }}
                  />
                  <div
                    style={{
                      height: "8px",
                      width: "120px",
                      borderRadius: "4px",
                      background: t.on,
                      opacity: 0.5,
                      marginTop: "8px",
                    }}
                  />
                </div>
                <div
                  style={{
                    alignSelf: "flex-start",
                    padding: "8px 14px",
                    borderRadius: "999px",
                    border: `1px solid ${t.line}`,
                    fontSize: "12px",
                    color: t.mu,
                  }}
                >
                  Source: Knowledge_Base_v2.pdf [Page 14]
                </div>
              </div>
              <div style={{ padding: "28px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      border: `1px solid ${t.bd2}`,
                      color: t.tx2,
                    }}
                  >
                    RAG
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      border: `1px solid ${t.bd2}`,
                      color: t.tx2,
                    }}
                  >
                    Chatbot
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "24px",
                    margin: "16px 0 8px",
                  }}
                >
                  Document-Grounded Support Assistant
                </h3>
                <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                  <strong style={{ color: t.tx, fontWeight: 600 }}>
                    Challenge:
                  </strong>{" "}
                  support teams answering the same questions repeatedly.{" "}
                  <strong style={{ color: t.tx, fontWeight: 600 }}>
                    Solution:
                  </strong>{" "}
                  a chatbot that answers directly from internal docs with
                  verified source citations.
                </p>
                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: `1px solid ${t.bd}`,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "8px",
                    fontSize: "14px",
                    color: t.mu,
                  }}
                >
                  <span>
                    Client: Enterprise SaaS &bull; Result: 85% Auto-Resolved
                  </span>
                  <span
                    style={{
                      color: t.ac,
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Discuss similar project
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section
          id="process"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "96px 24px 40px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: t.ac,
              fontWeight: 600,
            }}
          >
            How we work
          </div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.2vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              margin: "14px 0 0",
              maxWidth: "760px",
            }}
          >
            A clear process, from first call to launch.
          </h2>

          <div
            className="col-responsive"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "48px",
            }}
          >
            <div
              style={{
                flex: "1 1 240px",
                minWidth: 0,
                borderTop: `3px solid ${t.ac}`,
                paddingTop: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "15px",
                  color: t.ac,
                  fontWeight: 700,
                }}
              >
                01
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: "10px 0 8px",
                }}
              >
                Discover
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                We learn your goals, users and constraints, then agree on scope,
                timeline and cost.
              </p>
            </div>

            <div
              style={{
                flex: "1 1 240px",
                minWidth: 0,
                borderTop: `3px solid ${t.bd2}`,
                paddingTop: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "15px",
                  color: t.ac,
                  fontWeight: 700,
                }}
              >
                02
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: "10px 0 8px",
                }}
              >
                Design
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                Wireframes and clickable prototypes you can react to before any
                code is written.
              </p>
            </div>

            <div
              style={{
                flex: "1 1 240px",
                minWidth: 0,
                borderTop: `3px solid ${t.bd2}`,
                paddingTop: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "15px",
                  color: t.ac,
                  fontWeight: 700,
                }}
              >
                03
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: "10px 0 8px",
                }}
              >
                Build
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                Short sprints with regular demos, so you see working software
                every week or two.
              </p>
            </div>

            <div
              style={{
                flex: "1 1 240px",
                minWidth: 0,
                borderTop: `3px solid ${t.bd2}`,
                paddingTop: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "15px",
                  color: t.ac,
                  fontWeight: 700,
                }}
              >
                04
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: "10px 0 8px",
                }}
              >
                Launch &amp; support
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                Deployment, monitoring and ongoing improvements after go-live.
              </p>
            </div>
          </div>
        </section>

        {/* ENGAGEMENT SECTION */}
        <section
          id="engage"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "96px 24px 40px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: t.ac,
              fontWeight: 600,
            }}
          >
            Ways to work together
          </div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.2vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              margin: "14px 0 0",
              maxWidth: "760px",
            }}
          >
            Pick the model that fits your stage.
          </h2>

          <div
            className="col-responsive"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "48px",
            }}
          >
            {/* Model 1 */}
            <div
              style={{
                flex: "1 1 320px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "18px",
                padding: "28px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: 0,
                }}
              >
                Fixed-scope project
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                A defined deliverable with an agreed timeline and price. Best
                for MVPs and well-understood builds.
              </p>
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "16px",
                  borderTop: `1px solid ${t.bd}`,
                  fontSize: "15px",
                  color: t.tx2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Transparent scoping</span>
                <button
                  type="button"
                  onClick={openForm}
                  style={{
                    color: t.ac,
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Inquire &rarr;
                </button>
              </div>
            </div>

            {/* Model 2 (Featured) */}
            <div
              style={{
                flex: "1 1 320px",
                minWidth: 0,
                background: t.card,
                border: `2px solid ${t.ac}`,
                boxShadow: t.sh,
                borderRadius: "18px",
                padding: "27px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "22px",
                    margin: 0,
                  }}
                >
                  Dedicated team
                </h3>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: t.ac,
                    color: t.on,
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  Most Popular
                </span>
              </div>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                Engineers and a designer embedded with your team for ongoing
                product work. Best for growing products.
              </p>
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "16px",
                  borderTop: `1px solid ${t.bd}`,
                  fontSize: "15px",
                  color: t.tx2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Full-cycle delivery</span>
                <button
                  type="button"
                  onClick={openForm}
                  style={{
                    color: t.ac,
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Book a call &rarr;
                </button>
              </div>
            </div>

            {/* Model 3 */}
            <div
              style={{
                flex: "1 1 320px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "18px",
                padding: "28px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "22px",
                  margin: 0,
                }}
              >
                Support retainer
              </h3>
              <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                Monitoring, fixes and small improvements after launch. Best for
                live products that need a reliable partner.
              </p>
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "16px",
                  borderTop: `1px solid ${t.bd}`,
                  fontSize: "15px",
                  color: t.tx2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Guaranteed SLA</span>
                <button
                  type="button"
                  onClick={openForm}
                  style={{
                    color: t.ac,
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Inquire &rarr;
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL SECTION */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "72px 24px 40px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: t.band,
              border: `1px solid ${t.bd}`,
              borderRadius: "24px",
              padding: "clamp(28px, 5vw, 56px)",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: "clamp(22px, 3vw, 32px)",
                lineHeight: 1.3,
                margin: 0,
                maxWidth: "880px",
              }}
            >
              &ldquo;Softrix delivered our AI-powered platform weeks ahead of
              schedule. Their engineering standards, proactive communication,
              and domain insight made them feel like an integral part of our
              core team.&rdquo;
            </p>
            <div style={{ marginTop: "24px", color: t.mu, fontSize: "16px" }}>
              Alex Chen, VP of Engineering at CloudScale
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section
          id="faq"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "72px 24px 40px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: t.ac,
              fontWeight: 600,
            }}
          >
            FAQ
          </div>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(30px, 4.2vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              margin: "14px 0 0",
            }}
          >
            Questions clients ask before starting.
          </h2>

          <div style={{ marginTop: "36px", borderTop: `1px solid ${t.bd}` }}>
            <details
              style={{ borderBottom: `1px solid ${t.bd}`, padding: "4px 0" }}
            >
              <summary
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "18px 0",
                  fontSize: "18px",
                  fontWeight: 600,
                  minHeight: "44px",
                }}
              >
                How long does a typical project take?
                <span
                  className="chev"
                  style={{
                    color: t.mu,
                    display: "flex",
                    flex: "none",
                    transition: "transform 0.2s",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p
                style={{
                  margin: "0 0 18px",
                  color: t.mu,
                  fontSize: "16px",
                  maxWidth: "720px",
                }}
              >
                It depends on scope. A focused MVP usually takes 4 to 8 weeks.
                We confirm a realistic roadmap and milestones directly after our
                discovery call.
              </p>
            </details>

            <details
              style={{ borderBottom: `1px solid ${t.bd}`, padding: "4px 0" }}
            >
              <summary
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "18px 0",
                  fontSize: "18px",
                  fontWeight: 600,
                  minHeight: "44px",
                }}
              >
                Do you sign an NDA?
                <span
                  className="chev"
                  style={{
                    color: t.mu,
                    display: "flex",
                    flex: "none",
                    transition: "transform 0.2s",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p
                style={{
                  margin: "0 0 18px",
                  color: t.mu,
                  fontSize: "16px",
                  maxWidth: "720px",
                }}
              >
                Yes, absolutely. We are happy to execute your mutual NDA before
                you share any proprietary architectures or requirements.
              </p>
            </details>

            <details
              style={{ borderBottom: `1px solid ${t.bd}`, padding: "4px 0" }}
            >
              <summary
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "18px 0",
                  fontSize: "18px",
                  fontWeight: 600,
                  minHeight: "44px",
                }}
              >
                Who owns the code and designs?
                <span
                  className="chev"
                  style={{
                    color: t.mu,
                    display: "flex",
                    flex: "none",
                    transition: "transform 0.2s",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p
                style={{
                  margin: "0 0 18px",
                  color: t.mu,
                  fontSize: "16px",
                  maxWidth: "720px",
                }}
              >
                You own 100% of the IP. All source code, Figma files,
                documentation, and deployment scripts are yours upon milestone
                completion.
              </p>
            </details>

            <details
              style={{ borderBottom: `1px solid ${t.bd}`, padding: "4px 0" }}
            >
              <summary
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "18px 0",
                  fontSize: "18px",
                  fontWeight: 600,
                  minHeight: "44px",
                }}
              >
                Do you work with early-stage startups?
                <span
                  className="chev"
                  style={{
                    color: t.mu,
                    display: "flex",
                    flex: "none",
                    transition: "transform 0.2s",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p
                style={{
                  margin: "0 0 18px",
                  color: t.mu,
                  fontSize: "16px",
                  maxWidth: "720px",
                }}
              >
                Yes. We love working with ambitious founders. We scope a lean
                MVP first, then iterate rapidly based on real user analytics.
              </p>
            </details>

            <details
              style={{ borderBottom: `1px solid ${t.bd}`, padding: "4px 0" }}
            >
              <summary
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "18px 0",
                  fontSize: "18px",
                  fontWeight: 600,
                  minHeight: "44px",
                }}
              >
                What happens after launch?
                <span
                  className="chev"
                  style={{
                    color: t.mu,
                    display: "flex",
                    flex: "none",
                    transition: "transform 0.2s",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <p
                style={{
                  margin: "0 0 18px",
                  color: t.mu,
                  fontSize: "16px",
                  maxWidth: "720px",
                }}
              >
                We provide post-launch warranty, ongoing retainers for
                improvements, or a seamless handover and onboarding for your
                in-house engineers.
              </p>
            </details>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section
          id="contact"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "72px 24px 96px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="col-responsive"
            style={{ display: "flex", flexWrap: "wrap", gap: "48px" }}
          >
            {/* Left Info Column */}
            <div style={{ flex: "1 1 380px", minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: t.ac,
                  fontWeight: 600,
                }}
              >
                Contact
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(30px, 4.2vw, 46px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  margin: "14px 0 0",
                }}
              >
                Tell us what you are building.
              </h2>
              <p
                style={{
                  color: t.mu,
                  fontSize: "18px",
                  margin: "20px 0 0",
                  maxWidth: "460px",
                }}
              >
                Share a few details and we will reply within one working day
                with next steps.
              </p>

              <div
                style={{
                  marginTop: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "14px", alignItems: "center" }}
                >
                  <span
                    style={{
                      flex: "none",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: t.ac,
                      color: t.on,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    1
                  </span>
                  <span style={{ color: t.tx2, fontSize: "16px" }}>
                    We review your message and reply within one working day.
                  </span>
                </div>
                <div
                  style={{ display: "flex", gap: "14px", alignItems: "center" }}
                >
                  <span
                    style={{
                      flex: "none",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: t.ac,
                      color: t.on,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    2
                  </span>
                  <span style={{ color: t.tx2, fontSize: "16px" }}>
                    We schedule a short discovery call to understand your goals.
                  </span>
                </div>
                <div
                  style={{ display: "flex", gap: "14px", alignItems: "center" }}
                >
                  <span
                    style={{
                      flex: "none",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: t.ac,
                      color: t.on,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    3
                  </span>
                  <span style={{ color: t.tx2, fontSize: "16px" }}>
                    You receive a proposal with scope, timeline and cost.
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "16px",
                  color: t.tx2,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: t.ac }}
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>ranahammadismail@gmail.com</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: t.ac }}
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+92 330 3908006</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: t.ac }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span>Available Worldwide</span>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <form
              onSubmit={handleContactSubmit}
              style={{
                flex: "1 1 420px",
                minWidth: 0,
                background: t.card,
                border: `1px solid ${t.bd}`,
                boxShadow: t.sh,
                borderRadius: "20px",
                padding: "28px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {contactSent ? (
                <div
                  style={{
                    padding: "32px 16px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <div style={{ color: t.ac }}>
                    <svg
                      aria-hidden="true"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      fontSize: "22px",
                      margin: 0,
                      color: t.tx,
                    }}
                  >
                    Message Sent!
                  </h3>
                  <p style={{ margin: 0, color: t.mu, fontSize: "15px" }}>
                    Thanks for reaching out. We have sent you a confirmation
                    email and will reply within one working day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactSent(false)}
                    style={{
                      marginTop: "12px",
                      height: "44px",
                      padding: "0 20px",
                      borderRadius: "10px",
                      border: `1px solid ${t.bd2}`,
                      background: "transparent",
                      color: t.tx,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  {contactError && (
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "rgba(239, 68, 68, 0.12)",
                        color: "#ef4444",
                        fontSize: "14px",
                      }}
                    >
                      {contactError}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      htmlFor="contact-name"
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: t.tx2,
                      }}
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Your name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      style={{
                        height: "48px",
                        borderRadius: "10px",
                        border: `1px solid ${t.bd2}`,
                        background: t.bg,
                        color: t.tx,
                        padding: "0 14px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        width: "100%",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      htmlFor="contact-email"
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: t.tx2,
                      }}
                    >
                      Work email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@company.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      style={{
                        height: "48px",
                        borderRadius: "10px",
                        border: `1px solid ${t.bd2}`,
                        background: t.bg,
                        color: t.tx,
                        padding: "0 14px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        width: "100%",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      htmlFor="contact-type"
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: t.tx2,
                      }}
                    >
                      Project type
                    </label>
                    <select
                      id="contact-type"
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value)}
                      style={{
                        height: "48px",
                        borderRadius: "10px",
                        border: `1px solid ${t.bd2}`,
                        background: t.bg,
                        color: t.tx,
                        padding: "0 14px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        width: "100%",
                      }}
                    >
                      <option value="Mobile app">Mobile app</option>
                      <option value="Web / SaaS">Web / SaaS</option>
                      <option value="AI automation">AI automation</option>
                      <option value="Agentic AI / RAG">Agentic AI / RAG</option>
                      <option value="UI/UX design">UI/UX design</option>
                    </select>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <label
                      htmlFor="contact-details"
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: t.tx2,
                      }}
                    >
                      Project details
                    </label>
                    <textarea
                      id="contact-details"
                      rows={4}
                      required
                      placeholder="What are you trying to build or automate?"
                      value={contactDetails}
                      onChange={(e) => setContactDetails(e.target.value)}
                      style={{
                        borderRadius: "10px",
                        border: `1px solid ${t.bd2}`,
                        background: t.bg,
                        color: t.tx,
                        padding: "12px 14px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        width: "100%",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactLoading}
                    style={{
                      height: "52px",
                      border: 0,
                      borderRadius: "12px",
                      background: t.ac,
                      color: t.on,
                      fontWeight: 600,
                      fontSize: "16px",
                      cursor: contactLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      opacity: contactLoading ? 0.7 : 1,
                    }}
                  >
                    {contactLoading ? (
                      <>
                        <svg
                          aria-hidden="true"
                          className="animate-spin"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send message"
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: `1px solid ${t.bd}`,
          background: t.band,
        }}
      >
        <div
          className="col-responsive"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "48px 24px 24px",
            boxSizing: "border-box",
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
          }}
        >
          <div style={{ flex: "2 1 280px", minWidth: 0 }}>
            <Image
              src={t.lock}
              alt="Softrix: Technology. Innovation. Solutions."
              width={453}
              height={319}
              style={{ width: "auto", height: "100px", display: "block" }}
            />
            <p
              style={{
                margin: "12px 0 0",
                color: t.mu,
                fontSize: "15px",
                maxWidth: "340px",
              }}
            >
              Product design, engineering and AI for teams that want to ship.
            </p>
          </div>

          <div
            style={{
              flex: "1 1 140px",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "15px",
            }}
          >
            <div style={{ fontWeight: 600 }}>Services</div>
            <a href="#services" style={{ color: t.mu }}>
              Mobile apps
            </a>
            <a href="#services" style={{ color: t.mu }}>
              Web &amp; SaaS
            </a>
            <a href="#services" style={{ color: t.mu }}>
              AI &amp; agents
            </a>
            <a href="#services" style={{ color: t.mu }}>
              UI/UX design
            </a>
          </div>

          <div
            style={{
              flex: "1 1 140px",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "15px",
            }}
          >
            <div style={{ fontWeight: 600 }}>Company</div>
            <a href="#work" style={{ color: t.mu }}>
              Work
            </a>
            <a href="#process" style={{ color: t.mu }}>
              Process
            </a>
            <a href="#faq" style={{ color: t.mu }}>
              FAQ
            </a>
            <a href="#contact" style={{ color: t.mu }}>
              Contact
            </a>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px 24px 32px",
            boxSizing: "border-box",
            borderTop: `1px solid ${t.bd}`,
            color: t.fa,
            fontSize: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span>&copy; 2026 Softrix. All rights reserved.</span>
       
        </div>
      </footer>

      {/* BOOK A CALL POPUP MODAL */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Book a call"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          {/* Backdrop overlay button */}
          <button
            type="button"
            aria-label="Close dialog overlay"
            onClick={closeForm}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: t.ov,
              border: "none",
              padding: 0,
              margin: 0,
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              cursor: "pointer",
            }}
          />

          {/* Modal Card */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: t.card,
              border: `1px solid ${t.bd2}`,
              borderRadius: "20px",
              padding: "32px",
              boxSizing: "border-box",
              color: t.tx,
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontWeight: 700,
                    fontSize: "28px",
                    lineHeight: 1.15,
                    margin: 0,
                  }}
                >
                  Book a call
                </h2>
                <p
                  style={{
                    margin: "10px 0 0",
                    color: t.mu,
                    fontSize: "16px",
                  }}
                >
                  Tell us a bit about your project and we will reply within one
                  working day to schedule a call.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close"
                style={{
                  flex: "none",
                  width: "44px",
                  height: "44px",
                  border: `1px solid ${t.bd2}`,
                  background: "transparent",
                  borderRadius: "12px",
                  color: t.tx,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            {!modalSent ? (
              <form
                onSubmit={handleModalSubmit}
                style={{
                  marginTop: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {modalError && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "rgba(239, 68, 68, 0.12)",
                      color: "#ef4444",
                      fontSize: "14px",
                    }}
                  >
                    {modalError}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <label
                    htmlFor="bn"
                    style={{ fontSize: "14px", fontWeight: 500, color: t.tx2 }}
                  >
                    Name
                  </label>
                  <input
                    id="bn"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    style={{
                      height: "48px",
                      borderRadius: "10px",
                      border: `1px solid ${t.bd2}`,
                      background: t.bg,
                      color: t.tx,
                      padding: "0 14px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                      width: "100%",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <label
                    htmlFor="be"
                    style={{ fontSize: "14px", fontWeight: 500, color: t.tx2 }}
                  >
                    Work email
                  </label>
                  <input
                    id="be"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    style={{
                      height: "48px",
                      borderRadius: "10px",
                      border: `1px solid ${t.bd2}`,
                      background: t.bg,
                      color: t.tx,
                      padding: "0 14px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                      width: "100%",
                    }}
                  />
                </div>

                <div
                  className="col-responsive"
                  style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
                >
                  <div
                    style={{
                      flex: "1 1 220px",
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      htmlFor="bt"
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: t.tx2,
                      }}
                    >
                      Project type
                    </label>
                    <select
                      id="bt"
                      value={modalType}
                      onChange={(e) => setModalType(e.target.value)}
                      style={{
                        height: "48px",
                        borderRadius: "10px",
                        border: `1px solid ${t.bd2}`,
                        background: t.bg,
                        color: t.tx,
                        padding: "0 14px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        width: "100%",
                      }}
                    >
                      <option value="Mobile app">Mobile app</option>
                      <option value="Web / SaaS">Web / SaaS</option>
                      <option value="AI automation">AI automation</option>
                      <option value="Agentic AI / RAG">Agentic AI / RAG</option>
                      <option value="UI/UX design">UI/UX design</option>
                    </select>
                  </div>

                  <div
                    style={{
                      flex: "1 1 220px",
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      htmlFor="bb"
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: t.tx2,
                      }}
                    >
                      Budget range
                    </label>
                    <select
                      id="bb"
                      value={modalBudget}
                      onChange={(e) => setModalBudget(e.target.value)}
                      style={{
                        height: "48px",
                        borderRadius: "10px",
                        border: `1px solid ${t.bd2}`,
                        background: t.bg,
                        color: t.tx,
                        padding: "0 14px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                        width: "100%",
                      }}
                    >
                      <option value="Not sure yet">Not sure yet</option>
                      <option value="Under $2,000">Under $2,000</option>
                      <option value="$2,000 – $5,000">
                        $2,000 &ndash; $5,000
                      </option>
                      <option value="$5,000 – $15,000">
                        $5,000 &ndash; $15,000
                      </option>
                      <option value="$15,000+">$15,000+</option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <label
                    htmlFor="bm"
                    style={{ fontSize: "14px", fontWeight: 500, color: t.tx2 }}
                  >
                    Project details
                  </label>
                  <textarea
                    id="bm"
                    rows={4}
                    required
                    placeholder="What are you trying to build or automate?"
                    value={modalDetails}
                    onChange={(e) => setModalDetails(e.target.value)}
                    style={{
                      borderRadius: "10px",
                      border: `1px solid ${t.bd2}`,
                      background: t.bg,
                      color: t.tx,
                      padding: "12px 14px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                      width: "100%",
                      resize: "vertical",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  style={{
                    height: "52px",
                    border: 0,
                    borderRadius: "12px",
                    background: t.ac,
                    color: t.on,
                    fontWeight: 600,
                    fontSize: "16px",
                    cursor: modalLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    opacity: modalLoading ? 0.7 : 1,
                    marginTop: "8px",
                  }}
                >
                  {modalLoading ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="animate-spin"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" />
                      </svg>
                      Sending request...
                    </>
                  ) : (
                    <>
                      Request a call
                      <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div
                style={{
                  marginTop: "32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div style={{ color: t.ac }}>
                  <svg
                    aria-hidden="true"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: "24px",
                    margin: 0,
                  }}
                >
                  Request received
                </h3>
                <p style={{ margin: 0, color: t.mu, fontSize: "16px" }}>
                  Thanks for reaching out! We have received your project details
                  and sent a confirmation to your email. We will reply within
                  one working day to schedule your call.
                </p>
                <button
                  type="button"
                  onClick={closeForm}
                  style={{
                    marginTop: "8px",
                    height: "48px",
                    padding: "0 24px",
                    border: `1px solid ${t.bd2}`,
                    borderRadius: "12px",
                    background: "transparent",
                    color: t.tx,
                    fontWeight: 600,
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
