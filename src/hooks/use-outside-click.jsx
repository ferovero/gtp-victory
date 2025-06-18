// import { useEffect } from "react";
// const useOutsideClick = (elemRef, handlerFunction) => {
//   useEffect(() => {
//     document.onclick = (e) => {
//       if (!elemRef?.current || elemRef.current?.contains(e.target)) {
//         return;
//       } // ??this is returning iteslf so no execution made far if this condition true
//       console.log("Clicked HEre");
//       handlerFunction(e);
//     };
//   }, []);
// };

// export default useOutsideClick;

import { useEffect } from "react";

const useOutsideClick = (elemRef, handlerFunction) => {
  useEffect(() => {
    const listener = (e) => {
      if (!elemRef?.current || elemRef.current.contains(e.target)) {
        return;
      }
      handlerFunction(e);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, []);
};

export default useOutsideClick;
