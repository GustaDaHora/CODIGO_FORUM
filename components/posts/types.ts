export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export interface PostCardProps {
  post: Post;
  onPostClick?: (postId: string) => void;
}
