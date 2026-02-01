import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadResume() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  async function handleUpload(e) {
    e.preventDefault();

    if (!file) {
      alert("Please upload a resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("http://localhost:5000/upload-resume", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log("Resume AI Response:", data);

    navigate("/templates", {
  state: {
    portfolio: data.portfolio
  }
    })
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Upload Your Resume</h1>
      <p>Upload a PDF resume and let AI generate your portfolio</p>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br /><br />
        <button type="submit">Generate Portfolio</button>
      </form>
    </div>
  );
}

export default UploadResume;
    