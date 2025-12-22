'use server'

import { deleteComment as deleteCommentApi } from '@services/api'
import { CommentDeleteFormInput } from '@services/types'
import { revalidateTag } from 'next/cache'

const deleteComment = async (
  commentId: number,
  body: CommentDeleteFormInput,
) => {
  try {
    const response = await deleteCommentApi(commentId, body)
    revalidateTag('curatings')
    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.' }
  }
}

export default deleteComment
