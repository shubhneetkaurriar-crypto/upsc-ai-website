import { useEffect, useState } from "react"
import "./App.css"
import { supabase } from "./supabaseClient"


function App() {

  const [notes, setNotes] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)


  useEffect(() => {

    async function fetchNotes() {

      const { data, error } = await supabase
        .from("upsc_notes")
        .select("*")
        .order("date", { ascending: false })


      if(error){
        console.log(error)
      }
      else{
        setNotes(data || [])
      }


      setLoading(false)

    }


    fetchNotes()

  }, [])



  const filteredNotes = notes.filter(item => {

    const gs =
      filter === "ALL" ||
      item.gs_paper === filter


    const search =
      item.title?.toLowerCase()
      .includes(search.toLowerCase())


    return gs && search

  })



  return (

    <div className="app">


      <header className="header">

        <h1>
          🇮🇳 UPSC Lens
        </h1>

        <p>
          Daily Current Affairs • UPSC Focused
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
          ["ALL","GS1","GS2","GS3","GS4"].map(item=>(

            <button

              key={item}

              className={
                filter===item
                ?"active"
                :""
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
          Loading...
        </h3>


        :


        filteredNotes.map(item=>(


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

              {
                item.notes?.length > 250
                ?
                item.notes.substring(0,250)+"..."
                :
                item.notes
              }

            </p>



            <a

              className="source-btn"

              href={item.source}

              target="_blank"

              rel="noreferrer"

            >

              Read More →

            </a>



          </article>


        ))

      }


    </div>

  )

}


export default App
