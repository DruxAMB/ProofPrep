"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: { uid: string; name: string; email: string; profileImage?: string }) {
  const { uid, name, email, profileImage } = params;

  try {
    // Check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return { success: true, message: "User already exists" };
    }

    // Save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      profileImage: profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=0D8ABC&color=fff&size=128&bold=true`,
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: "Failed to create user account" };
  }
}

export async function signIn(params: { email: string; idToken: string }) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return { success: false, message: "User not found" };
    }

    await setSessionCookie(idToken);
    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, message: "Authentication failed" };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}

// Define User type
type User = {
  id: string;
  name: string;
  email: string;
  profileImage: string;
};

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  
  if (!session?.value) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(session.value);
    const userRecord = await auth.getUser(decodedClaims.uid);
    
    // Get additional user data from Firestore
    const userDoc = await db.collection("users").doc(userRecord.uid).get();
    const userData = userDoc.data();

    return {
      id: userRecord.uid,
      name: userRecord.displayName || userData?.name || "User",
      email: userRecord.email || "",
      profileImage: userRecord.photoURL || userData?.profileImage || "",
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
