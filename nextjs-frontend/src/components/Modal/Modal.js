import { useEffect } from "react";
import ReactPortal from "../ReactPortal";
import { MdClose } from "react-icons/md";

const Modal = ({ isOpen, handleClose, children, modalTitle }) => {
  useEffect(() => {
    const closeOnEscapeKey = (e) => (e.key === "Escape" ? handleClose() : null);
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
              {modalTitle ? (
                <h3 className="text-3xl font=semibold">{modalTitle}</h3>
              ) : ""}
              <span className="text-black h-6 w-6 text-2xl py-0">
                <MdClose onClick={handleClose} />
              </span>
            </div>
            <div className="relative p-6 flex-auto">{children}</div>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
};

export default Modal;
