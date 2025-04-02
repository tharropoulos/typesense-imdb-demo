import { OptimizedImage } from "@/components/optimized-image";

export interface Review {
  id: number;
  score: `${number}`;
  review: string;
  updated_at: Date;
  user: {
    id: number;
    username: string;
    profile_pic: string;
  };
}

function Reviews<T extends { reviews: Review[] }>({ medium }: { medium: T }) {
  if (medium.reviews.length === 0) {
    return <p>No reviews yet. Be the first to review this movie!</p>;
  }

  return (
    <div className="grid gap-4">
      {medium.reviews.map((review) => (
        <div key={review.id} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <OptimizedImage
                src={review.user.profile_pic}
                alt={`${review.user.username} profile picture`}
                loading="lazy"
                className="h-10 w-10 rounded-full border border-[#8b5cf6] p-0.5"
              />
              <h2 className="font-semibold">{review.user.username}</h2>
              <span> • </span>
              <h2 className="text-muted-foreground font-medium">{review.score}</h2>
            </div>
          </div>
          <p className="line-clamp-3">{review.review}</p>
        </div>
      ))}
    </div>
  );
}

export { Reviews };
