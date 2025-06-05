"use server"

import { db } from "@/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";
import { CreditActivity, CreditPlan, UserCredit, PlanType } from "@/types/credit";
import { defaultCreditPlans } from "@/lib/db/schemas/credit.schema";

// Collection names
const USERS_CREDITS_COLLECTION = "userCredits";
const CREDIT_ACTIVITIES_COLLECTION = "creditActivities";
const CREDIT_PLANS_COLLECTION = "creditPlans";

/**
 * Get all available credit plans
 */
export async function getCreditPlans(): Promise<CreditPlan[]> {
  try {
    const plansRef = db.collection(CREDIT_PLANS_COLLECTION);
    const plansSnapshot = await plansRef.get();
    
    // If no plans exist in Firestore, return default plans
    if (plansSnapshot.empty) {
      return defaultCreditPlans;
    }
    
    // Return plans from Firestore
    return plansSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as CreditPlan[];
  } catch (error) {
    console.error("Error getting credit plans:", error);
    return defaultCreditPlans;
  }
}

/**
 * Get a specific credit plan by ID
 */
export async function getCreditPlan(planId: string): Promise<CreditPlan | null> {
  try {
    const planRef = db.collection(CREDIT_PLANS_COLLECTION).doc(planId);
    const planSnapshot = await planRef.get();
    
    if (!planSnapshot.exists) {
      // Return default plan if not found in Firestore
      const defaultPlan = defaultCreditPlans.find(plan => plan.id === planId);
      return defaultPlan || null;
    }
    
    return {
      ...planSnapshot.data(),
      id: planSnapshot.id
    } as CreditPlan;
  } catch (error) {
    console.error("Error getting credit plan:", error);
    return null;
  }
}

/**
 * Get user's current credit status
 */
export async function getUserCredits(userId: string): Promise<UserCredit | null> {
  try {
    const creditsRef = db.collection(USERS_CREDITS_COLLECTION);
    const snapshot = await creditsRef.where("userId", "==", userId).get();
    
    if (snapshot.empty) {
      return null;
    }
    
    // Return the first matching document
    const doc = snapshot.docs[0];
    return {
      ...doc.data(),
      id: doc.id,
      purchaseDate: doc.data().purchaseDate.toDate(),
      expirationDate: doc.data().expirationDate.toDate()
    } as UserCredit;
  } catch (error) {
    console.error("Error getting user credits:", error);
    return null;
  }
}

/**
 * Get user's credit activity history
 */
export async function getUserCreditActivity(userId: string, resultLimit = 10): Promise<CreditActivity[]> {
  try {
    const activitiesRef = db.collection(CREDIT_ACTIVITIES_COLLECTION);
    const activitiesSnapshot = await activitiesRef
      .where("userId", "==", userId)
      .orderBy("timestamp", "desc")
      .limit(resultLimit)
      .get();
    
    return activitiesSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      timestamp: doc.data().timestamp.toDate()
    })) as CreditActivity[];
  } catch (error) {
    console.error("Error getting user credit activity:", error);
    return [];
  }
}

/**
 * Purchase a credit plan for a user
 * Note: This does not handle actual payment processing - that will be handled separately
 */
export async function purchaseCreditPlan(userId: string, planId: string): Promise<UserCredit | null> {
  try {
    // Get the plan details
    const plan = await getCreditPlan(planId);
    if (!plan) {
      throw new Error("Invalid plan ID");
    }
    
    // Check if user already has credits
    const existingCredits = await getUserCredits(userId);
    const creditsId = existingCredits?.id || uuidv4();
    
    // Calculate new credits and minutes
    const totalCredits = plan.credits;
    const totalMinutes = plan.credits * plan.minutesPerCredit;
    
    // Calculate expiration date (2 months from now)
    const purchaseDate = new Date();
    const expirationDate = new Date(purchaseDate);
    expirationDate.setMonth(expirationDate.getMonth() + 2); // 2 months expiration
    
    // Create or update user credits
    const userCreditData: Omit<UserCredit, "id"> = {
      userId,
      totalCredits,
      remainingCredits: totalCredits,
      planType: planId as PlanType,
      totalMinutes,
      minutesUsed: 0,
      purchaseDate,
      expirationDate,
      freeSessionsRemaining: 2 // Both plans include 2 free sessions
    };
    
    // Save to Firestore
    const creditRef = db.collection(USERS_CREDITS_COLLECTION).doc(creditsId);
    await creditRef.set({
      ...userCreditData,
      purchaseDate: Timestamp.fromDate(userCreditData.purchaseDate),
      expirationDate: Timestamp.fromDate(userCreditData.expirationDate)
    }, { merge: true });
    
    // Record activity
    await addCreditActivity({
      userId,
      activityType: "purchase",
      title: `${plan.name} Purchase`,
      description: `${plan.credits} credits added to account`,
      creditsChange: plan.credits,
      timestamp: new Date()
    });
    
    // Return updated credits
    return {
      ...userCreditData,
      id: creditsId
    };
  } catch (error) {
    console.error("Error purchasing credit plan:", error);
    return null;
  }
}

/**
 * Consume credits for an interview
 */
export async function consumeCredits(
  userId: string, 
  interviewId: string, 
  creditsToConsume = 1,
  minutesUsed = 45
): Promise<boolean> {
  try {
    // Get user's current credits
    const userCredits = await getUserCredits(userId);
    if (!userCredits || userCredits.remainingCredits < creditsToConsume) {
      return false;
    }
    
    // Update credits
    const creditsRef = db.collection(USERS_CREDITS_COLLECTION).doc(userCredits.id);
    await creditsRef.update({
      remainingCredits: userCredits.remainingCredits - creditsToConsume,
      minutesUsed: userCredits.minutesUsed + minutesUsed
    });
    
    // Record activity
    await addCreditActivity({
      userId,
      activityType: "interview",
      title: "Interview Session",
      description: `Interview session - ${minutesUsed} minutes`,
      creditsChange: -creditsToConsume,
      minutesUsed,
      interviewId,
      timestamp: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error consuming credits:", error);
    return false;
  }
}

/**
 * Add credit activity record
 */
async function addCreditActivity(activity: Omit<CreditActivity, "id">): Promise<string | null> {
  try {
    const activitiesRef = db.collection(CREDIT_ACTIVITIES_COLLECTION);
    const docRef = await activitiesRef.add({
      ...activity,
      timestamp: Timestamp.fromDate(activity.timestamp)
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding credit activity:", error);
    return null;
  }
}

/**
 * Check if user has enough credits for an interview
 */
export async function hasEnoughCredits(userId: string, requiredCredits = 1): Promise<boolean> {
  try {
    const userCredits = await getUserCredits(userId);
    if (!userCredits) return false;
    
    // Check if credits have expired
    if (new Date() > userCredits.expirationDate) return false;
    
    return userCredits.remainingCredits >= requiredCredits;
  } catch (error) {
    console.error("Error checking credits:", error);
    return false;
  }
}

/**
 * Check if user has valid credits (either enough remaining or free sessions)
 */
export async function hasValidCredits(userId: string, requiredCredits = 1): Promise<{valid: boolean; hasFreeSession: boolean}> {
  try {
    const userCredits = await getUserCredits(userId);
    if (!userCredits) return { valid: false, hasFreeSession: false };
    
    // Check if credits have expired
    if (new Date() > userCredits.expirationDate) return { valid: false, hasFreeSession: false };
    
    const hasFreeSessions = userCredits.freeSessionsRemaining > 0;
    const hasRemainingCredits = userCredits.remainingCredits >= requiredCredits;
    
    return { 
      valid: hasFreeSessions || hasRemainingCredits,
      hasFreeSession: hasFreeSessions
    };
  } catch (error) {
    console.error("Error checking valid credits:", error);
    return { valid: false, hasFreeSession: false };
  }
}

/**
 * Consume a free session for a user
 */
export async function consumeFreeSession(userId: string): Promise<boolean> {
  try {
    const userCredits = await getUserCredits(userId);
    if (!userCredits || userCredits.freeSessionsRemaining <= 0) return false;
    
    // Update the document
    const creditsRef = db.collection(USERS_CREDITS_COLLECTION).doc(userCredits.id);
    await creditsRef.update({
      freeSessionsRemaining: userCredits.freeSessionsRemaining - 1
    });
    
    // Record the activity
    await addCreditActivity({
      userId,
      activityType: "interview",
      title: "Free Interview Session",
      description: `Free interview session used (${userCredits.freeSessionsRemaining - 1} remaining)`,
      creditsChange: 0, // No credits consumed
      timestamp: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error consuming free session:", error);
    return false;
  }
}
