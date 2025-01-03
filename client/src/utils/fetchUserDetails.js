import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";

const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.userDetails,
        });
        return response.data;
    } catch (error) {
        console.log("Error fetching user details:", error);
    }
};

export default fetchUserDetails;