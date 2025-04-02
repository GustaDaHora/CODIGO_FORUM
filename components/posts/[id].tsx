interface PostProps {
  id: number;
  title: string;
  content: string;
  author: { name: string };
  createdAt: string;
}

export default function Post({ id, title, content, author, createdAt }: PostProps) {
  return (
    <div className="post">
      <h2>{title}</h2>
      <p>{content}</p>
      <small>By {author.name} • {new Date(createdAt).toLocaleDateString()}</small>
    </div>
  );
}
