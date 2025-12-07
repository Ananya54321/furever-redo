"use client";
import React, { useEffect, useState } from "react";
import { getUserByToken, getToken } from "../../../actions/userActions";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

// Dynamically import CometChat component with SSR disabled
const CometChatNoSSR = dynamic(
  () => import("@/components/CometChat/CometChatNoSSR/CometChatNoSSR"),
  { ssr: false }
);

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true; 

    const authenticateUser = async () => {
      if (typeof window === "undefined") return;

      try {
        // Get user token from cookies
        let userToken = await getToken("userToken");
        let userType = "user";

        // If no user token, check for seller token
        if (!userToken) {
          userToken = await getToken("sellerToken");
          userType = "seller";
        }

        console.log(`Token found (${userType}):`, userToken);

        if (!userToken) {
          console.log("No authentication token found");
          if (isMounted) {
            setError("Please log in to access chat");
            setLoading(false);
          }
          return;
        }

        // Get user data using token
        const res = await getUserByToken(userToken, userType);
        console.log("User data:", res.user);

        if (!res.success) {
           // If request returned success: false, it's a genuine error.
           // We can throw here to be caught below, or handle directly.
           throw new Error(res.message || "Failed to authenticate user");
        }

        if (isMounted) {
          setUser(res.user);
          setLoading(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        if (isMounted) {
          setError("Authentication failed: " + error.message);
          setLoading(false);
        }
      }
    };

    // Check authentication on component mount
    authenticateUser();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Render loading state
  if (loading) {
    return <div className="chat-loading">Authenticating user...</div>;
  }

  // Render error state
  if (error) {
    return <div className="chat-error">Error: {error}</div>;
  }

  // Render chat component when user is authenticated
  return (
    <div style={{ height: "calc(100vh - 80px)", width: "100%" }} className="flex flex-col">
      {user ? (
        <CometChatNoSSR currentUser={user} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Please log in to access the chat feature
        </div>
      )}
    </div>
  );
};

export default Page;
