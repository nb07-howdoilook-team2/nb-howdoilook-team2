import { deleteStyle as deleteStyleApi } from '@services/api'
import { StyleDeleteFormInput } from '@services/types'

const deleteStyle = async (styleId: number, body: StyleDeleteFormInput) => {
  try {
    const response = await deleteStyleApi(styleId, body)
    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : '스타일 삭제에 실패했습니다.' }
  }
}

export default deleteStyle
