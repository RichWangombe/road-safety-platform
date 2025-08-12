import { useAuth } from "../context/AuthContext";

/**
 * Simple RBAC hook that returns whether the current user has a given permission.
 * Permissions are hard-coded for now but can later be fetched from the API.
 *
 * @param {('move'|'edit'|'assign')} action – the action to check
 * @returns {boolean}
 */
export default function useCan(action) {
  const { user } = useAuth();
  const role = user?.role;

  const table = {
    move: [
      "admin",
      "program_manager",
      "regional_manager",
      "supervisor",
      "team_lead",
    ],
    edit: [
      "admin",
      "program_manager",
      "regional_manager",
      "supervisor",
      "team_lead",
    ],
    assign: ["admin", "program_manager", "regional_manager", "supervisor"],
  };

  return table[action]?.includes(role);
}
