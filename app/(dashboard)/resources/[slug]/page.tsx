// app/(dashboard)/resources/[slug]/page.tsx
import Link from 'next/link';

export default async function ResourceSlugPage({ params }: { params: { slug: string } }) {
  // The error message is: "params should be awaited before using its properties."
  // Let's try to await the `params` object itself before destructuring or accessing its properties.

  const awaitedParams = await params; // Await the params object.
  const { slug } = awaitedParams;     // Then destructure from the (identically) resolved object.

  // Alternatively, and more concisely if the above works:
  // const { slug } = await params;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Resource Details for: <span className="text-blue-600">{slug}</span>
      </h1>
      <p className="mb-2">
        This is the detailed page for the resource with slug: <strong>{slug}</strong>.
      </p>
      <p>
        You would typically fetch specific data for this resource using the slug
        and display it here. For example:
      </p>
      {/*
      <pre className="bg-gray-100 p-2 rounded mt-2">
        <code>
          {`// Fetching data example:
async function getResourceData(slug) {
  // const res = await fetch(\`https://api.example.com/resources/\${slug}\`);
  // if (!res.ok) return null;
  // return res.json();
  return { id: slug, title: \`Title for \${slug}\`, content: "Some details..." };
}
const data = await getResourceData(slug);
// Then display data...`}
        </code>
      </pre>
      */}
      <Link href="/resources" className="text-blue-500 hover:underline mt-6 inline-block">
        ← Back to all resources
      </Link>
    </div>
  );
}