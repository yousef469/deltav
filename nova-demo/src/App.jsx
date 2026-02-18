import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS, SURVIVAL_CONTENT, EMERGENCY_TREES, AI_PROTOCOLS } from './translations';
import { findNearestCivilization, getCelestialGuidance, validateMove } from './engine';
import './index.css';

// --- CHESS LOGIC REMOVED ---

function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('home');
  const [subTab, setSubTab] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [currentNode, setCurrentNode] = useState('start');
  const [search, setSearch] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // Real GPS & Orientation
  const [pos, setPos] = useState({ lat: 30.0444, lon: 31.2357 }); // Cairo Default
  const [heading, setHeading] = useState(0);
  const [dirStr, setDirStr] = useState("N");

  const [nearestRescue, setNearestRescue] = useState(null);
  const [celestialInfo, setCelestialInfo] = useState(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    setAiResponse(TRANSLATIONS[lang].ai_status);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p) => {
        const newPos = { lat: p.coords.latitude, lon: p.coords.longitude };
        setPos(newPos);
        const nearest = findNearestCivilization(newPos.lat, newPos.lon);
        setNearestRescue(nearest);
        setCelestialInfo(getCelestialGuidance(newPos.lat, newPos.lon, nearest.point.lat, nearest.point.lon, lang));
      });
    }
  }, [lang]);

  useEffect(() => {
    const handleOrientation = (e) => {
      let alpha = e.webkitCompassHeading || e.alpha;
      if (alpha !== null) {
        setHeading(alpha);
        const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        setDirStr(dirs[Math.round(alpha / 45) % 8]);
      }
    };
    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  useEffect(() => {
    if (activeTab === 'nav' && window.L) {
      setTimeout(() => {
        if (!mapInstance.current) {
          mapInstance.current = window.L.map('map', { zoomControl: false }).setView([pos.lat, pos.lon], 13);
          window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapInstance.current);
          if (nearestRescue) {
            window.L.marker([nearestRescue.point.lat, nearestRescue.point.lon]).addTo(mapInstance.current).bindPopup(`RESCUE: ${nearestRescue.point.name}`).openPopup();
          }
          window.L.marker([pos.lat, pos.lon], { icon: window.L.divIcon({ className: 'my-location-marker', html: '●' }) }).addTo(mapInstance.current);
        } else {
          mapInstance.current.setView([pos.lat, pos.lon]);
        }
      }, 300);
    }
  }, [activeTab, pos]);

  const t = (key) => TRANSLATIONS[lang][key] || key;

  const handleSearch = (e) => {
    e.preventDefault();
    const s = search.toLowerCase();
    const match = Object.keys(AI_PROTOCOLS[lang]).find(k => s.includes(k));
    setAiResponse(AI_PROTOCOLS[lang][match] || "Protocol: Unknown. Recommended SOS signal: 3 dots, 3 dashes, 3 dots.");
    setSearch("");
  };

  // --- Chess Removed ---


  const renderHome = () => (
    <div className={`main-content ${lang === 'ar' ? 'rtl' : ''} animated`}>
      <div className="card emergency-card" onClick={() => { setActiveTab('emergency'); setSubTab(null); }}>
        <div className="card-title">🚨 {t('emergency')}</div>
        <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>SOS RESPONSE INTERFACE</p>
      </div>

      <div className="card">
        <div className="ai-status"><span></span> {t('ai_status')}</div>
        <div className="ai-response">{aiResponse}</div>
      </div>

      <div className="card vault-card" onClick={() => setActiveTab('vault')}>
        <div className="card-title">📖 {t('vault')}</div>
        <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>LOCAL KNOWLEDGE DATABASE</p>
      </div>

      <div className="dashboard-grid">
        {['farming', 'repairing', 'education', 'coding', 'nav'].map(id => (
          <div key={id} className="grid-card" onClick={() => {
            setActiveTab(id === 'nav' ? id : 'cat');
            setSubTab(id);
            setExpandedId(null);
          }}>
            <div className="grid-icon">{
              id === 'farming' ? '🌾' : id === 'repairing' ? '⚙️' : id === 'education' ? '🎓' : id === 'coding' ? '💻' : '🌍'
            }</div>
            <span className="grid-label">{t(id)}</span>
          </div>
        ))}
      </div>

      <form className="manual-input-box" onSubmit={handleSearch}>
        <input type="text" placeholder={t('search_placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit" style={{ background: 'var(--accent-green)', border: 'none', color: '#000', padding: '0 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>➔</button>
      </form>
    </div>
  );

  return (
    <div className={`app-container ${lang === 'ar' ? 'rtl' : ''}`}>

      <div className="header animated">
        <div className="logo">🛡️</div>
        <h1>NOVA GEN-U</h1>
      </div>

      <div className="compass-hud">
        <div className="compass-hud-needle" style={{ transform: `rotate(${-heading}deg)` }}>⬆</div>
        <div className="compass-hud-text">{dirStr} {Math.round(heading)}°</div>
      </div>

      {activeTab === 'home' && renderHome()}

      {activeTab === 'vault' && (
        <div className="overlay animated">
          <div className="overlay-title">{t('vault')}</div>
          <div className="dashboard-grid">
            {['farming', 'repairing', 'education', 'coding'].map(id => (
              <div key={id} className="grid-card" onClick={() => { setActiveTab('cat'); setSubTab(id); setExpandedId(null); }}>
                <div className="grid-icon">{
                  id === 'farming' ? '🌾' : id === 'repairing' ? '⚙️' : id === 'education' ? '🎓' : '💻'
                }</div>
                <span className="grid-label">{t(id)}</span>
              </div>
            ))}
          </div>
          <button className="btn" style={{ marginTop: '20px' }} onClick={() => setActiveTab('home')}>{t('back')}</button>
        </div>
      )}

      {activeTab === 'cat' && (
        <div className="overlay animated">
          <div className="overlay-title">{t(subTab)}</div>
          <div className="detail-list">
            {(SURVIVAL_CONTENT[subTab]?.[lang] || []).map((item, i) => (
              <div key={i} className="card" onClick={() => setExpandedId(expandedId === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>{item.title}</span>
                  <span style={{ color: 'var(--accent-green)' }}>{expandedId === i ? '▲' : '▼'}</span>
                </div>
                {expandedId === i && <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#fff' }}>{item.content}</p>}
              </div>
            ))}
          </div>
          <button className="btn" onClick={() => setActiveTab('home')}>{t('back')}</button>
        </div>
      )}

      {activeTab === 'emergency' && (
        <div className="overlay overlay-red animated">
          <div className="overlay-title">{t('emergency')}</div>
          {(!subTab || !EMERGENCY_TREES[lang][subTab]) ? (
            <div className="button-stack">
              <button className="btn" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }} onClick={() => { setSubTab('bleeding'); setCurrentNode('start'); }}>🩸 BLEEDING CONTROL</button>
              <button className="btn" onClick={() => alert("SOS SIGNALING...")}>🆘 BEACON SOS</button>
              <button className="btn btn-cancel" onClick={() => setActiveTab('home')}>{t('back')}</button>
            </div>
          ) : (
            <div className="decision-flow">
              <div style={{ background: '#300', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <strong>{EMERGENCY_TREES[lang][subTab].title}</strong>
              </div>
              <div style={{ fontSize: '1.2rem', marginBottom: '30px', textAlign: 'center' }}>{EMERGENCY_TREES[lang][subTab].nodes[currentNode].q}</div>
              <div className="decision-buttons">
                {EMERGENCY_TREES[lang][subTab].nodes[currentNode].type === 'END' ? (
                  <button className="btn" onClick={() => { setActiveTab('home'); setSubTab(null); }}>{t('done')}</button>
                ) : (
                  <>
                    <button className="btn btn-yes" onClick={() => setCurrentNode(EMERGENCY_TREES[lang][subTab].nodes[currentNode].yes)}>{t('yes')}</button>
                    <button className="btn btn-no" onClick={() => setCurrentNode(EMERGENCY_TREES[lang][subTab].nodes[currentNode].no)}>{t('no')}</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'nav' && (
        <div className="overlay animated">
          <div className="overlay-title">{t('survival_nav')}</div>

          <div className="lang-switcher-nav" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '15px' }}>
            {['en', 'ar', 'zh'].map(l => (
              <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          <div className="coords-box">
            {t('pos')}: {pos.lat.toFixed(4)}, {pos.lon.toFixed(4)}
          </div>
          <div id="map"></div>
          {nearestRescue && (
            <div className="card" style={{ borderColor: 'var(--accent-green)' }}>
              <div style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '0.75rem' }}>{t('nearest_civilization')}</div>
              <div style={{ fontSize: '1.1rem', margin: '5px 0' }}>{nearestRescue.point.name}</div>
              <div style={{ opacity: 0.7 }}>{t('dist')}: {nearestRescue.distance.toFixed(1)} km</div>
              {celestialInfo && (
                <div style={{ marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px' }}>
                  <div style={{ color: '#ffcc00', fontWeight: 'bold' }}>{t('celestial')}: {celestialInfo.star}</div>
                  <div style={{ fontSize: '0.85rem' }}>{celestialInfo.instruction}</div>
                </div>
              )}
            </div>
          )}
          <button className="btn" onClick={() => setActiveTab('home')}>{t('back')}</button>
        </div>
      )}

    </div>
  );
}

export default App;
