import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";

const COMETCHAT_CONSTANTS = {
  APP_ID: process.env.NEXT_PUBLIC_COMETCHAT_APP_ID,
  REGION: process.env.NEXT_PUBLIC_COMETCHAT_REGION,
  AUTH_KEY: process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY,
};

let initializationPromise = null;

export const initializeCometChatService = (currentUser) => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      if (!currentUser || !currentUser._id) {
        throw new Error("Application user not found. Cannot initialize chat.");
      }

      const UID = currentUser._id;
      const name = currentUser.name || UID;
      const authKey = COMETCHAT_CONSTANTS.AUTH_KEY;

      // 1. Initialize UIKit
      const UIKitSettings = new UIKitSettingsBuilder()
        .setAppId(COMETCHAT_CONSTANTS.APP_ID)
        .setRegion(COMETCHAT_CONSTANTS.REGION)
        .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
        .subscribePresenceForAllUsers()
        .build();

      await CometChatUIKit.init(UIKitSettings);
      console.log("CometChat Service: UI Kit Initialized");

      // 2. Check Login Status
      let loggedInUser = await CometChat.getLoggedinUser();

      // 3. Handle User Mismatch
      if (loggedInUser && loggedInUser.uid !== UID) {
        console.log(`CometChat Service: User mismatch (${loggedInUser.uid} vs ${UID}). Logging out.`);
        await CometChatUIKit.logout();
        loggedInUser = null;
      }

      // 4. Login or Create User
      if (!loggedInUser) {
        try {
          loggedInUser = await CometChat.login(UID, authKey);
          console.log("CometChat Service: Login Successful");
        } catch (loginError) {
          if (loginError?.code === "ERR_UID_NOT_FOUND" || loginError?.message?.includes("not found")) {
            console.log("CometChat Service: User not found, creating...");
            const userToCreate = new CometChat.User(UID);
            userToCreate.setName(name);
            await CometChat.createUser(userToCreate, authKey);
            loggedInUser = await CometChat.login(UID, authKey);
            console.log("CometChat Service: User created and logged in");
          } else {
            throw loginError;
          }
        }
      }

      return loggedInUser;
    } catch (error) {
      console.error("CometChat Service Initialization Error:", error);
      initializationPromise = null; // Reset promise on error so we can retry
      throw error;
    }
  })();

  return initializationPromise;
};

export const resetCometChatService = () => {
    initializationPromise = null;
};
