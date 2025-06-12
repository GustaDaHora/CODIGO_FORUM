import { formatDistanceToNow } from "date-fns";
import { PostCardProps } from "./types";

export const PostCard = ({ post, onPostClick }: PostCardProps) => {
  const handleClick = () => {
    if (onPostClick) {
      onPostClick(post.id);
    }
  };

  return (
    <article 
      className="p-4 bg-[#17191a] rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <h2 className="text-xl text-[#279B7B] font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-100 mb-4 line-clamp-3">{post.content}</p>
      <div className="text-sm text-gray-300 flex items-center justify-between">
        <span>By {post.author.name}</span>
        <time>{formatDistanceToNow(new Date(post.createdAt))} ago</time>
      </div>
    </article>
  );
};
