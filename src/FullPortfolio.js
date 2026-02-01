import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import MinimalTemplate from "./templates/MinimalTemplate";
import "./templates/minimal.css";
import CreativeTemplate from "./templates/CreativeTemplate";
import "./templates/creative.css";


function FullPortfolio() {
  const { id } = useParams();

  const [portfolio, setPortfolio] = useState(null);
  const [theme, setTheme] = useState(null);
  const [template, setTemplate] = useState("minimal");


  /* ---------- FETCH FROM FIRESTORE ---------- */
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const ref = doc(db, "portfolios", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          console.error("Portfolio not found");
          return;
        }

        const data = snap.data();

        setPortfolio(data.portfolio);
        setTheme(data.theme); // ✅ READ THEME
        setTemplate(data.template);
      } catch (err) {
        console.error("Failed to load portfolio:", err);
      }
    }

    fetchPortfolio();
  }, [id]);

  /* ---------- APPLY SAVED THEME ---------- */
  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;

    root.style.setProperty(
      "--bg-hero",
      `rgb(${theme.hero.bg.join(",")})`
    );
    root.style.setProperty(
      "--text-hero",
      theme.hero.text
    );

    root.style.setProperty(
      "--bg-about",
      `rgb(${theme.about.bg.join(",")})`
    );
    root.style.setProperty(
      "--text-about",
      theme.about.text
    );

    root.style.setProperty(
      "--bg-skills",
      `rgb(${theme.skills.bg.join(",")})`
    );
    root.style.setProperty(
      "--text-skills",
      theme.skills.text
    );

    root.style.setProperty(
      "--bg-projects",
      `rgb(${theme.projects.bg.join(",")})`
    );
    root.style.setProperty(
      "--text-projects",
      theme.projects.text
    );
  }, [theme]);

  if (!portfolio) {
    return <p>Loading portfolio…</p>;
  }
  function normalizeText(value) {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((v) => {
        if (typeof v === "string") return v;
        if (typeof v === "object" && Array.isArray(v.items)) {
          return `${v.title}: ${v.items.join(", ")}`;
        }
        return "";
      })
      .filter(Boolean)
      .join(" · ");
  }

  if (typeof value === "object") {
    if (Array.isArray(value.items)) return value.items.join(", ");
    if (value.title) return value.title;
  }

  return "";
}

const creativeData = {
  heroTitleLine1: "I build things",
  heroTitleLine2: "that feel intentional.",

  heroDescription:
    normalizeText(portfolio.about) ||
    "A developer who values clarity, storytelling, and structure.",

  heroMeta: "Software Engineering · Product · Creative Systems",

  manifesto: [
    normalizeText(portfolio.about) ||
      "I believe good software should explain itself."
  ],

  projects: Array.isArray(portfolio.projects)
    ? portfolio.projects.map((p) => {
        if (typeof p === "string") {
          return {
            title: "Project",
            description: p,
            details: "Personal work"
          };
        }

        if (typeof p === "object") {
          return {
            title: p.title || "Project",
            description: Array.isArray(p.items)
              ? p.items.join(", ")
              : p.description || "Project description",
            details: p.tech || "Personal work"
          };
        }

        return null;
      }).filter(Boolean)
    : [],

  skills: normalizeText(portfolio.skills),

  contact: {
    email: "test@email.com",
    github: "#",
    linkedin: "#"
  }
};


  return (
    <div style={{ padding: "60px" }}>
      {template === "minimal" && <MinimalTemplate data={portfolio} />}

{template === "creative" && (
  <CreativeTemplate data={creativeData} />
)}

    </div>
  );
}

export default FullPortfolio;
    