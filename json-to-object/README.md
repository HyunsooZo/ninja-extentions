# JSON to Object Converter

VSCode 확장 프로그램으로 JSON을 다양한 언어의 타입 정의로 변환합니다.

## 지원 언어

- **TypeScript** - Interface 생성
- **JavaScript** - JSDoc + Class 생성
- **Python** - Dataclass 생성
- **Rust** - Struct with Serde 생성
- **C** - Struct 생성
- **C++** - Class 생성
- **Java** - Class with Getters/Setters 생성
- **Kotlin** - Data Class 생성

## 사용 방법

1. JSON 텍스트를 선택
2. 우클릭 → **"Convert JSON to Object"** 선택
3. 원하는 언어 선택
4. 타입/클래스 이름 입력
5. 생성된 코드 확인!

## 예제

### 입력 JSON
```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true,
  "tags": ["developer", "designer"]
}
```

### TypeScript 출력
```typescript
interface MyObject {
  name: string;
  age: number;
  email: string;
  isActive: boolean;
  tags: string[];
}
```

### Python 출력
```python
from dataclasses import dataclass
from typing import Any

@dataclass
class MyObject:
    name: str
    age: float
    email: str
    is_active: bool
    tags: list[str]
```

### Rust 출력
```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct MyObject {
    pub name: String,
    pub age: f64,
    pub email: String,
    #[serde(rename = "isActive")]
    pub is_active: bool,
    pub tags: Vec<String>,
}
```

## 설치 방법

### 로컬에서 테스트
1. 이 폴더를 VSCode로 열기
2. F5 키를 눌러 Extension Development Host 실행
3. 새 창에서 테스트

### 패키징 및 설치
```bash
npm install -g @vscode/vsce
vsce package
code --install-extension json-to-object-0.0.1.vsix
```

## 개발

```bash
# 의존성 설치
npm install

# 린트
npm run lint
```

## 라이선스

MIT
