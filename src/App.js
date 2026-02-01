import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import ChooseMethod from "./ChooseMethod";
import UploadResume from "./UploadResume";
import TemplateSelect from "./TemplateSelect";
import PortfolioPreview from "./PortfolioPreview";
import EditPortfolio from "./EditPortfolio";
import FullPortfolio from "./FullPortfolio";




function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "40px" }}>
      <h1>PersonaPort</h1>
      <p>AI-powered portfolio generator</p>
      <button onClick={() => navigate("/choose")}>
        Create Portfolio
      </button>
    </div>
  );
}

function Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    role: "",
    experience: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log("AI Response:", data);

    navigate("/templates", {
  state: {
    portfolio: data.portfolio
  }
});

  }

  return (
    <div style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>Create Your Portfolio</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Your name"
          onChange={handleChange}
        /><br /><br />

        <input
          name="industry"
          placeholder="Industry"
          onChange={handleChange}
        /><br /><br />

        <input
          name="role"
          placeholder="Role"
          onChange={handleChange}
        /><br /><br />

        <textarea
          name="experience"
          placeholder="Experience"
          onChange={handleChange}
        /><br /><br />

        <button type="submit">Generate Portfolio</button>
      </form>
    </div>
  );
}

function Loading() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Generating your portfolio…</h1>
      <p>Please wait ✨</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose" element={<ChooseMethod />} />
        <Route path="/form" element={<Form />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/templates" element={<TemplateSelect />} />
        <Route path="/portfolio" element={<PortfolioPreview />} />
        <Route path="/edit" element={<EditPortfolio />} />
        <Route path="/portfolio/:id" element={<FullPortfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
