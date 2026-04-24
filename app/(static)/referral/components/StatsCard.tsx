import "bootstrap-icons/font/bootstrap-icons.css";
const data = [
  { title: "Incoming", value: "12", icon: "incoming_icn.svg" }, 
  { title: "Under Review", value: "08", icon: "inreview_icn.svg" },
  { title: "Accepted", value: "02", icon: "accepted_icn.svg" },
  { title: "Confirmed", value: "24", icon: "confirmed_icn.svg" },
];

export default function StatsCard() {
  return (
    <div className="dash_cards_area">
      {data.map((item, i) => (
        <div key={i} className="dash_single_card">
          
          <div className="dash_card_icon">
             <img src={`/icn/${item.icon}`} alt="" />
          </div>

          <p className="dash_card_title">{item.title}</p>
          <h3 className="dash_card_value">{item.value}</h3>

        </div>
      ))}
    </div>
  );
}