import '../styles/SettingsPanel.css'

interface SettingsPanelProps {
  onClose: () => void
}

const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Settings</h2>
        <button onClick={onClose}>×</button>
      </div>
      <div className="settings-content">
        <div className="setting-item">
          <label>Camera Resolution</label>
          <select>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="setting-item">
          <label>Paint Finish</label>
          <select>
            <option value="matte">Matte</option>
            <option value="satin">Satin</option>
            <option value="gloss">Gloss</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel 