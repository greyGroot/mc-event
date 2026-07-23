import { db } from "@/lib/firebase";
import { Guest, RegistrationInput } from "@/types";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

/**
 * Saves a new guest registration into Firestore guests collection.
 * Generates a unique guest ID and sets default check-in status.
 * Gracefully handles runtime Firestore errors.
 */
export async function saveGuest(guestData: RegistrationInput): Promise<Guest> {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
  const id = `MC-VIP-${randomSuffix}`;
  const createdAt = new Date().toISOString();

  const guest: Guest = {
    id,
    firstName: guestData.firstName.trim(),
    lastName: guestData.lastName.trim(),
    company: guestData.company.trim(),
    position: guestData.position.trim(),
    email: guestData.email.trim(),
    createdAt,
    is_checked_in: false,
    checkedInAt: null,
  };

  try {
    const docRef = doc(db, "guests", guest.id);
    await setDoc(docRef, guest);
    console.log(`[Firestore] Successfully saved guest ${guest.id}`);
  } catch (error) {
    console.warn(`[Firestore Warning] Failed to save guest ${guest.id} to Firestore:`, error);
  }

  return guest;
}

/**
 * Retrieves a guest document from Firestore by guest ID.
 * Tries direct document lookup first, then queries by 'id' field as fallback.
 */
export async function getGuestById(guestId: string): Promise<Guest | null> {
  if (!guestId) return null;

  try {
    // 1. Direct document lookup by ID
    const docRef = doc(db, "guests", guestId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Guest;
    }

    // 2. Query fallback where id field matches
    const q = query(collection(db, "guests"), where("id", "==", guestId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      return docData as Guest;
    }
  } catch (error) {
    console.warn(`[Firestore Warning] Failed to retrieve guest ${guestId} from Firestore:`, error);
  }

  return null;
}

/**
 * Retrieves all registered guests from Firestore 'guests' collection.
 * Sorted by creation date descending (newest first).
 */
export async function getAllGuests(): Promise<Guest[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "guests"));
    const guests: Guest[] = [];
    querySnapshot.forEach((docSnap) => {
      guests.push(docSnap.data() as Guest);
    });

    guests.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return guests;
  } catch (error) {
    console.warn("[Firestore Warning] Failed to fetch all guests from Firestore:", error);
    return [];
  }
}

/**
 * Checks in a guest by updating their Firestore document.
 * Returns 404 if guest not found, 400 if already checked in, 200 if check-in successful.
 */
export async function checkInGuestInDb(guestId: string): Promise<{ status: number; data: import("@/types").CheckInResult }> {
  if (!guestId) {
    return {
      status: 404,
      data: { success: false, alreadyCheckedIn: false, guest: null, error: "Guest not found" },
    };
  }

  try {
    // Look up doc by ID directly first
    const docRef = doc(db, "guests", guestId);
    const docSnap = await getDoc(docRef);

    let targetRef = docRef;
    let guest: Guest | null = null;

    if (docSnap.exists()) {
      guest = docSnap.data() as Guest;
    } else {
      // Fallback query where id field matches guestId
      const q = query(collection(db, "guests"), where("id", "==", guestId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        targetRef = querySnapshot.docs[0].ref;
        guest = querySnapshot.docs[0].data() as Guest;
      }
    }

    if (!guest) {
      return {
        status: 404,
        data: { success: false, alreadyCheckedIn: false, guest: null, error: "Guest not found" },
      };
    }

    if (guest.is_checked_in) {
      return {
        status: 400,
        data: { success: false, alreadyCheckedIn: true, guest, error: "Guest already checked in" },
      };
    }

    const checkedInAt = new Date().toISOString();
    const updatedGuest: Guest = {
      ...guest,
      is_checked_in: true,
      checkedInAt,
    };

    await setDoc(targetRef, updatedGuest, { merge: true });
    console.log(`[Firestore] Checked in guest ${guestId} at ${checkedInAt}`);

    return {
      status: 200,
      data: { success: true, alreadyCheckedIn: false, guest: updatedGuest },
    };
  } catch (error) {
    console.error(`[Firestore Error] Checkin failed for guest ${guestId}:`, error);
    return {
      status: 500,
      data: { success: false, alreadyCheckedIn: false, guest: null, error: "Internal server error during check-in" },
    };
  }
}

