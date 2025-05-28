import { db } from "@/firebase/client";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, limit, Timestamp, addDoc } from "firebase/firestore";
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
    const plansRef = collection(db, CREDIT_PLANS_COLLECTION);
    const plansSnapshot = await getDocs(plansRef);
    
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
    const planRef = doc(db, CREDIT_PLANS_COLLECTION, planId);
    const planSnapshot = await getDoc(planRef);
    
    if (!planSnapshot.exists()) {
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
    const creditsRef = collection(db, USERS_CREDITS_COLLECTION);
    const q = query(creditsRef, where("userId", "==", userId));
    const creditsSnapshot = await getDocs(q);
    
    if (creditsSnapshot.empty) {
      return null;
    }
    
    const creditDoc = creditsSnapshot.docs[0];
    return {
      ...creditDoc.data(),
      id: creditDoc.id,
      purchaseDate: creditDoc.data().purchaseDate.toDate()
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
    const activitiesRef = collection(db, CREDIT_ACTIVITIES_COLLECTION);
    const q = query(
      activitiesRef, 
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(resultLimit)
    );
    
    const activitiesSnapshot = await getDocs(q);
    
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
    
    // Create or update user credits
    const userCreditData: Omit<UserCredit, "id"> = {
      userId,
      totalCredits,
      remainingCredits: totalCredits,
      planType: planId as PlanType,
      totalMinutes,
      minutesUsed: 0,
      purchaseDate: new Date()
    };
    
    // Save to Firestore
    const creditRef = doc(db, USERS_CREDITS_COLLECTION, creditsId);
    await setDoc(creditRef, {
      ...userCreditData,
      purchaseDate: Timestamp.fromDate(userCreditData.purchaseDate)
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
    const creditsRef = doc(db, USERS_CREDITS_COLLECTION, userCredits.id);
    await updateDoc(creditsRef, {
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
    const activitiesRef = collection(db, CREDIT_ACTIVITIES_COLLECTION);
    const docRef = await addDoc(activitiesRef, {
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
    return !!userCredits && userCredits.remainingCredits >= requiredCredits;
  } catch (error) {
    console.error("Error checking credits:", error);
    return false;
  }
}
