import { useEffect, useState } from "react"
import "./App.css"
import { supabase } from "./supabaseClient"


function App() {

  const [notes, setNotes] = useState([])
  const [quote, setQuote] = useState(null)
  const [facts, setFacts] = useState([])
  const [reports, setReports] = useState([])

  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)



  useEffect(() => {

    async function fetchData() {


      const notesData = await supabase
        .from("upsc_notes")
        .select("*")
        .order("date", { ascending:false })


      const quoteData = await supabase
        .from("quotes")
        .select("*")
        .order("date", { ascending:false })
        .limit(1)


      const factsData = await supabase
        .from("daily_facts")
        .select("*")
        .order("date", { ascending:false })
        .limit(5)


      const reportsData = await supabase
        .from("reports")
        .select("*")
        .order("date", { ascending:false })
        .limit(5)



      setNotes(notesData.data || [])

      setQuote(quoteData.data?.[0] || null)

      setFacts(factsData.data || [])

      setReports(reportsData.data || [])


      setLoading(false)

    }


    fetchData()

  }, [])



  const filteredNotes = notes.filter((item)=>{


    const gsMatch =
      filter==="ALL" ||
      item.gs_paper===filter



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

<h1>🇮🇳 UPSC Lens</h1>

<p>
Daily Current Affairs • UPSC Focused
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
["ALL","GS1","GS2","GS3","GS4"].map(item=>(

<button

key={item}

className={filter===item?"active":""}

onClick={()=>setFilter(item)}

>

{item}

</button>

))
}

</div>




<div className="layout">


<main>


<h2 className="section-title">
📰 Current Affairs
</h2>


{
loading ?

<p>Loading...</p>


:

filteredNotes.map(item=>(


<div className="card" key={item.id}>


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
item.notes.substring(0,300)+"..."
:
item.notes
}
</p>



<a

className="read"

href={item.source}

target="_blank"

rel="noreferrer"

>

Read More →

</a>



</div>


))


}



</main>





<aside>



<div className="side-card">

<h3>
💡 Quote of the Day
</h3>


{
quote &&

<p>
"{quote.quote}" 
<br/>
— {quote.author}
</p>

}


</div>





<div className="side-card">

<h3>
📌 Top Facts
</h3>


<ul>

{
facts.map(item=>(

<li key={item.id}>
{item.fact}
</li>

))
}

</ul>


</div>






<div className="side-card">

<h3>
📊 Reports & Indices
</h3>


<ul>

{
reports.map(item=>(

<li key={item.id}>

<b>{item.report_name}</b>
<br/>
{item.key_point}

</li>

))
}

</ul>


</div>



</aside>


</div>


</div>

)

}


export default App
