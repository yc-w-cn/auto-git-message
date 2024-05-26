import { useState } from "react";

/**
 * Custom hook to provide a mechanism for forcing component updates.
 * @returns {{
 *   forceUpdated: number,
 *   forceUpdated: number,
 *   forceUpdate: () => void
 * }}
 */
export default function useForceUpdate() {
  /**
   * Counter state to force component updates.
   * @type {number}
   */
  const [counter, setCounter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date().getTime());

  /**
   * The current value of the counter, representing the last update.
   * @type {number}
   */
  const forceUpdated = counter;

  /**
   * Function to force an update by incrementing the counter.
   * @function
   * @returns {void}
   */
  const forceUpdate = () => {
    setCounter((prevCounter) => prevCounter + 1);
    setLastUpdated(Date.now());
  };

  return {
    lastUpdated,
    forceUpdated,
    forceUpdate,
  };
}
