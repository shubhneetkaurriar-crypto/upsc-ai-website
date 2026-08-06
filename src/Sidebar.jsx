import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";


export default function Sidebar(){

const [quote,setQuote]=useState(null);
const [facts,setFacts]=useState([]);
const [reports,setReports]=useState([]);

const [factOpen,setFactOpen]=useState(null);
const [reportOpen,setReportOpen]=useState(null);


useEffect(()=>{

async function load(){

let {data:q}=await supabase
.from("quotes")
.select("*")
.order("id",{ascending:false})
.limit(1);

setQuote(q?.[0]);


let {data:f}=await supabase
.from("daily_facts")
.select("*")
.order("id",{ascending:false})
.limit(5);

setFacts(f || []);



let {data:r}=await supabase
.from("reports")
.select("*")
.order("id",{ascending:false})
.limit(3);

setReports(r || []);

}

load();

},[]);



return(

<div className="sidebar">


<h2>Daily Ethics Quote</h2>

{quote &&

<div className="card">

<p>
"{quote.quote}"
</p>

<b>
— {quote.author}
</b>

<p>
Theme: {quote.theme}
</p>

</div>

}



<h2>Daily Facts</h2>

{

facts.map(item=>(

<div
className="card"
key={item.id}
onClick={()=>setFactOpen(
factOpen===item.id?null:item.id
)}
>


<h4>
{item.fact}
</h4>

<p>
Subject: {item.subject}
</p>


{
factOpen===item.id &&

<p>
This topic is relevant for UPSC preparation under {item.subject}.
</p>

}


</div>

))

}




<h2>Important Reports</h2>


{

reports.map(item=>(

<div
className="card"
key={item.id}
onClick={()=>setReportOpen(
reportOpen===item.id?null:item.id
)}
>

<h4>
{item.report_name}
</h4>


<p>
Organisation: {item.organisation}
</p>


{
reportOpen===item.id &&

<p>
{item.key_point}
</p>

}


</div>


))

}


</div>

);

}
