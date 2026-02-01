import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function EditPortfolio() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ Hooks ALWAYS at top
  const [portfolio, setPortfolio] = useState(
    state?.portfolio || {
      name: "",
      role: "",
      summary: ""
    }
  );

  // ✅ Conditional return AFTER hooks
  if (!state || !state.portfolio) {
    return <p>No portfolio data to edit.</p>;
  }

  function handleChange(field, value) {
    setPortfolio(prev => ({
      ...prev,
      [field]: value
    }));
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Edit Portfolio</h1>

      {/* NAME */}
      <label>Name</label>
      <input
        type="text"
        value={portfolio.name}
        onChange={e => handleChange("name", e.target.value)}
        style={{ width: "100%", marginBottom: "20px" }}
      />

      {/* ROLE */}
      <label>Role</label>
      <input
        type="text"
        value={portfolio.role}
        onChange={e => handleChange("role", e.target.value)}
        style={{ width: "100%", marginBottom: "20px" }}
      />

      {/* SUMMARY */}
      <label>Summary</label>
      <textarea
        rows="5"
        value={portfolio.summary}
        onChange={e => handleChange("summary", e.target.value)}
        style={{ width: "100%", marginBottom: "30px" }}
      />

      <button
        onClick={() =>
          navigate("/portfolio", {
            state: {
              ...state,
              portfolio
            }
          })
        }
      >
        Save & Preview
      </button>
    </div>
  );
}

export default EditPortfolio;
