"use client"
const Modal = ({ isOpen, setIsOpen, children }) => {
  return isOpen ? (
    <div className="modal_container" onClick={() => setIsOpen(false)}>
      {/* Bg Overlay */}
      <div className="model_bg_overlay"></div>
      <div className="modal_box" onClick={(e) => e.stopPropagation()}>
        {/* <div style={{ height: "14px" }}></div> */}
        <div>{children}</div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Modal;
