//각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅 수가 표시됩니다.
//목록 조회용 class
export class Style {
  constructor(
    id,
    title,
    nickname,
    thumbnail, //대표 이미지
    tags,
    components, // 스타일 구성
    description,
    views,
    curatedCount
  ) {
    this.id = id;
    this.title = title;
    this.nickname = nickname;
    this.thumbnail = thumbnail;
    this.tags = tags;
    this.components = components;
    this.description = description;
    this.views = views;
    this.curatedCount = curatedCount;
  }

  static fromEntity(entity) {
    return new Style(
      entity.id.toString(),
      entity.title,
      entity.nickname,
      entity.thumbnail,
      entity.tags ?? [],
      entity.components ?? [],
      entity.description,
      entity.views,
      entity.curatedCount
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
    title,
    nickname,
    images,
    tags,
    components,
    description,
    views,
    curatedCount,
    curatedList
  ) {
    this.id = id;
    this.title = title;
    this.nickname = nickname;
    this.images = images;
    this.tags = tags;
    this.components = components;
    this.description = description;
    this.views = views;
    this.curatedCount = curatedCount;
    this.curatedList = curatedList;
  }

  static fromEntity(entity, curatedList = []) {
    return new StyleDetail(
      entity.id.toString(),
      entity.title,
      entity.nickname,
      entity.images ?? [], //이미지 여러장
      entity.tags ?? [],
      entity.components ?? [],
      entity.description,
      entity.views ?? 0,
      entity.curatedCount ?? 0,
      curatedList // 상세목록 조회에는 큐레이팅 목록 포함
    );
  }
}
