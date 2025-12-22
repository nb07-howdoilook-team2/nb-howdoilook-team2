import {
  CuratingType,
  CommentFormInput,
  CuratingFormInput,
  CuratingsSearchParams,
  StyleDetail,
  StyleFormInput,
  PaginationResponse,
  GalleryStylesSearchParams,
  GalleryStyle,
  RankingStylesSearchParams,
  RankingStyle,
  CommentDeleteFormInput,
  CuratingDeleteFormInput,
  StyleDeleteFormInput,
} from './types'
import fetch from './fetch'
import {
  CURATINGS_PAGE_SIZE,
  GALLERY_STYLES_PAGE_SIZE,
  RANKING_STYLES_PAGE_SIZE,
} from '@libs/shared/pagination/constants'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const postComment = async (
  curationId: number,
  body: CommentFormInput,
) => {
  const response = await fetch(`${BASE_URL}/curations/${curationId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '댓글 등록에 실패했습니다.')
  }

  const { comment } = await response.json()
  return { comment }
}

export const putComment = async (commentId: number, body: CommentFormInput) => {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '댓글 수정에 실패했습니다.')
  }

  const data = await response.json()
  return data
}

export const deleteComment = async (
  commentId: number,
  body: CommentDeleteFormInput,
) => {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '댓글 삭제에 실패했습니다.')
  }

  const data = await response.json()
  return data
}

export const postCurating = async (styleId: number, body: CuratingFormInput) => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}/curations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '큐레이팅 등록에 실패했습니다.')
  }

  const data = await response.json()
  return data
}

export const getCuratings = async (
  styleId: number,
  params: CuratingsSearchParams,
): Promise<PaginationResponse<CuratingType>> => {
  const urlParams = new URLSearchParams()
  urlParams.set('searchBy', params.searchBy)
  urlParams.set('keyword', params.keyword)
  urlParams.set('page', params.page.toString())
  urlParams.set('pageSize', CURATINGS_PAGE_SIZE.toString())
  const query = urlParams.toString()
  const response = await fetch(
    `${BASE_URL}/styles/${styleId}/curations?${query}`,
    {
      next: { tags: ['curatings'] },
    },
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '큐레이팅 조회에 실패했습니다.')
  }

  const { currentPage, totalPages, totalItemCount, data } =
    await response.json()
  return { currentPage, totalPages, totalItemCount, data }
}

export const putCurating = async (
  curationId: number,
  body: CuratingFormInput,
) => {
  const response = await fetch(`${BASE_URL}/curations/${curationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '큐레이팅 수정에 실패했습니다.')
  }

  const data = await response.json()
  return data
}

export const deleteCurating = async (
  curationId: number,
  body: CuratingDeleteFormInput,
) => {
  const response = await fetch(`${BASE_URL}/curations/${curationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '큐레이팅 삭제에 실패했습니다.')
  }

  const data = await response.json()
  return data
}

export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('image', file)
  const response = await fetch(`${BASE_URL}/images`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '이미지 업로드에 실패했습니다.')
  }

  const data = await response.json()
  const { imageUrl } = data
  return { imageUrl }
}

export const postStyle = async (body: StyleFormInput): Promise<StyleDetail> => {
  const response = await fetch(`${BASE_URL}/styles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '스타일 등록에 실패했습니다.')
  }

  const styleDetail = await response.json()
  return styleDetail
}

export const getStyle = async (styleId: number): Promise<StyleDetail> => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '스타일 조회에 실패했습니다.')
  }

  const style = await response.json()
  return style
}

export const putStyle = async (styleId: number, body: StyleFormInput) => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '스타일 수정에 실패했습니다.')
  }

  const data = await response.json()
  return data
}

export const deleteStyle = async (
  styleId: number,
  body: StyleDeleteFormInput,
) => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || '스타일 삭제에 실패했습니다.')
  }

  const { message } = await response.json()
  return { message }
}

export const getGalleryStyles = async (
  params: GalleryStylesSearchParams,
): Promise<PaginationResponse<GalleryStyle>> => {
  const urlParams = new URLSearchParams()
  urlParams.set('sortBy', params.sortBy)
  urlParams.set('searchBy', params.searchBy)
  urlParams.set('keyword', params.keyword)
  urlParams.set('tag', params.tag)
  urlParams.set('page', params.page?.toString() ?? '1')
  urlParams.set('pageSize', GALLERY_STYLES_PAGE_SIZE.toString())
  const query = urlParams.toString()

  const response = await fetch(`${BASE_URL}/styles?${query}`, {
    next: { tags: ['galleryStyles'] },
  })
  const { currentPage, totalPages, totalItemCount, data } =
    await response.json()
  return { currentPage, totalPages, totalItemCount, data }
}

export const getGalleryTags = async () => {
  const response = await fetch(`${BASE_URL}/tags`, {
    next: { tags: ['galleryTags'] },
  })
  const { tags } = await response.json()
  return { tags }
}

export const getRankingStyles = async (
  params: RankingStylesSearchParams,
): Promise<PaginationResponse<RankingStyle>> => {
  const urlParams = new URLSearchParams()
  urlParams.set('rankBy', params.rankBy)
  urlParams.set('page', params.page.toString())
  urlParams.set('pageSize', RANKING_STYLES_PAGE_SIZE.toString())
  const query = urlParams.toString()

  const response = await fetch(`${BASE_URL}/ranking?${query}`, {
    next: { tags: ['rankingStyles'] },
  })
  const { currentPage, totalPages, totalItemCount, data } =
    await response.json()
  return { currentPage, totalPages, totalItemCount, data }
}
