import { useRef, useImperativeHandle, ForwardRefRenderFunction, useState, forwardRef } from "react";
import { NoVNCViewerHandle, NoVNCViewerProps } from "./types";
import RFB from "../noVNC/core/rfb";

enum KeyEventVnc {
  "ControlLeft" = 0xffe3,
  "AltLeft" = 0xff_e9,
  "Delete" = 0xffff,
  "Tab" = 0xff_89,
  "F1" = 0xffbe,
  "F2" = 0xffbf,
  "F3" = 0xffc0,
  "F4" = 0xffc1,
  "F5" = 0xffc2,
  "F6" = 0xffc3,
  "F7" = 0xffc4,
  "F8" = 0xffc5,
  "F9" = 0xffc6,
  "F10" = 0xffc7,
  "F11" = 0xffc8,
  "F12" = 0xffc9,
}

const NoVNCViewer: ForwardRefRenderFunction<NoVNCViewerHandle, NoVNCViewerProps> = (
  {
    url,
    password,
    viewOnly = false,
    scaleViewport = true,
    resizeSession = true,
    showDotCursor = false,
    background = "black",
    quality = 6,
    compression = 2,
    debug = true,
    onConnect,
    onDisconnect,
    onSecurityFailure,
    onError,
    className,
    loader,
  },
  ref
) => {
  const vncContainerRef = useRef<HTMLDivElement>(null);
  const rfbRef = useRef<any>(null); // Usa 'any' si el tipo de RFB no está disponible
  const [loading, setLoading] = useState<boolean>(true);

  const connect = () => {
    if (vncContainerRef.current && url && !rfbRef.current) {
      rfbRef.current = new RFB(vncContainerRef.current, url, {
        credentials: { password },
      });

      // Configuración de propiedades
      rfbRef.current.viewOnly = viewOnly;
      rfbRef.current.scaleViewport = scaleViewport;
      rfbRef.current.resizeSession = resizeSession;
      rfbRef.current.showDotCursor = showDotCursor;
      rfbRef.current.qualityLevel = quality;
      rfbRef.current.compressionLevel = compression;

      // Modo de depuración
      if (debug) console.debug = (...args) => console.log("[DEBUG]", ...args);

      // Listeners para los eventos
      rfbRef.current.addEventListener("connect", () => {
        console.log("Conectado al servidor VNC");
        console.log(onConnect);
        if (onConnect) onConnect();

        setLoading(false);
      });

      rfbRef.current.addEventListener("disconnect", () => {
        console.log("Desconectado del servidor VNC");
        if (onDisconnect) onDisconnect();
        setLoading(true);
      });

      rfbRef.current.addEventListener("securityfailure", (e: CustomEvent) => {
        console.error("Error de seguridad en la conexión VNC", e.detail?.reason);
        if (onSecurityFailure) onSecurityFailure(e);
      });

      rfbRef.current.addEventListener("error", (e: Event) => {
        console.error("Error en la conexión VNC", e);
        if (onError) onError(e);
      });
    }
  };

  const sendKeys = (specialKeyCombination: string) => {
    if (rfbRef.current) {
      specialKeyCombination.split("|").map((item) => {
        var key: number | undefined = KeyEventVnc[item as keyof typeof KeyEventVnc];
        const hexValue: string = `0x${key.toString(16)}`;
        rfbRef.current.sendKey(hexValue, item, true);
      });

      specialKeyCombination.split("|").map((item) => {
        var key: number | undefined = KeyEventVnc[item as keyof typeof KeyEventVnc];
        const hexValue: string = `0x${key.toString(16)}`;
        rfbRef.current.sendKey(hexValue, item, false);
      });
    }
  };

  const disconnect = () => {
    if (rfbRef.current) {
      rfbRef.current.disconnect();
      rfbRef.current = null;
    }
  };

  useImperativeHandle(ref, () => ({
    connect,
    disconnect,
    sendKeys,
  }));

  return (
    <>
      {(loading || !url) && (loader ?? <p>Loading...</p>)}
      {url && (
        <div
          ref={vncContainerRef}
          style={
            loading
              ? {
                  width: "100%",
                  height: "0",
                }
              : {
                  width: "1024px",
                  height: "768px",
                  flex: "1",
                  overflow: "hidden",
                }
          }
          className={className}
        ></div>
      )}
    </>
  );
};

export default forwardRef(NoVNCViewer);
