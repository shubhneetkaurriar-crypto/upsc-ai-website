import { useEffect, useState } from "react"
import "./App.css"
import { supabase } from "./supabaseClient"
import Sidebar from "./Sidebar"
import logo from "./logo.png"


function App() {

  const [notes, setNotes] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)


  async function fetchNews() {

    try {

      const { data, error } = await supabase
        .from("upsc_notes")
        .select("*")
        .order("date", { ascending: false })


      if (error) {
        console.log(error)
      }


      setNotes(data || [])
      setLoading(false)

    }

    catch (err) {

      console.log(err)
      setLoading(false)

    }

  }


  useEffect(() => {

    fetchNews()


    const timer = setInterval(() => {

      fetchNews()

    }, 10800000)


    const channel = supabase
      .channel("news-update")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "upsc_notes"
        },
        () => {
          fetchNews()
        }
      )
      .subscribe()


    return () => {

      clearInterval(timer)

      supabase.removeChannel(channel)

    }

  }, [])


  /*
  ==========================================
  TODAY'S DATE
  ==========================================
  */

  const today = new Date().toISOString().split("T")[0]


  /*
  ==========================================
  FILTER CURRENT AFFAIRS
  ==========================================
  */

  const filteredNotes = notes.filter((item) => {


    /*
    GS FILTER

    ALL  → everything
    GS1  → only GS1
    GS2  → only GS2
    GS3  → only GS3
    GS4  → only GS4
    DAILY → all GS papers for today
    */

    const gsMatch =
      filter === "ALL" ||
      filter === "DAILY" ||
      item.gs_paper === filter


    /*
    DAILY CURRENT AFFAIRS PUNCH

    Only today's articles
    */

    const dailyMatch =
      filter !== "DAILY" ||
      item.date === today


    /*
    SEARCH
    */

    const searchMatch =
      item.title?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      item.notes?.toLowerCase()
        .includes(search.toLowerCase())


    return gsMatch && dailyMatch && searchMatch

  })


  return (

    <div className="app">


      {/* =====================================
          HEADER
      ===================================== */}

      <header className="header">

        <div className="brand">

          <img
            src={logo}
            alt="UPSC Lens Logo"
          />


          <div>

            <h1>
              UPSC Lens
            </h1>


            <p>
              Daily Current Affairs • UPSC Focused
            </p>

          </div>

        </div>

      </header>



      {/* =====================================
          SEARCH
      ===================================== */}

      <input

        className="search"

        placeholder={
          filter === "DAILY"
            ? "🔍 Search today's current affairs..."
            : "🔍 Search current affairs..."
        }

        value={search}

        onChange={(e) => setSearch(e.target.value)}

      />



      {/* =====================================
          MAIN TABS
      ===================================== */}

      <div className="filters">


        {
          [
            "ALL",
            "GS1",
            "GS2",
            "GS3",
            "GS4",
            "DAILY"
          ].map(item => (

            <button

              key={item}

              className={
                filter === item
                  ? "active"
                  : ""
              }

              onClick={() => setFilter(item)}

            >

              {
                item === "DAILY"
                  ? "📰 Daily Current Affairs Punch"
                  : item
              }

            </button>

          ))

        }


      </div>



      {/* =====================================
          PAGE TITLE
      ===================================== */}

      <h2 className="section-title">

        {
          filter === "DAILY"
            ? "📰 Daily Current Affairs Punch"
            : "📰 Current Affairs"
        }

      </h2>



      {
        filter === "DAILY" && (

          <div className="punch-intro">

            <h3>
              Today's UPSC Current Affairs
            </h3>

            <p>
              A concise collection of today's important
              current affairs for UPSC Civil Services preparation.
            </p>

            <span>
              📅 {today}
            </span>

          </div>

        )
      }



      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="layout">


        <main>


          {
            loading ?

              <p>
                Loading current affairs...
              </p>


              :


              filteredNotes.length === 0 ?

                <div className="empty-state">

                  <h3>
                    No current affairs found.
                  </h3>

                  <p>
                    There are no articles matching your
                    current selection.
                  </p>

                </div>


                :


                filteredNotes.map(item => (


                  <div
                    className="card"
                    key={item.id}
                  >


                    {/* TOP */}

                    <div className="top">


                      <span className="badge">

                        {item.gs_paper}

                      </span>


                      <span>

                        ⭐ {item.importance}/5

                      </span>


                    </div>



                    {/* TITLE */}

                    <h2>

                      {item.title}

                    </h2>



                    {/* DATE */}

                    <p className="date">

                      📅 {item.date}

                    </p>



                    {/* NOTES */}

                    <p>

                      {
                        item.notes?.length > 300

                          ?

                          item.notes.substring(0, 300) + "..."

                          :

                          item.notes
                      }

                    </p>



                    {/* READ MORE */}

                    <a

                      className="read"

                      href={
                        item.content_type === "internal"
                          ?
                          `/article/${item.id}`
                          :
                          item.source
                      }

                      target={
                        item.content_type === "internal"
                          ?
                          "_self"
                          :
                          "_blank"
                      }

                      rel="noreferrer"

                    >

                      Read More →

                    </a>


                  </div>


                ))

          }


        </main>


        {/* =====================================
            SIDEBAR
        ===================================== */}

        <Sidebar />


      </div>



      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="footer">

        <p>
          UPSC Lens
        </p>


        <p>
          AI-powered current affairs platform
          for Civil Services aspirants
        </p>


        <p>
          Founded by Shubhneet Kaur Riar
        </p>


        <p>
          © 2026 UPSC Lens. All Rights Reserved.
        </p>

      </footer>


    </div>

  )

}


export default App
