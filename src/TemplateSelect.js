import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

function lighten([r, g, b], amount = 25) {
  return [clamp(r + amount), clamp(g + amount), clamp(b + amount)];
}

function darken([r, g, b], amount = 25) {
  return [clamp(r - amount), clamp(g - amount), clamp(b - amount)];
}

function vibrant([r, g, b]) {
  return [clamp(r * 1.2), clamp(g * 1.2), clamp(b * 1.2)];
}

function pastel([r, g, b]) {
  return lighten([r, g, b], 45);
}

function TemplateSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const portfolioData = location.state?.portfolio;

  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [palettes, setPalettes] = useState([]);
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // 🔥 CORE FUNCTION — fetch multiple diverse palettes
  async function fetchPalettes() {
    try {
      setLoading(true);
      setError(false);

      const basePalettes = [];

      // fetch 3 DIFFERENT base palettes
      for (let i = 0; i < 3; i++) {
        const res = await fetch("http://localhost:5000/api/palette", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();
        if (!data?.result) throw new Error("Invalid palette");

        basePalettes.push(data.result);
      }

      // generate variations from each base
      const diversifiedPalettes = basePalettes.flatMap(base => [
        base,
        base.map(c => lighten(c)),
        base.map(c => darken(c))
      ]);

      setPalettes(diversifiedPalettes);
      setSelectedPalette(diversifiedPalettes[0]);
      setLoading(false);
    } catch (err) {
      console.error("Palette error:", err);
      setError(true);
      setLoading(false);

      // fallback (still diverse)
      const fallback = [
        [[44, 62, 80], [236, 240, 241], [52, 152, 219], [231, 76, 60], [241, 196, 15]],
        [[18, 18, 18], [245, 245, 245], [121, 85, 72], [96, 125, 139], [255, 193, 7]],
        [[33, 33, 33], [255, 255, 255], [0, 188, 212], [255, 87, 34], [76, 175, 80]]
      ];

      setPalettes(fallback);
      setSelectedPalette(fallback[0]);
    }
  }

  // initial load
  useEffect(() => {
    fetchPalettes();
  }, []);

  function handleContinue() {
    navigate("/portfolio", {
      state: {
        portfolio: portfolioData,
        template: selectedTemplate,
        palette: selectedPalette,
        palettes: palettes 
      }
    });
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Select Your Portfolio Style</h1>
      <p>Choose a template and a color palette</p>

      {/* TEMPLATE SELECTION */}
      <h3>Templates</h3>
      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <button onClick={() => setSelectedTemplate("minimal")}>Minimal</button>
        <button onClick={() => setSelectedTemplate("creative")}>Creative</button>
        <button onClick={() => setSelectedTemplate("formal")}>Formal</button>

      </div>

      <p>
        Selected Template: <b>{selectedTemplate}</b>
      </p>

      {/* COLOR PALETTES */}
      <h3>Color Palettes</h3>

      <button
        onClick={fetchPalettes}
        disabled={loading}
        style={{ marginBottom: "15px" }}
      >
        {loading ? "Generating..." : "Reload Palettes 🔄"}
      </button>

      {error && <p style={{ color: "red" }}>Using fallback palettes</p>}

      <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
        {palettes.map((palette, index) => (
          <div
            key={index}
            onClick={() => setSelectedPalette(palette)}
            style={{
              cursor: "pointer",
              border:
                selectedPalette === palette
                  ? "3px solid black"
                  : "1px solid #ccc",
              padding: "6px"
            }}
          >
            <div style={{ display: "flex" }}>
              {palette.map((color, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                    width: 32,
                    height: 32
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <br />

      <button onClick={handleContinue}>
        Continue to Portfolio →
      </button>
    </div>
  );
}

export default TemplateSelect;
