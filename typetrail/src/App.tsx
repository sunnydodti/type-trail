import { useCallback, useEffect, useState } from "react";
import TextArea from "./components/TextArea";
import KeyPressListener from "./components/KeyPressListener/KeyPressListener";
import { VALID_CHARACTERS } from "./constants/charactersConstants";

function App() {
  const [text] = useState<string>("Hello World");
  const [currentIndex, setcurrentIndex] = useState<number>(0);
  const [errors, seterrors] = useState<number[]>([]);
  const textLength = text.length;

  const evaluateKeyPress = useCallback(
    (key: string) => {
      console.log("Key pressed in App:", key);
      console.log("data:", text[currentIndex]);
      console.log("key:", key);

      // modifiers
      if (key == "Backspace") {
        updateDataForBackspacePress();
        logData();
        return;
      }

      if (!VALID_CHARACTERS.includes(key)) {
        console.log("invald character pressed");
        return;
      }

      if (currentIndex == textLength) return;

      if (text[currentIndex] === key) {
        console.log(true);
        updateDataForCorrectKeyPress();
      } else {
        console.log(false);
        updateDataForInCorrectKeyPress();
      }
      logData();
    },
    [text, currentIndex, textLength]
  );
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      evaluateKeyPress(event.key);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [evaluateKeyPress]);

  function updateDataForCorrectKeyPress() {
    seterrors((prev) => {
      const newErrors = prev.filter((i) => i !== currentIndex);
      return newErrors;
    });
    setcurrentIndex((prev) => prev + 1);
  }

  function updateDataForBackspacePress() {
    setcurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }

  function updateDataForInCorrectKeyPress() {
    seterrors((prev) => [...prev, currentIndex]);
    setcurrentIndex((prev) => prev + 1);
  }

  function logData() {
    console.log("text[currentIndex]", text[currentIndex]);
    console.log("currentIndex", currentIndex);
    console.log("errors", errors);
  }
  return (
    <>
      <KeyPressListener />
      <TextArea text={text} currentIndex={currentIndex} errors={errors} />
    </>
  );
}

export default App;
