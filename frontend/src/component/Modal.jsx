import ReactModal from "react-modal";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "300px",
    width: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
export default function Modal({ type, isOpenModal, closeModal }) {
  return (
    <>
      <ReactModal
        isOpen={isOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="flex flex-col items-center justify-between">
        <h1 className="font-bold text-red-600 text-2xl mb-6">
          {type === "ok" ? "Thank you" : type}
        </h1>

        <button
          className={" text-white px-4 py-2 rounded bg-blue-500"}
          onClick={closeModal}
          >
          Ok
        </button>
            </div>
      </ReactModal>
    </>
  );
}
