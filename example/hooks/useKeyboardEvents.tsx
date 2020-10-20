import { useEffect } from "react"
import { handleKeyDown, handleKeyUp } from "../components/utils"

export default function useKeyboardEvents() {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])
}
