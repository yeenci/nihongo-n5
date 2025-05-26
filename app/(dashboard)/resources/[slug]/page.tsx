// app/resources/[slug]/page.tsx

export default function ResourceSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <div>
      <h1>Resource Details for: {slug}</h1>
      <p>Content for the resource identified by &quot;{slug}&quot; would go here.</p>
    </div>
  );
}