/* eslint-disable prettier/prettier */
import { action, Action, persist, Thunk, thunk } from "easy-peasy";
import AppAsyncStorage from "../../Services/AsyncStorage";
import { GET_BARCODES, GET_CLOSURES } from "../../Apollo/Queries";
import { client } from "../../Apollo/apolloClient";
import { LINK_BARCODE, UNLINK_BARCODE } from "../../Apollo/Mutations";

const BarcodeModel =
// persist(
{
    barcodes: [],
    currentBarcodes: null,
    setBarcodes: action((state, payload) => {
        state.barcodes = payload;
    }),
    setCurrentBarcodes: action((state, payload) => {
        state.currentBarcodes = payload;
    }),
    fetchBarcodes: thunk(async (actions, payload, helpers) => {
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.mutate({
                mutation: GET_BARCODES,
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    },
                },
            });
            if (data?.appBarcode?.barcodes && Array.isArray(data?.appBarcode?.barcodes)) {
                actions.setBarcodes(data?.appBarcode?.barcodes);
            } else {
                throw new Error("Barcodes not found")
            }
        } catch (err) {
            console.log("Error fetchBarcodes", err.toString());
            throw new Error("Error fetchBarcodes", err.toString())
        }
    }),
    linkBarcode: thunk(async (actions, payload, helpers) => {
        const { type, id1, id2 } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.mutate({
                mutation: LINK_BARCODE,
                variables: { type, id1, id2 },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if (data?.linkAppBarcode?.barcodes && Array.isArray(data?.linkAppBarcode.barcodes)) {
                actions.setBarcodes(data.linkAppBarcode.barcodes);
            } else {
                throw new Error("Unable to link barcode")
            }
        } catch (err) {
            console.log("Error linkBarcode", err);
            throw new Error(err)
        }
    }),
    unLinkBarcode: thunk(async (actions, payload, helpers) => {
        const { barcode } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.mutate({
                mutation: UNLINK_BARCODE,
                variables: { barcode },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if (data?.unlinkAppBarcode?.barcodes && Array.isArray(data?.unlinkAppBarcode.barcodes)) {
                actions.setBarcodes(data.unlinkAppBarcode.barcodes);
            } else {
                throw new Error("Unable to unlink barcode")
            }
        } catch (err) {
            console.log("Error unLinkBarcodes", err.toString());
            throw new Error("Error unLinkBarcodes", err.toString())
        }
    }),
};
// {
//     allow: ['barcodes', 'currentBarcodes'],
//     deny: ['fetchBarcodes', 'setBarcodes', 'setCurrentBarcodes'],
//     storage: AppAsyncStorage,
// });

export default BarcodeModel;
