import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./App.css";


function Article() {

  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);


  async function fetchArticle() {

    const { data, error } = await supabase
      .from("upsc_notes")
      .select("*")
      .eq("id", Number(id))
      .single();


    if (error) {

      console.log(error);

    } else {

      setArticle(data);

    }

    setLoading(false);

  }


  useEffect(() => {

    fetchArticle();

  }, [id]);



  if (loading) {

    return <p>Loading...</p>;

  }


  if (!article) {

    return <p>Article not found</p>;

  }



  function formatContent(text) {

  const lines = text.split("\n");

  const elements = [];

  let sectionContent = [];

  let sectionTitle = null;
  let sectionClass = "";

  function pushSection() {

    if (!sectionTitle) {

      sectionContent.forEach((item, i) => {

  if (item.trim() === "") return;

  if (/^\d+\./.test(item.trim())) {

    elements.push(

      <h2 key={elements.length + "-" + i} className="topic-title">

        {item}

      </h2>

    );

    return;

  }

  elements.push(

    <p key={elements.length + "-" + i} className="article-text">

      {item}

    </p>

  );

});

      sectionContent = [];
      return;

    }

    elements.push(

      <div className="section-box" key={"section-" + elements.length}>

        <h3 className={`article-heading ${sectionClass}`}>

          {sectionTitle}

        </h3>

        {sectionContent.map((item, i) => {

          if (item.trim() === "") return null;

          if (
            item.startsWith("-") ||
            item.startsWith("•") ||
            item.startsWith("✔")
          ) {

            return (

              <li key={i} className="article-text">

                {item.replace(/^[-•✔]\s*/, "")}

              </li>

            );

          }

          if (/^\d+\./.test(item.trim())) {

  return (

    <h2 key={i} className="topic-title">

      {item}

    </h2>

  );

}

return (

  <p key={i} className="article-text">

    {item}

  </p>

);

        })}

      </div>

    );

    sectionContent = [];

  }

  lines.forEach((line) => {

    const t = line.trim();

    if (t === "Why in News?") {

      pushSection();

      sectionTitle = "📰 Why in News?";

      sectionClass = "news";

      return;

    }

    if (t === "Key Points:") {

      pushSection();

      sectionTitle = "📌 Key Points";

      sectionClass = "";

      return;

    }

    if (t === "Prelims Focus:") {

      pushSection();

      sectionTitle = "🎯 Prelims Focus";

      sectionClass = "prelims";

      return;

    }

    if (t === "Mains Link:") {

      pushSection();

      sectionTitle = "✍️ Mains Link";

      sectionClass = "mains";

      return;

    }

    if (t === "Keywords:") {

      pushSection();

      sectionTitle = "🔑 Keywords";

      sectionClass = "keywords";

      return;

    }

    if (t.includes("Today's UPSC Revision Capsule")) {

      pushSection();

      elements.push(

        <h2 className="revision-title" key={elements.length}>

          📚 Today's UPSC Revision Capsule

        </h2>

      );

      sectionTitle = null;

      return;

    }

    sectionContent.push(line);

  });

  pushSection();

  return elements;

}




  return (

    <div className="article-container">


      <div className="article-header">


        <h1>
          {article.title}
        </h1>


        <p>
          📅 {article.date}
        </p>


        <span className="gs-tag">

          {article.gs_paper}

        </span>


      </div>



      <div className="article-body">


        {formatContent(article.full_content)}


      </div>



    </div>

  );


}


export default Article;
