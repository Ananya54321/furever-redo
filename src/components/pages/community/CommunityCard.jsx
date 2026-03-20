import React from "react";
import { Users, MessageSquare, Shield } from "lucide-react";
import Link from "next/link";

export default function CommunityCard({ community, currentUser }) {
  if (!community) return null;

  const isAdmin =
    currentUser && community.admin && community.admin._id === currentUser._id;

  return (
    <Link href={`/community/${community._id}`}>
      <div className="group border-l-8 border-accent p-6 bg-ternary  transition-transform hover:transition-scale-105">
        <h3 className="text-xl font-medium text-accent">{community.name}</h3>
        <p className="text-secondary mt-2 text-sm">{community.description}</p>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-secondary">
              <MessageSquare size={16} />
              <span>{community.posts?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
