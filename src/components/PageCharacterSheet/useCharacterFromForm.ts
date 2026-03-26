import { FormInstance } from "antd"
import { useCallback } from "react"
import { Character } from "@/lib/character/types"
import { SheetFormValues } from "./characterSheetForm"

export const useCharacterFromForm = ({
  character,
  form
}: { character: Character | null, form: FormInstance }) => {
  const getCharacterFromForm = useCallback((): Character => {
    if (!character) throw new Error('Character not loaded')
    const values = form.getFieldsValue(true) as SheetFormValues
    return { ...character, ...values }
  }, [character, form])

  return  getCharacterFromForm
}