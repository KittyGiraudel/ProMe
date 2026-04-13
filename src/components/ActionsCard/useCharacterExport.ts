import { App, FormInstance } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import { stringifyCharacter } from '@/lib/character/store/migrations'
import { ServerError } from '@/lib/character/store/remoteStore'
import {
  buildCharacterExportFileName,
  downloadJsonFile,
} from '@/lib/download/downloadJsonFile'

export const useCharacterExport = (characterId: string, form: FormInstance) => {
  const { message } = App.useApp()
  const t = useTranslations()

  return useCallback(async () => {
    // @TODO: replace this with a lazy query
    try {
      const saved = await getCharacterStore().get(characterId as string)
      const character = { ...saved, ...form.getFieldsValue(true) }
      const content = stringifyCharacter(character)

      downloadJsonFile(content, buildCharacterExportFileName(character))
      message.success(t('characters.actions.export_downloaded'))
    } catch (error) {
      console.error(error)
      if (error instanceof ServerError) {
        message.error(t('errors.get_character'))
      } else {
        message.error(t('errors.export_download'))
      }
    }
  }, [characterId, message, t, form])
}
