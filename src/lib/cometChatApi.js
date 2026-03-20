export async function createCometChatUser(uid, name) {
  const appId = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID;
  const region = process.env.NEXT_PUBLIC_COMETCHAT_REGION;
  const authKey = process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY; // Note: Ensure this key has permissions to create users (API Key) or use Restricted Key

  if (!appId || !region || !authKey) {
    console.error("CometChat Env variables missing");
    return;
  }

  const url = `https://${appId}.api-${region}.cometchat.io/v3/users`;
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      apikey: authKey
    },
    body: JSON.stringify({
      uid: uid,
      name: name
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (data.data) {
      console.log("CometChat User Created (Server-side):", data.data);
      return data.data;
    } else {
        // If error code is ERR_UID_ALREADY_EXISTS, that's fine, we can treat it as success or ignore
        if (data.error && data.error.code === "ERR_UID_ALREADY_EXISTS") {
             console.log("CometChat User already exists (Server-side):", uid);
             return { uid, name }; 
        }
      console.error("CometChat User Creation Failed (Server-side):", data);
      throw new Error(data.message || "Failed to create CometChat user");
    }
  } catch (err) {
    console.error("CometChat API Error:", err);
    // We ideally shouldn't block the main registration if chat fails, 
    // but logging it is critical.
  }
}
