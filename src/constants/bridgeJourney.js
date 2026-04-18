/**
 * Stored on Firestore `membersData/{uid}.bridgeJourney` for segmentation (e.g. email to beginners only).
 * Keep these string values stable if you build exports or Cloud Functions against them.
 */
export const BRIDGE_JOURNEY_NEW = "new_to_bridge";
export const BRIDGE_JOURNEY_IMPROVING = "improving";

export const BRIDGE_JOURNEY_OPTIONS = [
  { value: BRIDGE_JOURNEY_NEW, label: "I'm new to bridge" },
  { value: BRIDGE_JOURNEY_IMPROVING, label: "I'm improving or returning to bridge" },
];

export function isValidBridgeJourney(value) {
  return value === BRIDGE_JOURNEY_NEW || value === BRIDGE_JOURNEY_IMPROVING;
}
