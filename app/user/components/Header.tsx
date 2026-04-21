export default function Header() {
  return (
<div className="dash_header">
      <input
        className="dash_search"
        placeholder="Search patient, referral, or document..."
      />

      <div className="dash_header_right">
        <button className="dash_btn">+ New Referral</button>
        <p className="dash_user">Dr. Elena</p>
      </div>
    </div>
  );
}