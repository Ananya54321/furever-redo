import { cookies } from "next/headers";
export const setCookie = async (token, userType) => {
  const cookieStore = await cookies();
  cookieStore.set(userType === "user" ? "userToken" : "sellerToken", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
  console.log("Cookie set");
};
