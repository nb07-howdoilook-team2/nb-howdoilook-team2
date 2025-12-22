'use server'

import { putComment as putCommentApi } from '@services/api'
import { CommentFormInput } from '@services/types'
import { revalidateTag } from 'next/cache'

const putComment = async (commentId: number, body: CommentFormInput) => {
  try {
    const response = await putCommentApi(commentId, body)
    revalidateTag('curatings')
    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : '댓글 수정에 실패했습니다.' }
  }
}

export default putComment
