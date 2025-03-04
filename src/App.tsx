import { useRef, useState } from "react";
import NoVNCViewer from "./lib/NoVncViewer";

const App = () => {
  const websocketUrl = "ws://localhost:20000/novnc";
  const vncPassword = "123456"; // Contraseña del VNC
  const vncScreenRef = useRef<React.ElementRef<typeof NoVNCViewer>>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const connect = () => {
    const { connect } = vncScreenRef.current ?? {};
    connect?.();
  };

  const disconnect = () => {
    const { disconnect } = vncScreenRef.current ?? {};
    disconnect?.();
  };

  return (
    <>
      <div style={{ flex: "1", background: "white" }}>
        <button
          onClick={() => {
            connect();
          }}
        >
          CONNECT
        </button>

        <button
          onClick={() => {
            disconnect();
          }}
        >
          DISCONNECT
        </button>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
      </div>
      <NoVNCViewer url={websocketUrl} password={vncPassword} debug={true} ref={vncScreenRef} />

    </>
  );
};

export default App;
