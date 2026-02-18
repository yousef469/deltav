export default function Sidebar({ activeMode }: { activeMode: string }) {
    const modes = [
        { id: 'chat', icon: '💬', label: 'AI Chat' },
        { id: '3d', icon: '🧊', label: '3D Viewer' },
        { id: 'sim', icon: '🔬', label: 'Simulations' },
        { id: 'image', icon: '🎨', label: 'Image Creation' },
        { id: 'demo', icon: '🚀', label: 'System Demo' },
        { id: 'video', icon: '🎬', label: 'Video Creation' },
        { id: '3dgen', icon: '🛠️', label: '3D Modeling' },
    ]

    return (
        <div className="sidebar">
            <div className="sidebar-nav">
                {modes.map(mode => (
                    <button
                        key={mode.id}
                        className={`sidebar-btn ${activeMode === mode.id ? 'active' : ''}`}
                    >
                        {mode.icon}
                        <span className="tooltip">{mode.label}</span>
                    </button>
                ))}
            </div>
            <div className="sidebar-bottom">
                <button className="sidebar-btn">
                    ⚙️
                    <span className="tooltip">Settings</span>
                </button>
            </div>
        </div>
    )
}
