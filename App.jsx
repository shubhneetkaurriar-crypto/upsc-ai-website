
import { useEffect, useState } from "react"
import "./App.css"

function App() {

  const [notes, setNotes] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("https://8000-m-s-kkb-euw4b2-kn3498dyqs00-b.europe-west4-2.prod.colab.dev/latest-notes")
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(error => console.log(error))
  }, [])

  const filteredNotes = notes.filter(item => {

    const matchesGS =
      filter === "ALL" || item.gs_paper === filter

    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.notes.toLowerCase().includes(search.toLowerCase())

    return matchesGS && matchesSearch
  })

  return (
    <div>

      <h1>🇮🇳 UPSC AI Current Affairs</h1>

      <input
        placeholder="Search current affairs..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

      <div>
        <button onClick={()=>setFilter("ALL")}>ALL</button>
        <button onClick={()=>setFilter("GS1")}>GS1</button>
        <button onClick={()=>setFilter("GS2")}>GS2</button>
        <button onClick={()=>setFilter("GS3")}>GS3</button>
        <button onClick={()=>setFilter("GS4")}>GS4</button>
      </div>

      {filteredNotes.map((item,index)=>(

        <div key={index}>

          <h2>{item.title}</h2>

          <p>GS: {item.gs_paper}</p>

          <p>⭐ {item.importance}/5</p>

          <p>{item.notes}</p>

          <hr/>

        </div>

      ))}

    </div>
  )
}

export default App
