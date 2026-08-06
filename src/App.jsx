import { useEffect, useState } from "react"
import "./App.css"
import { supabase } from "./supabaseClient"


function App() {

  const [notes, setNotes] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)


  useEffect(() => {

    async function loadNotes() {

      const { data, error } = await supabase
        .from("upsc_notes")
        .select("*")
        .order("date", { ascending: false })


      if (error) {

        console.log(error)

      } else {

        setNotes(data || [])

      }


      setLoading(false)

    }


    loadNotes()

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
          Daily Current Affairs • Made for Civil Services
        </p>

      </header>



      <input

        className="search"

        placeholder="🔍 Search current affairs..."

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
          Loading today's UPSC notes...
        </h3>


        :


        filteredNotes.length === 0 ?


        <h3 className="center">
          No current affairs found
        </h3>


        :


        filteredNotes.map((item)=>(


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

              {item.notes}

            </p>





            {
              item.source &&


              <a

                className="source-btn"

                href={item.source}

                target="_blank"

                rel="noreferrer"

              >

                Read Source →

              </a>

            }



          </div>


        ))


      }


    </div>

  )

}


export default App
