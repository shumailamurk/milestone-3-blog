import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import ReviewBox from "@/app/components/reviews"; // Adjust the path based on your folder structure

interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  image: string;
}

// Fetch data for a single blog post using its slug
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const query = groq`*[_type == "post" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    "summary": summary,
    "image": image.asset->url
  }`;

  const post = await client.fetch(query, { slug });
  return post;
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const blog = await getBlogPost(params.slug);

    if (!blog) {
      return <div>Blog not found</div>;
    }

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-yellow-600">{blog.title}</h1>
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto mb-6 rounded-md"
        />
        <p className="text-gray-700 text-lg">{blog.summary}</p>

        {/* Add Review Box Below the Blog Content */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
          <ReviewBox />
        </div>
      </div>
    );
  } catch (error) {
    return <div>Error loading blog post</div>;
  }
}
