import { ReactNode } from "react"

// Definimos la interfaz para las propiedades del componente
export type NoVNCViewerProps = {
  url: string;
  password: string;
  viewOnly?: boolean;
  scaleViewport?: boolean;
  resizeSession?: boolean;
  showDotCursor?: boolean;
  loader?: ReactNode
  style?: object
  className?: string
  background?: string
  quality?: number;
  compression?: number;
  debug?: boolean;
  // Callbacks para los eventos
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSecurityFailure?: (e: CustomEvent) => void;
  onError?: (e: Event) => void;
  onClipboard?: (e?: { detail: { text: string } }) => void

}

// Interfaz para los métodos expuestos del componente
export type NoVNCViewerHandle = {
  connect: () => void;
  disconnect: () => void;
  sendKeys: (keys: string) => void;
}
