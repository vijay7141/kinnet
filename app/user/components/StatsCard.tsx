const data = [
  { title: "Incoming", value: "12" },
  { title: "Claimed", value: "05" },
  { title: "In Review", value: "08" },
  { title: "Accepted", value: "02" },
  { title: "Confirmed", value: "24" },
];

export default function StatsCard() {
  return (
  <div className="dash_cards">
      {data.map((item, i) => (
        <div key={i} className="dash_card">
          <p>{item.title}</p>
          <h3>{item.value}</h3>
        </div>
      ))}
    </div>
  );
}