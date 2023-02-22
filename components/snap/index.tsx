import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

interface Props {}

const Snap: React.FC<Props> = (props) => {
  const imgRef = useRef<{
    src: string;
    alt: string;
  }>({
    src: "",
    alt: "",
  });
  const [previewImage, setPreviewImage] = useState<boolean>(false);
  const scrollRef = useRef<number[]>([]);
  const [dimm, setDimm] = useState<number[]>([]);
  const bodyTagRef = useRef<HTMLElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const actionBtnRef = useRef<HTMLButtonElement>();

  useEffect(() => {
    bodyTagRef.current = document.body;
  }, []);

  const disableScroll = () => {
    if (bodyTagRef.current) {
      bodyTagRef.current.addEventListener(
        "wheel",
        function(event) {
          if (previewImage) {
            event.preventDefault();
          } else {
            return;
          }
        },
        { passive: false }
      );

      // Disable scrolling using the directional keys
      bodyTagRef.current.addEventListener("keydown", function(event) {
        // Check if the arrow keys are pressed
        if (
          event.key === "ArrowUp" ||
          event.key === "ArrowDown" ||
          event.key === "ArrowLeft" ||
          event.key === "ArrowRight"
        ) {
          if (previewImage) {
            event.preventDefault();
          } else {
            return;
          }
        }
      });
    }
  };

  useEffect(() => {
    if (previewImage) {
      const canvas = canvasRef.current;

      canvas.width = dimm[0];
      canvas.height = dimm[1] - 2;

      const context = canvas.getContext("2d");

      context.strokeStyle = "#2F58CD";
      context.lineWidth = 4;

      const image = new Image();

      image.src = imgRef.current.src;

      context.strokeRect(0, 0, canvas.width, canvas.height);

      image.onload = () => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      bodyTagRef.current.style.visibility = "hidden";
      bodyTagRef.current.style.height = `${dimm[1]}px`;
      disableScroll();
    } else {
      bodyTagRef.current.style.visibility = "visible";
      bodyTagRef.current.style.height = `auto`;
      actionBtnRef.current.style.visibility = "visible";
      disableScroll();
    }
  }, [previewImage]);

  useEffect(() => {
    setDimm([window.innerWidth, window.innerHeight]);
    scrollRef.current = [window.scrollX, window.scrollY];

    window.addEventListener("resize", () => {
      setDimm([window.innerWidth, window.innerHeight]);
    });

    window.addEventListener("scroll", () => {
      scrollRef.current = [window.scrollX, window.scrollY];
    });

    return () => {
      window.removeEventListener("resize", () => {
        setDimm([window.innerWidth, window.innerHeight]);
      });

      window.removeEventListener("resize", () => {
        setDimm([window.scrollX, scrollY]);
      });
    };
  }, []);

  const captureScreenshot = () => {
    actionBtnRef.current.style.visibility = "hidden";
    html2canvas(bodyTagRef.current, {
      useCORS: true,
      allowTaint: true,
      logging: true,
      width: dimm[0],
      height: dimm[1],
      windowHeight: dimm[0],
      windowWidth: dimm[1],
      x: bodyTagRef.current.getBoundingClientRect().left,
      y: bodyTagRef.current.getBoundingClientRect().top,
    }).then((canvas) => {
      imgRef.current.src = canvas.toDataURL();
      imgRef.current.alt = `${new Date().getTime()}-snap`;
      console.log(canvas.toDataURL());
      setPreviewImage(true);
    });
  };

  return (
    <div className="snappy-container">
      <canvas
        ref={canvasRef}
        style={{
          zIndex: 999,
          visibility: previewImage ? "visible" : "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          border: "4px solid #2F58CD",
          borderRadius: "8px",
          overflow: "hidden",
          maxWidth: "100%",
        }}
      />
      <div className="action-btns">
        <button
          ref={actionBtnRef}
          className="action-btn"
          onClick={captureScreenshot}
        >
          <svg
            fill="none"
            stroke="currentColor"
            height={24}
            width={24}
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Snap;

//         {showCanvas && (
//           <button
//             className="action-btn"
//             onClick={() => {
//               setShowCanvas(false);
//             }}
//           >
//             <svg
//               fill="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//               aria-hidden="true"
//               height={24}
//               width={24}
//             >
//               <path
//                 clipRule="evenodd"
//                 fillRule="evenodd"
//                 d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
//               />
//             </svg>
//           </button>
//         )}
