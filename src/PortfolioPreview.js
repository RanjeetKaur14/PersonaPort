import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import MinimalTemplate from "./templates/MinimalTemplate";
import "./templates/minimal.css";
import CreativeTemplate from "./templates/CreativeTemplate";
import "./templates/creative.css";


function normalizeText(value) {
  if (!value) return "";

  // Case 1: string
  if (typeof value === "string") return value;

  // Case 2: array
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        if (typeof v === "string") return v;

        if (typeof v === "object") {
          if (Array.isArray(v.items)) {
            return `${v.title}: ${v.items.join(", ")}`;
          }
          if (v.title) return v.title;
        }

        return "";
      })
      .filter(Boolean)
      .join(" · ");
  }

  // Case 3: object
  if (typeof value === "object") {
    if (Array.isArray(value.items)) {
      return value.items.join(", ");
    }
    if (value.title) return value.title;
  }

  return "";
}

function getTextColor([r, g, b]) {
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 140 ? "#000000" : "#ffffff";
}

function PortfolioPreview() {
  const location = useLocation();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [template, setTemplate] = useState("");
  const [palettes, setPalettes] = useState([]);
  const [currentPalette, setCurrentPalette] = useState([]);

  /* ---------- LOAD ROUTER STATE ---------- */
  useEffect(() => {
    const state = location.state;
    if (!state) return;

    setPortfolio(state.portfolio);
    setTemplate(state.template);
    setPalettes(state.palettes || []);
    setCurrentPalette(state.palette || []);
  }, [location.state]);

  /* ---------- APPLY COLORS (PREVIEW) ---------- */
  useEffect(() => {
    if (!currentPalette.length) return;

    const root = document.documentElement;

    root.style.setProperty(
      "--bg-hero",
      `rgb(${currentPalette[0].join(",")})`
    );
    root.style.setProperty(
      "--text-hero",
      getTextColor(currentPalette[0])
    );

    root.style.setProperty(
      "--bg-about",
      `rgb(${currentPalette[1].join(",")})`
    );
    root.style.setProperty(
      "--text-about",
      getTextColor(currentPalette[1])
    );

    root.style.setProperty(
      "--bg-skills",
      `rgb(${currentPalette[2].join(",")})`
    );
    root.style.setProperty(
      "--text-skills",
      getTextColor(currentPalette[2])
    );

    root.style.setProperty(
      "--bg-projects",
      `rgb(${currentPalette[3].join(",")})`
    );
    root.style.setProperty(
      "--text-projects",
      getTextColor(currentPalette[3])
    );
  }, [currentPalette]);

  /* ---------- SAVE EXACT THEME ---------- */
  async function savePortfolioAndOpen() {
    try {
      const theme = {
        hero: {
          bg: currentPalette[0],
          text: getTextColor(currentPalette[0])
        },
        about: {
          bg: currentPalette[1],
          text: getTextColor(currentPalette[1])
        },
        skills: {
          bg: currentPalette[2],
          text: getTextColor(currentPalette[2])
        },
        projects: {
          bg: currentPalette[3],
          text: getTextColor(currentPalette[3])
        }
      };

      const docRef = await addDoc(collection(db, "portfolios"), {
        portfolio,
        template,
        theme,
        createdAt: serverTimestamp()
      });

      navigate(`/portfolio/${docRef.id}`);
    } catch (err) {
      console.error("Failed to save portfolio:", err);
      alert("Failed to save portfolio. Try again.");
    }
  }
  if (!portfolio) {
    return <p>No portfolio data found.</p>;
  }
  console.log("ABOUT:", portfolio.about);
console.log("SKILLS:", portfolio.skills);

  const creativeData = {
  heroTitleLine1: "I build things",
  heroTitleLine2: "that feel intentional.",

  heroDescription:
    portfolio.about ||
    "A developer who values clarity, storytelling, and structure.",

  heroMeta: "Software Engineering · Product · Creative Systems",

  manifesto: [
    portfolio.about ||
      "I believe good software should explain itself."
  ],

  projects: Array.isArray(portfolio.projects)
  ? portfolio.projects.map((p) => {
      // Case 1: already in Creative shape
      if (typeof p === "string") {
        return {
          title: "Project",
          description: p,
          details: "Personal work"
        };
      }

      // Case 2: object with title + items
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


  skills: portfolio.skills || "Skills coming soon",

  contact: {
    email: "test@email.com",
    github: "#",
    linkedin: "#"
  }
};

  

  return (
  <div style={{ padding: "40px", display: "flex", gap: "30px" }}>
    
    {/* LEFT: PREVIEW */}
    <div style={{ flex: 3 }}>
      {template === "minimal" && <MinimalTemplate data={portfolio} />}

      {template === "creative" && <CreativeTemplate data={creativeData} />}


      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() =>
          navigate("/edit", {
            state: { portfolio, template }
          })
        }>
          ✏️ Edit Content
        </button>

        <button onClick={savePortfolioAndOpen}>
          🌍 View Full Site
        </button>
      </div>
    </div>

    {/* RIGHT: COLOR PALETTE */}
    <div style={{ flex: 1 }}>
      <h3>Change Colors 🎨</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {palettes.map((palette, index) => (
          <div
            key={index}
            onClick={() => setCurrentPalette(palette)}
            style={{
              cursor: "pointer",
              border:
                palette === currentPalette
                  ? "3px solid black"
                  : "1px solid #ccc",
              padding: "6px"
            }}
          >
            <div style={{ display: "flex" }}>
              {palette.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: `rgb(${c.join(",")})`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
);

}

export default PortfolioPreview;
