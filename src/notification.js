import { Bounce, toast } from "react-toastify";


export const ToastSuccess = (message)=> {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
    
}

export const ToastError = (message)=> {
   const errorMessage = message || "Please try again"
  toast.error(`Error, ${errorMessage}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
        
}