import { useEffect, useState } from "react"
import "./App.css"
import { supabase } from "./supabaseClient"


function App() {

  const [notes,setNotes] = useState([])
  const [filter,setFilter] = useState("ALL")
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)


  useEffect(()=>{

    async function getNotes(){

      const {data,error}=await supabase
      .from("upsc_notes")
      .select("*")
      .order("date",{ascending:false})


      if(error){
        console.log(error)
      }
      else{
        setNotes(data || [])
      }

      setLoading(false)

    }


    getNotes()

  },[])



  const filteredNotes = notes.filter(item=>{

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
["ALL","GS1","GS2","GS3","GS4"].map(x=>(

<button

key={x}

className={filter===x?"active":""}

onClick={()=>setFilter(x)}

>

{x}

</button>

))
}

</div>



<div className="layout">



<main>


<h2 className="section-title">
📰 Today's Current Affairs
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
item.notes?.length>280
?
item.notes.substring(0,280)+"..."
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

<p>
"Great things are done by a series of small things brought together."
</p>

</div>



<div className="side-card">

<h3>
📌 Top 5 Facts
</h3>

<ul>

<li>Important reports</li>

<li>Government schemes</li>

<li>International organisations</li>

<li>Environment facts</li>

<li>Science updates</li>

</ul>

</div>



<div className="side-card">

<h3>
📊 Reports & Indices
</h3>

<p>
Daily important rankings and reports for prelims revision.
</p>

</div>


</aside>


</div>


</div>

)

}


export default App
