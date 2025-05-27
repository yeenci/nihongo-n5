"use client"

export default function SharedResourcesPage() {}

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";

// // Example data structure for shared resources
// const mockResources = [
//   {
//     id: 1,
//     title: "N5 Grammar Tips to Remember",
//     description: "Key points to remember when studying N5 grammar...",
//     tags: ["tips", "theory"],
//     likes: 12,
//     link: "/resources/n5-grammar-tips",
//   },
//   {
//     id: 2,
//     title: "JLPT N5 Listening Practice",
//     description: "Daily listening audio practice for N5 learners...",
//     tags: ["listening", "practice"],
//     likes: 8,
//     link: "/resources/n5-listening-practice",
//   },
// ];

// export default function SharedResourcesPage() {
//   const [resources, setResources] = useState(mockResources);
//   const [showForm, setShowForm] = useState(false);
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     email: "",
//     tags: [] as string[],
//     file: null as File | null,
//   });

//   const allTags = ["tips", "theory", "example", "difference", "listening"];

//   function toggleTag(tag: string) {
//     setFormData((prev) => {
//       const tags = prev.tags.includes(tag)
//         ? prev.tags.filter((t) => t !== tag)
//         : [...prev.tags, tag];
//       return { ...prev, tags };
//     });
//   }

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     console.log("Submitted:", formData);
//     // Simulate upload
//     setResources((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         title: formData.title,
//         description: formData.description,
//         tags: formData.tags,
//         likes: 0,
//         link: "#",
//       },
//     ]);
//     setShowForm(false);
//     setFormData({ title: "", description: "", email: "", tags: [], file: null });
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4 space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">Shared N5 Resources</h1>
//         <Button onClick={() => setShowForm(!showForm)}>Share Your Resource</Button>
//       </div>

//       {showForm && (
//         <form onSubmit={handleSubmit} className="border rounded p-4 space-y-4 bg-gray-50">
//           <Input
//             placeholder="Title"
//             value={formData.title}
//             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//             required
//           />
//           <Textarea
//             placeholder="Description"
//             value={formData.description}
//             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             required
//           />
//           <Input
//             type="email"
//             placeholder="Your Email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             required
//           />
//           <div className="flex flex-wrap gap-3">
//             {allTags.map((tag) => (
//               <Label key={tag} className="flex items-center gap-2 cursor-pointer">
//                 <Checkbox
//                   checked={formData.tags.includes(tag)}
//                   onCheckedChange={() => toggleTag(tag)}
//                 />
//                 {tag}
//               </Label>
//             ))}
//           </div>
//           <Input
//             type="file"
//             onChange={(e) =>
//               setFormData({ ...formData, file: e.target.files ? e.target.files[0] : null })
//             }
//           />
//           <Button type="submit">Submit Resource</Button>
//         </form>
//       )}

//       {resources.map((res) => (
//         <Card key={res.id} className="hover:shadow-md">
//           <Link href={res.link}>
//             <CardContent className="p-4 space-y-2 cursor-pointer">
//               <h2 className="text-lg font-bold text-blue-600 hover:underline">
//                 {res.title}
//               </h2>
//               <p className="text-sm text-gray-600">{res.description}</p>
//               <div className="flex flex-wrap gap-2">
//                 {res.tags.map((tag) => (
//                   <Badge key={tag} variant="secondary">
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//               <p className="text-sm text-gray-500">👍 {res.likes} likes</p>
//             </CardContent>
//           </Link>
//         </Card>
//       ))}
//     </div>
//   );
// }
