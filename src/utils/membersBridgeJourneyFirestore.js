import { firebase } from "../firebase/config";
import { isValidBridgeJourney } from "../constants/bridgeJourney";

/** Fields merged onto `membersData/{uid}` when the user picks a journey segment. */
export function bridgeJourneyFirestoreFields(bridgeJourney) {
  if (!isValidBridgeJourney(bridgeJourney)) return {};
  return {
    bridgeJourney,
    bridgeJourneyCapturedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
}
