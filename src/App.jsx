import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import azsData from "./azsData";

const getColor = (status) => {
  if (status === "green") return "#2ecc71";
  if (status === "orange") return "#f39c12";
  if (status === "red") return "#e74c3c";
  if (status === "gray") return "#7f8c8d";
  if (status === "white") return "#ffffff";
  return "#e74c3c";
};

const createIcon = (status) => {
  const color = getColor(status);

  return new L.DivIcon({
    className: "",
    html: `
      <div style="
        width:12px;
        height:12px;
        border-radius:50%;
        background:${color};
        border:2px solid #fff;
        box-shadow:0 0 6px ${color};
      "></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [brandFilter, setBrandFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const brands = ["all", ...new Set(azsData.map((a) => a.brand))];

  const filteredData = azsData.filter(
    (a) =>
      (brandFilter === "all" || a.brand === brandFilter) &&
      (typeFilter === "all" || a.type === typeFilter)
  );

  return (
    <div className="app">

      <button className="toggleBtn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>

        <div className="header">⛽ BenzinArmavir</div>

        {/* ЛЕГЕНДА */}
        <div className="card">
          <div className="row"><span className="dot green"></span> топливо есть</div>
          <div className="row"><span className="dot orange"></span> мало топлива</div>
          <div className="row"><span className="dot red"></span> нет топлива</div>
          <div className="row"><span className="dot gray"></span> закрыто</div>
          <div className="row"><span className="dot white"></span> нет данных / устарело</div>
        </div>

        <div className="card">
          <div className="label">Бренд</div>
          <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === "all" ? "Все" : b}
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          <div className="label">Тип</div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">Все</option>
            <option value="fuel">Бензин</option>
            <option value="gas">Газ</option>
          </select>
        </div>

        <div className="bottomInfo">
          <div className="title">BenzinArmavir</div>
          <div className="desc">Мониторинг АЗС в реальном времени</div>
        </div>

      </div>

      {/* MAP */}
      <div className="mapWrap">
        <MapContainer
          center={[44.989, 41.123]}
          zoom={12}
          className="map"
          attributionControl={false}   // ❗ убирает Leaflet подпись
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {filteredData.map((azs) => (
            <Marker
              key={azs.id}
              position={azs.position}
              icon={createIcon(azs.status)}
            >
              <Popup>
                <b>{azs.name}</b>
                <br />
                {azs.address}

                <hr />

                <div>92: {azs.fuel?.ai92 ?? "—"} ₽</div>
                <div>95: {azs.fuel?.ai95 ?? "—"} ₽</div>
                <div>100: {azs.fuel?.ai100 ?? "—"} ₽</div>
                <div>Дизель: {azs.fuel?.diesel ?? "—"} ₽</div>
                <div>Газ: {azs.fuel?.gas ?? "—"} ₽</div>

                <hr />

                <div>🚗 Очередь: {azs.queue ?? "—"}</div>

                <hr />

                <div style={{ fontSize: "12px", opacity: 0.7 }}>
                  Обновлено: {azs.updatedAt ?? "—"}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* STYLE */}
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          font-family: system-ui, sans-serif;
          background: #0b0f14;
        }

        .app {
          position: relative;
          height: 100vh;
          width: 100vw;
        }

        .mapWrap {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .map {
          height: 100%;
          width: 100%;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 320px;
          background: #0f141b;
          border-right: 1px solid #1d2633;
          padding: 16px;
          color: #fff;
          display: flex;
          flex-direction: column;
          transition: transform .3s ease;
          z-index: 2000;
        }

        .sidebar.closed {
          transform: translateX(-100%);
        }

        .header {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .card {
          background: #141b24;
          border: 1px solid #1f2a38;
          border-radius: 12px;
          padding: 10px;
          margin-bottom: 10px;
        }

        .label {
          font-size: 12px;
          opacity: 0.7;
          margin-bottom: 6px;
        }

        select {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          background: #0b0f14;
          color: #fff;
          border: 1px solid #2a3545;
        }

        .row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 4px 0;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .green { background: #2ecc71; }
        .orange { background: #f39c12; }
        .red { background: #e74c3c; }
        .gray { background: #7f8c8d; }
        .white { background: #ffffff; border: 1px solid #999; }

        .bottomInfo {
          margin-top: auto;
          padding: 12px;
          border-radius: 12px;
          background: #0b0f14;
          border: 1px solid #1f2a38;
        }

        .toggleBtn {
          position: fixed;
          top: 14px;
          right: 14px;
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 12px;
          background: rgba(15,20,27,.95);
          color: #fff;
          font-size: 18px;
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,.35);
          cursor: pointer;
        }
      `}</style>

    </div>
  );
}
