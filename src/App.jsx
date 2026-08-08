import { useEffect, useState } from "react"
import "./App.css"
import { supabase } from "./supabaseClient"
import Sidebar from "./Sidebar"
import logo from "./logo.png"


function App() {

  const [notes, setNotes] = useState([])

  const [activeTab, setActiveTab] = useState("HOME")

  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(true)

  const [visibleCount, setVisibleCount] = useState(6)

  const [archiveGS, setArchiveGS] = useState("ALL")

  const [archiveImportance, setArchiveImportance] = useState("ALL")

  const [openMonth, setOpenMonth] = useState(null)

  const [openDate, setOpenDate] = useState(null)



  /* ==========================================
     FETCH NEWS
  ========================================== */

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



  /* ==========================================
     INITIAL LOAD + AUTO REFRESH
  ========================================== */

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



  /* ==========================================
     TODAY'S DATE
  ========================================== */

  const today = new Date()
    .toISOString()
    .split("T")[0]



  /* ==========================================
     TODAY'S ARTICLES
  ========================================== */

  const todaysNotes = notes.filter(
    item => item.date === today
  )



  /* ==========================================
     SEARCH
  ========================================== */

  function matchesSearch(item) {

    const query = search.toLowerCase().trim()

    if (!query) {

      return true

    }


    return (

      item.title
        ?.toLowerCase()
        .includes(query)

      ||

      item.notes
        ?.toLowerCase()
        .includes(query)

    )

  }



  /* ==========================================
     HOME ARTICLES
  ========================================== */

  const homeNotes = todaysNotes
    .filter(matchesSearch)



  /* ==========================================
     GS ARTICLES
  ========================================== */

  const gsNotes = todaysNotes
    .filter(item => {

      return (
        item.gs_paper === activeTab &&
        matchesSearch(item)
      )

    })



  /* ==========================================
     DCAP
     COMPLETELY INDEPENDENT OF DATE
  ========================================== */

  const dcapNotes = notes
    .filter(item => {

      return (
        item.gs_paper === "DCAP" &&
        matchesSearch(item)
      )

    })



  /* ==========================================
     ARCHIVE ARTICLES
  ========================================== */

  const archiveNotes = notes
    .filter(item => {

      return item.date < today

    })
    .filter(matchesSearch)



  /* ==========================================
     ARCHIVE FILTERING
  ========================================== */

  const filteredArchives = archiveNotes
    .filter(item => {

      if (
        archiveGS !== "ALL" &&
        item.gs_paper !== archiveGS
      ) {

        return false

      }


      if (
        archiveImportance !== "ALL" &&
        String(item.importance) !== archiveImportance
      ) {

        return false

      }


      return true

    })



  /* ==========================================
     GROUP ARCHIVES BY MONTH
  ========================================== */

  const archiveMonths = {}


  filteredArchives.forEach(item => {

    if (!item.date) {

      return

    }


    const dateObject = new Date(item.date)


    const monthName = dateObject.toLocaleString(
      "en-IN",
      {
        month: "long",
        year: "numeric"
      }
    )


    if (!archiveMonths[monthName]) {

      archiveMonths[monthName] = []

    }


    archiveMonths[monthName].push(item)

  })



  /* ==========================================
     GROUP MONTH BY DATE
  ========================================== */

  Object.keys(archiveMonths).forEach(month => {

    const grouped = {}


    archiveMonths[month].forEach(item => {

      if (!grouped[item.date]) {

        grouped[item.date] = []

      }


      grouped[item.date].push(item)

    })


    archiveMonths[month] = grouped

  })



  /* ==========================================
     RESET MORE WHEN TAB CHANGES
  ========================================== */

  function changeTab(tab) {

    setActiveTab(tab)

    setVisibleCount(6)

    setSearch("")

  }



  /* ==========================================
     ARTICLE CARD
  ========================================== */

  function ArticleCard({ item }) {

    return (

      <div
        className="card"
        key={item.id}
      >


        <div className="top">

          <span className="badge">

            {item.gs_paper}

          </span>


          <span>

            ⭐ {item.importance}/5

          </span>

        </div>



        <h2>

          {item.title}

        </h2>



        <p className="date">

          📅 {item.date}

        </p>



        <p>

          {
            item.notes?.length > 300

              ?

              item.notes.substring(0, 300) + "..."

              :

              item.notes

          }

        </p>



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

    )

  }



  /* ==========================================
     SELECT CURRENT ARTICLES
  ========================================== */

  let currentArticles = []


  if (activeTab === "HOME") {

    currentArticles = homeNotes

  }

  else if (activeTab === "DCAP") {

    currentArticles = dcapNotes

  }

  else {

    currentArticles = gsNotes

  }



  /* ==========================================
     ARTICLES SHOWN
  ========================================== */

  const displayedArticles = currentArticles
    .slice(0, visibleCount)



  return (

    <div className="app">


      {/* ======================================
          HEADER
      ====================================== */}

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



      {/* ======================================
          NAVIGATION
      ====================================== */}

      <div className="filters">


        <button
          className={activeTab === "HOME" ? "active" : ""}
          onClick={() => changeTab("HOME")}
        >

          🏠 Home

        </button>


        <button
          className={activeTab === "GS1" ? "active" : ""}
          onClick={() => changeTab("GS1")}
        >

          GS1

        </button>


        <button
          className={activeTab === "GS2" ? "active" : ""}
          onClick={() => changeTab("GS2")}
        >

          GS2

        </button>


        <button
          className={activeTab === "GS3" ? "active" : ""}
          onClick={() => changeTab("GS3")}
        >

          GS3

        </button>


        <button
          className={activeTab === "GS4" ? "active" : ""}
          onClick={() => changeTab("GS4")}
        >

          GS4

        </button>


        <button
          className={activeTab === "DCAP" ? "active" : ""}
          onClick={() => changeTab("DCAP")}
        >

          📰 Daily Current Affairs Punch

        </button>


        <button
          className={activeTab === "ARCHIVES" ? "active" : ""}
          onClick={() => changeTab("ARCHIVES")}
        >

          📚 Archives

        </button>


      </div>



      {/* ======================================
          SEARCH
      ====================================== */}

      <input

        className="search"

        placeholder="🔍 Search current affairs..."

        value={search}

        onChange={(e) =>
          setSearch(e.target.value)
        }

      />



      {/* ======================================
          PAGE CONTENT
      ====================================== */}

      <div className="layout">


        <main>


          {/* ==================================
              ARCHIVES
          ================================== */}

          {

            activeTab === "ARCHIVES" ?

              <>

                <h2 className="section-title">

                  📚 Current Affairs Archives

                </h2>



                {/* ARCHIVE FILTERS */}

                <div className="filters">


                  <button
                    className={
                      archiveGS === "ALL"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setArchiveGS("ALL")
                    }
                  >

                    ALL

                  </button>


                  {
                    ["GS1", "GS2", "GS3", "GS4", "DCAP"]
                      .map(gs => (

                        <button
                          key={gs}
                          className={
                            archiveGS === gs
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setArchiveGS(gs)
                          }
                        >

                          {gs}

                        </button>

                      ))
                  }


                </div>



                <div className="filters">


                  {
                    ["ALL", "1", "2", "3", "4", "5"]
                      .map(level => (

                        <button
                          key={level}
                          className={
                            archiveImportance === level
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setArchiveImportance(level)
                          }
                        >

                          {
                            level === "ALL"
                              ? "All Importance"
                              : `⭐ ${level}`
                          }

                        </button>

                      ))
                  }


                </div>



                {
                  Object.keys(archiveMonths).length === 0

                    ?

                    <div className="empty-state">

                      <h3>
                        No archived articles found.
                      </h3>

                    </div>


                    :


                    Object.entries(archiveMonths)
                      .map(([month, dates]) => (

                        <div
                          className="section-box"
                          key={month}
                        >


                          <button

                            className="archive-month"

                            onClick={() =>
                              setOpenMonth(
                                openMonth === month
                                  ? null
                                  : month
                              )
                            }

                          >

                            📅 {month}

                            <span>
                              {openMonth === month
                                ? "▲"
                                : "▼"}
                            </span>

                          </button>



                          {

                            openMonth === month &&

                            Object.entries(dates)
                              .map(([date, articles]) => (

                                <div
                                  key={date}
                                  className="archive-date"
                                >


                                  <button

                                    className="archive-date-button"

                                    onClick={() =>
                                      setOpenDate(
                                        openDate === date
                                          ? null
                                          : date
                                      )
                                    }

                                  >

                                    📌 {date}

                                    <span>
                                      {articles.length} articles
                                    </span>

                                  </button>



                                  {

                                    openDate === date &&

                                    articles.map(item => (

                                      <ArticleCard
                                        key={item.id}
                                        item={item}
                                      />

                                    ))

                                  }


                                </div>

                              ))

                          }


                        </div>

                      ))

                }


              </>



              :


              /* ==================================
                 NORMAL TABS
              ================================== */

              <>


                <h2 className="section-title">

                  {

                    activeTab === "HOME"

                      ?

                      "📰 Today's Current Affairs"

                      :

                    activeTab === "DCAP"

                      ?

                      "📰 Daily Current Affairs Punch"

                      :

                      `${activeTab} Current Affairs`

                  }

                </h2>



                {

                  loading

                    ?

                    <p>
                      Loading...
                    </p>


                    :


                  displayedArticles.length === 0

                    ?

                    <div className="empty-state">

                      <h3>
                        No current affairs found.
                      </h3>


                      <p>

                        {
                          activeTab === "HOME"

                            ?

                            "Today's articles have not been fetched yet."

                            :

                          activeTab === "DCAP"

                            ?

                            "No articles have been marked DCAP yet."

                            :

                            `No ${activeTab} articles found for today.`

                        }

                      </p>

                    </div>


                    :


                    displayedArticles.map(item => (

                      <ArticleCard
                        key={item.id}
                        item={item}
                      />

                    ))

                }



                {/* MORE */}

                {

                  visibleCount < currentArticles.length &&

                  <button

                    className="more-button"

                    onClick={() =>
                      setVisibleCount(
                        visibleCount + 6
                      )
                    }

                  >

                    More →

                  </button>

                }


              </>

          }


        </main>



        <Sidebar />


      </div>



      {/* ======================================
          FOOTER
      ====================================== */}

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
