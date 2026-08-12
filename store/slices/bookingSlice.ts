import { Collection } from "@/types/api";
import { EstimatedVolume } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
    collectionId: string | null;
    collectionDate: string | null;

    selectedTime: string;

    tempLocation?: string;
    lat?: number;
    lng?: number;


    useFreeCollecte?: boolean;
    tempPhone?: string;

    //wasteType: "Plastique" | "Papier" | "Verre" | "Canettes" | "Mixte" | "Autre";
    wasteType: string;
    wasteTypeOther?: string | null;

    estimatedVolume: EstimatedVolume;
    estimatedVolumeOther?: string | null;

    collection: Collection | null;
}

const initialState: BookingState = {
    collectionId: "",
    collectionDate: "",

    wasteType: "Plastique",
    wasteTypeOther: '',
    tempLocation: "",

    lat: undefined,
    lng: undefined,
    selectedTime: "",

    useFreeCollecte: false,
    tempPhone: "",

    estimatedVolume: "Un sac (20-30L)",
    estimatedVolumeOther: "",

    collection: null,
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {

        // STEP 1
        setWasteType(state, action: PayloadAction<string>) {
            state.wasteType = action.payload;
        },

        setWasteTypeOther(state, action: PayloadAction<string>) {
            state.wasteTypeOther = action.payload;
        },


        // STEP 2 - COLLECTION
        setCollection(
            state,
            action: PayloadAction<Collection | null>
        ) {
            state.collection = action.payload;

            state.collectionId = action.payload?._id ?? "";
            state.collectionDate = action.payload?.date ?? "";
        },

        setCollectionId(state, action: PayloadAction<string>) {
            state.collectionId = action.payload;
        },

        setCollectionDate(state, action: PayloadAction<string>) {
            state.collectionDate = action.payload;
        },

        setSelectedTime(state, action: PayloadAction<string>) {
            state.selectedTime = action.payload;
        },


        // LOCATION
        setLocation(state, action: PayloadAction<string>) {
            state.tempLocation = action.payload;
        },

        setLatitude(state, action: PayloadAction<number | undefined>) {
            state.lat = action.payload;
        },

        setLongitude(state, action: PayloadAction<number | undefined>) {
            state.lng = action.payload;
        },

        // STEP 2 - VOLUME
        setEstimatedVolume(state, action: PayloadAction<EstimatedVolume>) {
            state.estimatedVolume = action.payload;
        },

        setEstimatedVolumeOther(state, action: PayloadAction<string>) {
            state.estimatedVolumeOther = action.payload;
        },

        setUseFreeCollecte(state, action: PayloadAction<boolean>) {
            state.useFreeCollecte = action.payload;
        },

        setTempPhone(state, action: PayloadAction<string>) {
            state.tempPhone = action.payload;
        }
    },
});

export const {
    setWasteType,
    setWasteTypeOther,
    setCollectionId,
    setCollectionDate,
    setSelectedTime,
    setLocation,
    setLatitude,
    setLongitude,
    setTempPhone,
    setEstimatedVolume,
    setEstimatedVolumeOther,
    setUseFreeCollecte,
    setCollection,
} = bookingSlice.actions;

export default bookingSlice.reducer;