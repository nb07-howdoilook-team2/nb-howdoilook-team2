'use server'

import { putCurating as putCuratingApi } from '@services/api'
import { CuratingFormInput } from '@services/types'
import { revalidatePath, revalidateTag } from 'next/cache'

const putCurating = async (curationId: number, body: CuratingFormInput) => {
  try {
    const response = await putCuratingApi(curationId, body)

    revalidateTag('curatings')
    revalidatePath('/')
    revalidatePath('/ranking')

    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : '큐레이팅 수정에 실패했습니다.' }
  }
}

export default putCurating
