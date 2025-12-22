'use server'

import { deleteCurating as deleteCuratingApi } from '@services/api'
import { CuratingDeleteFormInput } from '@services/types'
import { revalidatePath, revalidateTag } from 'next/cache'

const deleteCurating = async (curationId: number, body: CuratingDeleteFormInput) => {
  try {
    const response = await deleteCuratingApi(curationId, body)

    revalidateTag('curatings')
    revalidatePath('/')
    revalidatePath('/ranking')

    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : '큐레이팅 삭제에 실패했습니다.' }
  }
}

export default deleteCurating
