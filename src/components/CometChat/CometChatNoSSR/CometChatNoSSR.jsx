"use client";

import React, { useEffect, useState } from "react";
import {
  CometChatConversations,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
  CometChatUsers,
  CometChatUIKit,
  UIKitSettingsBuilder,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { Plus, X } from "lucide-react";
import "./CometChatNoSSR.css";

const COMETCHAT_CONSTANTS = {
  APP_ID: process.env.NEXT_PUBLIC_COMETCHAT_APP_ID,
  REGION: process.env.NEXT_PUBLIC_COMETCHAT_REGION,
  AUTH_KEY: process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY,
};

const CometChatNoSSR = ({ currentUser }) => {
  const [isCometChatReady, setIsCometChatReady] = useState(false);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(undefined);
  const [selectedGroup, setSelectedGroup] = useState(undefined);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        if (!currentUser || !currentUser._id) {
           throw new Error("No user to login");
        }

        // Initialize UIKit locally to ensure it shares the same instance
        const UIKitSettings = new UIKitSettingsBuilder()
            .setAppId(COMETCHAT_CONSTANTS.APP_ID)
            .setRegion(COMETCHAT_CONSTANTS.REGION)
            .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
            .subscribePresenceForAllUsers()
            .build();

        await CometChatUIKit.init(UIKitSettings);
        console.log("CometChatUIKit initialized in component.");

        // Check Login
        const UID = currentUser._id;
        const name = currentUser.name || UID;
        const authKey = COMETCHAT_CONSTANTS.AUTH_KEY;
        
        let loggedInUser = await CometChat.getLoggedinUser();
        
        if (loggedInUser && loggedInUser.uid !== UID) {
            console.log("User mismatch, logging out...");
            await CometChatUIKit.logout();
            loggedInUser = null;
        }

        if (!loggedInUser) {
            try {
                await CometChat.login(UID, authKey);
                console.log("Login successful");
            } catch (loginErr) {
                if (loginErr?.code === "ERR_UID_NOT_FOUND") {
                    const user = new CometChat.User(UID);
                    user.setName(name);
                    await CometChat.createUser(user, authKey);
                    await CometChat.login(UID, authKey);
                } else {
                    throw loginErr;
                }
            }
        }
        
        // Final sanity check
        // We can't easily check getDataSource() as it might be internal or protected in TS, 
        // but verifying we are here means init didn't throw.

        if (isMounted) {
          setIsCometChatReady(true);
        }
      } catch (err) {
        console.error("Initialization failed:", err);
        if (isMounted) {
          setError(err.message);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleConversationClick = (item) => {
    console.log("Conversation item clicked:", item);
    
    // Extract the target entity (User or Group)
    let targetEntity = item;
    
    if (item.constructor.name === "Conversation" || item.conversationId) {
       // It's a Conversation object
       console.log("Identified as Conversation object");
       targetEntity = item.getConversationWith();
    }
    
    console.log("Target Entity:", targetEntity);

    // Reset both first to ensure clean switch
    setSelectedUser(undefined);
    setSelectedGroup(undefined);

    // Allow a small tick for state to clear (React batching usually handles this, but let's be explicit with logic)
    if (targetEntity.uid) { // User
      console.log("Setting Selected User:", targetEntity.uid);
      setSelectedUser(targetEntity);
    } else if (targetEntity.guid) { // Group
      console.log("Setting Selected Group:", targetEntity.guid);
      setSelectedGroup(targetEntity);
    } else {
        console.warn("Could not determine type of entity (no uid or guid):", targetEntity);
    }

    // Close user list if open
    setShowUserList(false);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full text-red-500 p-4">
        Error initializing chat: {error}
      </div>
    );
  }

  if (!isCometChatReady) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="conversations-with-messages">
      <div className="conversations-wrapper">
        <div className="cometchat-conversations-title flex justify-between items-center bg-white border-b border-gray-100 p-4">
            <span className="font-semibold text-lg text-gray-800">
                {showUserList ? "Available Chats" : "Start New Chat"}
            </span>
            <button 
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title={showUserList ? "Close" : "Start New Chat"}
            >
                {showUserList ? (
                    <X size={20} className="text-gray-600" />
                ) : (
                    <Plus size={20} className="text-primary" />
                )}
            </button>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
            {showUserList ? (
                <div className="absolute inset-0 bg-white z-10">
                     <CometChatUsers onItemClick={handleConversationClick} />
                </div>
            ) : (
                <CometChatConversations onItemClick={handleConversationClick} />
            )}
        </div>
      </div>

      <div className="messages-wrapper">
        {selectedUser || selectedGroup ? (
          <div key={selectedUser?.uid || selectedGroup?.guid} className="flex flex-col h-full w-full">
            <CometChatMessageHeader user={selectedUser} group={selectedGroup} />
            <CometChatMessageList 
                user={selectedUser} 
                group={selectedGroup}
                onError={(err) => console.error("MessageList Error:", err)} 
            />
            <CometChatMessageComposer user={selectedUser} group={selectedGroup} />
          </div>
        ) : (
          <div className="empty-conversation">
            <div className="text-gray-400">Select a conversation to start chatting</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CometChatNoSSR;
