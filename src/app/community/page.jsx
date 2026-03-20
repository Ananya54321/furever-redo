import React from "react";
import Link from "next/link";
import { User, Users } from "lucide-react";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md text-center">
        <Users className="w-16 h-16 mx-auto mb-6 text-primary" />
        <h1 className="text-2xl font-bold text-primary mb-3">Communities</h1>
        <p className="text-secondary mb-8">
          Select a community to interact with:
        </p>
      </div>
    </div>
  );
};

export default Page;
