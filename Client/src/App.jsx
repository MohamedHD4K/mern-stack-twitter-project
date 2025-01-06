import { useState } from "react";

function App() {
  const [value, setValue] = useState(false);

  return (
    <div
      style={{
        background: value ? "#333" : "#222",
      }}
    >
      <button onClick={() => setValue((prev) => !prev)}>
        count {value + ""}
      </button>
    </div>
  );
}

export default App;
