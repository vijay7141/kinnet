export default function Sidebar() {
  return (
    <aside className="dash_sidebar">
       <img src="/logo_big.svg" alt="logo" className="logo" />

      <ul className="dash_menu">
        <li className="active"><img src="/icn/home_icn.svg" alt="" />Dashboard</li>
        <li><img src="/icn/referrals_icn.svg" alt="" />Referrals</li>
        <li><img src="/icn/messages_icn.svg" alt="" />Messages <span>2</span></li>
        <li><img src="/icn/channels_icn.svg" alt="" />Channels <span>7</span></li>
        <li><img src="/icn/webinar_icn.svg" alt="" />Webinar</li>
        <li><img src="/icn/recordings_icn.svg" alt="" />Recordings</li>
        <li><img src="/icn/settings_icn.svg" alt="" />Settings</li>
      </ul>

      <button className="dash_logout">Logout</button>
    </aside>
  );
}