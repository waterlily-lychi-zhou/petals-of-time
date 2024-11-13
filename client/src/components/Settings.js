import { useState } from "react";

function Settings ({ onSettingsChange, closeSettings }) {
  const [workPeriodInput, setWorkPeriodInput] = useState(0.1);
  const [breakPeriodInput, setBreakPeriodInput] = useState(1);
  const [longRestInput, setLongRestInput] = useState(1);
  const [sessionCountInput, setSessionCountInput] = useState(4);


  // TODO: pass data to Settings

  const handleSave = () => {
    onSettingsChange({
      workPeriod: workPeriodInput,
      breakPeriod: breakPeriodInput,
      longRest: longRestInput,
      sessionCount: sessionCountInput,
    })
    closeSettings(); // Close settings after saving
  }
  return (
    <div className="settings">
      <div>
        <label>Focus Period</label>
        <input
          type="number"
          value={workPeriodInput}
          onChange={(e) => setWorkPeriodInput(e.target.value)}
        />
        <span>mins</span>
      </div>
      <div>
        <label>Short Break</label>
        <input
          type="number"
          value={breakPeriodInput}
          onChange={(e) => setBreakPeriodInput(e.target.value)}
        />
        <span>mins</span>
      </div>
      <div>
        <label>Long Rest</label>
        <input
          type="number"
          value={longRestInput}
          onChange={(e) => setLongRestInput(e.target.value)}
        />
        <span>mins</span>
      </div>
      <div>
        <label>Before Long Rest</label>
        <input
          type="number"
          value={sessionCountInput}
          onChange={(e) => setSessionCountInput(e.target.value)}
        />
        <span>streaks</span>
      </div>
      <button onClick={handleSave}>Save</button>


    </div>
  )
}

export default Settings;