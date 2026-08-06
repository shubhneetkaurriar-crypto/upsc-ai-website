import { useEffect, useState } from "react"
import "./App.css"
import { supabase } from "./supabaseClient"

function App() {

  const [notes, setNotes] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")


  useEffect(() => {

    const getNotes = async () => {

      const { data, error } = await supabase
        .from("upsc_notes")
        .select("*")
        .order("date", { ascending: false })


      if (error) {
        console.log(error)
      } 
      else {
        setNotes(data)
      }

    }

    getNotes()

  }, [])



  const filteredNotes = notes.filter(item => {

    const matchesGS =
      filter === "ALL" || item.gs_paper === filter


    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.notes?.toLowerCase().includes(search.toLowerCase())


    return matchesGS && matchesSearch

  })



  return (

    <div>

      <h1>🇮🇳 UPSC Current Affairs</h1>


      <input
        placeholder="Search current affairs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      <div>

        <button onClick={() => setFilter("ALL")}>
          ALL
        </button>

        <button onClick={() => setFilter("GS1")}>
          GS1
        </button>

        <button onClick={() => setFilter("GS2")}>
          GS2
        </button>

        <button onClick={() => setFilter("GS3")}>
          GS3
        </button>

        <button onClick={() => setFilter("GS4")}>
          GS4
        </button>

      </div>



      {
        filteredNotes.map((item) => (

          <div key={item.id}>

            <h2>
              {item.title}
            </h2>


            <p>
              📚 GS: {item.gs_paper}
            </p>


            <p>
              ⭐ Importance: {item.importance}/5
            </p>


            <p>
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
              Read Source
            </a>


            <hr />

          </div>

        ))
      }


    </div>

  )

}

export default App
