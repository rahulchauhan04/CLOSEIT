import toast from "react-hot-toast"

const AxiosToastError = (error) => {
    console.error("Axios error:", error); // Log the error object
    toast.error(
        error?.response?.data?.message || error.message || "An unexpected error occurred"
    );
}

export default AxiosToastError;