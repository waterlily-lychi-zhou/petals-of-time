import { RiListSettingsLine } from "react-icons/ri";

function SettingsButton({ toggleSettings }) {
  return (
    <div>
      <button className='settings-button' onClick={toggleSettings}>
      <RiListSettingsLine style={{ color: 'white', fontSize: '24px' }}/>
        {/* <img
          src={settingsIcon}
          alt="Settings Icon"
          className="settings-icon"
        /> */}
      </button>
    </div>
  );
}

export default SettingsButton;
