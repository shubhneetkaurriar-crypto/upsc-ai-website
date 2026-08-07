import { useEffect, useState } from "react"
import "./App.css"
import { supabase } from "./supabaseClient"
import Sidebar from "./Sidebar"
import logo from "./logo.png"


function App() {


  const [notes,setNotes] = useState([])
  const [filter,setFilter] = useState("ALL")
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)



  async function fetchNews(){

    try{

      const {data,error} = await supabase
      .from("upsc_notes")
      .select("*")
      .order("date",{ascending:false})


      if(error){
        console.log(error)
      }


      setNotes(data || [])

      setLoading(false)


    }
    catch(err){

      console.log(err)

      setLoading(false)

    }

  }



  useEffect(()=>{


    fetchNews()


    const timer=setInterval(()=>{

      fetchNews()

    },10800000)



    const channel=supabase
    .channel("news-update")
    .on(
      "postgres_changes",
      {
        event:"*",
        schema:"public",
        table:"upsc_notes"
      },
      ()=>{
        fetchNews()
      }
    )
    .subscribe()



    return ()=>{

      clearInterval(timer)

      supabase.removeChannel(channel)

    }


  },[])





  const filteredNotes = notes.filter((item)=>{


    const gsMatch =
    filter==="ALL" ||
    item.gs_paper===filter



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

className={
filter===item ? "active" : ""
}

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

<p>
Loading...
</p>


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





<Sidebar />





</div>



<footer className="footer">

<p>
UPSC Lens
</p>

<p>
AI-powered current affairs platform for Civil Services aspirants
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
