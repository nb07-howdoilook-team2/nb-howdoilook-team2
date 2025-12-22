const checkIsNotEmpty = <T extends object>(obj: T | {} | null | undefined): obj is T => {
  // 1. obj가 null이나 undefined면 바로 false 반환
  if (!obj) return false;
  
  return Object.keys(obj).length !== 0;
};

export default checkIsNotEmpty
