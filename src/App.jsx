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
  FILTER CURRENT AFFAIRS
  ==========================================
  */

  const filteredNotes = notes.filter((item) => {


    /*
    ALL
    → Shows every article

    GS1
    → Shows only GS1

    GS2
    → Shows only GS2

    GS3
    → Shows only GS3

    GS4
    → Shows only GS4

    DCAP
    → Shows only manually added
      Daily Current Affairs Punch articles
    */


    const gsMatch =
      filter === "ALL" ||
      item.gs_paper === filter



    /*
    SEARCH
    */

    const searchMatch =
      item.title?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      item.notes?.toLowerCase()
        .includes(search.toLowerCase())



    return gsMatch && searchMatch

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
          filter === "DCAP"
            ? "🔍 Search Daily Current Affairs Punch..."
            : "🔍 Search current affairs..."
        }

        value={search}

        onChange={(e) => setSearch(e.target.value)}

      />





      {/* =====================================
          FILTER TABS
      ===================================== */}

      <div className="filters">


        {
          [
            "ALL",
            "GS1",
            "GS2",
            "GS3",
            "GS4",
            "DCAP"
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
                item === "DCAP"
                  ? "📰 Daily Current Affairs Punch"
                  : item
              }


            </button>


          ))
        }


      </div>





      {/* =====================================
          SECTION TITLE
      ===================================== */}

      <h2 className="section-title">


        {
          filter === "DCAP"
            ? "📰 Daily Current Affairs Punch"
            : "📰 Current Affairs"
        }


      </h2>





      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="layout">


        <main>


          {


            loading ?


              <p>
                Loading...
              </p>


              :


              filteredNotes.length === 0 ?


                <div className="empty-state">

                  <h3>
                    No current affairs found.
                  </h3>

                  <p>
                    Add an article with
                    <strong> DCAP </strong>
                    in the gs_paper column of Supabase
                    to display it here.
                  </p>

                </div>


                :


                filteredNotes.map(item => (


                  <div
                    className="card"
                    key={item.id}
                  >



                    {/* =========================
                        TOP
                    ========================= */}


                    <div className="top">


                      <span className="badge">

                        {item.gs_paper}

                      </span>


                      <span>

                        ⭐ {item.importance}/5

                      </span>


                    </div>



                    {/* =========================
                        TITLE
                    ========================= */}


                    <h2>

                      {item.title}

                    </h2>



                    {/* =========================
                        DATE
                    ========================= */}


                    <p className="date">

                      📅 {item.date}

                    </p>



                    {/* =========================
                        NOTES
                    ========================= */}


                    <p>


                      {

                        item.notes?.length > 300

                          ?

                          item.notes.substring(0, 300) + "..."

                          :

                          item.notes

                      }


                    </p>



                    {/* =========================
                        READ MORE
                    ========================= */}


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
