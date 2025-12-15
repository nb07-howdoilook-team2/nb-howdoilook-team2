import prisma from "../../prisma/prisma.js";
import { Style, StyleDetail } from "../models/Style.js";
import StyleRepository from "../repositories/style.repository.js";
import { NotFoundError } from "../utils/CustomError.js";

class StyleService {
  //목록조회, 오프셋페이지네이션, 검색, 정렬기준
  getStyles = async ({ page, limit, sort, search }) => {
    const skip = (page - 1) * limit;

    //정렬기준
    let orderByOption = { createdAt: "desc" };
    if (sort === "viewCount") orderByOption = { viewCount: "desc" };
    if (sort === "curationCount") orderByOption = { curationCount: "desc" };

    const where = {};
    // 검색어가 들어왔을때 제목, 닉네임, 내용, 태그에 대해 검색
    // 빈 문자열("")이면 모두 조회되도록 처리
    if (search && search.trim() !== "") {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { nickname: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    // 게시글 총 개수 가져오기
    const totalItemCount = await StyleRepository.countStyles(where);

    // 검색어, 페이지네이션, 정렬기준에 따른 스타일 목록 가져오기
    const styles = await StyleRepository.getStylesList({
      where,
      skip,
      limit,
      orderBy: orderByOption,
    });

    // 현재페이지, 총페이지수, 총아이템수, 데이터
    // 데이터는 src/models/Style.js의 fromEntity 메서드를 사용해 Style 인스턴스로 매핑
    return {
      currentPage: page,
      totalPages: Math.ceil(totalItemCount / limit),
      totalItemCount,
      data: styles.map((s) => Style.fromEntity(s)), // Style 인스턴스로 매핑(캡슐화)
    };
  };

  //상세조회
  findStyle = async (styleId) => {
    const style = await StyleRepository.getFindStyle(styleId);

    // 스타일이 존재하지 않으면 NotFoundError 발생
    if (!style) {
      throw new NotFoundError("해당 스타일을 찾을 수 없습니다.");
    }

    // 조회수 증가
    await StyleRepository.increaseViewCount(styleId);

    // API 명세서 형식에 맞추기(캡슐화)
    return StyleDetail.fromEntity(style);
  };

  //스타일 작성
  postStyle = async ({
    nickname,
    title,
    content,
    password,
    categories,
    tags,
    imageUrls,
  }) => {
    // 1. thumbnail 필드 처리: imageUrls 배열의 첫 번째 요소를 thumbnail로 사용
    const thumbnail = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;

    const newStyle = await prisma.style.create({
      data: {
        nickname,
        title,
        content,
        password,
        thumbnail,
        categories,
        tags,
        imageUrls,
      },
      select: {
        id: true,
        nickname: true,
        title: true,
        content: true,
        thumbnail: true,
        viewCount: true,
        curationCount: true,
        createdAt: true,
        categories: true,
        tags: true,
        imageUrls: true,
      },
    });
    return newStyle;
  };
}

export default new StyleService();
// // 스타일 수정 로직
// updateStyle = async (styleId, password, updateData) => {
//   // 1. 해당 스타일 존재 여부 확인
//   const style = await this.styleRepository.findStyleById(styleId);
//   if (!style) {
//     throw new CustomError(404, "존재하지 않는 스타일입니다.");
//   }

//   // 2. 비밀번호 검증 (단순 문자열 비교 예시, 실제 서비스에선 해시 비교 권장)
//   if (style.password !== password) {
//     throw new CustomError(403, "비밀번호가 일치하지 않습니다.");
//   }

//   // 3. 수정 진행
//   const updatedStyle = await this.styleRepository.updateStyle(
//     styleId,
//     updateData
//   );

//   return updatedStyle;
// };

// // 스타일 삭제 로직
// deleteStyle = async (styleId, password) => {
//   // 1. 해당 스타일 존재 여부 확인
//   const style = await this.styleRepository.findStyleById(styleId);
//   if (!style) {
//     throw new CustomError(404, "존재하지 않는 스타일입니다.");
//   }

//   // 2. 비밀번호 검증
//   if (style.password !== password) {
//     throw new CustomError(403, "비밀번호가 일치하지 않습니다.");
//   }

//   // 3. 삭제 진행
//   const deletedStyle = await this.styleRepository.deleteStyle(styleId);

//   return deletedStyle;
// };

// updateStyle = async (styleId, password, updateData) => {
//   /* ... */
// };
// deleteStyle = async (styleId, password) => {
//   /* ... */
// };
