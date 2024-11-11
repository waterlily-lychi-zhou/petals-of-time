function SettingsButton({ toggleSettings }) {
  return (
    <div>
      <button className='settings-button' onClick={toggleSettings}>
        Button
      </button>
    </div>
  );
}

export default SettingsButton;
