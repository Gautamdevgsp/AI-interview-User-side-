import { useEffect, useState } from "react";

function Countdown() {
  const TOTAL_TIME = 20;
  const [time, setTime] = useState(TOTAL_TIME);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          return TOTAL_TIME; // 🔁 reset to 20
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div className="countdown">Left time: {time}s</div>;
}

export default Countdown;
