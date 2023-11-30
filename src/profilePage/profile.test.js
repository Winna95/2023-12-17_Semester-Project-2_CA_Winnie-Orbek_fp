import {getSortedBids} from "../js/listingUtilities.js";


describe("The profile page", ()=> {

        it("show the value of the newest bid per listing", () => {
            const now = new Date()
            const somePreviousTime = new Date(now.getTime()-10)
            const someFutureTime = new Date(now.getTime()+10)
            const listing = {
                bids: [
                    {
                        amount: 1,
                        created: now
                    },
                    {
                        amount: 2,
                        created: someFutureTime
                    },
                    {
                        amount: 3,
                        created: somePreviousTime
                    }
                ]

            }
            expect(getSortedBids(listing)[0].amount).toEqual(2)
        })
    }


)