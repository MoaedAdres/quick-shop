import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", "dark");
  }, []);
  return <></>;
}

export default App;
