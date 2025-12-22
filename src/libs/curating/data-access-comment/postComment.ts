'use server'

import { postComment as postCommentApi } from '@services/api'
import { CommentFormInput } from '@services/types'
import { revalidateTag } from 'next/cache'

const postComment = async (curationId: number, body: CommentFormInput) => {
  try {
    const response = await postCommentApi(curationId, body)
    revalidateTag('curatings')
    return { ok: true, data: response }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : '댓글 등록에 실패했습니다.' }
  }
}

export default postComment
