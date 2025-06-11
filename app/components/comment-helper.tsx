

export function getNameFromEmail(email?: string): string {
  if (!email) return "Anonymous";
  return email.split("@")[0];
}

export function getInitials(email?: string): string {
  if (!email) return "AN";
  const name = getNameFromEmail(email);
  const parts = name.split(/[._-]/);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SimpleAvatar = ({ initials }: { initials: string }) => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary/80">
    {initials}
  </div>
);

export default SimpleAvatar;
