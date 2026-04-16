# Mermaid → Word PoC

WIMS 2.0 산출물에서 Mermaid 다이어그램을 Word로 그대로 보존할 수 있는지 검증한다.

## 1. 시스템 구성 (Flowchart)

```mermaid
flowchart LR
    A[사용자] -->|로그인| B(WIMS FE)
    B --> C{인증}
    C -->|성공| D[대시보드]
    C -->|실패| E[오류 페이지]
    D --> F[(MariaDB)]
```

## 2. 견적 승인 (Sequence)

```mermaid
sequenceDiagram
    participant U as 영업
    participant S as ES 서비스
    participant D as DB
    U->>S: 견적 제출
    S->>D: 견적 저장
    D-->>S: OK
    S-->>U: 승인 대기
```

## 3. 엔티티 관계 (ERD)

```mermaid
erDiagram
    PRODUCT ||--o{ BOM_ITEM : contains
    PRODUCT {
        string code PK
        string name
    }
    BOM_ITEM {
        string id PK
        string product_code FK
        int qty
    }
```

## 결론

위 세 가지 다이어그램이 Word에서 벡터로 선명하게 보이면 PoC 성공.
