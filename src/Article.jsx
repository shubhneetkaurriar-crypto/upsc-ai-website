import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./App.css";

function Article() {

  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  async function fetchArticle() {

    const { data, error } = await supabase
      .from("upsc_notes")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (!error) {
      setArticle(data);
    }

    setLoading(false);

  }

  if (loading) return <p className="loading">Loading...</p>;

  if (!article) return <p className="loading">Article not found.</p>;

  function renderLine(line, index) {

    const text = line.trim();

    if (!text) return <br key={index} />;

    // Numbered Topics
    if (/^\d+\./.test(text)) {
      return (
        <div className="topic-card" key={index}>
          <h2>{text}</h2>
        </div>
      );
    }

    // Main Headings

    const headings = {
      "Why in News?": ["📰 Why in News?", "why"],
      "Key Points:": ["📌 Key Points", "key"],
      "Prelims Focus:": ["🎯 Prelims Focus", "prelims"],
      "Mains Link:": ["✍️ Mains Link", "mains"],
      "Keywords:": ["🔑 Keywords", "keywords"],
      "Why Important?": ["⭐ Why Important?", "important"],
      "Today's UPSC Revision Capsule:": ["📚 Today's UPSC Revision Capsule", "revision"]
    };

    if (headings[text]) {

      return (
        <div
          key={index}
          className={`section-title ${headings[text][1]}`}
        >
          {headings[text][0]}
        </div>
      );

    }

    // Keywords

    if (
      text.startsWith("#")
    ) {

      return (
        <span key={index} className="keyword-chip">

          {text}

        </span>
      );

    }

    // Bullet

    if (
      text.startsWith("-") ||
      text.startsWith("•") ||
      text.startsWith("✔")
    ) {

      return (
        <div className="bullet-item" key={index}>

          ✔ {text.replace(/^[-•✔]\s*/, "")}

        </div>
      );

    }

    // GS

    if (text.startsWith("GS-")) {

      return (
        <div className="gs-box" key={index}>

          {text}

        </div>
      );

    }

    return (

      <p className="article-text" key={index}>

        {text}

      </p>

    );

  }

  return (

    <div className="article-container">

      <div className="article-header">

        <div className="top-row">

          <span className="badge">

            {article.gs_paper}

          </span>

          <span className="importance">

            ⭐ {article.importance}/5

          </span>

        </div>

        <h1>

          {article.title}

        </h1>

        <p className="date">

          📅 {article.date}

        </p>

      </div>

      <div className="article-card">

        {article.full_content
          ?.split("\n")
          .map((line, index) => renderLine(line, index))}

      </div>

    </div>

  );

}

export default Article;
