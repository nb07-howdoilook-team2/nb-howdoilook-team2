'use server'

import { postCurating as postCuratingApi } from '@services/api'
import { CuratingFormInput } from '@services/types'
import { revalidatePath } from 'next/cache'

const postCurating = async (styleId: number, body: CuratingFormInput) => {
  try {
    const response = await postCuratingApi(styleId, body)

    revalidatePath(`/styles/${styleId}`)
    revalidatePath('/')
    revalidatePath('/ranking')

    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : '큐레이팅 등록에 실패했습니다.' }
  }
}

export default postCurating
