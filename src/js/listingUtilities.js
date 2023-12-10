/**
 * Returns a new array of bids sorted by creation date in descending order.
 *
 * @param {object} listing - The listing object containing bids.
 * @returns {Array} A new array of bids sorted by creation date in descending order.
 */
export function getSortedBids(listing) {
  return listing.bids.sort(
    (bid1, bid2) => new Date(bid2.created) - new Date(bid1.created),
  );
}
