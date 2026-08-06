import { useEffect, useState } from "react"
import "./App.css"
import { supabase } from "./supabaseClient"

function App() {

  const [notes, setNotes] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)


  useEffect(() => {

    const fetchNotes = async () => {

      const { data, error } = await supabase
        .from("upsc_notes")
        .select("*")
        .order("date", { ascending: false })


      if (error) {
        console.log(error)
      } else {
        setNotes(data)
      }

      setLoading(false)
    }


    fetchNotes()

  }, [])



  const filteredNotes = notes.filter((item) => {

    const gsMatch =
      filter === "ALL" ||
      item.gs_paper === filter


    const searchMatch =
      item.title?.toLowerCase()
      .includes(search.toLowerCase()) ||

      item.notes?.toLowerCase()
      .includes(search.toLowerCase())


    return gsMatch && searchMatch

  })



  return (

    <div className="app">


      <header className="header">

        <h1>
          🇮🇳 UPSC Odyssey
        </h1>

        <p>
          Daily Current Affairs for Civil Services
        </p>

      </header>



      <input

        className="search"

        placeholder="Search topics..."

        value={search}

        onChange={(e)=>setSearch(e.target.value)}

      />



      <div className="filters">

        {
          ["ALL","GS1","GS2","GS3","GS4"]
          .map((item)=>(

            <button

              key={item}

              className={
                filter === item
                ? "active"
                : ""
              }

              onClick={()=>setFilter(item)}

            >

              {item}

            </button>

          ))
        }

      </div>



      {
        loading ?

        <h3 className="center">
          Loading current affairs...
        </h3>

        :

        filteredNotes.length === 0 ?

        <h3 className="center">
          No articles found
        </h3>

        :

        filteredNotes.map((item)=>(


          <article
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
              {item.notes}
            </p>



            <a

              href={item.source}

              target="_blank"

              rel="noreferrer"

            >

              Read Source →

            </a>


          </article>


        ))

      }


    </div>

  )

}


export default App
