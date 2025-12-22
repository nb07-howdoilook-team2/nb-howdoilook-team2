'use server'

import { postStyle as postStyleApi } from '@services/api'
import { CategoryKey, CategoryValue, StyleFormInput } from '@services/types'
import { revalidatePath } from 'next/cache'

const postStyle = async (data: StyleFormInput) => {
  try {
    const { categories, ...rest } = data

    let filteredCategories: {
      [key in CategoryKey]?: CategoryValue
    } = {}
    Object.entries(categories).forEach(([key, value]) => {
      if (Object.values(value).some(Boolean))
        filteredCategories[key as CategoryKey] = value
    })
    const body = {
      ...rest,
      categories: filteredCategories,
    }

    const styleDetail = await postStyleApi(body)

    revalidatePath('/')
    revalidatePath('/ranking')

    return { ok: true, data: styleDetail }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : '스타일 등록에 실패했습니다.' }
  }
}

export default postStyle
