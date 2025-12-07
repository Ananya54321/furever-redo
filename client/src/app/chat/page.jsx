"use client";
import React, { useEffect, useState } from "react";
import { getUserByToken, getToken } from "../../../actions/userActions";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

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
        let userToken = await getToken("userToken");
        let userType = "user";

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

        const res = await getUserByToken(userToken, userType);
        console.log("User data:", res.user);

        if (!res.success) {
           throw new Error(res.message || "Failed to authenticate user");
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

    authenticateUser();

    return () => {
      isMounted = false;
    };
  }, []); 
  if (loading) {
    return <div className="chat-loading">Authenticating user...</div>;
  }

  if (error) {
    return <div className="chat-error">Error: {error}</div>;
  }

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
