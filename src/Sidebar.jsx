import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Sidebar() {

  const [quote, setQuote] = useState(null);
  const [facts, setFacts] = useState([]);
  const [reports, setReports] = useState([]);


  useEffect(() => {

    async function fetchSidebarData() {


      const { data: quoteData } = await supabase
        .from("quotes")
        .select("*")
        .order("id", { ascending:false })
        .limit(1);

      setQuote(quoteData?.[0]);


      const { data: factsData } = await supabase
        .from("daily_facts")
        .select("*")
        .order("id", { ascending:false })
        .limit(5);

      setFacts(factsData || []);


      const { data: reportsData } = await supabase
        .from("reports")
        .select("*")
        .order("id", { ascending:false })
        .limit(3);

      setReports(reportsData || []);

    }


    fetchSidebarData();


  }, []);



  return (

    <div>

      <h2>Daily Ethics Quote</h2>

      <p>
        {quote?.quote}
      </p>

      <h2>Daily Facts</h2>

      {facts.map((item)=>(
        <p key={item.id}>
          {item.fact}
        </p>
      ))}


      <h2>Reports</h2>

      {reports.map((item)=>(
        <p key={item.id}>
          {item.report_name}
        </p>
      ))}


    </div>

  );
  }
