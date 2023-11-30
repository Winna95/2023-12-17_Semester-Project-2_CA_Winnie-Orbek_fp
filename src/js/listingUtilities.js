export function getSortedBids(listing) {
  return listing.bids.sort(
    (bid1, bid2) => new Date(bid2.created) - new Date(bid1.created),
  );
}
