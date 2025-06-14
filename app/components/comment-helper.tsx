
// In src/app/components/simple-avatar.tsx (or your helper file)

// Update the capitalizeName function to accept null
export function capitalizeName(name?: string | null): string {
  if (!name || name.length === 0) {
    return "User"; // This check now correctly handles undefined, null, and ""
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// You should also update your other helpers to be consistent and safe
export function getNameFromEmail(email?: string | null): string {
  if (!email) return "Anonymous";
  return email.split("@")[0];
}

export function getInitials(email?: string | null): string {
  if (!email) return "AN";
  // Since getNameFromEmail is now safe, this function is also safe.
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
