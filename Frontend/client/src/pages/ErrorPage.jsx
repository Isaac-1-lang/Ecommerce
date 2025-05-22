import { useRouteError, useNavigate, replace } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Handle "Go back" safely
  const handleGoBack = () => {
    const canGoBack = window.history.length > 1;
    //  Check if history stack allows goig back
    canGoBack ? navigate(-1) : navigate("/",{replace:true});
  }
  const handleGoHome = () => {
    navigate("/",{replace:true});
  }

  // Determine error type and set a user-friendly message
  let errorMessage = "An unexpected error occurred.";
  let errorStatus = "Error";

  if (error.status) {
    errorStatus = `${error.status}`;
    switch (error.status) {
      case 404:
        errorMessage = "The page you're looking for doesn't exist.";
        break;
      case 401:
        errorMessage = "You are not authorized to view this page.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      default:
        errorMessage = error.data?.message || error.message || errorMessage;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️ {errorStatus}</h1>
      <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "2rem" }}>
        {errorMessage}
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button
          onClick={() => navigate(-1)} // Go back
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/")} // Go home
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          Go Home
        </button>
      </div>
      {/* Show debug info only in development */}
      {import.meta.env.DEV && (
        <details style={{ marginTop: "2rem", textAlign: "left" }}>
          <summary>Debug Details</summary>
          <pre style={{ background: "#f0f0f0", padding: "1rem", borderRadius: "4px" }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ErrorPage;