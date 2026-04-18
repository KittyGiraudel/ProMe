'use client'

import { ConfigProvider, Form } from 'antd'
import type { FormListFieldData } from 'antd/es/form'
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useWatchedJournal } from '@/hooks/useCharacterSheetDerived'

type JournalEditingState =
  | { mode: 'idle' }
  | { mode: 'floating'; fieldKey: number }
  | { mode: 'modal'; fieldKey: number }

type JournalEditingAction =
  | { type: 'open_floating'; fieldKey: number }
  | { type: 'expand_to_modal' }
  | { type: 'collapse_to_floating' }
  | { type: 'close' }

function journalEditingReducer(
  state: JournalEditingState,
  action: JournalEditingAction
): JournalEditingState {
  switch (action.type) {
    case 'open_floating':
      return { mode: 'floating', fieldKey: action.fieldKey }
    case 'expand_to_modal':
      if (state.mode !== 'floating') return state
      return { mode: 'modal', fieldKey: state.fieldKey }
    case 'collapse_to_floating':
      if (state.mode !== 'modal') return state
      return { mode: 'floating', fieldKey: state.fieldKey }
    case 'close':
      return { mode: 'idle' }
  }
}

export function useJournalEditing(fields: FormListFieldData[]) {
  const form = Form.useFormInstance()
  const { componentDisabled } = ConfigProvider.useConfig()
  const { getEntry, updateEntryField } = useWatchedJournal()

  const [state, dispatch] = useReducer(journalEditingReducer, { mode: 'idle' })
  const floatingInitialContentRef = useRef<string | undefined>(undefined)
  const modalInitialContentRef = useRef<string | undefined>(undefined)
  const previousFieldCountRef = useRef(fields.length)

  const floatingField = useMemo(
    () =>
      state.mode === 'floating'
        ? (fields.find(f => f.key === state.fieldKey) ?? null)
        : null,
    [fields, state]
  )

  const modalField = useMemo(
    () =>
      state.mode === 'modal'
        ? (fields.find(f => f.key === state.fieldKey) ?? null)
        : null,
    [fields, state]
  )

  useEffect(
    function captureInitialContentOnFloat() {
      if (floatingField !== null) {
        floatingInitialContentRef.current = form.getFieldValue([
          'journalEntries',
          floatingField.name,
          'content',
        ]) as string | undefined
      }
    },
    [floatingField, form]
  )

  useEffect(
    function captureInitialContentOnModal() {
      if (modalField !== null) {
        modalInitialContentRef.current = form.getFieldValue([
          'journalEntries',
          modalField.name,
          'content',
        ]) as string | undefined
      }
    },
    [modalField, form]
  )

  useEffect(
    function editNewEntry() {
      if (fields.length > previousFieldCountRef.current) {
        const latest = fields[fields.length - 1]
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (latest) dispatch({ type: 'open_floating', fieldKey: latest.key })
      }
      previousFieldCountRef.current = fields.length
    },
    [fields]
  )

  const editEntry = useCallback(
    (fieldKey: number) => dispatch({ type: 'open_floating', fieldKey }),
    []
  )

  const collapseToFloating = useCallback(
    () => dispatch({ type: 'collapse_to_floating' }),
    []
  )

  const closeEditor = useCallback(() => dispatch({ type: 'close' }), [])

  const isEditorOpen = state.mode !== 'idle'

  const onFloatingSave = useCallback(() => {
    if (!componentDisabled && floatingField) {
      updateEntryField(
        floatingField.name,
        'updatedAt',
        new Date().toISOString()
      )
      dispatch({ type: 'close' })
    }
  }, [componentDisabled, floatingField, updateEntryField])

  const onFloatingCancel = useCallback(() => {
    if (floatingField) {
      updateEntryField(
        floatingField.name,
        'content',
        floatingInitialContentRef.current
      )
    }
    dispatch({ type: 'close' })
  }, [floatingField, updateEntryField])

  const onFloatingExpand = useCallback(
    () => dispatch({ type: 'expand_to_modal' }),
    []
  )

  const modalDraftContent = modalField
    ? getEntry(modalField.name)?.content
    : undefined

  const onModalSave = useCallback(() => {
    if (!componentDisabled && modalField) {
      updateEntryField(modalField.name, 'updatedAt', new Date().toISOString())
      dispatch({ type: 'close' })
    }
  }, [componentDisabled, modalField, updateEntryField])

  const onModalCancel = useCallback(() => {
    if (modalField) {
      updateEntryField(
        modalField.name,
        'content',
        modalInitialContentRef.current
      )
    }
    dispatch({ type: 'close' })
  }, [modalField, updateEntryField])

  return useMemo(
    () => ({
      editEntry,
      isEditorOpen,
      closeEditor,
      floating:
        floatingField !== null
          ? {
              fieldName: floatingField.name,
              onSave: onFloatingSave,
              onCancel: onFloatingCancel,
              onExpand: onFloatingExpand,
            }
          : null,
      modal:
        modalField !== null
          ? {
              fieldName: modalField.name,
              draftContent: modalDraftContent,
              onSave: onModalSave,
              onCancel: onModalCancel,
              onFloat: collapseToFloating,
            }
          : null,
    }),
    [
      editEntry,
      isEditorOpen,
      closeEditor,
      floatingField,
      onFloatingSave,
      onFloatingCancel,
      onFloatingExpand,
      modalField,
      modalDraftContent,
      onModalSave,
      onModalCancel,
      collapseToFloating,
    ]
  )
}
