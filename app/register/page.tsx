import React from "react";
import Link from "next/link";

function Page() {
  return (
    <>
      <Link href="/login">
        Log In
      </Link>
      <form className="mt-10">
        <div>
          <p>Enter your email: </p>
          <input type="text" placeholder="name@example.com" />
        </div>
        <div>
          <p>Enter your password: </p>
          <input type="password" placeholder="••••••••" />
        </div>
        <div>
          <p>Confirm your password: </p>
          <input type="password" placeholder="••••••••" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Page;
