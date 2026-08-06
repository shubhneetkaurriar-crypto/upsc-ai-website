import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./Sidebar.css";


export default function Sidebar() {

  const [quote, setQuote] = useState(null);
  const [facts, setFacts] = useState([]);
  const [reports, setReports] = useState([]);

  const [openFact, setOpenFact] = useState(null);
  const [openReport, setOpenReport] = useState(null);



  useEffect(() => {

    async function fetchSidebarData() {


      // Quote

      const { data: quoteData } = await supabase
        .from("quotes")
        .select("*")
        .order("id", { ascending: false })
        .limit(1);


      setQuote(
        quoteData?.[0] || null
      );



      // Facts

      const { data: factsData } = await supabase
        .from("daily_facts")
        .select("*")
        .order("id", { ascending: false })
        .limit(5);


      setFacts(
        factsData || []
      );



      // Reports

      const { data: reportsData } = await supabase
        .from("reports")
        .select("*")
        .order("id", { ascending: false })
        .limit(3);


      setReports(
        reportsData || []
      );


    }


    fetchSidebarData();


  }, []);




  return (

    <div className="sidebar">


      {/* QUOTE */}

      <div className="sidebar-card">

        <h2>
          Daily Ethics Quote
        </h2>


        {quote && (

          <>
            <p className="quote">
              "{quote.quote}"
            </p>


            <p>
              <b>
                — {quote.author}
              </b>
            </p>


            <span>
              Theme: {quote.theme}
            </span>

          </>

        )}

      </div>




      {/* FACTS */}

      <div className="sidebar-card">

        <h2>
          Daily UPSC Facts
        </h2>


        {facts.length === 0 && (
          <p>
            No facts available yet.
          </p>
        )}



        {facts.map((item)=>(


          <div
            className="click-card"
            key={item.id}
            onClick={() =>
              setOpenFact(
                openFact === item.id
                ? null
                : item.id
              )
            }
          >

            <h3>
              {item.fact}
            </h3>


            <p>
              Subject: {item.subject}
            </p>



            {openFact === item.id && (

              <div>

                <p>
                  This fact is important for UPSC preparation under {item.subject}.
                </p>


                <p>
                  Date: {item.date}
                </p>

              </div>

            )}

          </div>


        ))}


      </div>





      {/* REPORTS */}


      <div className="sidebar-card">


        <h2>
          Important Reports
        </h2>



        {reports.map((item)=>(


          <div

            className="click-card"

            key={item.id}

            onClick={() =>
              setOpenReport(
                openReport === item.id
                ? null
                : item.id
              )
            }

          >


            <h3>
              {item.report_name}
            </h3>


            <p>
              Organisation: {item.organisation}
            </p>



            {openReport === item.id && (

              <div>

                <p>
                  {item.key_point}
                </p>


                <p>
                  Date: {item.date}
                </p>

              </div>

            )}


          </div>


        ))}


      </div>


    </div>

  );

        }
