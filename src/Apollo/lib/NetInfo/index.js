/* eslint-disable prettier/prettier */
import { useContext } from "react";
import NetContext from "./Context";

const useNetInfoContext = props => {
    return useContext(NetContext);
};

export default useNetInfoContext;
