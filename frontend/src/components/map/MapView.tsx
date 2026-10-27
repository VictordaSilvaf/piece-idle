interface MapViewProps {
  active: boolean;
}

export function MapView({ active }: MapViewProps) {
  return (
    <section
      className={`view menu-page map-page ${active ? 'is-active' : ''}`}
      data-view-panel="mapa"
      aria-labelledby="map-title"
    >
      <div className="page-header">
        <p className="eyebrow">Escolha seu destino</p>
        <h1 id="map-title">Mapa de ilhas</h1>
        <p>Entre em uma ilha para iniciar uma área de batalha. Inimigos surgem a cada visita.</p>
      </div>
      <div className="map-grid" id="map-grid" />
    </section>
  );
}
