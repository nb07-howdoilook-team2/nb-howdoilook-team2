//각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅 수가 표시됩니다.
//목록 조회용 class
export class Style {
  constructor(
    id,
    thumbnail,
    nickname,
    title,
    tags,
    categories,
    content,
    viewCount,
    curationCount,
    createdAt
  ) {
    this.id = id;
    this.thumbnail = thumbnail;
    this.nickname = nickname;
    this.title = title;
    this.tags = tags;
    this.categories = categories;
    this.content = content;
    this.viewCount = viewCount;
    this.curationCount = curationCount;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    return new Style(
      entity.id.toString(),
      entity.imageUrls?.[0] || null, // 첫 번째 이미지를 thumbnail로 사용
      entity.nickname,
      entity.title,
      entity.tags ?? [],
      entity.categories ?? {},
      entity.content,
      entity.viewCount,
      entity.curationCount,
      entity.createdAt
    );
  }
}

//상세 조회용 class
//갤러리, 랭킹에서 스타일을 클릭할 경우 스타일 상세 조회가 가능합니다.
//이미지(여러장 가능), 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅수가 표시
//해당 스타일의 큐레이팅 목록도 포함
export class StyleDetail {
  constructor(
    id,
    nickname,
    title,
    content,
    viewCount,
    curationCount,
    createdAt,
    categories,
    tags,
    imageUrls,
    curatedList
  ) {
    this.id = id;
    this.nickname = nickname;
    this.title = title;
    this.content = content;
    this.viewCount = viewCount;
    this.curationCount = curationCount;
    this.createdAt = createdAt;
    this.categories = categories;
    this.tags = tags;
    this.imageUrls = imageUrls;
    this.curatedList = curatedList;
  }

  static fromEntity(entity) {
    return new StyleDetail(
      entity.id.toString(),
      entity.nickname,
      entity.title,
      entity.content,
      entity.viewCount,
      entity.curationCount,
      entity.createdAt,
      entity.categories,
      entity.tags,
      entity.imageUrls,
      entity.curations ?? []
    );
  }
}
