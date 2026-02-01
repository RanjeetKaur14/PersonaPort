import { useNavigate } from "react-router-dom";

function ChooseMethod() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>How would you like to create your portfolio?</h1>
      <p>Select one option below</p>

      <div style={{ marginTop: "40px" }}>
        <button
          style={{ padding: "15px 30px", marginRight: "20px" }}
          onClick={() => navigate("/upload")}
        >
          📄 Upload Resume
        </button>

        <button
          style={{ padding: "15px 30px" }}
          onClick={() => navigate("/form")}
        >
          ✍️ Fill Details Manually
        </button>
      </div>
    </div>
  );
}

export default ChooseMethod;
