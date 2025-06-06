"use client";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

export default function Map() {
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const L = await import("leaflet");

        const map = L.map("map").setView([28.7058143724066, 77.27230688817474], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(map);

        const customIcon = L.icon({
          iconUrl: "/marker-icon.png", // place your image inside public/
          iconSize: [25, 25],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          shadowSize: [41, 41],
        });

        L.marker([28.7058143724066, 77.27230688817474], { icon: customIcon })
          .addTo(map)
          .bindPopup("Sabar Store")
          .openPopup();
      }
    })();

    // Cleanup map instance on component unmount
    return () => {
      const mapEl = document.getElementById("map");
      if (mapEl) {
        const L = window.L as typeof import("leaflet");
        const mapInstance = L?.map?.(mapEl);
        if (mapInstance) mapInstance.remove();
      }
    };
  }, []);

  return (
    <div className="w-full h-[500px] rounded-4xl overflow-hidden shadow-md">
      <div id="map" style={{ height: "500px", width: "100%" }} />
    </div>
  );
}
