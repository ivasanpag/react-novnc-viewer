import React, { ForwardRefRenderFunction, useEffect, useRef } from 'react';
import RFB from "../noVNC/core/rfb";
import { VncViewerHandle, VncViewerProps } from './types';

const NoVNCViewer: ForwardRefRenderFunction<VncViewerHandle, VncViewerProps> = (
    { url, password },
    ref
  ) => {
    const vncContainerRef = useRef(null);
    const rfbRef = useRef<RFB | undefined>(undefined);

    useEffect(() => {
        // Verifica que el contenedor y la URL estén definidos antes de intentar conectar
        if (vncContainerRef.current && url) {
            // Configura la conexión al servidor VNC
            rfbRef.current = new RFB(vncContainerRef.current, url, {
                credentials: { password },
            });

            // Opciones adicionales (puedes ajustarlas según tus necesidades)
            rfbRef.current.viewOnly = false;
            rfbRef.current.scaleViewport = true;
            rfbRef.current.resizeSession = true;

            // Event listeners para gestionar la conexión y los errores
            rfbRef.current.addEventListener('connect', () => {
                console.log('Conectado al servidor VNC');
            });

            rfbRef.current.addEventListener('disconnect', () => {
                console.log('Desconectado del servidor VNC');
            });

            rfbRef.current.addEventListener('securityfailure', (e:any) => {
                console.error('Error de seguridad en la conexión VNC', e.detail.reason);
            });

            return () => {
                if (rfbRef.current) {
                    rfbRef.current.disconnect();
                }
            };
        }
    }, [url, password]);

    return (
        <div
            ref={vncContainerRef}
            style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
        ></div>
    );
};

export default NoVNCViewer;
