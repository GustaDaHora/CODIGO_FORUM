export const dynamic = "force-dynamic";
import "./index.css";

import Post from "@/components/posts";

export default function Main() {
  return (
    <main className="mainTag">
      <aside>
        <header>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
          assumenda quasi, ipsam laboriosam eligendi quo est voluptatibus eaque
          officia laudantium corporis excepturi, non eveniet asperiores
          voluptates veniam similique suscipit quis.
        </header>
      </aside>
      <div className="mainDiv">
        <Post />
      </div>
      <section>
        <header>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
          assumenda quasi, ipsam laboriosam eligendi quo est voluptatibus eaque
          officia laudantium corporis excepturi, non eveniet asperiores
          voluptates veniam similique suscipit quis.
        </header>
      </section>
    </main>
  );
}
