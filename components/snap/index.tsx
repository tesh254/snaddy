import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

interface Props {}

interface Points {
  x: number;
  y: number;
}

interface PointsOpt {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

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
  const overlayCanvasRef = useRef<HTMLCanvasElement>();
  const actionBtnRef = useRef<HTMLButtonElement>();
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const offsetRef = useRef<Points>({ x: 0, y: 0 });
  const startPointsRef = useRef<Points>({ x: 0, y: 0 });
  const points = useRef<PointsOpt>({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const isMouseDownRef = useRef<boolean>(false);

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
      const overlayCanvas = overlayCanvasRef.current;

      overlayCanvas.width = dimm[0];
      overlayCanvas.height = dimm[1] - 2;

      const overlayContext = overlayCanvas.getContext("2d");

      ctxRef.current = overlayContext;

      const offset = overlayCanvas.getBoundingClientRect();

      offsetRef.current = { x: offset.left, y: offset.top };

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

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startPointsRef.current = {
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    };

    isMouseDownRef.current = true;
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    isMouseDownRef.current = false;
  };

  const handleMouseOut = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // the drag is over, clear the dragging flag
    isMouseDownRef.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isMouseDownRef.current) {
      return;
    }

    const mouseX = e.clientX - offsetRef.current.x;
    const mouseY = e.clientY - offsetRef.current.y;

    const ctx = ctxRef.current;

    ctx.clearRect(
      0,
      0,
      overlayCanvasRef.current.width,
      overlayCanvasRef.current.height
    );

    const width = mouseX - startPointsRef.current.x;
    const height = mouseY - startPointsRef.current.y;

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      startPointsRef.current.x,
      startPointsRef.current.y,
      width,
      height
    );

    points.current = {
      x1: startPointsRef.current.x,
      y1: startPointsRef.current.y,
      x2: width,
      y2: height,
    };
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
      <canvas
        ref={overlayCanvasRef}
        onMouseDown={(e) => handleMouseDown(e as unknown as MouseEvent)}
        onMouseMove={(e) => handleMouseMove(e as unknown as MouseEvent)}
        onMouseUp={(e) => handleMouseUp(e as unknown as MouseEvent)}
        onMouseOut={(e) => handleMouseOut(e as unknown as MouseEvent)}
        style={{
          zIndex: 9999,
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
