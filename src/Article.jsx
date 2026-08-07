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
      .eq("id", id)
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

  }, []);


  if (loading) {

    return <p>Loading...</p>;

  }


  if (!article) {

    return <p>Article not found</p>;

  }


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


      <main className="article-page">

        <h1>
          {article.title}
        </h1>


        <p
