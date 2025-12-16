const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "스타일 공유 서비스 API",
    version: "1.0.0",
    description: "DevPod 환경에서도 완벽하게 작동하는 API 문서입니다.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "로컬 개발 서버",
    },
  ],
  // ▼ 파일을 읽지 않고 여기에 직접 명세(paths)를 적습니다. (100% 작동 보장)
  paths: {
    "/api/styles": {
      get: {
        tags: ["Styles"],
        summary: "스타일 목록 조회 (큐레이팅 개수 포함)",
        responses: {
          200: {
            description: "조회 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer" },
                          name: { type: "string" },
                          curationCount: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/styles/{id}": {
      put: {
        tags: ["Styles"],
        summary: "스타일 수정",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  password: { type: "string" },
                  name: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "수정 성공" },
          403: { description: "비밀번호 불일치" },
        },
      },
      delete: {
        tags: ["Styles"],
        summary: "스타일 삭제",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "삭제 성공" },
          403: { description: "비밀번호 불일치" },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [], // 파일을 읽지 않으므로 빈 배열로 둡니다.
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
