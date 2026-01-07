import React from "react";

type Priest = {
  name: string;
  period?: string;
};

const parishPriests: Priest[] = [
  { name: "Rev.Fr.V.Mary George", period: "19.05.1961 – 06.12.1971" },
  { name: "Rev.Fr.A.P.Stephen", period: "06.12.1971 – 08.10.1975" },
  { name: "Rev.Fr.S.Servacius", period: "08.10.1975 – 03.01.1976" },
  { name: "Rev.Fr.A.Joseph Raj", period: "03.01.1976 – 25.05.1978" },
  { name: "Rev.Fr.S.Joseph", period: "25.05.1978 – 30.05.1982" },
  { name: "Rev.Fr.V.Maria James", period: "30.05.1982 – 13.05.1987" },
  { name: "Rev.Fr.R.Lawrence", period: "13.05.1987 – 20.05.1989" },
  { name: "Rev.Fr.S.M.Charles Borromeo", period: "20.05.1989 – 08.06.1992" },
  { name: "Rev.Fr.George Ponniah", period: "08.06.1992 – 12.06.1998" },
  { name: "Rev.Fr.J.R.Partic Xavier", period: "12.06.1998 – 25.06.2001" },
  { name: "Rev.Fr.M.David Michael", period: "25.06.2001 – 18.08.2001" },
  { name: "Rev.Fr.R.Lawrence", period: "18.08.2001 – 16.05.2002" },
  { name: "Rev.Fr.Antonyhas Stalin", period: "16.05.2002 – 12.03.2004" },
  { name: "Rev.Fr.Yesudasan Thomas", period: "12.03.2004 – 21.05.2004" },
  { name: "Rev.Fr.George Ponniah", period: "21.05.2004 – 26.06.2005" },
  { name: "Rev.Fr.M.Devasahayam", period: "26.06.2005 – 23.05.2010" },
  { name: "Rev.Fr.Perpetual Antony", period: "23.05.2010 – 24.06.2015" },
  { name: "Rev.Fr.A.Stephen", period: "24.06.2015 – 19.08.2020" },
  { name: "Rev.Fr.A.Michael George Bright", period: "19.08.2020 – 24.05.2025" },
  { name: "Rev.Fr.S.Leon Henson", period: "25.05.2025 – Now" },
];

const assistantPriests: Priest[] = [
  { name: "Rev.Fr.Francis De Sales", period: "07.12.1989 – 09.03.1990" },
  { name: "Rev.Fr.A.Gabriel", period: "11.05.1999 – 25.05.2001" },
  { name: "Rev.Fr.Yesudasan Thomas", period: "17.08.2003 – 12.03.2004" },
  { name: "Rev.Fr.Gnanaraj", period: "June 2012 – May 2013" },
  { name: "Rev.Fr.Antony Dhas", period: "June 2013 – May 2014" },
  { name: "Rev.Fr.Britto Raj", period: "June 2014 – May 2015" },
  { name: "Rev.Fr.Benhar", period: "04.10.2014 – 04.02.2015" },
  { name: "Rev.Fr.Benjamin", period: "05.02.2015 – 10.06.2015" },
  { name: "Rev.Fr.John Sibi", period: "10.06.2015 – 05.12.2015" },
  { name: "Rev.Fr.Ravi Godson Kennady", period: "05.12.2015 – 10.10.2017" },
  { name: "Rev.Fr.A.Michael George Bright", period: "12.10.2017 – 30.03.2018" },
  { name: "Rev.Fr.Gnana Sekaran", period: "03.05.2018 – 18.05.2019" },
  { name: "Rev.Fr.Maria Joseph Sibu", period: "09.05.2019 – 19.08.2020" },
];

const sonsOfSoil: Priest[] = [
  { name: "Rev.Fr.Kunju Micheal" },
  { name: "Rev.Fr.Jesudhasan" },
  { name: "Rev.Fr.Arul Nirmal" },
  { name: "Rev.Fr.Sahaya Felix" },
  { name: "Rev.Fr.S.Anbin Devasahayam" },
];

const deacons: Priest[] = [
  { name: "Dn.Saju", period: "10.09.2017 – 01.04.2018" },
  { name: "Dn.Sahaya Sunil", period: "09.09.2018 – 01.04.2019" },
  { name: "Dn.Jesu Pravin", period: "01.09.2024 – 01.04.2025" },
];

const Section = ({ title, data }: { title: string; data: Priest[] }) => (
  <div className="section-card">
    <h3>{title}</h3>
    <ul>
      {data.map((item, index) => (
        <li key={index}>
          <span>{item.name}</span>
          {item.period && <em>{item.period}</em>}
        </li>
      ))}
    </ul>
  </div>
);

const FathersPage: React.FC = () => {
  return (
    <div className="fathers-page">
      <h1>Fathers Information</h1>

      <div className="grid">
        <Section title="Assistant Parish Priests" data={assistantPriests} />
        <Section title="Parish Priests" data={parishPriests} />
        <Section title="Son of Soils" data={sonsOfSoil} />
        <Section title="Deacons" data={deacons} />
      </div>

      <style>{`
        .fathers-page {
          padding: 2.5rem 1.5rem;
          max-width: 1400px;
          margin: auto;
          font-family: "Inter", "Segoe UI", sans-serif;
          background: #f7faf7;
        }

        h1 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: #1f3d2b;
          border-left: 5px solid #2f6b3f;
          padding-left: 0.75rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.75rem;
        }

        .section-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border-top: 4px solid #2f6b3f;
        }

        .section-card h3 {
          margin-bottom: 1rem;
          font-size: 1.15rem;
          color: #2f6b3f;
          font-weight: 600;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.55rem 0;
          border-bottom: 1px dashed #e2e8e2;
          font-size: 0.9rem;
        }

        li:last-child {
          border-bottom: none;
        }

        li span {
          font-weight: 500;
          color: #1f2937;
        }

        li em {
          font-style: normal;
          font-size: 0.8rem;
          color: #6b7280;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          li {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FathersPage;
