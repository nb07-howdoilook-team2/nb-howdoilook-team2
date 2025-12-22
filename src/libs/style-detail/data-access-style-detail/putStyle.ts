'use server'

import { putStyle as putStyleApi } from '@services/api'
import { CategoryKey, CategoryValue, StyleFormInput } from '@services/types'
import { revalidatePath } from 'next/cache'

const putStyle = async (styleId: number, data: StyleFormInput) => {
  try {
    const { categories, ...rest } = data

    let filteredCategories: {
      [key in CategoryKey]?: CategoryValue
    } = {}
    Object.entries(categories).forEach(([key, value]) => {
      if (Object.values(value).some(Boolean)) filteredCategories[key as CategoryKey] = value
    })
    const body = {
      ...rest,
      categories: filteredCategories,
    }

    const response = await putStyleApi(styleId, body)
    revalidatePath(`/styles/${styleId}`)
    revalidatePath(`/styles/${styleId}/edit`)
    revalidatePath('/')
    revalidatePath('/ranking')

    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : '스타일 수정에 실패했습니다.' }
  }
}

export default putStyle
