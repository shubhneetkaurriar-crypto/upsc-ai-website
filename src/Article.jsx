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

    return text.split("\n").map((line, index)=>{


      if(line.includes("Why in News?")){

        return (
          <h3 className="article-heading news" key={index}>
            📰 Why in News?
          </h3>
        );

      }


      if(line.includes("Key Points:")){

        return (
          <h3 className="article-heading" key={index}>
            📌 Key Points
          </h3>
        );

      }


      if(line.includes("Prelims Focus:")){

        return (
          <h3 className="article-heading prelims" key={index}>
            🎯 Prelims Focus
          </h3>
        );

      }


      if(line.includes("Mains Link:")){

        return (
          <h3 className="article-heading mains" key={index}>
            ✍️ Mains Link
          </h3>
        );

      }


      if(line.includes("Keywords:")){

        return (
          <h3 className="article-heading keywords" key={index}>
            🔑 Keywords
          </h3>
        );

      }


      if(line.includes("Today's UPSC Revision Capsule")){

        return (
          <h2 className="revision-title" key={index}>
            📚 Today's UPSC Revision Capsule
          </h2>
        );

      }



      if(line.trim()===""){

        return <br key={index}/>;

      }



      return (

        <p key={index} className="article-text">

          {line}

        </p>

      );


    });

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
