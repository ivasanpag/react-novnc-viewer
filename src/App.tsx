import NoVNCViewer from "./lib/NoVncViewer";
const App = () => {
  const websocketUrl = "wss://localhost:12000/novnc"; // URL del WebSocket VNC
  const vncPassword = '123456'; // Contraseña del VNC

  return (
      <div style={{  width: '800px', height: '600px', flex: '1', overflow: 'hidden' }}>
          <NoVNCViewer url={websocketUrl} password={vncPassword} />
      </div>
  );
};

export default App;
