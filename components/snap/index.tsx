import React, { MouseEventHandler, useEffect, useRef, useState } from "react";

const Snap = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  const [dimm, setDimm] = useState<number[]>([]);

  useEffect(() => {
    setDimm([window.innerHeight, window.innerWidth]);

    window.addEventListener("resize", () => {
      setDimm([window.innerHeight, window.innerWidth]);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setDimm([window.innerHeight, window.innerWidth]);
      });
    };
  }, []);

  const handleMouseDown: MouseEventHandler<HTMLCanvasElement> = event => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setIsSelecting(true);
    setSelection({ x, y, width: 0, height: 0 });
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  // useEffect(() => {
  //   let svgCursor: string = "auto";
  //   if (isSelecting) {
  //     svgCursor =
  //       "url('data:image/svg+xml,%3Csvg stroke-width='0.4px' stroke='white' fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'%3E%3Cpath clip-rule='evenodd' fill-rule='evenodd' d='M8.128 9.155a3.751 3.751 0 11.713-1.321l1.136.656a.75.75 0 01.222 1.104l-.006.007a.75.75 0 01-1.032.157 1.421 1.421 0 00-.113-.072l-.92-.531zm-4.827-3.53a2.25 2.25 0 013.994 2.063.756.756 0 00-.122.23 2.25 2.25 0 01-3.872-2.293zM13.348 8.272a5.073 5.073 0 00-3.428 3.57c-.101.387-.158.79-.165 1.202a1.415 1.415 0 01-.707 1.201l-.96.554a3.751 3.751 0 10.734 1.309l13.729-7.926a.75.75 0 00-.181-1.374l-.803-.215a5.25 5.25 0 00-2.894.05l-5.325 1.629zm-9.223 7.03a2.25 2.25 0 102.25 3.897 2.25 2.25 0 00-2.25-3.897zM12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z'%3E%3C/path%3E%3Cpath d='M16.372 12.615a.75.75 0 01.75 0l5.43 3.135a.75.75 0 01-.182 1.374l-.802.215a5.25 5.25 0 01-2.894-.051l-5.147-1.574a.75.75 0 01-.156-1.367l3-1.732z'%3E%3C/path%3E%3C/svg%3E')";
  //   } else {
  //     svgCursor = "auto";
  //   }
  //   document.body.style.cursor = svgCursor;
  // }, [isSelecting]);

  const handleMouseMove: MouseEventHandler<HTMLCanvasElement> = event => {
    if (!isSelecting) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const width = x - selection.x;
    const height = y - selection.y;
    setSelection({ ...selection, width, height });
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(0, 0, 0, 0)";
    // context.strokeStyle = "blue";
    // context.lineWidth = 2;
    // context.stroke();
    context.fillRect(selection.x, selection.y, width, height);
  };

  const handleMouseUp: MouseEventHandler<HTMLCanvasElement> = () => {
    setIsSelecting(false);
  };

  const handleCaptureClick = () => {
    const canvas = canvasRef.current;
    const { x, y, width, height } = selection;
    const dataUrl = canvas.toDataURL("image/png", 1.0);
    console.log({ dataUrl });
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas2 = document.createElement("canvas");
      canvas2.width = width;
      canvas2.height = height;
      const context2 = canvas2.getContext("2d");
      context2.drawImage(img, x, y, width, height, 0, 0, width, height);
      const dataUrl2 = canvas2.toDataURL("image/png", 1.0);
      console.log({ dataUrl2 });
    };
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={dimm[1]}
        height={dimm[0]}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 9999 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <img
        style={{
          position: "absolute",
          bottom: "32px",
          right: "32px"
        }}
      />
      <button
        style={{
          cursor: "pointer !important"
        }}
        onClick={handleCaptureClick}
      >
        Capture
      </button>
    </div>
  );
};

export default Snap;
