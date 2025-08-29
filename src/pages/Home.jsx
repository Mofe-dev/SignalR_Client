import React, { useEffect, useState, useRef } from "react";
import { useMsalAuth } from "../services/useMsalAuth.js";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function Home() {
  const { user, signOut, accessToken } = useMsalAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const connectionRef = useRef(null);

  useEffect(() => {
    // Solo intenta conectar si el token existe y es una cadena no vacía
    if (
      !accessToken ||
      typeof accessToken !== "string" ||
      accessToken.length < 10
    ) {
      setLoading(true);
      console.log("No accessToken válido, esperando para conectar a SignalR.");
      return;
    }

    setLoading(false);
    console.log("Creando conexión SignalR...");
    const connection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_SIGNALR_URL, {
        accessTokenFactory: () => {
          console.log("Proveyendo accessToken a SignalR:", accessToken);
          return accessToken;
        },
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on("ReceiveNotification", (message) => {
      console.log("Notificación recibida:", message);
      setNotifications((prev) => [message, ...prev]);
    });

    connection.onreconnecting((error) => {
      console.warn("SignalR reconectando...", error);
    });

    connection.onreconnected((connectionId) => {
      console.info("SignalR reconectado. ConnectionId:", connectionId);
    });

    connection.onclose((error) => {
      console.error("Conexión SignalR cerrada.", error);
    });

    let stopped = false;
    connection
      .start()
      .then(() => {
        if (!stopped) {
          console.log("Conexión SignalR iniciada.");
        }
      })
      .catch((err) => {
        if (!stopped) {
          console.error("Error iniciando SignalR:", err);
        }
      });

    return () => {
      stopped = true;
      if (connectionRef.current) {
        console.log("Deteniendo conexión SignalR...");
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [accessToken]);

  return (
    <div style={{ padding: 32 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Bienvenido, {user?.name}</h2>
        <button onClick={signOut}>Cerrar sesión</button>
      </div>
      <div style={{ marginTop: 32, display: "flex", flexDirection: "column" }}>
        <h3>Notificaciones</h3>
        {loading ? (
          <div style={{ padding: 24, textAlign: "center" }}>
            <span>Cargando notificaciones...</span>
          </div>
        ) : notifications.length === 0 ? (
          <p>No hay notificaciones.</p>
        ) : (
          <div
            className="noti-container"
            style={{ maxHeight: 400, overflowY: "auto", width: "30vw" }}
          >
            {notifications.map((n, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <strong>{n.sender}</strong>: {n.message}
                <div style={{ fontSize: 12, color: "#888" }}>{n.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
